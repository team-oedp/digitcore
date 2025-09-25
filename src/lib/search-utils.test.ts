import type { PortableTextBlock } from "next-sanity";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from "vitest";
import {
	extractTextFromPortableText,
	getMatchExplanation,
	hasMatchInTitle,
	highlightMatches,
	truncateWithContext,
} from "./search-utils";

describe("search-utils", () => {
	describe("truncateWithContext", () => {
		it("should return original text if shorter than max length", () => {
			const text = "Short text";
			const result = truncateWithContext(text, "text", 50);

			expect(result.text).toBe("Short text");
			expect(result.isTruncated).toBe(false);
			expect(result.hasMatch).toBe(true);
			expect(result.matchCount).toBe(1);
		});

		it("should handle empty text", () => {
			const result = truncateWithContext("", "search", 50);

			expect(result.text).toBe("");
			expect(result.isTruncated).toBe(false);
			expect(result.hasMatch).toBe(false);
			expect(result.matchCount).toBe(0);
		});

		it("should truncate from beginning when no search term provided", () => {
			const longText = "a".repeat(300);
			const result = truncateWithContext(longText, "", 100);

			expect(result.text).toBe(`${"a".repeat(100)}...`);
			expect(result.isTruncated).toBe(true);
			expect(result.hasMatch).toBe(false);
			expect(result.matchCount).toBe(0);
		});

		it("should truncate from beginning when no match found", () => {
			const longText =
				"This is a very long text that does not contain the search term we are looking for and needs to be truncated";
			const result = truncateWithContext(longText, "nonexistent", 50);

			expect(result.text).toBe(
				"This is a very long text that does not contain the...",
			);
			expect(result.isTruncated).toBe(true);
			expect(result.hasMatch).toBe(false);
			expect(result.matchCount).toBe(0);
		});

		it("should center text around match when found", () => {
			const longText =
				"This is a very long text that contains the important keyword that we want to highlight and show in context";
			const result = truncateWithContext(longText, "important keyword", 60);

			expect(result.text).toContain("important keyword");
			expect(result.text.length).toBeLessThanOrEqual(70); // Allow for longer text with ellipsis
			expect(result.isTruncated).toBe(true);
			expect(result.hasMatch).toBe(true);
			expect(result.matchCount).toBe(1);
		});

		it("should handle match at the beginning of text", () => {
			const longText =
				"important keyword is at the beginning of this very long text that needs to be truncated properly";
			const result = truncateWithContext(longText, "important keyword", 50);

			expect(result.text).toContain("important keyword");
			expect(result.text.startsWith("important")).toBe(true);
			expect(result.isTruncated).toBe(true);
			expect(result.hasMatch).toBe(true);
		});

		it("should handle match at the end of text", () => {
			const longText =
				"This is a very long text that needs to be truncated properly and ends with important keyword";
			const result = truncateWithContext(longText, "important keyword", 50);

			expect(result.text).toContain("important keyword");
			expect(result.text.endsWith("important keyword")).toBe(true);
			expect(result.isTruncated).toBe(true);
			expect(result.hasMatch).toBe(true);
		});

		it("should be case insensitive", () => {
			const text = "This text contains UPPERCASE matches";
			const result = truncateWithContext(text, "uppercase", 100);

			expect(result.hasMatch).toBe(true);
			expect(result.matchCount).toBe(1);
		});

		it("should count multiple matches correctly", () => {
			const text =
				"The word test appears in this test text multiple times and test should be counted";
			const result = truncateWithContext(text, "test", 100);

			expect(result.matchCount).toBe(3);
			expect(result.hasMatch).toBe(true);
		});

		it("should handle whitespace in search terms", () => {
			const text = "This text has multiple words that match";
			const result = truncateWithContext(text, "  multiple words  ", 100);

			expect(result.hasMatch).toBe(true);
			expect(result.matchCount).toBe(1);
		});
	});

	describe("highlightMatches", () => {
		it("should highlight single match", () => {
			const text = "This text contains a match";
			const result = highlightMatches(text, "match");

			expect(result).toBe(
				'This text contains a <mark class="bg-yellow-200 rounded-sm">match</mark>',
			);
		});

		it("should highlight multiple matches", () => {
			const text = "This match has another match";
			const result = highlightMatches(text, "match");

			expect(result).toBe(
				'This <mark class="bg-yellow-200 rounded-sm">match</mark> has another <mark class="bg-yellow-200 rounded-sm">match</mark>',
			);
		});

		it("should be case insensitive", () => {
			const text = "This text has UPPERCASE and lowercase";
			const result = highlightMatches(text, "uppercase");

			expect(result).toBe(
				'This text has <mark class="bg-yellow-200 rounded-sm">UPPERCASE</mark> and lowercase',
			);
		});

		it("should handle empty text", () => {
			const result = highlightMatches("", "search");
			expect(result).toBe("");
		});

		it("should handle empty search term", () => {
			const text = "This text should remain unchanged";
			const result = highlightMatches(text, "");
			expect(result).toBe(text);
		});

		it("should handle whitespace in search term", () => {
			const text = "This text should remain unchanged";
			const result = highlightMatches(text, "   ");
			expect(result).toBe(text);
		});

		it("should escape regex special characters", () => {
			const text = "Price: $10.99 (on sale)";
			const result = highlightMatches(text, "$10.99");

			expect(result).toBe(
				'Price: <mark class="bg-yellow-200 rounded-sm">$10.99</mark> (on sale)',
			);
		});

		it("should handle special regex characters in text", () => {
			const text = "Regular expression [.*+?^${}()|[\\]\\] characters";
			const result = highlightMatches(text, "expression");

			expect(result).toBe(
				'Regular <mark class="bg-yellow-200 rounded-sm">expression</mark> [.*+?^${}()|[\\]\\] characters',
			);
		});

		it("should preserve original case in highlights", () => {
			const text = "JavaScript and JAVASCRIPT and Javascript";
			const result = highlightMatches(text, "javascript");

			expect(result).toBe(
				'<mark class="bg-yellow-200 rounded-sm">JavaScript</mark> and <mark class="bg-yellow-200 rounded-sm">JAVASCRIPT</mark> and <mark class="bg-yellow-200 rounded-sm">Javascript</mark>',
			);
		});
	});

	describe("extractTextFromPortableText", () => {
		it("should return string as-is", () => {
			const text = "Plain string text";
			const result = extractTextFromPortableText(text);
			expect(result).toBe(text);
		});

		it("should extract text from portable text blocks", () => {
			const portableText: PortableTextBlock[] = [
				{
					_type: "block",
					_key: "1",
					children: [
						{ _type: "span", _key: "1a", text: "First paragraph " },
						{ _type: "span", _key: "1b", text: "continues here." },
					],
				},
				{
					_type: "block",
					_key: "2",
					children: [{ _type: "span", _key: "2a", text: "Second paragraph." }],
				},
			];

			const result = extractTextFromPortableText(portableText);
			expect(result).toBe("First paragraph continues here. Second paragraph.");
		});

		it("should handle empty portable text", () => {
			const result = extractTextFromPortableText([]);
			expect(result).toBe("");
		});

		it("should handle null/undefined portable text", () => {
			expect(extractTextFromPortableText(null as unknown as string)).toBe("");
			expect(extractTextFromPortableText(undefined as unknown as string)).toBe(
				"",
			);
		});

		it("should filter out non-block types", () => {
			const portableText: PortableTextBlock[] = [
				{
					_type: "block",
					_key: "1",
					children: [{ _type: "span", _key: "1a", text: "Block text" }],
				},
				{
					_type: "image",
					_key: "2",
					alt: "Should be ignored",
				} as unknown as PortableTextBlock,
			];

			const result = extractTextFromPortableText(portableText);
			expect(result).toBe("Block text");
		});

		it("should filter out non-span children", () => {
			const portableText: PortableTextBlock[] = [
				{
					_type: "block",
					_key: "1",
					children: [
						{ _type: "span", _key: "1a", text: "Span text" },
						{
							_type: "link",
							_key: "1b",
							text: "Should be ignored",
						},
					],
				},
			];

			const result = extractTextFromPortableText(portableText);
			expect(result).toBe("Span text");
		});

		it("should handle blocks without children", () => {
			const portableText: PortableTextBlock[] = [
				{
					_type: "block",
					_key: "1",
					children: [],
				},
				{
					_type: "block",
					_key: "2",
					children: [{ _type: "span", _key: "2a", text: "Has text" }],
				},
			];

			const result = extractTextFromPortableText(portableText);
			expect(result).toBe("Has text");
		});
	});

	describe("hasMatchInTitle", () => {
		it("should find exact match", () => {
			const result = hasMatchInTitle("Pattern Title", "Pattern");
			expect(result).toBe(true);
		});

		it("should be case insensitive", () => {
			const result = hasMatchInTitle("Pattern Title", "pattern");
			expect(result).toBe(true);
		});

		it("should find partial match", () => {
			const result = hasMatchInTitle("Sustainability Pattern", "sustain");
			expect(result).toBe(true);
		});

		it("should return false for no match", () => {
			const result = hasMatchInTitle("Pattern Title", "nonexistent");
			expect(result).toBe(false);
		});

		it("should handle empty title", () => {
			const result = hasMatchInTitle("", "search");
			expect(result).toBe(false);
		});

		it("should handle empty search term", () => {
			const result = hasMatchInTitle("Pattern Title", "");
			expect(result).toBe(false);
		});

		it("should handle whitespace in search term", () => {
			const result = hasMatchInTitle("Pattern Title", "   ");
			expect(result).toBe(false);
		});

		it("should trim whitespace from search term", () => {
			const result = hasMatchInTitle("Pattern Title", "  Pattern  ");
			expect(result).toBe(true);
		});
	});

	describe("getMatchExplanation", () => {
		const samplePortableText: PortableTextBlock[] = [
			{
				_type: "block",
				_key: "1",
				children: [
					{
						_type: "span",
						_key: "1a",
						text: "This is a description with sustainability content.",
					},
				],
			},
		];

		it("should identify title match", () => {
			const result = getMatchExplanation(
				"Sustainability Pattern",
				samplePortableText,
				"sustainability",
			);

			expect(result.titleMatch).toBe(true);
			expect(result.descriptionMatch).toBe(true);
			expect(result.matchLocations).toEqual(["title", "description"]);
		});

		it("should identify description-only match", () => {
			const result = getMatchExplanation(
				"Pattern Title",
				samplePortableText,
				"description",
			);

			expect(result.titleMatch).toBe(false);
			expect(result.descriptionMatch).toBe(true);
			expect(result.matchLocations).toEqual(["description"]);
		});

		it("should identify title-only match", () => {
			const result = getMatchExplanation(
				"Unique Pattern",
				samplePortableText,
				"unique",
			);

			expect(result.titleMatch).toBe(true);
			expect(result.descriptionMatch).toBe(false);
			expect(result.matchLocations).toEqual(["title"]);
		});

		it("should identify no matches", () => {
			const result = getMatchExplanation(
				"Pattern Title",
				samplePortableText,
				"nonexistent",
			);

			expect(result.titleMatch).toBe(false);
			expect(result.descriptionMatch).toBe(false);
			expect(result.matchLocations).toEqual([]);
		});

		it("should handle string description", () => {
			const result = getMatchExplanation(
				"Pattern Title",
				"String description with keyword",
				"keyword",
			);

			expect(result.titleMatch).toBe(false);
			expect(result.descriptionMatch).toBe(true);
			expect(result.matchLocations).toEqual(["description"]);
		});

		it("should handle empty description", () => {
			const result = getMatchExplanation("Pattern Title", [], "search");

			expect(result.titleMatch).toBe(false);
			expect(result.descriptionMatch).toBe(false);
			expect(result.matchLocations).toEqual([]);
		});
	});

	describe("edge cases and performance", () => {
		it("should handle very long text efficiently", () => {
			const longText = `${"word ".repeat(10000)}target${" word".repeat(10000)}`;

			const startTime = Date.now();
			const result = truncateWithContext(longText, "target", 100);
			const endTime = Date.now();

			expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
			expect(result.hasMatch).toBe(true);
			expect(result.text).toContain("target");
		});

		it("should handle unicode characters correctly", () => {
			const text = "This text contains üñíçødé characters and emojis 🚀";
			const result1 = highlightMatches(text, "üñíçødé");
			const result2 = truncateWithContext(text, "🚀", 100);

			expect(result1).toContain(
				'<mark class="bg-yellow-200 rounded-sm">üñíçødé</mark>',
			);
			expect(result2.hasMatch).toBe(true);
		});

		it("should handle multiple consecutive matches", () => {
			const text = "test test test in a row";
			const result = highlightMatches(text, "test");

			expect(result).toBe(
				'<mark class="bg-yellow-200 rounded-sm">test</mark> <mark class="bg-yellow-200 rounded-sm">test</mark> <mark class="bg-yellow-200 rounded-sm">test</mark> in a row',
			);
		});

		it("should handle overlapping search scenarios", () => {
			const text = "JavaScript and Java programming";
			const result1 = highlightMatches(text, "Java");

			// Should match both "JavaScript" (partial) and "Java" (full)
			expect(result1).toBe(
				'<mark class="bg-yellow-200 rounded-sm">Java</mark>Script and <mark class="bg-yellow-200 rounded-sm">Java</mark> programming',
			);
		});
	});
});
