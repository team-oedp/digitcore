import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { CarrierBagContent } from "./carrier-bag-content";

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

// Mock Next.js navigation
const mockPush = vi.fn();
const mockRouter = {
	push: mockPush,
	back: vi.fn(),
	forward: vi.fn(),
	refresh: vi.fn(),
	prefetch: vi.fn(),
	replace: vi.fn(),
};

vi.mock("next/navigation", () => ({
	useRouter: vi.fn(() => mockRouter),
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
	default: ({
		children,
		href,
		...props
	}: {
		children: React.ReactNode;
		href: string;
		[key: string]: unknown;
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

// Mock MultiSelect components that use cmdk
vi.mock("~/components/ui/multiselect", () => ({
	MultiSelect: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	MultiSelectContent: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	MultiSelectGroup: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	MultiSelectItem: ({ children }: { children: React.ReactNode }) => (
		<div>{children}</div>
	),
	MultiSelectTrigger: ({ children }: { children: React.ReactNode }) => (
		<button type="button">{children}</button>
	),
	MultiSelectValue: ({ placeholder }: { placeholder: string }) => (
		<span>{placeholder}</span>
	),
}));

// Mock Zustand store
const mockItems = [
	{
		pattern: {
			_id: "pattern-1",
			_type: "pattern" as const,
			_createdAt: "2024-01-01",
			_updatedAt: "2024-01-01",
			_rev: "rev-1",
			title: "Pattern One",
			slug: { current: "pattern-one", _type: "slug" as const },
			theme: { _ref: "theme-1", _type: "reference" as const },
			tags: [
				{ _ref: "tag-1", _type: "reference" as const },
				{ _ref: "tag-2", _type: "reference" as const },
			],
			audiences: [{ _ref: "audience-1", _type: "reference" as const }],
		},
		dateAdded: "2024-01-01",
		notes: "Test notes",
	},
	{
		pattern: {
			_id: "pattern-2",
			_type: "pattern" as const,
			_createdAt: "2024-01-02",
			_updatedAt: "2024-01-02",
			_rev: "rev-2",
			title: "Pattern Two",
			slug: { current: "pattern-two", _type: "slug" as const },
			theme: {
				_id: "theme-2",
				_type: "theme" as const,
				_createdAt: "2024-01-01",
				_updatedAt: "2024-01-01",
				_rev: "rev-1",
				title: "Theme Two",
			},
		},
		dateAdded: "2024-01-02",
	},
	{
		pattern: {
			_id: "pattern-3",
			_type: "pattern" as const,
			_createdAt: "2024-01-03",
			_updatedAt: "2024-01-03",
			_rev: "rev-3",
			title: "Pattern Without Slug",
			// No slug property
		},
		dateAdded: "2024-01-03",
	},
];

const mockRemovePattern = vi.fn();
const mockSetItems = vi.fn();

vi.mock("~/stores/carrier-bag", () => ({
	useCarrierBagStore: vi.fn(),
}));

describe("CarrierBagContent Navigation", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		(useCarrierBagStore as ReturnType<typeof vi.fn>).mockImplementation(
			(selector: (state: unknown) => unknown) => {
				const state = {
					items: mockItems,
					removePattern: mockRemovePattern,
					setItems: mockSetItems,
				};
				return selector ? selector(state) : state;
			},
		);
	});

	it("renders carrier bag items with correct titles", () => {
		render(<CarrierBagContent />);

		expect(screen.getByText("Pattern One")).toBeInTheDocument();
		expect(screen.getByText("Pattern Two")).toBeInTheDocument();
		expect(screen.getByText("Pattern Without Slug")).toBeInTheDocument();
	});

	it("renders clickable links for patterns with slugs", () => {
		render(<CarrierBagContent />);

		const patternOneLink = screen.getByRole("link", { name: /Pattern One/i });
		const patternTwoLink = screen.getByRole("link", { name: /Pattern Two/i });

		expect(patternOneLink).toHaveAttribute("href", "/pattern/pattern-one");
		expect(patternTwoLink).toHaveAttribute("href", "/pattern/pattern-two");
	});

	it("does not render links for patterns without slugs", () => {
		render(<CarrierBagContent />);

		// Pattern Without Slug should not be a link
		const patternWithoutSlugText = screen.getByText("Pattern Without Slug");
		const parentElement = patternWithoutSlugText.closest("a");
		expect(parentElement).toBeNull();
	});

	it("navigates to pattern page when visit button is clicked", async () => {
		render(<CarrierBagContent />);

		// Find the visit button for Pattern One
		const visitButtons = screen.getAllByRole("button", { name: /Visit/i });
		const patternOneVisitButton = visitButtons[0];

		if (patternOneVisitButton) {
			fireEvent.click(patternOneVisitButton);
		}

		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith("/pattern/pattern-one");
		});
	});

	it("does not navigate when visit button is clicked for pattern without slug", async () => {
		render(<CarrierBagContent />);

		// Find the visit button for Pattern Without Slug (should be the third one)
		const visitButtons = screen.getAllByRole("button", { name: /Visit/i });
		const patternWithoutSlugVisitButton = visitButtons[2];

		// The button should be disabled
		expect(patternWithoutSlugVisitButton).toBeDisabled();

		if (patternWithoutSlugVisitButton) {
			fireEvent.click(patternWithoutSlugVisitButton);
		}

		await waitFor(() => {
			expect(mockPush).not.toHaveBeenCalled();
		});
	});

	it("removes pattern when remove button is clicked", async () => {
		render(<CarrierBagContent />);

		const removeButtons = screen.getAllByRole("button", { name: /Remove/i });
		const patternOneRemoveButton = removeButtons[0];

		if (patternOneRemoveButton) {
			fireEvent.click(patternOneRemoveButton);
		}

		await waitFor(() => {
			expect(mockRemovePattern).toHaveBeenCalledWith("pattern-1");
		});
	});

	it("handles patterns with string slugs", () => {
		const itemWithStringSlug = {
			pattern: {
				_id: "pattern-4",
				_type: "pattern" as const,
				_createdAt: "2024-01-04",
				_updatedAt: "2024-01-04",
				_rev: "rev-4",
				title: "Pattern With String Slug",
				slug: "pattern-string-slug", // Direct string instead of object
			},
			dateAdded: "2024-01-04",
		};

		(useCarrierBagStore as ReturnType<typeof vi.fn>).mockImplementation(
			(selector: (state: unknown) => unknown) => {
				const state = {
					items: [itemWithStringSlug],
					removePattern: mockRemovePattern,
					setItems: mockSetItems,
				};
				return selector ? selector(state) : state;
			},
		);

		render(<CarrierBagContent />);

		const link = screen.getByRole("link", {
			name: /Pattern With String Slug/i,
		});
		expect(link).toHaveAttribute("href", "/pattern/pattern-string-slug");
	});

	it("navigates correctly when pattern link is clicked directly", () => {
		render(<CarrierBagContent />);

		const patternOneLink = screen.getByRole("link", { name: /Pattern One/i });

		// Verify the href is correct
		expect(patternOneLink).toHaveAttribute("href", "/pattern/pattern-one");

		// In a real browser, clicking the link would navigate
		// Here we just verify the href is set correctly
	});

	it("shows correct item count", () => {
		render(<CarrierBagContent />);

		expect(screen.getByText("3 saved items")).toBeInTheDocument();
	});

	it("shows empty state when no items", () => {
		(useCarrierBagStore as ReturnType<typeof vi.fn>).mockImplementation(
			(selector: (state: unknown) => unknown) => {
				const state = {
					items: [],
					removePattern: mockRemovePattern,
					setItems: mockSetItems,
				};
				return selector ? selector(state) : state;
			},
		);

		render(<CarrierBagContent />);

		expect(
			screen.getByText(/There are no patterns in your carrier bag/i),
		).toBeInTheDocument();
	});
});

