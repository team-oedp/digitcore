import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	type PatternContentSearchResult,
	searchPatternContent,
} from "./pattern-search";

// Mock the Sanity client
vi.mock("~/sanity/lib/client", () => ({
	client: {
		fetch: vi.fn(),
	},
}));

// Console logging mock
vi.mock("console", () => ({
	log: vi.fn(),
	error: vi.fn(),
}));

// Import the mocked client to get access to the fetch function
import { client } from "~/sanity/lib/client";
const mockFetch = vi.mocked(client.fetch);

// Mock data helpers
const createMockPatternResult = (overrides?: any) => ({
	_id: "pattern1",
	title: "Climate Change Adaptation Strategies",
	description: [
		{
			_type: "block",
			_key: "block1",
			children: [
				{
					_type: "span",
					_key: "span1",
					text: "Comprehensive strategies for climate adaptation in urban environments",
					marks: [],
				},
			],
		},
	],
	solutions: [
		{
			_id: "solution1",
			_type: "solution",
			title: "Green Infrastructure Development",
			description: [
				{
					_type: "block",
					_key: "block2",
					children: [
						{
							_type: "span",
							_key: "span2",
							text: "Implementing green roofs and sustainable water management systems",
							marks: [],
						},
					],
				},
			],
		},
		{
			_id: "solution2",
			_type: "solution",
			title: "Community Resilience Programs",
			description: [
				{
					_type: "block",
					_key: "block3",
					children: [
						{
							_type: "span",
							_key: "span3",
							text: "Building local capacity for climate resilience",
							marks: [],
						},
					],
				},
			],
		},
	],
	resources: [
		{
			_id: "resource1",
			_type: "resource",
			title: "Climate Adaptation Toolkit",
			description: [
				{
					_type: "block",
					_key: "block4",
					children: [
						{
							_type: "span",
							_key: "span4",
							text: "Comprehensive toolkit for climate adaptation planning",
							marks: [],
						},
					],
				},
			],
			nestedSolutions: [
				{
					_id: "nested-solution1",
					_type: "solution",
					title: "Risk Assessment Framework",
					description: [
						{
							_type: "block",
							_key: "block5",
							children: [
								{
									_type: "span",
									_key: "span5",
									text: "Framework for assessing climate risks and vulnerabilities",
									marks: [],
								},
							],
						},
					],
				},
			],
		},
	],
	tags: [
		{
			_id: "tag1",
			_type: "tag",
			title: "Climate Change",
		},
		{
			_id: "tag2",
			_type: "tag",
			title: "Urban Planning",
		},
	],
	audiences: [
		{
			_id: "audience1",
			_type: "audience",
			title: "Urban Planners",
		},
		{
			_id: "audience2",
			_type: "audience",
			title: "Policy Makers",
		},
	],
	...overrides,
});

describe("searchPatternContent", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should return empty results for empty search term", async () => {
		const result = await searchPatternContent("test-pattern", "");

		expect(result).toEqual({
			success: true,
			data: {
				patterns: [],
				solutions: [],
				resources: [],
				tags: [],
				audiences: [],
				nestedSolutions: [],
			},
		});

		expect(mockFetch).not.toHaveBeenCalled();
	});

	it("should return empty results for whitespace-only search term", async () => {
		const result = await searchPatternContent("test-pattern", "   ");

		expect(result).toEqual({
			success: true,
			data: {
				patterns: [],
				solutions: [],
				resources: [],
				tags: [],
				audiences: [],
				nestedSolutions: [],
			},
		});

		expect(mockFetch).not.toHaveBeenCalled();
	});

	it("should search pattern content and return matching results", async () => {
		const mockPattern = createMockPatternResult();
		mockFetch.mockResolvedValueOnce(mockPattern);

		const result = await searchPatternContent("test-pattern", "climate");

		expect(result.success).toBe(true);
		expect(result.data).toBeDefined();

		// Should match pattern title
		expect(result.data?.patterns).toHaveLength(1);
		expect(result.data?.patterns[0]?.title).toBe(
			"Climate Change Adaptation Strategies",
		);

		// Should match tags
		expect(result.data?.tags).toHaveLength(1);
		expect(result.data?.tags[0]?.title).toBe("Climate Change");

		// Should match solutions with "climate" in description
		expect(result.data?.solutions).toHaveLength(1);
		expect(result.data?.solutions[0]?.title).toBe(
			"Community Resilience Programs",
		);

		// Should match resources with "climate" in description
		expect(result.data?.resources).toHaveLength(1);
		expect(result.data?.resources[0]?.title).toBe("Climate Adaptation Toolkit");

		// Should match nested solutions
		expect(result.data?.nestedSolutions).toHaveLength(1);
		expect(result.data?.nestedSolutions[0]?.title).toBe(
			"Risk Assessment Framework",
		);
	});

	it("should handle case-insensitive searches", async () => {
		const mockPattern = createMockPatternResult();
		mockFetch.mockResolvedValueOnce(mockPattern);

		const result = await searchPatternContent("test-pattern", "CLIMATE");

		expect(result.success).toBe(true);
		expect(result.data?.patterns).toHaveLength(1);
		expect(result.data?.tags).toHaveLength(1);
	});

	it("should escape special characters in search terms", async () => {
		const mockPattern = createMockPatternResult();
		mockFetch.mockResolvedValueOnce(mockPattern);

		await searchPatternContent("test-pattern", 'climate "adaptation"');

		expect(mockFetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				patternSlug: "test-pattern",
				searchTerm: 'climate \\"adaptation\\"',
			}),
		);
	});

	it("should return error when pattern is not found", async () => {
		mockFetch.mockResolvedValueOnce(null as any);

		const result = await searchPatternContent("nonexistent-pattern", "test");

		expect(result).toEqual({
			success: false,
			error: "Pattern not found",
		});
	});

	it("should handle Sanity client errors", async () => {
		const error = new Error("Sanity fetch failed");
		mockFetch.mockRejectedValueOnce(error);

		const result = await searchPatternContent("test-pattern", "test");

		expect(result).toEqual({
			success: false,
			error: "Sanity fetch failed",
		});
	});

	it("should handle non-Error exceptions", async () => {
		mockFetch.mockRejectedValueOnce("String error");

		const result = await searchPatternContent("test-pattern", "test");

		expect(result).toEqual({
			success: false,
			error: "Pattern content search failed",
		});
	});

	it("should call the correct GROQ query with correct parameters", async () => {
		const mockPattern = createMockPatternResult();
		mockFetch.mockResolvedValueOnce(mockPattern);

		await searchPatternContent("test-pattern", "test search");

		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining(
				'*[_type == "pattern" && slug.current == $patternSlug]',
			),
			{
				patternSlug: "test-pattern",
				searchTerm: "test search",
			},
		);
	});
});
