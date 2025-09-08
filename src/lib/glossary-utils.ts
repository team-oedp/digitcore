/**
 * Utility functions for detecting glossary terms within text content
 * and linking them to the glossary page
 */

export type GlossaryTerm = {
	_id: string;
	title: string;
};

/**
 * Convert a glossary term title or identifier into a stable, URL-safe anchor id.
 * This should be used both when creating anchors on the glossary page and when
 * generating links to those anchors from elsewhere in the site.
 */
export function toGlossaryAnchorId(input: string): string {
	if (!input) return "";
	return (
		input
			.toString()
			.normalize("NFKD")
			// Remove Unicode combining diacritical marks
			.replace(/\p{M}/gu, "")
			.toLowerCase()
			.trim()
			// Replace any sequence of non-alphanumeric characters with a single dash
			.replace(/[^a-z0-9]+/g, "-")
			// Trim leading/trailing dashes
			.replace(/^-+|-+$/g, "")
	);
}

/**
 * Detects glossary terms in text and returns an array of matched terms with positions
 * @param text - The text to search for glossary terms
 * @param glossaryTerms - Array of glossary terms to detect
 * @returns Array of matches with term info and position
 */
export function detectGlossaryTerms(
	text: string,
	glossaryTerms: GlossaryTerm[],
): Array<{
	term: GlossaryTerm;
	startIndex: number;
	endIndex: number;
	originalText: string;
}> {
	if (!text || !glossaryTerms || glossaryTerms.length === 0) {
		return [];
	}

	const matches: Array<{
		term: GlossaryTerm;
		startIndex: number;
		endIndex: number;
		originalText: string;
	}> = [];

	// Sort terms by length (longest first) to match longer terms before shorter ones
	const sortedTerms = [...glossaryTerms].sort(
		(a, b) => b.title.length - a.title.length,
	);

	for (const term of sortedTerms) {
		// Create a case-insensitive regex that matches whole words
		const pattern = new RegExp(`\\b${escapeRegExp(term.title)}\\b`, "gi");

		for (const match of text.matchAll(pattern)) {
			const startIndex = match.index ?? 0;
			const endIndex = startIndex + match[0].length;

			// Check if this position overlaps with any existing matches
			const hasOverlap = matches.some(
				(existing) =>
					(startIndex >= existing.startIndex &&
						startIndex < existing.endIndex) ||
					(endIndex > existing.startIndex && endIndex <= existing.endIndex),
			);

			if (!hasOverlap) {
				matches.push({
					term,
					startIndex,
					endIndex,
					originalText: match[0], // Preserve original case
				});
			}
		}
	}

	// Sort matches by position for easier processing
	return matches.sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Processes text to wrap glossary terms with React components
 * @param text - The text to process
 * @param glossaryTerms - Array of glossary terms to detect
 * @param renderTerm - Function to render a detected glossary term
 * @returns Array of React nodes with glossary terms wrapped
 */
export function processTextWithGlossaryTerms(
	text: string,
	glossaryTerms: GlossaryTerm[],
	renderTerm: (
		term: GlossaryTerm,
		text: string,
		key: string,
	) => React.ReactNode,
): React.ReactNode[] {
	const matches = detectGlossaryTerms(text, glossaryTerms);

	if (matches.length === 0) {
		return [text];
	}

	const result: React.ReactNode[] = [];
	let lastIndex = 0;

	for (const [index, match] of matches.entries()) {
		// Add text before the match
		if (match.startIndex > lastIndex) {
			result.push(text.substring(lastIndex, match.startIndex));
		}

		// Add the wrapped glossary term
		result.push(
			renderTerm(match.term, match.originalText, `glossary-${index}`),
		);

		lastIndex = match.endIndex;
	}

	// Add remaining text after the last match
	if (lastIndex < text.length) {
		result.push(text.substring(lastIndex));
	}

	return result;
}

/**
 * Creates a glossary link URL for a given term title or identifier.
 * Prefer passing the term title; the function will generate a stable slug
 * that matches the anchor id rendered on the glossary page.
 */
export function createGlossaryLink(term: string): string {
	return `/glossary#${toGlossaryAnchorId(term)}`;
}
