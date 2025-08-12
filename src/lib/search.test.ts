import { describe, expect, it } from "vitest";
import {
	type ParsedSearchParams,
	type SearchParams,
	defaultSearchParams,
	parseSearchParams,
	searchParamsSchema,
	serializeSearchParams,
} from "./search";

describe("search functionality", () => {
	describe("searchParamsSchema", () => {
		it("should validate valid search parameters", () => {
			const validParams: SearchParams = {
				q: "test query",
				audiences: "students,researchers",
				themes: "sustainability,innovation",
				tags: "tag1,tag2",
				page: 2,
				limit: 50,
			};

			const result = searchParamsSchema.parse(validParams);
			expect(result).toEqual(validParams);
		});

		it("should handle missing optional parameters", () => {
			const minimalParams = {};
			const result = searchParamsSchema.parse(minimalParams);

			expect(result.page).toBe(1);
			expect(result.limit).toBe(20);
			expect(result.q).toBeUndefined();
			expect(result.audiences).toBeUndefined();
		});

		it("should coerce string numbers to numbers", () => {
			const stringParams = {
				page: "3",
				limit: "15",
			};

			const result = searchParamsSchema.parse(stringParams);
			expect(result.page).toBe(3);
			expect(result.limit).toBe(15);
		});

		it("should reject invalid page numbers", () => {
			expect(() => searchParamsSchema.parse({ page: 0 })).toThrow();

			expect(() => searchParamsSchema.parse({ page: -1 })).toThrow();
		});

		it("should reject invalid limit numbers", () => {
			expect(() => searchParamsSchema.parse({ limit: 0 })).toThrow();

			expect(() => searchParamsSchema.parse({ limit: 101 })).toThrow();
		});
	});

	describe("parseSearchParams", () => {
		it("should parse basic search parameters correctly", () => {
			const searchParams: SearchParams = {
				q: "test query",
				audiences: "students,researchers",
				themes: "sustainability",
				tags: "tag1,tag2,tag3",
				page: 2,
				limit: 30,
			};

			const result = parseSearchParams(searchParams);

			expect(result).toEqual({
				searchTerm: "test query",
				audiences: ["students", "researchers"],
				themes: ["sustainability"],
				tags: ["tag1", "tag2", "tag3"],
				page: 2,
				limit: 30,
			});
		});

		it("should handle empty and undefined values", () => {
			const emptyParams: SearchParams = {};
			const result = parseSearchParams(emptyParams);

			expect(result).toEqual({
				searchTerm: "",
				audiences: [],
				themes: [],
				tags: [],
				page: 1,
				limit: 20,
			});
		});

		it("should trim whitespace from search term", () => {
			const searchParams: SearchParams = {
				q: "  test query  ",
			};

			const result = parseSearchParams(searchParams);
			expect(result.searchTerm).toBe("test query");
		});

		it("should filter out empty string values from comma-separated lists", () => {
			const searchParams: SearchParams = {
				audiences: "students,,researchers,",
				themes: ",sustainability,",
				tags: "tag1,,,tag2",
			};

			const result = parseSearchParams(searchParams);

			expect(result.audiences).toEqual(["students", "researchers"]);
			expect(result.themes).toEqual(["sustainability"]);
			expect(result.tags).toEqual(["tag1", "tag2"]);
		});

		it("should handle single values without commas", () => {
			const searchParams: SearchParams = {
				audiences: "students",
				themes: "sustainability",
				tags: "single-tag",
			};

			const result = parseSearchParams(searchParams);

			expect(result.audiences).toEqual(["students"]);
			expect(result.themes).toEqual(["sustainability"]);
			expect(result.tags).toEqual(["single-tag"]);
		});

		it("should use default values when not provided", () => {
			const searchParams: SearchParams = {
				q: "test",
			};

			const result = parseSearchParams(searchParams);

			expect(result.page).toBe(1);
			expect(result.limit).toBe(20);
		});
	});

	describe("serializeSearchParams", () => {
		it("should serialize complete search parameters", () => {
			const params: ParsedSearchParams = {
				searchTerm: "test query",
				audiences: ["students", "researchers"],
				themes: ["sustainability", "innovation"],
				tags: ["tag1", "tag2"],
				page: 2,
				limit: 50,
			};

			const result = serializeSearchParams(params);

			expect(result.get("q")).toBe("test query");
			expect(result.get("audiences")).toBe("students,researchers");
			expect(result.get("themes")).toBe("sustainability,innovation");
			expect(result.get("tags")).toBe("tag1,tag2");
			expect(result.get("page")).toBe("2");
			expect(result.get("limit")).toBe("50");
		});

		it("should omit empty search term", () => {
			const params: Partial<ParsedSearchParams> = {
				searchTerm: "",
				audiences: ["students"],
			};

			const result = serializeSearchParams(params);

			expect(result.has("q")).toBe(false);
			expect(result.get("audiences")).toBe("students");
		});

		it("should omit empty arrays", () => {
			const params: Partial<ParsedSearchParams> = {
				searchTerm: "test",
				audiences: [],
				themes: [],
				tags: [],
			};

			const result = serializeSearchParams(params);

			expect(result.get("q")).toBe("test");
			expect(result.has("audiences")).toBe(false);
			expect(result.has("themes")).toBe(false);
			expect(result.has("tags")).toBe(false);
		});

		it("should omit default page value (1)", () => {
			const params: Partial<ParsedSearchParams> = {
				searchTerm: "test",
				page: 1,
			};

			const result = serializeSearchParams(params);

			expect(result.get("q")).toBe("test");
			expect(result.has("page")).toBe(false);
		});

		it("should omit default limit value (20)", () => {
			const params: Partial<ParsedSearchParams> = {
				searchTerm: "test",
				limit: 20,
			};

			const result = serializeSearchParams(params);

			expect(result.get("q")).toBe("test");
			expect(result.has("limit")).toBe(false);
		});

		it("should include non-default page and limit values", () => {
			const params: Partial<ParsedSearchParams> = {
				page: 3,
				limit: 10,
			};

			const result = serializeSearchParams(params);

			expect(result.get("page")).toBe("3");
			expect(result.get("limit")).toBe("10");
		});

		it("should handle partial parameters", () => {
			const params: Partial<ParsedSearchParams> = {
				searchTerm: "partial search",
				tags: ["important-tag"],
			};

			const result = serializeSearchParams(params);

			expect(result.get("q")).toBe("partial search");
			expect(result.get("tags")).toBe("important-tag");
			expect(result.has("audiences")).toBe(false);
			expect(result.has("themes")).toBe(false);
		});
	});

	describe("round-trip conversion", () => {
		it("should maintain data integrity through parse -> serialize -> parse cycle", () => {
			const originalParams: SearchParams = {
				q: "complex search query",
				audiences: "students,researchers,practitioners",
				themes: "sustainability,innovation,collaboration",
				tags: "important,urgent,research",
				page: 3,
				limit: 15,
			};

			// Parse to internal format
			const parsed = parseSearchParams(originalParams);

			// Serialize back to URL params
			const serialized = serializeSearchParams(parsed);

			// Convert URLSearchParams back to SearchParams object
			const reconstructed: SearchParams = {};
			const q = serialized.get("q");
			if (q !== null) reconstructed.q = q;

			const audiences = serialized.get("audiences");
			if (audiences !== null) reconstructed.audiences = audiences;

			const themes = serialized.get("themes");
			if (themes !== null) reconstructed.themes = themes;

			const tags = serialized.get("tags");
			if (tags !== null) reconstructed.tags = tags;

			const page = serialized.get("page");
			if (page !== null) reconstructed.page = Number.parseInt(page, 10);

			const limit = serialized.get("limit");
			if (limit !== null) reconstructed.limit = Number.parseInt(limit, 10);

			// Parse the reconstructed params
			const finalParsed = parseSearchParams(reconstructed);

			expect(finalParsed).toEqual(parsed);
		});
	});

	describe("defaultSearchParams", () => {
		it("should have expected default values", () => {
			expect(defaultSearchParams).toEqual({
				searchTerm: "",
				audiences: [],
				themes: [],
				tags: [],
				page: 1,
				limit: 20,
			});
		});

		it("should be immutable", () => {
			const original = { ...defaultSearchParams };

			// Attempt to modify (this should not affect the original)
			defaultSearchParams.searchTerm = "modified";
			defaultSearchParams.audiences.push("test");

			// Reset for test consistency
			defaultSearchParams.searchTerm = "";
			defaultSearchParams.audiences.length = 0;

			expect(defaultSearchParams).toEqual(original);
		});
	});

	describe("edge cases and error handling", () => {
		it("should handle special characters in search terms", () => {
			const searchParams: SearchParams = {
				q: "special chars: @#$%^&*()[]{}|\\;':\",./<>?",
			};

			const result = parseSearchParams(searchParams);
			expect(result.searchTerm).toBe(
				"special chars: @#$%^&*()[]{}|\\;':\",./<>?",
			);
		});

		it("should handle unicode characters", () => {
			const searchParams: SearchParams = {
				q: "üñíçødé tëxt 🚀 中文",
				audiences: "académicos,investigadores",
			};

			const result = parseSearchParams(searchParams);
			expect(result.searchTerm).toBe("üñíçødé tëxt 🚀 中文");
			expect(result.audiences).toEqual(["académicos", "investigadores"]);
		});

		it("should handle very long search terms", () => {
			const longTerm = "a".repeat(1000);
			const searchParams: SearchParams = {
				q: longTerm,
			};

			const result = parseSearchParams(searchParams);
			expect(result.searchTerm).toBe(longTerm);
		});

		it("should handle many filter values", () => {
			const manyTags = Array.from({ length: 50 }, (_, i) => `tag${i}`);
			const searchParams: SearchParams = {
				tags: manyTags.join(","),
			};

			const result = parseSearchParams(searchParams);
			expect(result.tags).toEqual(manyTags);
		});
	});
});
