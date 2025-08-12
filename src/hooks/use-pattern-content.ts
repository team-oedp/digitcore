/**
 * Shared content logic for pattern rendering
 * Used by both web and PDF renderers to ensure consistency
 */
"use client";

import type { PortableTextBlock } from "@portabletext/types";
import { useEffect } from "react";
import type { CarrierBagItem } from "~/components/global/carrier-bag/carrier-bag-item";
import type {
	Audience,
	PATTERN_QUERYResult,
	Pattern,
	Resource,
	Solution,
	Tag,
	Theme,
} from "~/sanity/sanity.types";
import { usePageContentStore } from "~/stores/page-content";

// Generic Sanity reference when a relationship is not populated
export type SanityReference = {
	_id?: string;
	_key?: string;
	_ref?: string;
};

// Entities that may arrive either as populated documents or as bare references
export type TagEntity = Tag & SanityReference;
export type AudienceEntity = Audience & SanityReference;
export type ThemeEntity = Theme & SanityReference;
export type SolutionEntity = Solution & SanityReference;
export type ResourceEntity = Resource & SanityReference;

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
export type PatternHeaderData = {
	title: string;
	description: string;
	slug?: string;
	hasCarrierBagButton?: boolean;
};

// Pattern connection data structure
export type PatternConnectionData = {
	type: "tags" | "audiences" | "themes";
	title: string;
	items: Array<{
		id: string;
		title: string;
	}>;
};

// Solution data structure
export type SolutionData = {
	id: string;
	number: string;
	title: string;
	description: string;
	audiences: Array<{
		id: string;
		title: string;
	}>;
};

// Resource data structure
export type ResourceData = {
	id: string;
	title: string;
	description: string;
	relatedSolutions: string[];
};

// Pattern content structure
export type PatternContentData = {
	header: PatternHeaderData;
	connections: PatternConnectionData[];
	solutions: SolutionData[];
	resources: ResourceData[];
	notes?: string;
	dateAdded?: string;
};

/**
 * Hook to process pattern data into a consistent structure for rendering
 */
export type PopulatedPattern = Pattern & {
	tags?: TagEntity[];
	audiences?: AudienceEntity[];
	themes?: ThemeEntity[];
	solutions?: SolutionEntity[];
	resources?: ResourceEntity[];
};

export function usePatternContentStore(pattern: PATTERN_QUERYResult) {
	const { setContent, setPatternSlug } = usePageContentStore();

	useEffect(() => {
		console.log("usePatternContentStore - Pattern data received:", pattern);
		if (!pattern) {
			console.log("No pattern data, clearing content");
			// Clear content if no pattern
			setContent({
				patterns: [],
				solutions: [],
				resources: [],
				tags: [],
				audiences: [],
			});
			setPatternSlug(null);
			return;
		}

		// Extract and prepare the searchable content from the pattern
		// Convert the pattern query result to the types expected by the store
		const searchableContent = {
			patterns: [
				{
					_id: pattern._id,
					_type: pattern._type,
					_createdAt: pattern._createdAt,
					_updatedAt: pattern._updatedAt,
					_rev: pattern._rev,
					title: pattern.title ?? undefined,
					slug: pattern.slug
						? { current: pattern.slug, _type: "slug" as const }
						: undefined,
					description: pattern.description ?? undefined,
				},
			],
			solutions:
				pattern.solutions?.map(
					(solution) =>
						({
							_id: solution._id,
							_type: solution._type,
							_createdAt: new Date().toISOString(),
							_updatedAt: new Date().toISOString(),
							_rev: "",
							title: solution.title || undefined,
							description: solution.description || undefined,
						}) as Solution,
				) || [],
			resources:
				pattern.resources?.map(
					(resource) =>
						({
							_id: resource._id,
							_type: resource._type,
							_createdAt: new Date().toISOString(),
							_updatedAt: new Date().toISOString(),
							_rev: "",
							title: resource.title || undefined,
							description: resource.description || undefined,
						}) as Resource,
				) || [],
			tags:
				pattern.tags?.map(
					(tag) =>
						({
							_id: tag._id,
							_type: tag._type,
							_createdAt: new Date().toISOString(),
							_updatedAt: new Date().toISOString(),
							_rev: "",
							title: tag.title || undefined,
						}) as Tag,
				) || [],
			audiences:
				pattern.audiences?.map(
					(audience) =>
						({
							_id: audience._id,
							_type: audience._type,
							_createdAt: new Date().toISOString(),
							_updatedAt: new Date().toISOString(),
							_rev: "",
							title: audience.title || undefined,
						}) as Audience,
				) || [],
		};

		console.log("Setting searchable content in store:", searchableContent);
		console.log("Content breakdown:", {
			patterns: searchableContent.patterns.length,
			solutions: searchableContent.solutions?.length || 0,
			resources: searchableContent.resources?.length || 0,
			tags: searchableContent.tags?.length || 0,
			audiences: searchableContent.audiences?.length || 0,
		});

		// Set the pattern slug for GROQ searches
		const patternSlug = typeof pattern.slug === "string" ? pattern.slug : null;
		console.log("Setting pattern slug:", patternSlug);

		setContent(searchableContent);
		setPatternSlug(patternSlug);
	}, [pattern, setContent, setPatternSlug]);
}

