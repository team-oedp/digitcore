/**
 * Search utilities for text processing, highlighting, and truncation
 */

import type { PortableTextBlock } from "next-sanity";
export type { PortableTextBlock };

export type TruncationResult = {
	text: string;
	isTruncated: boolean;
	hasMatch: boolean;
	matchCount: number;
};

export type DescriptionDisplayResult = {
	text: string;
	hasSearchMatch: boolean;
	matchCount: number;
	displayType: "first-sentence" | "search-context";
};

/**
 * Truncates text while preserving context around search term matches.
 *
 * When the text exceeds maxLength, this function intelligently creates a snippet
 * that centers around the search term match, providing relevant context while
 * maintaining the specified character limit.
 *
 * @param text - The text content to truncate (string or portable text)
 * @param searchTerm - The search term to center the snippet around
 * @param maxLength - Maximum character length for the result (default: 200)
 * @returns TruncationResult containing the processed text and metadata
 */
export function truncateWithContext(
	text: string,
	searchTerm: string,
	maxLength = 200,
): TruncationResult {
	if (!text) {
		return { text: "", isTruncated: false, hasMatch: false, matchCount: 0 };
	}

	// Convert to string if it's portable text
	const plainText =
		typeof text === "string" ? text : extractTextFromPortableText(text);

	if (plainText.length <= maxLength) {
		const matchCount = countMatches(plainText, searchTerm);
		return {
			text: plainText,
			isTruncated: false,
			hasMatch: matchCount > 0,
			matchCount,
		};
	}

	if (!searchTerm.trim()) {
		// No search term, truncate from beginning
		return {
			text: `${plainText.substring(0, maxLength)}...`,
			isTruncated: true,
			hasMatch: false,
			matchCount: 0,
		};
	}

	const lowerText = plainText.toLowerCase();
	const lowerTerm = searchTerm.toLowerCase().trim();
	const matchIndex = lowerText.indexOf(lowerTerm);

	if (matchIndex === -1) {
		// No match found, truncate from beginning
		return {
			text: `${plainText.substring(0, maxLength)}...`,
			isTruncated: true,
			hasMatch: false,
			matchCount: 0,
		};
	}

	// Calculate snippet boundaries to center around the match
	const termLength = searchTerm.length;
	const contextBefore = Math.floor((maxLength - termLength) / 2);
	const contextAfter = maxLength - contextBefore - termLength;

	const start = Math.max(0, matchIndex - contextBefore);
	const _end = Math.min(
		plainText.length,
		matchIndex + termLength + contextAfter,
	);

	// Adjust start if we have room at the end
	const adjustedStart = Math.max(
		0,
		Math.min(start, plainText.length - maxLength),
	);
	const adjustedEnd = Math.min(plainText.length, adjustedStart + maxLength);

	let snippet = plainText.substring(adjustedStart, adjustedEnd);

	// Add ellipsis indicators
	const prefix = adjustedStart > 0 ? "..." : "";
	const suffix = adjustedEnd < plainText.length ? "..." : "";

	snippet = prefix + snippet + suffix;
	const matchCount = countMatches(plainText, searchTerm);

	return {
		text: snippet,
		isTruncated: true,
		hasMatch: true,
		matchCount,
	};
}

/**
 * Highlights search terms in text with HTML spans
 */
export function highlightMatches(text: string, searchTerm: string): string {
	if (!text || !searchTerm.trim()) {
		return text;
	}

	const plainText =
		typeof text === "string" ? text : extractTextFromPortableText(text);
	const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const regex = new RegExp(`(${escapedTerm})`, "gi");

	return plainText.replace(
		regex,
		'<mark class="bg-yellow-200 rounded-sm">$1</mark>',
	);
}

/**
 * Count occurrences of search term in text
 */
function countMatches(text: string, searchTerm: string): number {
	if (!text || !searchTerm.trim()) return 0;

	const lowerText = text.toLowerCase();
	const lowerTerm = searchTerm.toLowerCase().trim();
	let count = 0;
	let position = 0;
	while (true) {
		const foundIndex = lowerText.indexOf(lowerTerm, position);
		if (foundIndex === -1) break;
		count++;
		position = foundIndex + lowerTerm.length;
	}
	return count;
}

/**
 * Extract plain text from Sanity portable text
 */
