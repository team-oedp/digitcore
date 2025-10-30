import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Language } from "~/i18n/config";

// Mocks for next/navigation
const mockParams = new Map<string, string>();

vi.mock("next/navigation", () => ({
	useParams: () => ({ language: "en" }),
	usePathname: () => "/en/search",
	useSearchParams: () => ({
		get: (key: string) => mockParams.get(key) ?? null,
		toString: () =>
			Array.from(mockParams.entries())
				.map(([k, v]) => `${k}=${v}`)
				.join("&"),
		entries: function* () {
			for (const [k, v] of mockParams.entries()) {
				yield [k, v] as const;
			}
		},
	}),
}));

// Mock orientation store to control eligibility for suggestions
const mockOrientationState = {
	hasCompletedOrientation: true,
	selectedAudienceIds: ["aud1"],
	selectedThemeIds: ["th1"],
};

type OrientationMockState = {
	hasCompletedOrientation: boolean;
	selectedAudienceIds: string[];
	selectedThemeIds: string[];
};

vi.mock("~/stores/orientation", () => ({
	useOrientationStore: (
		selector?: (s: OrientationMockState) => unknown,
	): unknown => {
		const base: OrientationMockState = {
			hasCompletedOrientation: mockOrientationState.hasCompletedOrientation,
			selectedAudienceIds: mockOrientationState.selectedAudienceIds,
			selectedThemeIds: mockOrientationState.selectedThemeIds,
		};
		return selector ? selector(base) : base;
	},
	OrientationStoreProvider: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
}));

// Mock server actions used by wrapper and suggestions
const mockSearch = vi.fn<[URLSearchParams, string], Promise<unknown>>();
vi.mock("~/app/actions/search", () => ({
	searchPatternsWithParams: (params: URLSearchParams, language: string) =>
		mockSearch(params, language),
	searchPatternsWithPreferences: (
		params: URLSearchParams,
		_prefs: unknown,
		language: string,
	) => mockSearch(params, language),
	getPatternSuggestionsWithPreferences: (
		language: string,
		_prefs: unknown,
		_limit?: number,
	) =>
		Promise.resolve([
			{
				_id: "p1",
				_type: "pattern",
				title: "Suggestion One",
				language: "en",
				description: [],
				slug: "s-one",
				tags: [],
				audiences: [],
				theme: null,
			},
		]),
}));

import { SearchClientWrapper } from "../search-client-wrapper";

describe("SearchClientWrapper integration with suggestions", () => {
	beforeEach(() => {
		mockParams.clear();
		mockSearch.mockReset();
	});

	it("renders suggestions when there is no search criteria", async () => {
		// No q, audiences, themes, tags
		mockOrientationState.hasCompletedOrientation = true;
		mockOrientationState.selectedAudienceIds = ["aud1"];
		mockOrientationState.selectedThemeIds = ["th1"];

		mockSearch.mockResolvedValue({
			success: true,
			data: [
				{
					_id: "p1",
					_type: "pattern",
					title: "Suggestion One",
					language: "en",
					description: [],
					slug: "s-one",
					tags: [],
					audiences: [],
					theme: null,
				},
			],
			totalCount: 1,
			searchParams: { page: 1, limit: 20 },
		});

		render(<SearchClientWrapper language={"en" as Language} />);

		// Suggestions header appears and item renders
		expect(await screen.findByText(/Suggestions for you/i)).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.getByText("Suggestion One")).toBeInTheDocument();
		});
	});

	it("shows empty-state then suggestions when search returns zero results", async () => {
		// Provide a valid search term (>=4 chars)
		mockParams.set("q", "open");

		// First call: wrapper search -> zero results
		mockSearch.mockResolvedValueOnce({
			success: true,
			data: [],
			totalCount: 0,
			searchParams: { page: 1, limit: 20 },
		});

		// Second call: suggestions fetch -> some results
		mockSearch.mockResolvedValueOnce({
			success: true,
			data: [
				{
					_id: "p3",
					_type: "pattern",
					title: "Suggestion Three",
					language: "en",
					description: [],
					slug: "s-three",
					tags: [],
					audiences: [],
					theme: null,
				},
			],
			totalCount: 1,
			searchParams: { page: 1, limit: 20 },
		});

		render(<SearchClientWrapper language={"en" as Language} />);

		// Empty state text
		expect(
			await screen.findByText(
				/No results found\. Try adjusting your search terms or filters/i,
			),
		).toBeInTheDocument();

		// Suggestions header appears below
		expect(await screen.findByText(/Suggestions for you/i)).toBeInTheDocument();
		expect(await screen.findByText("Suggestion Three")).toBeInTheDocument();
	});
});
