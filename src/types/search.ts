/**
 * Shared search types derived from Sanity-generated types
 *
 * These types are used across search components to ensure type safety
 * and consistency with the data returned from GROQ queries.
 */

import type { PATTERN_FILTER_QUERYResult } from "~/sanity/sanity.types";

/**
 * Base search pattern type - extends the generated Sanity type with optional _score
 * Used for all search queries (PATTERN_SEARCH_QUERY, PATTERN_FILTER_QUERY, etc.)
 */
export type SearchPattern = PATTERN_FILTER_QUERYResult[number] & {
	_score?: number;
	descriptionPlainText?: string | null;
};

/**
 * Array of search patterns
 */
export type SearchPatterns = SearchPattern[];

/**
 * Extract nested types from SearchPattern for component props
 */
export type SearchPatternTag = NonNullable<SearchPattern["tags"]>[number];
export type SearchPatternAudience = NonNullable<
	SearchPattern["audiences"]
>[number];
export type SearchPatternTheme = NonNullable<SearchPattern["theme"]>;
export type SearchPatternSolution = NonNullable<
	SearchPattern["solutions"]
>[number];
export type SearchPatternResource = NonNullable<
	SearchPattern["resources"]
>[number];

/**
 * Portable text block type from SearchPattern description
 */
export type SearchPatternDescription = NonNullable<
	SearchPattern["description"]
>[number];
