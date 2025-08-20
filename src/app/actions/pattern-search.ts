"use server";

import type { PortableTextBlock } from "@portabletext/types";
import { client } from "~/sanity/lib/client";

export type PatternContentSearchResult = {
	success: boolean;
	data?: {
		patterns: PatternSearchItem[];
		solutions: PatternSearchItem[];
		resources: PatternSearchItem[];
		tags: PatternSearchItem[];
		audiences: PatternSearchItem[];
		nestedSolutions: PatternSearchItem[];
	};
	error?: string;
};

export type PatternSearchItem = {
	_id: string;
	_type: string;
	title?: string;
	description?: Array<{
		children?: Array<{
			marks?: Array<string>;
			text?: string;
			_type: "span";
			_key: string;
		}>;
		style?: "normal";
		listItem?: never;
		markDefs?: Array<{
			href?: string;
			_type: "link";
			_key: string;
		}>;
		level?: number;
		_type: "block";
		_key: string;
	}>;
	matchType?: string;
	parentResource?: string;
	nestedSolutions?: PatternSearchItem[];
	_score?: number;
};

/**
 * Server action to search within a specific pattern's content using GROQ
 */
export async function searchPatternContent(
	patternSlug: string,
	searchTerm: string,
): Promise<PatternContentSearchResult> {
	try {
		if (!searchTerm.trim()) {
			return {
				success: true,
				data: {
					patterns: [],
					solutions: [],
					resources: [],
					tags: [],
					audiences: [],
					nestedSolutions: [],
				},
			};
		}

		// Escape special characters in search term for GROQ
		const escapedSearchTerm = searchTerm.trim().replace(/["\\]/g, "\\$&");

		const queryParams = {
			patternSlug,
			searchTerm: escapedSearchTerm,
		};

		// Execute GROQ query
		console.log("Searching for pattern content with:", queryParams);

		// First, fetch the pattern and all its related content
		const PATTERN_CONTENT_QUERY = `*[_type == "pattern" && slug.current == $patternSlug][0]{
    _id,
    title,
    description,
    "solutions": solutions[]->{
      _id,
      _type,
      title,
      description
    },
    "resources": resources[]->{
      _id,
      _type,
      title,
      description,
      "nestedSolutions": solutions[]->{
        _id,
        _type,
        title,
        description
      }
    },
    "tags": tags[]->{
      _id,
      _type,
      title
    },
    "audiences": audiences[]->{
      _id,
      _type,
      title
    }
  }`;

		const response = await client.fetch(PATTERN_CONTENT_QUERY, queryParams);

		console.log("Query result:", response);

		// Extract result from Sanity client response
		const result = response?.result !== undefined ? response.result : response;

		if (!result) {
			return {
				success: false,
				error: "Pattern not found",
			};
		}

		// Now filter the results based on search term
		const searchTermLower = searchTerm.toLowerCase();

		const searchResults: {
			patterns: PatternSearchItem[];
			solutions: PatternSearchItem[];
			resources: PatternSearchItem[];
			tags: PatternSearchItem[];
			audiences: PatternSearchItem[];
			nestedSolutions: PatternSearchItem[];
		} = {
			patterns: [],
			solutions: [],
			resources: [],
			tags: [],
			audiences: [],
			nestedSolutions: [],
		};

		// Helper function to check if text content matches search term
		const matchesSearchTerm = (
			content: string | PortableTextBlock[] | null | undefined,
		): boolean => {
			if (!content) return false;

			// Handle string descriptions
			if (typeof content === "string") {
				return content.toLowerCase().includes(searchTermLower);
			}

			// Handle portable text array
			if (Array.isArray(content)) {
				return content.some((block) =>
					block.children?.some(
						(child) =>
							"text" in child &&
							typeof child.text === "string" &&
							child.text.toLowerCase().includes(searchTermLower),
					),
				);
			}

			return false;
		};

		// Check if pattern title or description matches
		if (
			result.title?.toLowerCase().includes(searchTermLower) ||
			matchesSearchTerm(result.description)
		) {
			searchResults.patterns.push({
				_id: result._id,
				_type: "pattern",
				title: result.title,
				description: result.description,
			});
		}

		// Filter solutions
		if (result.solutions) {
			const matchingSolutions = result.solutions.filter(
				(solution: {
					_id: string;
					_type: string;
					title?: string;
					description?: unknown;
				}) =>
					solution.title?.toLowerCase().includes(searchTermLower) ||
					matchesSearchTerm(solution.description as PortableTextBlock[]),
			);
			searchResults.solutions = matchingSolutions as PatternSearchItem[];
		}

		// Filter resources
		if (result.resources) {
			const matchingResources = result.resources.filter(
				(resource: {
					_id: string;
					_type: string;
					title?: string;
					description?: unknown;
					nestedSolutions?: unknown[];
				}) =>
					resource.title?.toLowerCase().includes(searchTermLower) ||
					matchesSearchTerm(resource.description as PortableTextBlock[]),
			);
			searchResults.resources = matchingResources as PatternSearchItem[];

			// Also check nested solutions within resources
			for (const resource of result.resources) {
				if (resource.nestedSolutions) {
					const matchingNestedSolutions = resource.nestedSolutions.filter(
						(solution: {
							_id: string;
							_type: string;
							title?: string;
							description?: unknown;
						}) =>
							solution.title?.toLowerCase().includes(searchTermLower) ||
							matchesSearchTerm(solution.description as PortableTextBlock[]),
					);
					searchResults.nestedSolutions.push(
						...(matchingNestedSolutions as PatternSearchItem[]),
					);
				}
			}
		}

		// Filter tags
		if (result.tags) {
			const matchingTags = result.tags.filter(
				(tag: { _id: string; _type: string; title?: string }) =>
					tag.title?.toLowerCase().includes(searchTermLower),
			);
			searchResults.tags = matchingTags as PatternSearchItem[];
		}

		// Filter audiences
		if (result.audiences) {
			const matchingAudiences = result.audiences.filter(
				(audience: { _id: string; _type: string; title?: string }) =>
					audience.title?.toLowerCase().includes(searchTermLower),
			);
			searchResults.audiences = matchingAudiences as PatternSearchItem[];
		}

		return {
			success: true,
			data: searchResults,
		};
	} catch (error) {
		console.error("Pattern content search error:", error);

		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Pattern content search failed",
		};
	}
}