export function extractTextFromPortableText(
	portableText: PortableTextBlock[] | string,
): string {
	if (typeof portableText === "string") return portableText;
	if (!portableText || !Array.isArray(portableText)) return "";

	return portableText
		.filter((block) => block._type === "block")
		.map(
			(block) =>
				block.children
					?.filter((child) => child._type === "span")
					?.map((child) => child.text)
					?.join("") || "",
		)
		.join(" ")
		.trim();
}

/**
 * Check if search term appears in title
 */
export function hasMatchInTitle(title: string, searchTerm: string): boolean {
	if (!title || !searchTerm.trim()) return false;
	return title.toLowerCase().includes(searchTerm.toLowerCase().trim());
}

/**
 * Extract the first sentence from text with improved sentence boundary detection
 */
export function extractFirstSentence(text: string): string {
	if (!text) return "";

	// Common abbreviations that shouldn't end sentences
	const abbreviations =
		/\b(?:Dr|Mr|Mrs|Ms|Prof|Inc|Ltd|Corp|Co|etc|vs|e\.g|i\.e|Ph\.D|M\.D|B\.A|M\.A|U\.S|U\.K)\./gi;

	// Replace abbreviations with placeholders to avoid false sentence breaks
	const placeholderMap: Record<string, string> = {};
	let placeholderCounter = 0;
	const textWithPlaceholders = text.replace(abbreviations, (match) => {
		const placeholder = `__ABBREV_${placeholderCounter++}__`;
		placeholderMap[placeholder] = match;
		return placeholder;
	});

	// Find the first sentence-ending punctuation
	const sentenceEndRegex = /[.!?]/;
	const match = textWithPlaceholders.match(sentenceEndRegex);

	if (!match || match.index === undefined) {
		// No sentence-ending punctuation found, return entire text
		return restorePlaceholders(text, placeholderMap);
	}

	// Extract up to and including the first sentence-ending punctuation
	const firstSentence = textWithPlaceholders.substring(0, match.index + 1);

	// Restore abbreviations
	return restorePlaceholders(firstSentence, placeholderMap);
}

/**
 * Helper function to restore abbreviation placeholders
 */
function restorePlaceholders(
	text: string,
	placeholderMap: Record<string, string>,
): string {
	let result = text;
	for (const [placeholder, original] of Object.entries(placeholderMap)) {
		result = result.replace(placeholder, original);
	}
	return result;
}

/**
 * Process description text for display, handling both search context and first-sentence fallback
 */
export function processDescriptionForDisplay(
	portableText: PortableTextBlock[] | string,
	searchTerm?: string,
	maxLength = 200,
): DescriptionDisplayResult {
	const fullText = extractTextFromPortableText(portableText);

	if (!fullText) {
		return {
			text: "",
			hasSearchMatch: false,
			matchCount: 0,
			displayType: "first-sentence",
		};
	}

	// If no search term, always show first sentence
	if (!searchTerm?.trim()) {
		return {
			text: extractFirstSentence(fullText),
			hasSearchMatch: false,
			matchCount: 0,
			displayType: "first-sentence",
		};
	}

	// Check for search matches
	const truncationResult = truncateWithContext(fullText, searchTerm, maxLength);

	// If we have a match, use the search context
	if (truncationResult.hasMatch) {
		return {
			text: truncationResult.text,
			hasSearchMatch: true,
			matchCount: truncationResult.matchCount,
			displayType: "search-context",
		};
	}

	// No match found, fall back to first sentence
	return {
		text: extractFirstSentence(fullText),
		hasSearchMatch: false,
		matchCount: 0,
		displayType: "first-sentence",
	};
}

/**
 * Generate match explanation for debugging
 */
export function getMatchExplanation(
	title: string,
	description: PortableTextBlock[] | string,
	searchTerm: string,
): {
	titleMatch: boolean;
	descriptionMatch: boolean;
	matchLocations: string[];
} {
	const titleMatch = hasMatchInTitle(title, searchTerm);
	const plainDescription = extractTextFromPortableText(description);
	const descriptionMatch = plainDescription
		.toLowerCase()
		.includes(searchTerm.toLowerCase().trim());

	const matchLocations: string[] = [];
	if (titleMatch) matchLocations.push("title");
	if (descriptionMatch) matchLocations.push("description");

	return {
		titleMatch,
		descriptionMatch,
		matchLocations,
	};
}
