import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mocks
vi.mock("next/navigation", () => ({
	useParams: () => ({ language: "en" }),
	usePathname: () => "/en/search",
}));

// Mock orientation store to not require provider and to control values
const mockOrientationState = {
	hasCompletedOrientation: false,
	selectedAudienceIds: [] as string[],
	selectedThemeIds: [] as string[],
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

// Mock server action
const mockSearch = vi.fn<
	[
		string,
		{ selectedAudienceIds: string[]; selectedThemeIds: string[] },
		number?,
	],
	Promise<unknown>
>();
vi.mock("~/app/actions/search", () => ({
	getPatternSuggestionsWithPreferences: (
		language: string,
		preferences: { selectedAudienceIds: string[]; selectedThemeIds: string[] },
		limit?: number,
	) => mockSearch(language, preferences, limit),
}));

import { SearchSuggestions } from "../search-suggestions";

describe("SearchSuggestions", () => {
	beforeEach(() => {
		mockSearch.mockReset();
		mockOrientationState.hasCompletedOrientation = false;
		mockOrientationState.selectedAudienceIds = [];
		mockOrientationState.selectedThemeIds = [];
	});

	it("does not render or fetch when orientation not completed", () => {
		mockOrientationState.hasCompletedOrientation = false;
		render(<SearchSuggestions />);
		expect(screen.queryByText(/Suggestions for you/i)).toBeNull();
		expect(mockSearch).not.toHaveBeenCalled();
	});

	it("does not render or fetch when no preferences selected", () => {
		mockOrientationState.hasCompletedOrientation = true;
		mockOrientationState.selectedAudienceIds = [];
		mockOrientationState.selectedThemeIds = [];
		render(<SearchSuggestions />);
		expect(screen.queryByText(/Suggestions for you/i)).toBeNull();
		expect(mockSearch).not.toHaveBeenCalled();
	});

	it("renders skeleton and then suggestions when preferences exist", async () => {
		mockOrientationState.hasCompletedOrientation = true;
		mockOrientationState.selectedAudienceIds = ["aud1"];
		mockOrientationState.selectedThemeIds = ["th1"];

		mockSearch.mockResolvedValue({
			success: true,
			data: [
				{
					_id: "p1",
					_type: "pattern",
					title: "Pattern One",
					language: "en",
					description: [],
					slug: "pattern-one",
					tags: [],
					audiences: [],
					theme: null,
				},
				{
					_id: "p2",
					_type: "pattern",
					title: "Pattern Two",
					language: "en",
					description: [],
					slug: "pattern-two",
					tags: [],
					audiences: [],
					theme: null,
				},
			],
			totalCount: 2,
			searchParams: { page: 1, limit: 20 },
		});

		render(<SearchSuggestions />);

		// Heading appears (skeleton phase or soon after)
		expect(await screen.findByText(/Suggestions for you/i)).toBeInTheDocument();

		// Wait for items to render
		await waitFor(() => {
			expect(screen.getByText("Pattern One")).toBeInTheDocument();
			expect(screen.getByText("Pattern Two")).toBeInTheDocument();
		});

		// Called with preferences
		expect(mockSearch).toHaveBeenCalledTimes(1);
		const [langArg, prefsArg] = mockSearch.mock.calls[0] as unknown as [
			string,
			{ selectedAudienceIds: string[]; selectedThemeIds: string[] },
		];
		expect(langArg).toBe("en");
		expect(prefsArg.selectedAudienceIds).toEqual(["aud1"]);
		expect(prefsArg.selectedThemeIds).toEqual(["th1"]);
	});

	it("renders nothing after load if API returns empty array", async () => {
		mockOrientationState.hasCompletedOrientation = true;
		mockOrientationState.selectedAudienceIds = ["aud1"];
		mockOrientationState.selectedThemeIds = [];

		mockSearch.mockResolvedValue({
			success: true,
			data: [],
			totalCount: 0,
			searchParams: { page: 1, limit: 20 },
		});

		render(<SearchSuggestions />);
		expect(await screen.findByText(/Suggestions for you/i)).toBeInTheDocument();
		await waitFor(() => {
			// No items rendered
			expect(screen.queryByRole("link", { name: /pattern/i })).toBeNull();
		});
	});
});
