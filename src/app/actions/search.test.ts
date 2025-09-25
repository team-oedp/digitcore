import { beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "~/lib/logger";
import { parseSearchParams, searchParamsSchema } from "~/lib/search";
import { client } from "~/sanity/lib/client";
import { searchPatterns, searchPatternsWithParams } from "./search";

vi.mock("~/lib/logger", () => ({
	logger: {
		searchInfo: vi.fn(),
		groq: vi.fn(),
		searchError: vi.fn(),
		search: vi.fn(),
		error: vi.fn(),
	},
	createLogLocation: vi.fn(() => ({
		file: "test-file",
		function: "test-function",
	})),
}));
vi.mock("~/sanity/lib/client");
vi.mock("~/lib/search");

const mockFetch = vi.mocked(client.fetch);
const mockSearchParamsSchema = vi.mocked(searchParamsSchema);
const mockParseSearchParams = vi.mocked(parseSearchParams);
const mockLogger = vi.mocked(logger);

// Mock queries
vi.mock("~/sanity/lib/queries", () => ({
	PATTERN_SEARCH_QUERY: "SEARCH_QUERY_STRING",
	PATTERN_FILTER_QUERY: "FILTER_QUERY_STRING",
}));

// Mock data
const createMockSearchResult = (count = 3) =>
	Array.from({ length: count }, (_, i) => ({
		_id: `pattern${i + 1}`,
		_type: "pattern",
		title: `Test Pattern ${i + 1}`,
		description: [
			{
				_type: "block",
				_key: `block${i}`,
				children: [
					{
						_type: "span",
						_key: `span${i}`,
						text: `Description for pattern ${i + 1}`,
						marks: [],
					},
				],
			},
		],
		slug: `test-pattern-${i + 1}`,
		tags: [
			{
				_id: `tag${i + 1}`,
				title: `Tag ${i + 1}`,
			},
		],
		audiences: [
			{
				_id: `audience${i + 1}`,
				title: `Audience ${i + 1}`,
			},
		],
		theme: {
			_id: `theme${i + 1}`,
			title: `Theme ${i + 1}`,
		},
		solutions: [],
		resources: [],
	}));

const createFormData = (data: Record<string, string>) => {
	const formData = new FormData();
	for (const [key, value] of Object.entries(data)) {
		formData.append(key, value);
	}
	return formData;
};

describe("searchPatterns", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should successfully search patterns with search term", async () => {
		const mockResults = createMockSearchResult(3);
		const mockParsedParams = {
			searchTerm: "climate",
			audiences: ["urban-planners"],
			themes: ["sustainability"],
			tags: ["climate-change"],
			enhance: false,
			page: 1,
			limit: 20,
		};

		mockSearchParamsSchema.parse.mockReturnValue({
			q: "climate",
			audiences: "urban-planners",
			themes: "sustainability",
			tags: "climate-change",
			page: 1,
			limit: 20,
		});

		mockParseSearchParams.mockReturnValue(mockParsedParams);
		mockFetch.mockResolvedValue({ ms: 100, result: mockResults });

		const formData = createFormData({
			q: "climate",
			audiences: "urban-planners",
			themes: "sustainability",
			tags: "climate-change",
			page: "1",
			limit: "20",
		});

		const result = await searchPatterns(formData);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(mockResults);
		expect(result.totalCount).toBe(3);
		expect(result.searchParams).toEqual(mockParsedParams);

		// Should use search query when search term is present
		expect(mockFetch).toHaveBeenCalledWith(
			"SEARCH_QUERY_STRING",
			expect.objectContaining({
				searchTerm: "climate",
				audiences: ["urban-planners"],
				themes: ["sustainability"],
				tags: ["climate-change"],
			}),
		);
	});

	it("should use filter query when no search term is provided", async () => {
		const mockResults = createMockSearchResult(2);
		const mockParsedParams = {
			searchTerm: "",
			audiences: ["students"],
			themes: [],
			tags: [],
			enhance: false,
			page: 1,
			limit: 20,
		};

		mockSearchParamsSchema.parse.mockReturnValue({
			q: "",
			audiences: "students",
			themes: "",
			tags: "",
			page: 1,
			limit: 20,
		});

		mockParseSearchParams.mockReturnValue(mockParsedParams);
		mockFetch.mockResolvedValue({ ms: 100, result: mockResults });

		const formData = createFormData({
			q: "",
			audiences: "students",
			themes: "",
			tags: "",
			page: "1",
			limit: "20",
		});

		const result = await searchPatterns(formData);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(mockResults);

		// Should use filter query when no search term
		expect(mockFetch).toHaveBeenCalledWith(
			"FILTER_QUERY_STRING",
			expect.objectContaining({
				audiences: ["students"],
				themes: [],
				tags: [],
			}),
		);

		// Search term should not be included in query params when empty
		expect(mockFetch).toHaveBeenCalledWith(
			"FILTER_QUERY_STRING",
			expect.not.objectContaining({
				searchTerm: expect.anything(),
			}),
		);
	});

	it("should handle empty form data gracefully", async () => {
		const mockResults = createMockSearchResult(0);
		const mockParsedParams = {
			searchTerm: "",
			audiences: [],
			themes: [],
			tags: [],
			enhance: false,
			page: 1,
			limit: 20,
		};

		mockSearchParamsSchema.parse.mockReturnValue({
			q: undefined,
			audiences: undefined,
			themes: undefined,
			tags: undefined,
			page: 1,
			limit: 20,
		});

		mockParseSearchParams.mockReturnValue(mockParsedParams);
		mockFetch.mockResolvedValue({ ms: 100, result: mockResults });

		const formData = new FormData();

		const result = await searchPatterns(formData);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(mockResults);
		expect(result.totalCount).toBe(0);
	});

	it("should escape special characters in search terms", async () => {
		const mockResults = createMockSearchResult(1);
		const mockParsedParams = {
			searchTerm: 'climate "adaptation" & planning',
			audiences: [],
			themes: [],
			tags: [],
			enhance: false,
			page: 1,
			limit: 20,
		};

		mockSearchParamsSchema.parse.mockReturnValue({
			q: 'climate "adaptation" & planning',
			audiences: "",
			themes: "",
			tags: "",
			page: 1,
			limit: 20,
		});

		mockParseSearchParams.mockReturnValue(mockParsedParams);
		mockFetch.mockResolvedValue({ ms: 100, result: mockResults });

		const formData = createFormData({
			q: 'climate "adaptation" & planning',
			page: "1",
			limit: "20",
		});

		await searchPatterns(formData);

		expect(mockFetch).toHaveBeenCalledWith(
			"SEARCH_QUERY_STRING",
			expect.objectContaining({
				searchTerm: 'climate \\"adaptation\\" & planning',
			}),
		);
	});

	it("should handle whitespace-only search terms as empty", async () => {
		const mockResults = createMockSearchResult(1);
		const mockParsedParams = {
			searchTerm: "   ",
			audiences: [],
			themes: [],
			tags: [],
			enhance: false,
			page: 1,
			limit: 20,
		};

		mockSearchParamsSchema.parse.mockReturnValue({
			q: "   ",
			audiences: "",
			themes: "",
			tags: "",
			page: 1,
			limit: 20,
		});

		mockParseSearchParams.mockReturnValue(mockParsedParams);
		mockFetch.mockResolvedValue({ ms: 100, result: mockResults });

		const formData = createFormData({
			q: "   ",
			page: "1",
			limit: "20",
		});

		await searchPatterns(formData);

		// Should use filter query for whitespace-only search term
		expect(mockFetch).toHaveBeenCalledWith(
			"FILTER_QUERY_STRING",
			expect.not.objectContaining({
				searchTerm: expect.anything(),
			}),
		);
	});

	it("should handle validation errors", async () => {
		const validationError = new Error("Invalid search parameters");
		mockSearchParamsSchema.parse.mockImplementation(() => {
			throw validationError;
		});

		const formData = createFormData({
			q: "test",
			page: "invalid",
		});

		const result = await searchPatterns(formData);

		expect(result.success).toBe(false);
		expect(result.error).toBe("Invalid search parameters");
		expect(result.totalCount).toBe(0);
		expect(mockLogger.searchError).toHaveBeenCalledWith(
			"Search operation failed",
			validationError,
			expect.any(Object),
		);
	});

	it("should handle GROQ query errors", async () => {
		const queryError = new Error("GROQ syntax error");
		mockSearchParamsSchema.parse.mockReturnValue({
			q: "test",
			audiences: "",
			themes: "",
			tags: "",
			page: 1,
			limit: 20,
		});

		mockParseSearchParams.mockReturnValue({
			searchTerm: "test",
			audiences: [],
			themes: [],
			tags: [],
			enhance: false,
			page: 1,
			limit: 20,
		});

		mockFetch.mockRejectedValue(queryError);

		const formData = createFormData({ q: "test" });

		const result = await searchPatterns(formData);

		expect(result.success).toBe(false);
		expect(result.error).toBe("GROQ syntax error");
		expect(result.totalCount).toBe(0);
	});

	it("should handle null GROQ errors", async () => {
		mockSearchParamsSchema.parse.mockReturnValue({
			q: "test",
			audiences: "",
			themes: "",
			tags: "",
			page: 1,
			limit: 20,
		});

		mockParseSearchParams.mockReturnValue({
			searchTerm: "test",
			audiences: [],
			themes: [],
			tags: [],
			enhance: false,
			page: 1,
			limit: 20,
		});

		mockFetch.mockRejectedValue(null);

		const formData = createFormData({ q: "test" });

		const result = await searchPatterns(formData);

		expect(result.success).toBe(false);
		expect(result.error).toBe("Search failed - GROQ query error");
		expect(result.totalCount).toBe(0);
	});

	it("should handle unknown error types", async () => {
		mockSearchParamsSchema.parse.mockReturnValue({
			q: "test",
			audiences: "",
			themes: "",
			tags: "",
			page: 1,
			limit: 20,
		});

		mockParseSearchParams.mockReturnValue({
			searchTerm: "test",
			audiences: [],
			themes: [],
			tags: [],
			enhance: false,
			page: 1,
			limit: 20,
		});

		mockFetch.mockRejectedValue({ unknown: "error" });

		const formData = createFormData({ q: "test" });

		const result = await searchPatterns(formData);

		expect(result.success).toBe(false);
		expect(result.error).toBe("Search failed - unknown error");
		expect(result.totalCount).toBe(0);
	});

	it("should provide empty arrays for filter parameters when they are not present", async () => {
		const mockResults = createMockSearchResult(1);
		const mockParsedParams = {
			searchTerm: "test",
			audiences: [],
			themes: [],
			tags: [],
			enhance: false,
			page: 1,
			limit: 20,
		};

		mockSearchParamsSchema.parse.mockReturnValue({
			q: "test",
			audiences: undefined,
			themes: undefined,
			tags: undefined,
			page: 1,
			limit: 20,
		});

		mockParseSearchParams.mockReturnValue(mockParsedParams);
		mockFetch.mockResolvedValue({ ms: 100, result: mockResults });

		const formData = createFormData({ q: "test" });

		await searchPatterns(formData);

		expect(mockFetch).toHaveBeenCalledWith(
			"SEARCH_QUERY_STRING",
			expect.objectContaining({
				audiences: [],
				themes: [],
				tags: [],
			}),
		);
	});

	it("should log search operations properly", async () => {
		const mockResults = createMockSearchResult(2);
		const mockParsedParams = {
			searchTerm: "test",
			audiences: [],
			themes: [],
			tags: [],
			enhance: false,
			page: 1,
			limit: 20,
		};

		mockSearchParamsSchema.parse.mockReturnValue({
			q: "test",
			audiences: "",
			themes: "",
			tags: "",
			page: 1,
			limit: 20,
		});

		mockParseSearchParams.mockReturnValue(mockParsedParams);
		mockFetch.mockResolvedValue({ ms: 100, result: mockResults });

		const formData = createFormData({ q: "test" });

		await searchPatterns(formData);

		expect(mockLogger.searchInfo).toHaveBeenCalledWith(
			"Starting search operation",
			undefined,
			expect.any(Object),
		);

		expect(mockLogger.groq).toHaveBeenCalledWith(
			"Using PATTERN_SEARCH_QUERY with escaped search term",
			{ original: "test", escaped: "test" },
			expect.any(Object),
		);

		expect(mockLogger.searchInfo).toHaveBeenCalledWith(
			"Search completed successfully",
			{ resultCount: 2 },
			expect.any(Object),
		);
	});
});

