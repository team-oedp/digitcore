import type { PortableTextBlock } from "@portabletext/types";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CarrierBagItem } from "~/components/global/carrier-bag/carrier-bag-item";
import {
	type PatternContentData,
	type PopulatedPattern,
	getRomanNumeral,
	portableTextToString,
	useCarrierBagDocument,
	usePatternConnections,
	usePatternContent,
	usePatternHeader,
	usePatternResources,
	usePatternSolutions,
} from "./use-pattern-content";

// Mock data helpers
const createMockPortableText = (text: string): any[] => [
	{
		_type: "block",
		_key: "block1",
		children: [
			{
				_type: "span",
				_key: "span1",
				text,
				marks: [],
			},
		],
		markDefs: [],
		style: "normal",
	},
];

const createMockPattern = (overrides?: any): any => ({
	_id: "pattern1",
	_type: "pattern",
	_createdAt: "2023-01-01T00:00:00Z",
	_updatedAt: "2023-01-01T00:00:00Z",
	_rev: "rev1",
	title: "Test Pattern",
	slug: { current: "test-pattern", _type: "slug" },
	description: createMockPortableText("Test pattern description"),
	tags: [
		{
			_id: "tag1",
			_type: "tag",
			_createdAt: "2023-01-01T00:00:00Z",
			_updatedAt: "2023-01-01T00:00:00Z",
			_rev: "rev1",
			title: "Test Tag",
		},
	],
	audiences: [
		{
			_id: "audience1",
			_type: "audience",
			_createdAt: "2023-01-01T00:00:00Z",
			_updatedAt: "2023-01-01T00:00:00Z",
			_rev: "rev1",
			title: "Test Audience",
		},
	],
	themes: [
		{
			_id: "theme1",
			_type: "theme",
			_createdAt: "2023-01-01T00:00:00Z",
			_updatedAt: "2023-01-01T00:00:00Z",
			_rev: "rev1",
			title: "Test Theme",
		},
	],
	solutions: [
		{
			_id: "solution1",
			_type: "solution",
			_createdAt: "2023-01-01T00:00:00Z",
			_updatedAt: "2023-01-01T00:00:00Z",
			_rev: "rev1",
			title: "Test Solution",
			description: createMockPortableText("Test solution description"),
			audiences: [
				{
					_id: "audience2",
					_type: "audience",
					_createdAt: "2023-01-01T00:00:00Z",
					_updatedAt: "2023-01-01T00:00:00Z",
					_rev: "rev1",
					title: "Solution Audience",
				},
			],
		},
	],
	resources: [
		{
			_id: "resource1",
			_type: "resource",
			_createdAt: "2023-01-01T00:00:00Z",
			_updatedAt: "2023-01-01T00:00:00Z",
			_rev: "rev1",
			title: "Test Resource",
			description: createMockPortableText("Test resource description"),
			solutions: [
				{
					_id: "solution2",
					_type: "solution",
					_createdAt: "2023-01-01T00:00:00Z",
					_updatedAt: "2023-01-01T00:00:00Z",
					_rev: "rev1",
					title: "Related Solution",
				},
			],
		},
	],
	...overrides,
});

const createMockCarrierBagItem = (
	pattern?: PopulatedPattern,
): CarrierBagItem => ({
	pattern: pattern || createMockPattern(),
	dateAdded: "2023-01-15T10:30:00Z",
	notes: "Test notes for this pattern",
});

