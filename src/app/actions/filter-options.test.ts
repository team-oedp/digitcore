import { beforeEach, describe, expect, it, vi } from "vitest";
import { type FilterOptionsResult, fetchFilterOptions } from "./filter-options";

// Mock the logger
const mockLogger = {
	searchInfo: vi.fn(),
	groq: vi.fn(),
	searchError: vi.fn(),
};

vi.mock("~/lib/logger", () => ({
	createLogLocation: vi.fn(() => ({
		file: "filter-options.ts",
		function: "test",
	})),
	logger: mockLogger,
}));

// Mock the Sanity client
const mockFetch = vi.fn();

vi.mock("~/sanity/lib/client", () => ({
	client: {
		fetch: mockFetch,
	},
}));

// Mock the filter options query
vi.mock("~/sanity/lib/filter-options", () => ({
	FILTER_OPTIONS_QUERY: "FILTER_OPTIONS_QUERY_STRING",
}));

// Mock data
const createMockFilterData = (overrides?: any) => ({
	audiences: [
		{ value: "students", label: "Students" },
		{ value: "researchers", label: "Researchers" },
		{ value: "policy-makers", label: "Policy Makers" },
		{ value: "practitioners", label: "Practitioners" },
	],
	themes: [
		{ value: "sustainability", label: "Sustainability" },
		{ value: "innovation", label: "Innovation" },
		{ value: "climate-change", label: "Climate Change" },
		{ value: "urban-planning", label: "Urban Planning" },
	],
	tags: [
		{ value: "renewable-energy", label: "Renewable Energy" },
		{ value: "water-management", label: "Water Management" },
		{ value: "biodiversity", label: "Biodiversity" },
		{ value: "community-engagement", label: "Community Engagement" },
	],
	...overrides,
});

