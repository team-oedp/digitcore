import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type React from "react";
import { useEffect } from "react";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";
import type { PATTERNS_BY_SLUGS_QUERYResult } from "~/sanity/sanity.types";
import {
	CarrierBagStoreProvider,
	useCarrierBagStore,
} from "~/stores/carrier-bag";
import { CarrierBagPage } from "./carrier-bag-page";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
		back: vi.fn(),
	}),
	usePathname: () => "/carrier-bag",
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
	default: ({
		href,
		children,
		...props
	}: {
		href: string;
		children: React.ReactNode;
		[key: string]: unknown;
	}) => {
		return (
			<a href={href} {...props}>
				{children}
			</a>
		);
	},
}));

// Mock pattern content hook
vi.mock("~/hooks/use-pattern-content", () => ({
	useCarrierBagDocument: () => ({
		title: "Carrier Bag",
		subtitle: "A collection of patterns",
		date: new Date().toLocaleDateString(),
		patternCount: 0,
		patterns: [],
		hasTableOfContents: false,
	}),
}));

// Mock PDF preview modal
vi.mock("~/components/pdf/pdf-preview-modal", () => ({
	PDFPreviewModal: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
}));

// Mock use-mobile hook
vi.mock("~/hooks/use-mobile", () => ({
	useIsMobile: () => false,
}));

// Mock Sanity client
vi.mock("~/sanity/lib/client", () => {
	return {
		client: { fetch: vi.fn() },
	};
});

const { client } = await import("~/sanity/lib/client");

// Type the mocked client properly
const mockClient = client as unknown as {
	fetch: Mock<
		[query: string, params?: Record<string, unknown>],
		Promise<PATTERNS_BY_SLUGS_QUERYResult>
	>;
};

// Type for mocked clipboard
interface MockClipboard {
	writeText: Mock<[text: string], Promise<void>>;
}

// Helpers
type MockPattern = PATTERNS_BY_SLUGS_QUERYResult[number] & {
	descriptionPlainText: string;
};

function makePattern(id: string, slug: string, title?: string): MockPattern {
	return {
		_id: id,
		_type: "pattern" as const,
		_createdAt: "2024-01-01T00:00:00Z",
		_updatedAt: "2024-01-01T00:00:00Z",
		_rev: "1",
		title: title ?? `Pattern ${id}`,
		slug,
		description: null,
		descriptionPlainText: "",
		tags: null,
		audiences: null,
		theme: null,
		solutions: null,
		resources: null,
	};
}

function SeedItems({ slugs }: { slugs: string[] }) {
	const addPattern = useCarrierBagStore((s) => s.addPattern);

	useEffect(() => {
		slugs.forEach((slug, idx) => {
			addPattern(makePattern(`seed-${idx + 1}`, slug));
		});
	}, [slugs, addPattern]);

	return null;
}

function Harness({ children }: { children: React.ReactNode }) {
	return <CarrierBagStoreProvider>{children}</CarrierBagStoreProvider>;
}

beforeEach(() => {
	// Clear localStorage
	localStorage.clear();

	// location baseline
	window.history.replaceState({}, "", "/carrier-bag");

	// Mock clipboard with proper typing
	const mockWriteText = vi.fn().mockResolvedValue(undefined);
	Object.defineProperty(navigator, "clipboard", {
		value: { writeText: mockWriteText },
		writable: true,
		configurable: true,
	});

	// Reset fetch mock
	vi.clearAllMocks();
});