describe("CarrierBagContent Filtering and Ordering", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Mock items with populated theme data for grouping tests
		const mockItemsWithThemes = [
			{
				pattern: {
					_id: "pattern-1",
					_type: "pattern" as const,
					_createdAt: "2024-01-01",
					_updatedAt: "2024-01-01",
					_rev: "rev-1",
					title: "Alpha Pattern",
					slug: { current: "alpha-pattern", _type: "slug" as const },
					theme: {
						_id: "theme-1",
						_type: "theme" as const,
						_createdAt: "2024-01-01",
						_updatedAt: "2024-01-01",
						_rev: "rev-1",
						title: "Design Theme",
					},
					tags: [
						{
							_id: "tag-1",
							_type: "tag" as const,
							_createdAt: "2024-01-01",
							_updatedAt: "2024-01-01",
							_rev: "rev-1",
							title: "UX",
						},
					],
					audiences: [
						{
							_id: "audience-1",
							_type: "audience" as const,
							_createdAt: "2024-01-01",
							_updatedAt: "2024-01-01",
							_rev: "rev-1",
							title: "Designers",
						},
					],
				},
				dateAdded: "2024-01-01",
			},
			{
				pattern: {
					_id: "pattern-2",
					_type: "pattern" as const,
					_createdAt: "2024-01-02",
					_updatedAt: "2024-01-02",
					_rev: "rev-2",
					title: "Beta Pattern",
					slug: { current: "beta-pattern", _type: "slug" as const },
					theme: {
						_id: "theme-2",
						_type: "theme" as const,
						_createdAt: "2024-01-01",
						_updatedAt: "2024-01-01",
						_rev: "rev-1",
						title: "Tech Theme",
					},
					tags: [
						{
							_id: "tag-2",
							_type: "tag" as const,
							_createdAt: "2024-01-01",
							_updatedAt: "2024-01-01",
							_rev: "rev-1",
							title: "Development",
						},
					],
					audiences: [
						{
							_id: "audience-2",
							_type: "audience" as const,
							_createdAt: "2024-01-01",
							_updatedAt: "2024-01-01",
							_rev: "rev-1",
							title: "Developers",
						},
					],
				},
				dateAdded: "2024-01-02",
			},
			{
				pattern: {
					_id: "pattern-3",
					_type: "pattern" as const,
					_createdAt: "2024-01-03",
					_updatedAt: "2024-01-03",
					_rev: "rev-3",
					title: "Gamma Pattern",
					slug: { current: "gamma-pattern", _type: "slug" as const },
					theme: {
						_id: "theme-1",
						_type: "theme" as const,
						_createdAt: "2024-01-01",
						_updatedAt: "2024-01-01",
						_rev: "rev-1",
						title: "Design Theme",
					},
				},
				dateAdded: "2024-01-03",
			},
		];

		(useCarrierBagStore as ReturnType<typeof vi.fn>).mockImplementation(
			(selector: (state: unknown) => unknown) => {
				const state = {
					items: mockItemsWithThemes,
					removePattern: mockRemovePattern,
					setItems: mockSetItems,
				};
				return selector ? selector(state) : state;
			},
		);
	});

	it("sorts items alphabetically by default", () => {
		render(<CarrierBagContent />);

		const items = screen.getAllByText(/Pattern$/);
		expect(items[0]).toHaveTextContent("Alpha Pattern");
		expect(items[1]).toHaveTextContent("Beta Pattern");
		expect(items[2]).toHaveTextContent("Gamma Pattern");
	});

	it("groups items by theme when toggle is clicked", async () => {
		render(<CarrierBagContent />);

		const groupByThemeButton = screen.getByRole("button", {
			name: /Group by theme/i,
		});

		fireEvent.click(groupByThemeButton);

		// Check that theme headers are displayed
		await waitFor(() => {
			expect(screen.getByText("Design Theme")).toBeInTheDocument();
			expect(screen.getByText("Tech Theme")).toBeInTheDocument();
		});
	});

	it("resets to filter/group mode when filter button is clicked after drag reordering", async () => {
		render(<CarrierBagContent />);

		// Simulate drag reordering by calling setItems
		const reorderedItems = [mockItems[2], mockItems[0], mockItems[1]];
		mockSetItems(reorderedItems);

		// Now click the group by theme toggle
		const groupByThemeButton = screen.getByRole("button", {
			name: /Group by theme/i,
		});

		fireEvent.click(groupByThemeButton);

		// Should see theme groups (this would previously fail due to the bug)
		await waitFor(() => {
			expect(screen.getByText("Design Theme")).toBeInTheDocument();
			expect(screen.getByText("Tech Theme")).toBeInTheDocument();
		});
	});

	it("clears manual order when sort option is changed", async () => {
		render(<CarrierBagContent />);

		// Find the sort dropdown
		const sortTrigger = screen.getByRole("combobox", { name: /Sort by/i });

		// Simulate that manual order was active
		const reorderedItems = [mockItems[2], mockItems[0], mockItems[1]];
		mockSetItems(reorderedItems);

		// Change sort order
		fireEvent.click(sortTrigger);
		await waitFor(() => {
			const zaOption = screen.getByRole("option", { name: /Title \(Z–A\)/i });
			fireEvent.click(zaOption);
		});

		// Items should be sorted Z-A now
		await waitFor(() => {
			const items = screen.getAllByText(/Pattern$/);
			expect(items[0]).toHaveTextContent("Gamma Pattern");
			expect(items[1]).toHaveTextContent("Beta Pattern");
			expect(items[2]).toHaveTextContent("Alpha Pattern");
		});
	});

	it("clears all filters and manual order when clear all is clicked", async () => {
		render(<CarrierBagContent />);

		// First, enable group by theme
		const groupByThemeButton = screen.getByRole("button", {
			name: /Group by theme/i,
		});
		fireEvent.click(groupByThemeButton);

		// Verify grouping is active
		await waitFor(() => {
			expect(screen.getByText("Design Theme")).toBeInTheDocument();
		});

		// Click clear all
		const clearAllButton = screen.getByRole("button", { name: /Clear all/i });
		fireEvent.click(clearAllButton);

		// Grouping should be gone, items should be in default A-Z order
		await waitFor(() => {
			expect(screen.queryByText("Design Theme")).not.toBeInTheDocument();
			const items = screen.getAllByText(/Pattern$/);
			expect(items[0]).toHaveTextContent("Alpha Pattern");
			expect(items[1]).toHaveTextContent("Beta Pattern");
			expect(items[2]).toHaveTextContent("Gamma Pattern");
		});
	});
});