describe("fetchFilterOptions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should successfully fetch filter options", async () => {
		const mockData = createMockFilterData();
		mockFetch.mockResolvedValue(mockData);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: mockData.audiences,
			themes: mockData.themes,
			tags: mockData.tags,
		});
		expect(result.error).toBeUndefined();

		expect(mockFetch).toHaveBeenCalledWith("FILTER_OPTIONS_QUERY_STRING");

		expect(mockLogger.searchInfo).toHaveBeenCalledWith(
			"Fetching filter options from Sanity",
			undefined,
			expect.any(Object),
		);

		expect(mockLogger.groq).toHaveBeenCalledWith(
			"Filter options query completed",
			expect.objectContaining({
				executionTime: expect.stringMatching(/\d+ms/),
				dataReceived: true,
			}),
			expect.any(Object),
		);

		expect(mockLogger.searchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 4,
				themeCount: 4,
				tagCount: 4,
			},
			expect.any(Object),
		);
	});

	it("should handle empty data from Sanity", async () => {
		mockFetch.mockResolvedValue(null);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: [],
			themes: [],
			tags: [],
		});

		expect(mockLogger.searchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 0,
				themeCount: 0,
				tagCount: 0,
			},
			expect.any(Object),
		);
	});

	it("should filter out items with null labels", async () => {
		const mockData = createMockFilterData({
			audiences: [
				{ value: "students", label: "Students" },
				{ value: "invalid", label: null },
				{ value: "researchers", label: "Researchers" },
			],
			themes: [
				{ value: "sustainability", label: "Sustainability" },
				{ value: "invalid-theme", label: null },
			],
			tags: [
				{ value: "renewable-energy", label: "Renewable Energy" },
				{ value: "invalid-tag", label: null },
				{ value: "water-management", label: "Water Management" },
			],
		});

		mockFetch.mockResolvedValue(mockData);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data?.audiences).toHaveLength(2);
		expect(result.data?.themes).toHaveLength(1);
		expect(result.data?.tags).toHaveLength(2);

		// Should only include items with valid labels
		expect(result.data?.audiences).toEqual([
			{ value: "students", label: "Students" },
			{ value: "researchers", label: "Researchers" },
		]);

		expect(result.data?.themes).toEqual([
			{ value: "sustainability", label: "Sustainability" },
		]);

		expect(result.data?.tags).toEqual([
			{ value: "renewable-energy", label: "Renewable Energy" },
			{ value: "water-management", label: "Water Management" },
		]);
	});

	it("should handle missing categories in response", async () => {
		const mockData = {
			audiences: [{ value: "students", label: "Students" }],
			// themes missing
			tags: [{ value: "renewable-energy", label: "Renewable Energy" }],
		};

		mockFetch.mockResolvedValue(mockData);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: [{ value: "students", label: "Students" }],
			themes: [],
			tags: [{ value: "renewable-energy", label: "Renewable Energy" }],
		});

		expect(mockLogger.searchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 1,
				themeCount: 0,
				tagCount: 1,
			},
			expect.any(Object),
		);
	});

	it("should handle empty arrays in response", async () => {
		const mockData = {
			audiences: [],
			themes: [],
			tags: [],
		};

		mockFetch.mockResolvedValue(mockData);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: [],
			themes: [],
			tags: [],
		});

		expect(mockLogger.searchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 0,
				themeCount: 0,
				tagCount: 0,
			},
			expect.any(Object),
		);
	});

	it("should handle Sanity client errors", async () => {
		const error = new Error("Sanity fetch failed");
		mockFetch.mockRejectedValue(error);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(false);
		expect(result.error).toBe("Sanity fetch failed");
		expect(result.data).toBeUndefined();

		expect(mockLogger.searchError).toHaveBeenCalledWith(
			"Failed to fetch filter options",
			error,
			expect.any(Object),
		);
	});

	it("should handle non-Error exceptions", async () => {
		const stringError = "String error occurred";
		mockFetch.mockRejectedValue(stringError);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(false);
		expect(result.error).toBe("Failed to fetch filter options");
		expect(result.data).toBeUndefined();

		expect(mockLogger.searchError).toHaveBeenCalledWith(
			"Failed to fetch filter options",
			stringError,
			expect.any(Object),
		);
	});

	it("should handle null exceptions", async () => {
		mockFetch.mockRejectedValue(null);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(false);
		expect(result.error).toBe("Failed to fetch filter options");
		expect(result.data).toBeUndefined();
	});

	it("should measure and log execution time", async () => {
		const mockData = createMockFilterData();
		mockFetch.mockImplementation(
			() => new Promise((resolve) => setTimeout(() => resolve(mockData), 50)),
		);

		await fetchFilterOptions();

		expect(mockLogger.groq).toHaveBeenCalledWith(
			"Filter options query completed",
			expect.objectContaining({
				executionTime: expect.stringMatching(/\d+ms/),
				dataReceived: true,
			}),
			expect.any(Object),
		);
	});

	it("should handle partial null labels in mixed arrays", async () => {
		const mockData = {
			audiences: [
				{ value: "students", label: "Students" },
				{ value: "researchers", label: "Researchers" },
				{ value: "invalid1", label: null },
				{ value: "policy-makers", label: "Policy Makers" },
				{ value: "invalid2", label: null },
			],
			themes: [
				{ value: "sustainability", label: "Sustainability" },
				{ value: "innovation", label: "Innovation" },
			],
			tags: [{ value: "valid-tag", label: "Valid Tag" }],
		};

		mockFetch.mockResolvedValue(mockData);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data?.audiences).toHaveLength(3);
		expect(result.data?.themes).toHaveLength(2);
		expect(result.data?.tags).toHaveLength(1);

		// Verify only items with valid labels are included
		expect(result.data?.audiences).toEqual([
			{ value: "students", label: "Students" },
			{ value: "researchers", label: "Researchers" },
			{ value: "policy-makers", label: "Policy Makers" },
		]);

		expect(mockLogger.searchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 3,
				themeCount: 2,
				tagCount: 1,
			},
			expect.any(Object),
		);
	});

	it("should handle completely invalid data structure", async () => {
		const mockData = {
			invalid: "data",
			structure: true,
		};

		mockFetch.mockResolvedValue(mockData);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: [],
			themes: [],
			tags: [],
		});

		expect(mockLogger.searchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 0,
				themeCount: 0,
				tagCount: 0,
			},
			expect.any(Object),
		);
	});

	it("should handle undefined response from Sanity", async () => {
		mockFetch.mockResolvedValue(undefined);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: [],
			themes: [],
			tags: [],
		});

		expect(mockLogger.groq).toHaveBeenCalledWith(
			"Filter options query completed",
			expect.objectContaining({
				dataReceived: false,
			}),
			expect.any(Object),
		);
	});

	it("should handle arrays with only null labels", async () => {
		const mockData = {
			audiences: [
				{ value: "invalid1", label: null },
				{ value: "invalid2", label: null },
			],
			themes: [{ value: "invalid3", label: null }],
			tags: [{ value: "invalid4", label: null }],
		};

		mockFetch.mockResolvedValue(mockData);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: [],
			themes: [],
			tags: [],
		});

		expect(mockLogger.searchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 0,
				themeCount: 0,
				tagCount: 0,
			},
			expect.any(Object),
		);
	});
});
