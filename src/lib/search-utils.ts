/**
 * Search utilities for text processing, highlighting, and truncation
 */

export type TruncationResult = {
	text: string;
	isTruncated: boolean;
	hasMatch: boolean;
	matchCount: number;
};

/**
 * Truncates text while preserving context around search matches
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
	const end = Math.min(
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
					?.filter((child: PortableTextChild) => child._type === "span")
					?.map((child: PortableTextChild) => child.text)
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

// Type for Sanity Portable Text block and child
export type PortableTextChild = { text?: string; _type: string; _key: string };
export type PortableTextBlock = {
	children?: PortableTextChild[];
	_type: string;
	_key: string;
};
