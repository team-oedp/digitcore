import { describe, expect, it } from "vitest";
import {
	type GlossaryTerm,
	createGlossaryLink,
	detectGlossaryTerms,
	processTextWithGlossaryTerms,
} from "./glossary-utils";

describe("glossary-utils", () => {
	const mockGlossaryTerms: GlossaryTerm[] = [
		{ _id: "term1", title: "API" },
		{ _id: "term2", title: "Open Source" },
		{ _id: "term3", title: "Infrastructure" },
		{ _id: "term4", title: "Digital Infrastructure" }, // Longer term that contains "Infrastructure"
	];

	describe("detectGlossaryTerms", () => {
		it("should detect glossary terms in text", () => {
			const text = "This is about API and Open Source development.";
			const matches = detectGlossaryTerms(text, mockGlossaryTerms);

			expect(matches).toHaveLength(2);
			expect(matches[0].term.title).toBe("API");
			expect(matches[0].startIndex).toBe(14);
			expect(matches[0].endIndex).toBe(17);
			expect(matches[1].term.title).toBe("Open Source");
			expect(matches[1].startIndex).toBe(22);
			expect(matches[1].endIndex).toBe(33);
		});

		it("should detect case-insensitive matches", () => {
			const text = "The api and open source are important.";
			const matches = detectGlossaryTerms(text, mockGlossaryTerms);

			expect(matches).toHaveLength(2);
			expect(matches[0].originalText).toBe("api");
			expect(matches[1].originalText).toBe("open source");
		});

		it("should prioritize longer terms over shorter ones", () => {
			const text = "We need better Digital Infrastructure for our community.";
			const matches = detectGlossaryTerms(text, mockGlossaryTerms);

			expect(matches).toHaveLength(1);
			expect(matches[0].term.title).toBe("Digital Infrastructure");
			expect(matches[0].startIndex).toBe(15);
			expect(matches[0].endIndex).toBe(37);
		});

		it("should match whole words only", () => {
			const text = "APIS and APIs are different from API.";
			const matches = detectGlossaryTerms(text, mockGlossaryTerms);

			expect(matches).toHaveLength(1);
			expect(matches[0].term.title).toBe("API");
			expect(matches[0].startIndex).toBe(33); // "APIS and APIs are different from " is 33 characters
		});

		it("should return empty array for empty text", () => {
			const matches = detectGlossaryTerms("", mockGlossaryTerms);
			expect(matches).toHaveLength(0);
		});

		it("should return empty array for no glossary terms", () => {
			const matches = detectGlossaryTerms("Some text", []);
			expect(matches).toHaveLength(0);
		});
	});

	describe("processTextWithGlossaryTerms", () => {
		it("should wrap glossary terms with custom renderer", () => {
			const text = "Learn about API and Infrastructure.";
			const renderTerm = (term: GlossaryTerm, text: string, key: string) =>
				`<span key="${key}" data-term="${term._id}">${text}</span>`;

			const result = processTextWithGlossaryTerms(
				text,
				mockGlossaryTerms,
				renderTerm,
			);

			// The result should have 5 elements: "Learn about ", API wrapped, " and ", Infrastructure wrapped, "."
			expect(result).toHaveLength(5);
			expect(result[0]).toBe("Learn about ");
			expect(result[1]).toBe(
				'<span key="glossary-0" data-term="term1">API</span>',
			);
			expect(result[2]).toBe(" and ");
			expect(result[3]).toBe(
				'<span key="glossary-1" data-term="term3">Infrastructure</span>',
			);
			expect(result[4]).toBe(".");
		});

		it("should return original text when no matches found", () => {
			const text = "No matching terms here.";
			const renderTerm = (term: GlossaryTerm, text: string, key: string) =>
				`<span key="${key}">${text}</span>`;

			const result = processTextWithGlossaryTerms(
				text,
				mockGlossaryTerms,
				renderTerm,
			);

			expect(result).toHaveLength(1);
			expect(result[0]).toBe(text);
		});

		it("should preserve original case in rendered terms", () => {
			const text = "The API and api are the same.";
			const renderTerm = (term: GlossaryTerm, text: string, key: string) =>
				`[${text}]`;

			const result = processTextWithGlossaryTerms(
				text,
				mockGlossaryTerms,
				renderTerm,
			);

			expect(result).toContain("[API]");
			expect(result).toContain("[api]");
		});
	});

	describe("createGlossaryLink", () => {
		it("should create proper glossary link", () => {
			const link = createGlossaryLink("test-term-id");
			expect(link).toBe("/glossary?word=test-term-id");
		});

		it("should encode special characters", () => {
			const link = createGlossaryLink("term with spaces");
			expect(link).toBe("/glossary?word=term%20with%20spaces");
		});
	});
});
