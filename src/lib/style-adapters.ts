/**
 * Style adapters to convert unified styles to format-specific implementations
 */

import { type PatternStyleKey, patternStyles } from "./pattern-styles";

/**
 * Convert unified styles to Tailwind CSS classes
 * This maintains the existing web styling approach
 */
export const toTailwindClasses = (styleKey: PatternStyleKey): string => {
	const style = patternStyles[styleKey];

	// Map specific styles to their existing Tailwind equivalents
	const tailwindMap: Record<PatternStyleKey, string> = {
		// Document structure
		page: "bg-white font-inter text-sm leading-tight text-primary",

		// Cover page
		coverTitle: "font-light text-[32px] text-primary capitalize mb-5",
		coverSubtitle: "text-[14px] text-zinc-500 mb-10",
		coverMeta: "text-xs text-zinc-400",

		// Table of contents
		tocTitle: "font-light text-2xl text-primary mb-8",
		tocItem: "py-2 border-b border-neutral-100",
		tocItemTitle: "text-sm text-primary capitalize",
		tocItemPage: "text-xs text-zinc-500",

		// Pattern header
		patternTitle: "font-light text-[32px] text-primary capitalize mb-5",
		patternDescription: "text-sm text-primary leading-normal mb-6",

		// Section headers
		sectionTitle: "font-light text-[32px] text-primary mt-8 mb-4",

		// Connections/tags
		connectionContainer: "mb-8",
		connectionSection: "mb-4",
		connectionTitle: "text-xs font-semibold text-neutral-700 uppercase mb-2",
		tag: "bg-gray-200 text-neutral-700 text-xs px-2 py-1 rounded",

		// Solutions
		solutionContainer: "mb-6",
		solutionNumber: "text-lg font-normal text-primary w-10",
		solutionTitle: "text-lg font-normal text-primary mb-3",
		solutionDescription: "text-sm text-zinc-500 leading-normal mb-3",
		audienceTag:
			"bg-blue-100 border border-blue-200 text-blue-800 text-sm px-2 py-1 rounded-md",

		// Resources
		resourceContainer: "border-t border-dashed border-neutral-300 pt-5 pb-5",
		resourceTitle: "text-base font-semibold text-primary mb-2",
		resourceDescription: "text-sm text-zinc-500 leading-normal mb-3",
		resourceSolutions: "text-xs text-neutral-600 italic",

		// Notes
		notesContainer: "mt-5 pt-4 border-t border-gray-200",
		notesTitle: "text-sm font-semibold text-neutral-700 mb-2",
		notesText: "text-xs text-neutral-600 leading-normal",

		// Page elements
		pageNumber: "text-xs text-zinc-400",
	};

	return tailwindMap[styleKey] || "";
};

/**
 * Convert unified styles to react-pdf StyleSheet format
 * Direct usage of the style objects with any necessary transformations
 */
export const toPDFStyle = (styleKey: PatternStyleKey) => {
	const style = patternStyles[styleKey];

	// Some properties might need transformation for react-pdf
	const { textTransform, ...transformedStyle }: Record<string, unknown> = {
		...style,
	};

	// Handle border style
	if ("borderStyle" in style && style.borderStyle === "dashed") {
		transformedStyle.borderStyle = "dashed";
	}

	return transformedStyle;
};

/**
 * Get raw style values for custom implementations
 */
export const getStyleValues = (styleKey: PatternStyleKey) => {
	return patternStyles[styleKey];
};

/**
 * Utility to apply text transform since react-pdf doesn't support it natively
 */
export const applyTextTransform = (
	text: string,
	transform?: "capitalize" | "uppercase" | "lowercase",
) => {
	if (!transform || !text) return text;

	switch (transform) {
		case "capitalize":
			return text.replace(/\b\w/g, (char) => char.toUpperCase());
		case "uppercase":
			return text.toUpperCase();
		case "lowercase":
			return text.toLowerCase();
		default:
			return text;
	}
};
