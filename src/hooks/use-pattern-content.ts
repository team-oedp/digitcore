/**
 * Shared content logic for pattern rendering
 * Used by both web and PDF renderers to ensure consistency
 */

import type { PortableTextBlock } from "@portabletext/types";
import type { CarrierBagItem } from "~/components/global/carrier-bag/carrier-bag-item";
import type { Pattern } from "~/sanity/sanity.types";

// Helper function to convert PortableText to plain text for PDF
export const portableTextToString = (blocks?: PortableTextBlock[]): string => {
	if (!blocks) return "";

	return blocks
		.map((block) => {
			if (block._type === "block" && block.children) {
				return block.children
					.map((child) => (child._type === "span" ? child.text || "" : ""))
					.join("");
			}
			return "";
		})
		.join("\n\n");
};

// Roman numerals helper
export const getRomanNumeral = (index: number): string => {
	const romanNumerals = [
		"i",
		"ii",
		"iii",
		"iv",
		"v",
		"vi",
		"vii",
		"viii",
		"ix",
		"x",
	];
	return `${romanNumerals[index] || `${index + 1}`}.`;
};

// Pattern header data structure
export interface PatternHeaderData {
	title: string;
	description: string;
	slug?: string;
	hasCarrierBagButton?: boolean;
}

// Pattern connection data structure
export interface PatternConnectionData {
	type: "tags" | "audiences" | "themes";
	title: string;
	items: Array<{
		id: string;
		title: string;
	}>;
}

// Solution data structure
export interface SolutionData {
	id: string;
	number: string;
	title: string;
	description: string;
	audiences: Array<{
		id: string;
		title: string;
	}>;
}

// Resource data structure
export interface ResourceData {
	id: string;
	title: string;
	description: string;
	relatedSolutions: string[];
}

// Pattern content structure
export interface PatternContentData {
	header: PatternHeaderData;
	connections: PatternConnectionData[];
	solutions: SolutionData[];
	resources: ResourceData[];
	notes?: string;
	dateAdded?: string;
}

/**
 * Hook to process pattern data into a consistent structure for rendering
 */
export const usePatternContent = (
	pattern: Pattern,
	carrierBagItem?: CarrierBagItem,
): PatternContentData => {
	// Process header
	const header: PatternHeaderData = {
		title: pattern.title || "Untitled Pattern",
		description: portableTextToString(
			pattern.description as PortableTextBlock[],
		),
		slug:
			typeof pattern.slug === "string" ? pattern.slug : pattern.slug?.current,
	};

	// Process connections
	const connections: PatternConnectionData[] = [];

	if (pattern.tags && pattern.tags.length > 0) {
		connections.push({
			type: "tags",
			title: "Tags",
			items: pattern.tags.map((tag: any) => ({
				id: tag._id || tag._key || tag._ref,
				title: tag?.title || tag?._ref || "Unknown Tag",
			})),
		});
	}

	if (pattern.audiences && pattern.audiences.length > 0) {
		connections.push({
			type: "audiences",
			title: "Audiences",
			items: pattern.audiences.map((audience: any) => ({
				id: audience._id || audience._key || audience._ref,
				title: audience?.title || audience?._ref || "Unknown Audience",
			})),
		});
	}

	if (pattern.themes && pattern.themes.length > 0) {
		connections.push({
			type: "themes",
			title: "Themes",
			items: pattern.themes.map((theme: any) => ({
				id: theme._id || theme._key || theme._ref,
				title: theme?.title || theme?._ref || "Unknown Theme",
			})),
		});
	}

	// Process solutions
	const solutions: SolutionData[] = (pattern.solutions || []).map(
		(solution: any, index: number) => ({
			id: solution._id || `solution-${index}`,
			number: getRomanNumeral(index),
			title: solution.title || "Untitled Solution",
			description: portableTextToString(solution.description),
			audiences: (solution.audiences || []).map((audience: any) => ({
				id: audience._id || audience._key || audience._ref,
				title: audience?.title || audience?._ref || "Unknown Audience",
			})),
		}),
	);

	// Process resources
	const resources: ResourceData[] = (pattern.resources || []).map(
		(resource: any, index: number) => ({
			id: resource._id || `resource-${index}`,
			title: resource.title || "Untitled Resource",
			description: portableTextToString(resource.description),
			relatedSolutions: (resource.solution || [])
				.map((sol: any) => sol.title || "Untitled")
				.filter(Boolean),
		}),
	);

	return {
		header,
		connections,
		solutions,
		resources,
		notes: carrierBagItem?.notes,
		dateAdded: carrierBagItem?.dateAdded,
	};
};

/**
 * Hook for carrier bag document structure
 */
export interface CarrierBagDocumentData {
	title: string;
	subtitle: string;
	date: string;
	patternCount: number;
	patterns: PatternContentData[];
	hasTableOfContents: boolean;
}

export const useCarrierBagDocument = (
	items: CarrierBagItem[],
): CarrierBagDocumentData => {
	const currentDate = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const patterns = items.map((item) => usePatternContent(item.pattern, item));

	return {
		title: "Your Carrier Bag",
		subtitle: "A collection of patterns from the DIGITCORE Toolkit",
		date: currentDate,
		patternCount: items.length,
		patterns,
		hasTableOfContents: items.length > 1,
	};
};

/**
 * Utility hooks for specific sections
 */
export const usePatternHeader = (pattern: Pattern) => {
	const content = usePatternContent(pattern);
	return content.header;
};

export const usePatternConnections = (pattern: Pattern) => {
	const content = usePatternContent(pattern);
	return content.connections;
};

export const usePatternSolutions = (pattern: Pattern) => {
	const content = usePatternContent(pattern);
	return content.solutions;
};

export const usePatternResources = (pattern: Pattern) => {
	const content = usePatternContent(pattern);
	return content.resources;
};