describe("searchPatternsWithParams", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should convert URLSearchParams to FormData and delegate to searchPatterns", async () => {
		const mockResults = createMockSearchResult(1);
		const mockParsedParams = {
			searchTerm: "climate",
			audiences: ["students"],
			themes: [],
			tags: [],
			enhance: false,
			page: 1,
			limit: 20,
		};

		mockSearchParamsSchema.parse.mockReturnValue({
			q: "climate",
			audiences: "students",
			themes: "",
			tags: "",
			page: 1,
			limit: 20,
		});

		mockParseSearchParams.mockReturnValue(mockParsedParams);
		mockFetch.mockResolvedValue({ ms: 100, result: mockResults });

		const searchParams = new URLSearchParams({
			q: "climate",
			audiences: "students",
			page: "1",
			limit: "20",
		});

		const result = await searchPatternsWithParams(searchParams);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(mockResults);
		expect(result.totalCount).toBe(1);

		expect(mockLogger.searchInfo).toHaveBeenCalledWith(
			"Converting URLSearchParams to FormData",
			{
				q: "climate",
				audiences: "students",
				page: "1",
				limit: "20",
			},
			expect.any(Object),
		);
	});

	it("should handle errors in URLSearchParams conversion", async () => {
		const conversionError = new Error("URLSearchParams conversion failed");

		// Mock a scenario where parameter processing fails
		mockSearchParamsSchema.parse.mockImplementation(() => {
			throw conversionError;
		});

		const searchParams = new URLSearchParams({
			q: "test",
			page: "invalid",
		});

		const result = await searchPatternsWithParams(searchParams);

		expect(result.success).toBe(false);
		expect(result.error).toBe("URLSearchParams conversion failed");
		expect(result.totalCount).toBe(0);

		// Note: The error is actually caught and logged by searchPatterns first
		expect(mockLogger.searchError).toHaveBeenCalledWith(
			"Search operation failed",
			conversionError,
			expect.any(Object),
		);
	});

	it("should handle empty URLSearchParams", async () => {
		const mockResults = createMockSearchResult(0);
		const mockParsedParams = {
			searchTerm: "",
			audiences: [],
			themes: [],
			tags: [],
			enhance: false,
			page: 1,
			limit: 20,
		};

		mockSearchParamsSchema.parse.mockReturnValue({
			q: undefined,
			audiences: undefined,
			themes: undefined,
			tags: undefined,
			page: 1,
			limit: 20,
		});

		mockParseSearchParams.mockReturnValue(mockParsedParams);
		mockFetch.mockResolvedValue({ ms: 100, result: mockResults });

		const searchParams = new URLSearchParams();

		const result = await searchPatternsWithParams(searchParams);

		expect(result.success).toBe(true);
		expect(result.data).toEqual(mockResults);
		expect(result.totalCount).toBe(0);
	});

	it("should handle non-Error exceptions", async () => {
		const stringError = "String error occurred";
		mockSearchParamsSchema.parse.mockImplementation(() => {
			throw stringError;
		});

		const searchParams = new URLSearchParams({ q: "test" });

		const result = await searchPatternsWithParams(searchParams);

		expect(result.success).toBe(false);
		expect(result.error).toBe("Search failed - unknown error");
		expect(result.totalCount).toBe(0);
	});

	it("should preserve all URL parameters during conversion", async () => {
		const mockResults = createMockSearchResult(1);
		const mockParsedParams = {
			searchTerm: "climate change",
			audiences: ["students", "researchers"],
			themes: ["sustainability", "innovation"],
			tags: ["climate", "environment"],
			enhance: false,
			page: 2,
			limit: 50,
		};

		mockSearchParamsSchema.parse.mockReturnValue({
			q: "climate change",
			audiences: "students,researchers",
			themes: "sustainability,innovation",
			tags: "climate,environment",
			page: 2,
			limit: 50,
		});

		mockParseSearchParams.mockReturnValue(mockParsedParams);
		mockFetch.mockResolvedValue({ ms: 100, result: mockResults });

		const searchParams = new URLSearchParams({
			q: "climate change",
			audiences: "students,researchers",
			themes: "sustainability,innovation",
			tags: "climate,environment",
			page: "2",
			limit: "50",
		});

		const result = await searchPatternsWithParams(searchParams);

		expect(result.success).toBe(true);
		expect(result.searchParams).toEqual(mockParsedParams);

		expect(mockLogger.searchInfo).toHaveBeenCalledWith(
			"Converting URLSearchParams to FormData",
			{
				q: "climate change",
				audiences: "students,researchers",
				themes: "sustainability,innovation",
				tags: "climate,environment",
				page: "2",
				limit: "50",
			},
			expect.any(Object),
		);
	});
});