describe("usePatternContent hook utilities", () => {
	describe("portableTextToString", () => {
		it("should convert portable text blocks to plain text", () => {
			const blocks: PortableTextBlock[] = [
				{
					_type: "block",
					_key: "block1",
					children: [
						{
							_type: "span",
							_key: "span1",
							text: "First paragraph",
							marks: [],
						},
					],
					markDefs: [],
					style: "normal",
				},
				{
					_type: "block",
					_key: "block2",
					children: [
						{
							_type: "span",
							_key: "span2",
							text: "Second paragraph",
							marks: [],
						},
					],
					markDefs: [],
					style: "normal",
				},
			];

			const result = portableTextToString(blocks);
			expect(result).toBe("First paragraph\n\nSecond paragraph");
		});

		it("should handle empty blocks", () => {
			const result = portableTextToString([]);
			expect(result).toBe("");
		});

		it("should handle undefined input", () => {
			const result = portableTextToString(undefined);
			expect(result).toBe("");
		});

		it("should handle blocks with no children", () => {
			const blocks: PortableTextBlock[] = [
				{
					_type: "block",
					_key: "block1",
					children: [],
					markDefs: [],
					style: "normal",
				},
			];

			const result = portableTextToString(blocks);
			expect(result).toBe("");
		});

		it("should handle non-span children", () => {
			const blocks: PortableTextBlock[] = [
				{
					_type: "block",
					_key: "block1",
					children: [
						{
							_type: "break",
							_key: "break1",
						} as any,
					],
					markDefs: [],
					style: "normal",
				},
			];

			const result = portableTextToString(blocks);
			expect(result).toBe("");
		});

		it("should handle non-block types", () => {
			const blocks: PortableTextBlock[] = [
				{
					_type: "image",
					_key: "image1",
				} as any,
			];

			const result = portableTextToString(blocks);
			expect(result).toBe("");
		});
	});

	describe("getRomanNumeral", () => {
		it("should return correct roman numerals for indices 0-9", () => {
			expect(getRomanNumeral(0)).toBe("i.");
			expect(getRomanNumeral(1)).toBe("ii.");
			expect(getRomanNumeral(2)).toBe("iii.");
			expect(getRomanNumeral(3)).toBe("iv.");
			expect(getRomanNumeral(4)).toBe("v.");
			expect(getRomanNumeral(5)).toBe("vi.");
			expect(getRomanNumeral(6)).toBe("vii.");
			expect(getRomanNumeral(7)).toBe("viii.");
			expect(getRomanNumeral(8)).toBe("ix.");
			expect(getRomanNumeral(9)).toBe("x.");
		});

		it("should return numeric fallback for indices beyond 9", () => {
			expect(getRomanNumeral(10)).toBe("11.");
			expect(getRomanNumeral(15)).toBe("16.");
		});
	});
});

