import { beforeEach, describe, expect, it, vi } from "vitest";
import { type FilterOptionsResult, fetchFilterOptions } from "./filter-options";

// Mock the logger (include createLogLocation export expected by code)
vi.mock("~/lib/logger", () => {
	const mockSearchInfo = vi.fn();
	const mockGroq = vi.fn();
	const mockSearchError = vi.fn();

	// Store mocks in global for later access
	if (typeof globalThis !== "undefined") {
		(
			globalThis as typeof globalThis & {
				__mockSearchInfo?: typeof mockSearchInfo;
				__mockGroq?: typeof mockGroq;
				__mockSearchError?: typeof mockSearchError;
			}
		).__mockSearchInfo = mockSearchInfo;
		(
			globalThis as typeof globalThis & {
				__mockSearchInfo?: typeof mockSearchInfo;
				__mockGroq?: typeof mockGroq;
				__mockSearchError?: typeof mockSearchError;
			}
		).__mockGroq = mockGroq;
		(
			globalThis as typeof globalThis & {
				__mockSearchInfo?: typeof mockSearchInfo;
				__mockGroq?: typeof mockGroq;
				__mockSearchError?: typeof mockSearchError;
			}
		).__mockSearchError = mockSearchError;
	}

	return {
		createLogLocation: vi.fn((file: string, fn?: string, line?: number) =>
			[file, fn, line].filter(Boolean).join("::"),
		),
		logger: {
			searchInfo: mockSearchInfo,
			groq: mockGroq,
			searchError: mockSearchError,
		},
	};
});

// Mock the Sanity client
vi.mock("~/sanity/lib/client", () => {
	const mockFetch = vi.fn();

	// Store mock in global for later access
	if (typeof globalThis !== "undefined") {
		(
			globalThis as typeof globalThis & {
				__mockFetch?: typeof mockFetch;
			}
		).__mockFetch = mockFetch;
	}

	return {
		client: {
			fetch: mockFetch,
		},
	};
});

// Mock the filter options query from the correct module
vi.mock("~/sanity/lib/queries", () => ({
	FILTER_OPTIONS_QUERY: "FILTER_OPTIONS_QUERY_STRING",
}));

// Define type for extended globalThis
type GlobalWithMocks = typeof globalThis & {
	__mockFetch?: ReturnType<typeof vi.fn>;
	__mockSearchInfo?: ReturnType<typeof vi.fn>;
	__mockGroq?: ReturnType<typeof vi.fn>;
	__mockSearchError?: ReturnType<typeof vi.fn>;
};

// Get the mock functions from global
const mockFetch = (globalThis as GlobalWithMocks).__mockFetch || vi.fn();
const mockSearchInfo =
	(globalThis as GlobalWithMocks).__mockSearchInfo || vi.fn();
const mockGroq = (globalThis as GlobalWithMocks).__mockGroq || vi.fn();
const mockSearchError =
	(globalThis as GlobalWithMocks).__mockSearchError || vi.fn();