export const usePatternContent = (
	pattern: PopulatedPattern,
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
			items: (pattern.tags as TagEntity[]).map((tag) => ({
				id: tag._id ?? tag._key ?? tag._ref ?? "",
				title: tag?.title || tag?._ref || "Unknown Tag",
			})),
		});
	}

	if (pattern.audiences && pattern.audiences.length > 0) {
		connections.push({
			type: "audiences",
			title: "Audiences",
			items: (pattern.audiences as AudienceEntity[]).map((audience) => ({
				id: audience._id ?? audience._key ?? audience._ref ?? "",
				title: audience?.title || audience?._ref || "Unknown Audience",
			})),
		});
	}

	if (pattern.themes && pattern.themes.length > 0) {
		connections.push({
			type: "themes",
			title: "Themes",
			items: (pattern.themes as ThemeEntity[]).map((theme) => ({
				id: theme._id ?? theme._key ?? theme._ref ?? "",
				title: theme?.title || theme?._ref || "Unknown Theme",
			})),
		});
	}

	// Process solutions
	const solutions: SolutionData[] = (
		(pattern.solutions as SolutionEntity[]) || []
	).map((solution: SolutionEntity, index) => ({
		id: (solution as SolutionEntity)._id ?? `solution-${index}`,
		number: getRomanNumeral(index),
		title: solution.title || "Untitled Solution",
		description: portableTextToString(
			solution.description as PortableTextBlock[],
		),
		audiences: ((solution.audiences ?? []) as unknown as AudienceEntity[]).map(
			(audience) => ({
				id: audience._id ?? audience._key ?? audience._ref ?? "",
				title: audience?.title || audience?._ref || "Unknown Audience",
			}),
		),
	}));

	// Process resources
	const resources: ResourceData[] = (
		(pattern.resources as ResourceEntity[]) || []
	).map((resource: ResourceEntity, index) => ({
		id: resource._id ?? resource._key ?? resource._ref ?? `resource-${index}`,
		title: resource.title || "Untitled Resource",
		description: portableTextToString(
			resource.description as PortableTextBlock[],
		),
		relatedSolutions: (
			(resource.solutions ?? []) as unknown as SolutionEntity[]
		)
			.map(
				(sol) =>
					(sol as SolutionEntity).title ||
					(sol as SolutionEntity)._ref ||
					"Untitled",
			)
			.filter(Boolean),
	}));

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
export type CarrierBagDocumentData = {
	title: string;
	subtitle: string;
	date: string;
	patternCount: number;
	patterns: PatternContentData[];
	hasTableOfContents: boolean;
};

export const useCarrierBagDocument = (
	items: CarrierBagItem[],
): CarrierBagDocumentData => {
	const currentDate = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const patterns = items.map((item) =>
		usePatternContent(item.pattern as PopulatedPattern, item),
	);

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
export const usePatternHeader = (pattern: PopulatedPattern) => {
	const content = usePatternContent(pattern);
	return content.header;
};

export const usePatternConnections = (pattern: PopulatedPattern) => {
	const content = usePatternContent(pattern);
	return content.connections;
};

export const usePatternSolutions = (pattern: PopulatedPattern) => {
	const content = usePatternContent(pattern);
	return content.solutions;
};

export const usePatternResources = (pattern: PopulatedPattern) => {
	const content = usePatternContent(pattern);
	return content.resources;
};