describe("CarrierBagPage - share/import flow", () => {
	it("generates a share URL with slugs and replace mode, copies to clipboard", async () => {
		// Seed two items so the button is enabled
		render(
			<Harness>
				<SeedItems slugs={["alpha", "beta"]} />
				<CarrierBagPage />
			</Harness>,
		);

		const copyBtn = await screen.findByRole("button", {
			name: /Generate Link/i,
		});

		await waitFor(() => expect(copyBtn).not.toBeDisabled());
		fireEvent.click(copyBtn);

		// Note: URL might encode commas as %2C, and includes port in test env
		const mockWriteText = (navigator.clipboard as unknown as MockClipboard)
			.writeText;
		const actualUrl = mockWriteText.mock.calls[0]?.[0];
		expect(actualUrl).toContain("/carrier-bag");
		expect(actualUrl).toContain("alpha");
		expect(actualUrl).toContain("beta");
		expect(actualUrl).toContain("mode=replace");
	});

	it("imports by slugs with replace mode: clears bag, adds fetched, cleans URL", async () => {
		// Mock fetch result before mounting
		mockClient.fetch.mockResolvedValueOnce([
			makePattern("p1", "new-1", "New 1"),
			makePattern("p2", "new-2", "New 2"),
		]);

		// Set URL with import params before mounting
		window.history.pushState(
			{},
			"",
			"/carrier-bag?slugs=new-1,new-2&mode=replace",
		);

		// Render with existing item (will be replaced)
		render(
			<Harness>
				<SeedItems slugs={["existing"]} />
				<CarrierBagPage />
			</Harness>,
		);

		// Wait for URL cleanup and persistence
		await waitFor(
			() => {
				expect(window.location.pathname).toBe("/carrier-bag");
				expect(window.location.search).toBe("");
			},
			{ timeout: 3000 },
		);

		// Assert persisted state has only fetched items (replaced)
		await waitFor(
			() => {
				const persisted = JSON.parse(
					localStorage.getItem("carrier-bag") || "{}",
				) as { state?: { items?: Array<{ pattern: { _id: string } }> } };
				expect(persisted.state?.items?.length).toBe(2);
				const ids = (persisted.state?.items || []).map((i) => i.pattern._id);
				expect(ids).toEqual(["p1", "p2"]);
			},
			{ timeout: 3000 },
		);
	});

	it("imports by slugs without replace: appends to existing bag", async () => {
		mockClient.fetch.mockResolvedValueOnce([
			makePattern("np1", "extra", "Extra"),
		]);

		window.history.pushState({}, "", "/carrier-bag?slugs=extra&mode=append");

		render(
			<Harness>
				<SeedItems slugs={["existing-a", "existing-b"]} />
				<CarrierBagPage />
			</Harness>,
		);

		await waitFor(
			() => {
				expect(window.location.pathname).toBe("/carrier-bag");
				expect(window.location.search).toBe("");
			},
			{ timeout: 3000 },
		);

		await waitFor(
			() => {
				const persisted = JSON.parse(
					localStorage.getItem("carrier-bag") || "{}",
				) as { state?: { items?: Array<{ pattern: { _id: string } }> } };
				expect(persisted.state?.items?.length).toBe(3);
				const ids = (persisted.state?.items || []).map((i) => i.pattern._id);
				expect(ids).toContain("np1");
			},
			{ timeout: 3000 },
		);
	});

	it("handles fetch error: preserves bag and query string remains", async () => {
		mockClient.fetch.mockRejectedValueOnce(new Error("fetch failed"));

		window.history.pushState({}, "", "/carrier-bag?slugs=fails&mode=replace");

		render(
			<Harness>
				<SeedItems slugs={["keep-me"]} />
				<CarrierBagPage />
			</Harness>,
		);

		// Allow effect to run, URL should NOT be cleaned on error
		await waitFor(
			() => {
				expect(window.location.search).toBe("?slugs=fails&mode=replace");
			},
			{ timeout: 3000 },
		);

		await waitFor(
			() => {
				const persisted = JSON.parse(
					localStorage.getItem("carrier-bag") || "{}",
				) as { state?: { items?: Array<{ pattern: { slug?: string } }> } };
				expect(persisted.state?.items?.length).toBe(1);
				const slugs = (persisted.state?.items || []).map((i) => i.pattern.slug);
				expect(slugs).toContain("keep-me");
			},
			{ timeout: 3000 },
		);
	});
});
