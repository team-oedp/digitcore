/**
 * Utility functions for detecting glossary terms within text content
 * and linking them to the glossary page
 */

export type GlossaryTerm = {
	_id: string;
	title: string;
};

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
		let match: RegExpExecArray | null;

		while ((match = pattern.exec(text)) !== null) {
			const startIndex = match.index;
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
 * Creates a glossary link URL for a given term
 * @param termId - The glossary term ID
 * @returns The URL to the glossary page with the term anchor
 */
export function createGlossaryLink(termId: string): string {
	return `/glossary?word=${encodeURIComponent(termId)}`;
}