describe("usePatternContent", () => {
	it("should process pattern data correctly", () => {
		const pattern = createMockPattern();
		const { result } = renderHook(() => usePatternContent(pattern));

		const content: PatternContentData = result.current;

		// Check header
		expect(content.header.title).toBe("Test Pattern");
		expect(content.header.description).toBe("Test pattern description");
		expect(content.header.slug).toBe("test-pattern");

		// Check connections
		expect(content.connections).toHaveLength(3);

		const tagsConnection = content.connections.find((c) => c.type === "tags");
		expect(tagsConnection?.title).toBe("Tags");
		expect(tagsConnection?.items).toHaveLength(1);
		expect(tagsConnection?.items[0]?.title).toBe("Test Tag");

		const audiencesConnection = content.connections.find(
			(c) => c.type === "audiences",
		);
		expect(audiencesConnection?.title).toBe("Audiences");
		expect(audiencesConnection?.items).toHaveLength(1);
		expect(audiencesConnection?.items[0]?.title).toBe("Test Audience");

		const themesConnection = content.connections.find(
			(c) => c.type === "themes",
		);
		expect(themesConnection?.title).toBe("Themes");
		expect(themesConnection?.items).toHaveLength(1);
		expect(themesConnection?.items[0]?.title).toBe("Test Theme");

		// Check solutions
		expect(content.solutions).toHaveLength(1);
		expect(content.solutions[0]?.title).toBe("Test Solution");
		expect(content.solutions[0]?.number).toBe("i.");
		expect(content.solutions[0]?.description).toBe("Test solution description");
		expect(content.solutions[0]?.audiences).toHaveLength(1);
		expect(content.solutions[0]?.audiences[0]?.title).toBe("Solution Audience");

		// Check resources
		expect(content.resources).toHaveLength(1);
		expect(content.resources[0]?.title).toBe("Test Resource");
		expect(content.resources[0]?.description).toBe("Test resource description");
		expect(content.resources[0]?.relatedSolutions).toHaveLength(1);
		expect(content.resources[0]?.relatedSolutions[0]).toBe("Related Solution");
	});

	it("should handle pattern with carrier bag item", () => {
		const pattern = createMockPattern();
		const carrierBagItem = createMockCarrierBagItem(pattern);

		const { result } = renderHook(() =>
			usePatternContent(pattern, carrierBagItem),
		);

		const content: PatternContentData = result.current;
		expect(content.notes).toBe("Test notes for this pattern");
		expect(content.dateAdded).toBe("2023-01-15T10:30:00Z");
	});

	it("should handle pattern with missing title", () => {
		const pattern = createMockPattern({ title: undefined });
		const { result } = renderHook(() => usePatternContent(pattern));

		expect(result.current.header.title).toBe("Untitled Pattern");
	});

	it("should handle pattern with string slug", () => {
		const pattern = createMockPattern({ slug: "string-slug" as any });
		const { result } = renderHook(() => usePatternContent(pattern));

		expect(result.current.header.slug).toBe("string-slug");
	});

	it("should handle pattern with no connections", () => {
		const pattern = createMockPattern({
			tags: undefined,
			audiences: undefined,
			themes: undefined,
		});
		const { result } = renderHook(() => usePatternContent(pattern));

		expect(result.current.connections).toHaveLength(0);
	});

	it("should handle pattern with empty connections", () => {
		const pattern = createMockPattern({
			tags: [],
			audiences: [],
			themes: [],
		});
		const { result } = renderHook(() => usePatternContent(pattern));

		expect(result.current.connections).toHaveLength(0);
	});

	it("should handle pattern with no solutions", () => {
		const pattern = createMockPattern({ solutions: undefined });
		const { result } = renderHook(() => usePatternContent(pattern));

		expect(result.current.solutions).toHaveLength(0);
	});

	it("should handle pattern with no resources", () => {
		const pattern = createMockPattern({ resources: undefined });
		const { result } = renderHook(() => usePatternContent(pattern));

		expect(result.current.resources).toHaveLength(0);
	});

	it("should handle solutions with missing titles", () => {
		const pattern = createMockPattern({
			solutions: [
				{
					_id: "solution1",
					_type: "solution",
					_createdAt: "2023-01-01T00:00:00Z",
					_updatedAt: "2023-01-01T00:00:00Z",
					_rev: "rev1",
					title: undefined,
					description: createMockPortableText("Test description"),
				} as any,
			],
		});

		const { result } = renderHook(() => usePatternContent(pattern));

		expect(result.current.solutions[0]?.title).toBe("Untitled Solution");
	});

	it("should handle resources with missing titles", () => {
		const pattern = createMockPattern({
			resources: [
				{
					_id: "resource1",
					_type: "resource",
					_createdAt: "2023-01-01T00:00:00Z",
					_updatedAt: "2023-01-01T00:00:00Z",
					_rev: "rev1",
					title: undefined,
					description: createMockPortableText("Test description"),
				} as any,
			],
		});

		const { result } = renderHook(() => usePatternContent(pattern));

		expect(result.current.resources[0]?.title).toBe("Untitled Resource");
	});

	it("should handle entities with reference fallbacks", () => {
		const pattern = createMockPattern({
			tags: [
				{
					_id: undefined,
					_key: "key1",
					_ref: "tag-ref-1",
					title: undefined,
				} as any,
			],
		});

		const { result } = renderHook(() => usePatternContent(pattern));

		const tagsConnection = result.current.connections.find(
			(c) => c.type === "tags",
		);
		expect(tagsConnection?.items[0]?.id).toBe("key1");
		expect(tagsConnection?.items[0]?.title).toBe("tag-ref-1");
	});

	it("should handle entities with no identifiers", () => {
		const pattern = createMockPattern({
			audiences: [
				{
					_id: undefined,
					_key: undefined,
					_ref: undefined,
					title: undefined,
				} as any,
			],
		});

		const { result } = renderHook(() => usePatternContent(pattern));

		const audiencesConnection = result.current.connections.find(
			(c) => c.type === "audiences",
		);
		expect(audiencesConnection?.items[0]?.id).toBe("");
		expect(audiencesConnection?.items[0]?.title).toBe("Unknown Audience");
	});
});

describe("useCarrierBagDocument", () => {
	it("should process carrier bag items correctly", () => {
		const items = [
			createMockCarrierBagItem(),
			createMockCarrierBagItem(
				createMockPattern({
					_id: "pattern2",
					title: "Second Pattern",
				}),
			),
		];

		const { result } = renderHook(() => useCarrierBagDocument(items));

		const document = result.current;
		expect(document.title).toBe("Your Carrier Bag");
		expect(document.subtitle).toBe(
			"A collection of patterns from the DIGITCORE Toolkit",
		);
		expect(document.patternCount).toBe(2);
		expect(document.patterns).toHaveLength(2);
		expect(document.hasTableOfContents).toBe(true);

		// Check date format
		expect(document.date).toMatch(/\w+ \d{1,2}, \d{4}/);
	});

	it("should handle single item (no table of contents)", () => {
		const items = [createMockCarrierBagItem()];

		const { result } = renderHook(() => useCarrierBagDocument(items));

		const document = result.current;
		expect(document.patternCount).toBe(1);
		expect(document.hasTableOfContents).toBe(false);
	});

	it("should handle empty items", () => {
		const { result } = renderHook(() => useCarrierBagDocument([]));

		const document = result.current;
		expect(document.patternCount).toBe(0);
		expect(document.patterns).toHaveLength(0);
		expect(document.hasTableOfContents).toBe(false);
	});
});