// Mock data
const createMockFilterData = (
	overrides: Partial<FilterOptionsResult> = {},
) => ({
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
		mockFetch.mockResolvedValue({ ms: 100, result: mockData });

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: mockData.audiences,
			themes: mockData.themes,
			tags: mockData.tags,
		});
		expect(result.error).toBeUndefined();

		expect(mockFetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({ language: expect.any(String) }),
		);

		expect(mockSearchInfo).toHaveBeenCalledWith(
			"Fetching filter options from Sanity",
			undefined,
			expect.any(String),
		);

		expect(mockGroq).toHaveBeenCalledWith(
			"Filter options query completed",
			expect.objectContaining({
				executionTime: expect.stringMatching(/\d+ms/),
				dataReceived: true,
			}),
			expect.any(String),
		);

		expect(mockSearchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 4,
				themeCount: 4,
				tagCount: 4,
			},
			expect.any(String),
		);
	});

	it("should handle empty data from Sanity", async () => {
		mockFetch.mockResolvedValue({ ms: 100, result: null });

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: [],
			themes: [],
			tags: [],
		});

		expect(mockSearchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 0,
				themeCount: 0,
				tagCount: 0,
			},
			expect.any(String),
		);
	});

	it("should filter out items with null labels", async () => {
		const mockData = {
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
		};

		mockFetch.mockResolvedValue({ ms: 100, result: mockData });

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

		mockFetch.mockResolvedValue({ ms: 100, result: mockData });

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: [{ value: "students", label: "Students" }],
			themes: [],
			tags: [{ value: "renewable-energy", label: "Renewable Energy" }],
		});

		expect(mockSearchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 1,
				themeCount: 0,
				tagCount: 1,
			},
			expect.any(String),
		);
	});

	it("should handle empty arrays in response", async () => {
		const mockData = {
			audiences: [],
			themes: [],
			tags: [],
		};

		mockFetch.mockResolvedValue({ ms: 100, result: mockData });

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: [],
			themes: [],
			tags: [],
		});

		expect(mockSearchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 0,
				themeCount: 0,
				tagCount: 0,
			},
			expect.any(String),
		);
	});

	it("should handle Sanity client errors", async () => {
		const error = new Error("Sanity fetch failed");
		mockFetch.mockRejectedValue(error);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(false);
		expect(result.error).toBe("Sanity fetch failed");
		expect(result.data).toBeUndefined();

		expect(mockSearchError).toHaveBeenCalledWith(
			"Failed to fetch filter options",
			error,
			expect.any(String),
		);
	});

	it("should handle non-Error exceptions", async () => {
		const stringError = "String error occurred";
		mockFetch.mockRejectedValue(stringError);

		const result = await fetchFilterOptions();

		expect(result.success).toBe(false);
		expect(result.error).toBe("Failed to fetch filter options");
		expect(result.data).toBeUndefined();

		expect(mockSearchError).toHaveBeenCalledWith(
			"Failed to fetch filter options",
			stringError,
			expect.any(String),
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
			() =>
				new Promise((resolve) =>
					setTimeout(() => resolve({ ms: 100, result: mockData }), 50),
				),
		);

		await fetchFilterOptions();

		expect(mockGroq).toHaveBeenCalledTimes(1);
		const groqArgs = mockGroq.mock.calls[0];
		expect(groqArgs?.[0]).toBe("Filter options query completed");
		expect(typeof groqArgs?.[1]).toBe("object");
		const logData = groqArgs?.[1] as {
			dataReceived?: boolean;
			executionTime?: string;
		};
		expect(logData?.dataReceived).toBe(true);
		expect(String(logData?.executionTime)).toMatch(/\d+ms/);
		expect(typeof groqArgs?.[2]).toBe("string");
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

		mockFetch.mockResolvedValue({ ms: 100, result: mockData });

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

		expect(mockSearchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 3,
				themeCount: 2,
				tagCount: 1,
			},
			expect.any(String),
		);
	});

	it("should handle completely invalid data structure", async () => {
		const mockData = {
			invalid: "data",
			structure: true,
		};

		mockFetch.mockResolvedValue({ ms: 100, result: mockData });

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: [],
			themes: [],
			tags: [],
		});

		expect(mockSearchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 0,
				themeCount: 0,
				tagCount: 0,
			},
			expect.any(String),
		);
	});

	it("should handle undefined response from Sanity", async () => {
		mockFetch.mockResolvedValue({ ms: 100, result: undefined });

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: [],
			themes: [],
			tags: [],
		});

		expect(mockGroq).toHaveBeenCalledWith(
			"Filter options query completed",
			expect.objectContaining({
				dataReceived: false,
			}),
			expect.any(String),
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

		mockFetch.mockResolvedValue({ ms: 100, result: mockData });

		const result = await fetchFilterOptions();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			audiences: [],
			themes: [],
			tags: [],
		});

		expect(mockSearchInfo).toHaveBeenCalledWith(
			"Filter options processed successfully",
			{
				audienceCount: 0,
				themeCount: 0,
				tagCount: 0,
			},
			expect.any(String),
		);
	});
});