describe("utility hooks", () => {
	const pattern = createMockPattern();

	describe("usePatternHeader", () => {
		it("should return pattern header data", () => {
			const { result } = renderHook(() => usePatternHeader(pattern));

			expect(result.current.title).toBe("Test Pattern");
			expect(result.current.description).toBe("Test pattern description");
			expect(result.current.slug).toBe("test-pattern");
		});
	});

	describe("usePatternConnections", () => {
		it("should return pattern connections data", () => {
			const { result } = renderHook(() => usePatternConnections(pattern));

			expect(result.current).toHaveLength(3);
			expect(result.current.find((c) => c.type === "tags")?.title).toBe("Tags");
			expect(result.current.find((c) => c.type === "audiences")?.title).toBe(
				"Audiences",
			);
			expect(result.current.find((c) => c.type === "themes")?.title).toBe(
				"Themes",
			);
		});
	});

	describe("usePatternSolutions", () => {
		it("should return pattern solutions data", () => {
			const { result } = renderHook(() => usePatternSolutions(pattern));

			expect(result.current).toHaveLength(1);
			expect(result.current[0]?.title).toBe("Test Solution");
			expect(result.current[0]?.number).toBe("i.");
		});
	});

	describe("usePatternResources", () => {
		it("should return pattern resources data", () => {
			const { result } = renderHook(() => usePatternResources(pattern));

			expect(result.current).toHaveLength(1);
			expect(result.current[0]?.title).toBe("Test Resource");
			expect(result.current[0]?.description).toBe("Test resource description");
		});
	});
});

describe("edge cases and error handling", () => {
	it("should handle multiple solutions with correct roman numerals", () => {
		const pattern = createMockPattern({
			solutions: Array.from({ length: 12 }, (_, i) => ({
				_id: `solution${i + 1}`,
				_type: "solution",
				_createdAt: "2023-01-01T00:00:00Z",
				_updatedAt: "2023-01-01T00:00:00Z",
				_rev: "rev1",
				title: `Solution ${i + 1}`,
				description: createMockPortableText(`Description ${i + 1}`),
			})) as any,
		});

		const { result } = renderHook(() => usePatternContent(pattern));

		expect(result.current.solutions[0]?.number).toBe("i.");
		expect(result.current.solutions[9]?.number).toBe("x.");
		expect(result.current.solutions[10]?.number).toBe("11.");
		expect(result.current.solutions[11]?.number).toBe("12.");
	});

	it("should handle resources with no related solutions", () => {
		const pattern = createMockPattern({
			resources: [
				{
					_id: "resource1",
					_type: "resource",
					_createdAt: "2023-01-01T00:00:00Z",
					_updatedAt: "2023-01-01T00:00:00Z",
					_rev: "rev1",
					title: "Test Resource",
					description: createMockPortableText("Test description"),
					solutions: undefined,
				} as any,
			],
		});

		const { result } = renderHook(() => usePatternContent(pattern));

		expect(result.current.resources[0]?.relatedSolutions).toHaveLength(0);
	});

	it("should handle solutions with no audiences", () => {
		const pattern = createMockPattern({
			solutions: [
				{
					_id: "solution1",
					_type: "solution",
					_createdAt: "2023-01-01T00:00:00Z",
					_updatedAt: "2023-01-01T00:00:00Z",
					_rev: "rev1",
					title: "Test Solution",
					description: createMockPortableText("Test description"),
					audiences: undefined,
				} as any,
			],
		});

		const { result } = renderHook(() => usePatternContent(pattern));

		expect(result.current.solutions[0]?.audiences).toHaveLength(0);
	});

	it("should handle complex portable text structures", () => {
		const complexBlocks: PortableTextBlock[] = [
			{
				_type: "block",
				_key: "block1",
				children: [
					{
						_type: "span",
						_key: "span1",
						text: "Bold text",
						marks: ["strong"],
					},
					{
						_type: "span",
						_key: "span2",
						text: " and regular text",
						marks: [],
					},
				],
				markDefs: [],
				style: "normal",
			},
		];

		const result = portableTextToString(complexBlocks);
		expect(result).toBe("Bold text and regular text");
	});
});
