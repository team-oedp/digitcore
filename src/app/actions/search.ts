"use server";

import { type Language, i18n } from "~/i18n/config";
import { createLogLocation, logger } from "~/lib/logger";
import type { ParsedSearchParams } from "~/lib/search";
import { parseSearchParams, searchParamsSchema } from "~/lib/search";
import { client } from "~/sanity/lib/client";
import {
	PATTERN_FILTER_QUERY,
	PATTERN_SEARCH_QUERY,
	PATTERN_SEARCH_WITH_PREFERENCES_QUERY,
	PATTERN_SIMPLE_SEARCH_QUERY,
	RESOURCE_SEARCH_QUERY,
	SOLUTION_SEARCH_QUERY,
	TAG_SEARCH_QUERY,
} from "~/sanity/lib/queries";
import type { Resource, Solution, Tag } from "~/sanity/sanity.types";
import type { SearchPattern } from "~/types/search";

/**
 * Direct solution search result
 * Extends Sanity's Solution type with search-specific fields (_score and patterns)
 */
export type SearchSolution = Pick<
	Solution,
	"_id" | "_type" | "title" | "description" | "audiences"
> & {
	_score?: number;
	patterns?: Array<{
		_id: string;
		title: string | null;
		slug: string;
	}> | null;
};

/**
 * Direct resource search result
 * Extends Sanity's Resource type with search-specific fields (_score and patterns)
 */
export type SearchResource = Pick<
	Resource,
	"_id" | "_type" | "title" | "description" | "solutions" | "mainLink"
> & {
	_score?: number;
	patterns?: Array<{
		_id: string;
		title: string | null;
		slug: string;
	}> | null;
};

/**
 * Direct tag search result
 * Extends Sanity's Tag type with search-specific fields (_score and patterns)
 */
export type SearchTag = Pick<Tag, "_id" | "_type" | "title"> & {
	_score?: number;
	patterns?: Array<{
		_id: string;
		title: string | null;
		slug: string;
	}> | null;
};

// Result type for search action
export type SearchResult = {
	success: boolean;
	data?: SearchPattern[];
	error?: string;
	totalCount: number;
	searchParams: ParsedSearchParams;
};

// Comprehensive search result for all content types
export type ComprehensiveSearchResult = {
	success: boolean;
	data?: {
		patterns: SearchPattern[];
		solutions: SearchSolution[];
		resources: SearchResource[];
		tags: SearchTag[];
	};
	error?: string;
	totalCount: number;
	searchParams: ParsedSearchParams;
};

/**
 * Server action to search patterns with GROQ scoring and filtering
 */
export async function searchPatterns(
	formData: FormData,
	language: Language,
): Promise<SearchResult> {
	const location = createLogLocation("search.ts", "searchPatterns");

	try {
		logger.searchInfo("Starting search operation", undefined, location);

		// Extract search parameters from form data
		const rawParams = {
			q: formData.get("q")?.toString(),
			audiences: formData.get("audiences")?.toString(),
			themes: formData.get("themes")?.toString(),
			tags: formData.get("tags")?.toString(),
			enhance: formData.get("enhance")?.toString(),
			page: formData.get("page")?.toString(),
			limit: formData.get("limit")?.toString(),
		};

		// Extract preference parameters for boosting
		const prefParams = {
			prefAudiences: formData.get("prefAudiences")?.toString(),
			prefThemes: formData.get("prefThemes")?.toString(),
		};

		logger.search("Raw form data parameters", rawParams, location);

		// Validate and parse parameters
		const validatedParams = searchParamsSchema.parse(rawParams);
		logger.search("Validated parameters", validatedParams, location);

		const parsedParams = parseSearchParams(validatedParams);
		logger.search("Parsed parameters", parsedParams, location);

		// Parse preference parameters for boosting
		const prefAudiences = prefParams.prefAudiences
			? prefParams.prefAudiences.split(",").filter(Boolean)
			: [];
		const prefThemes = prefParams.prefThemes
			? prefParams.prefThemes.split(",").filter(Boolean)
			: [];

		// Prepare GROQ query parameters - always provide all parameters (empty arrays if no values)
		const queryParams: Record<string, unknown> = {
			language,
			audiences: parsedParams.audiences || [],
			themes: parsedParams.themes || [],
			tags: parsedParams.tags || [],
			prefAudiences: prefAudiences,
			prefThemes: prefThemes,
		};

		logger.search(
			"GROQ query parameters prepared",
			{
				audiences: queryParams.audiences,
				themes: queryParams.themes,
				tags: queryParams.tags,
			},
			location,
		);

		// Determine which query to use based on search term and preferences
		const hasSearchTerm = parsedParams.searchTerm?.trim();
		const hasPreferences = prefAudiences.length > 0 || prefThemes.length > 0;

		logger.search(
			"Query selection criteria",
			{
				hasSearchTerm: !!hasSearchTerm,
				searchTerm: parsedParams.searchTerm,
				hasPreferences,
				prefAudiencesCount: prefAudiences.length,
				prefThemesCount: prefThemes.length,
			},
			location,
		);

		let query: string;
		let finalQueryParams: Record<string, unknown>;

		if (hasSearchTerm) {
			// Use appropriate search query based on preferences
			if (hasPreferences) {
				query = PATTERN_SEARCH_WITH_PREFERENCES_QUERY;
				finalQueryParams = queryParams; // Include all params including preferences
				logger.groq(
					"Using PATTERN_SEARCH_WITH_PREFERENCES_QUERY",
					undefined,
					location,
				);
			} else {
				query = PATTERN_SEARCH_QUERY;
				finalQueryParams = {
					audiences: queryParams.audiences,
					themes: queryParams.themes,
					tags: queryParams.tags,
					// Don't include preference params for regular search
				};
				logger.groq(
					"Using PATTERN_SEARCH_QUERY (no preferences)",
					undefined,
					location,
				);
			}

			// Escape special characters in search term for GROQ
			const escapedSearchTerm = parsedParams.searchTerm
				.trim()
				.replace(/["\\]/g, "\\$&"); // Escape quotes and backslashes
			finalQueryParams.searchTerm = escapedSearchTerm;

			logger.groq(
				"Search term escaped",
				{ original: parsedParams.searchTerm, escaped: escapedSearchTerm },
				location,
			);
		} else {
			// Use filter query (no search term, only filters)
			query = PATTERN_FILTER_QUERY;
			finalQueryParams = hasPreferences
				? queryParams
				: {
						audiences: queryParams.audiences,
						themes: queryParams.themes,
						tags: queryParams.tags,
					};
			logger.groq("Using PATTERN_FILTER_QUERY", { hasPreferences }, location);
		}

		logger.groq("Final GROQ query parameters", finalQueryParams, location);
		logger.groq("Query type", hasSearchTerm ? "SEARCH" : "FILTER", location);

		// Execute GROQ query
		logger.groq(
			"Executing GROQ query",
			{ queryType: hasSearchTerm ? "SEARCH" : "FILTER" },
			location,
		);
		const startTime = Date.now();
		const response = await client.fetch(query, finalQueryParams);
		const endTime = Date.now();

		// Extract results from Sanity client response
		const results = response?.result || response;

		logger.groq(
			"GROQ query completed",
			{
				resultCount: results?.length || 0,
				executionTime: `${endTime - startTime}ms`,
			},
			location,
		);

		logger.searchInfo(
			"Search completed successfully",
			{ resultCount: results?.length || 0 },
			location,
		);

		return {
			success: true,
			data: results || [],
			totalCount: results?.length || 0,
			searchParams: parsedParams,
		};
	} catch (error) {
		logger.searchError("Search operation failed", error, location);
		logger.error(
			"server",
			"Search error details",
			{
				errorType: typeof error,
				errorConstructor: error?.constructor?.name,
				isError: error instanceof Error,
				isNull: error === null,
			},
			location,
		);

		// More detailed error logging
		if (error instanceof Error) {
			logger.searchError(
				"Error details",
				{
					message: error.message,
					stack: error.stack,
					name: error.name,
				},
				location,
			);
		} else if (error === null) {
			logger.searchError(
				"Null error - likely GROQ syntax issue",
				undefined,
				location,
			);
		} else {
			logger.searchError(
				"Unknown error type",
				{
					type: typeof error,
					value: error,
				},
				location,
			);
		}

		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: error === null
						? "Search failed - GROQ query error"
						: "Search failed - unknown error",
			totalCount: 0,
			searchParams: parseSearchParams({ page: 1, limit: 20 }),
		};
	}
}

/**
 * Alternative server action that accepts URL search params directly
 */
export async function searchPatternsWithParams(
	searchParams: URLSearchParams,
	language: Language,
): Promise<SearchResult> {
	const location = createLogLocation("search.ts", "searchPatternsWithParams");

	try {
		logger.searchInfo(
			"Converting URLSearchParams to FormData",
			Object.fromEntries(searchParams.entries()),
			location,
		);

		const formData = new FormData();

		// Convert URLSearchParams to FormData
		for (const [key, value] of searchParams) {
			formData.append(key, value);
		}

		logger.search("Delegating to searchPatterns", undefined, location);
		return await searchPatterns(formData, language);
	} catch (error) {
		logger.searchError("searchPatternsWithParams failed", error, location);

		return {
			success: false,
			error: error instanceof Error ? error.message : "Search failed",
			totalCount: 0,
			searchParams: parseSearchParams({ page: 1, limit: 20 }),
		};
	}
}

/**
 * Search function that accepts onboarding preferences for result boosting
 */

export async function searchPatternsWithPreferences(
	searchParams: URLSearchParams,
	preferences: {
		selectedAudienceIds: string[];
		selectedThemeIds: string[];
	},
	language: Language,
): Promise<SearchResult> {
	const location = createLogLocation(
		"search.ts",
		"searchPatternsWithPreferences",
	);

	try {
		logger.searchInfo(
			"Starting search with onboarding preferences",
			{
				searchParams: Object.fromEntries(searchParams.entries()),
				preferences,
			},
			location,
		);

		const formData = new FormData();

		// Add search params
		for (const [key, value] of searchParams) {
			formData.append(key, value);
		}

		// Add preference parameters for GROQ boosting (only if not empty)
		if (preferences.selectedAudienceIds.length > 0) {
			formData.append(
				"prefAudiences",
				preferences.selectedAudienceIds.join(","),
			);
		}
		if (preferences.selectedThemeIds.length > 0) {
			formData.append("prefThemes", preferences.selectedThemeIds.join(","));
		}

		logger.search(
			"Delegating to searchPatterns with preferences",
			undefined,
			location,
		);
		return await searchPatterns(formData, language);
	} catch (error) {
		logger.searchError("searchPatternsWithPreferences failed", error, location);

		return {
			success: false,
			error: error instanceof Error ? error.message : "Search failed",
			totalCount: 0,
			searchParams: parseSearchParams({ page: 1, limit: 20 }),
		};
	}
}

/**
 * Direct search function for command modal - no URL params needed
 */
export async function searchContentForCommandModal(
	searchTerm: string,
	language: Language,
): Promise<ComprehensiveSearchResult> {
	const location = createLogLocation("search.ts", "searchAllContent");

	try {
		if (!searchTerm.trim()) {
			return {
				success: true,
				data: { patterns: [], solutions: [], resources: [], tags: [] },
				totalCount: 0,
				searchParams: parseSearchParams({ page: 1, limit: 20 }),
			};
		}

		logger.searchInfo("Starting direct search", { searchTerm }, location);

		// Escape search term for GROQ
		const escapedSearchTerm = searchTerm.trim().replace(/["\\]/g, "\\$&");
		const queryParams = { searchTerm: escapedSearchTerm, language };

		logger.search(
			"Executing direct GROQ queries",
			{ escapedSearchTerm, language },
			location,
		);

		// Execute all searches directly against Sanity
		const [patternsResult, solutionsResult, resourcesResult, tagsResult] =
			await Promise.allSettled([
				client.fetch(PATTERN_SIMPLE_SEARCH_QUERY, queryParams),
				client.fetch(SOLUTION_SEARCH_QUERY, queryParams),
				client.fetch(RESOURCE_SEARCH_QUERY, queryParams),
				client.fetch(TAG_SEARCH_QUERY, queryParams),
			]);

		// Extract results with error handling
		const patterns =
			patternsResult.status === "fulfilled" ? patternsResult.value || [] : [];
		const solutions =
			solutionsResult.status === "fulfilled" ? solutionsResult.value || [] : [];
		const resources =
			resourcesResult.status === "fulfilled" ? resourcesResult.value || [] : [];
		const tags =
			tagsResult.status === "fulfilled" ? tagsResult.value || [] : [];

		// Log any failed searches
		if (patternsResult.status === "rejected") {
			logger.searchError(
				"Patterns search failed",
				patternsResult.reason,
				location,
			);
		}
		if (solutionsResult.status === "rejected") {
			logger.searchError(
				"Solutions search failed",
				solutionsResult.reason,
				location,
			);
		}
		if (resourcesResult.status === "rejected") {
			logger.searchError(
				"Resources search failed",
				resourcesResult.reason,
				location,
			);
		}
		if (tagsResult.status === "rejected") {
			logger.searchError("Tags search failed", tagsResult.reason, location);
		}

		const totalCount =
			patterns.length + solutions.length + resources.length + tags.length;

		logger.searchInfo(
			"Direct search completed",
			{
				patterns: patterns.length,
				solutions: solutions.length,
				resources: resources.length,
				tags: tags.length,
				totalCount,
			},
			location,
		);

		return {
			success: true,
			data: { patterns, solutions, resources, tags },
			totalCount,
			searchParams: parseSearchParams({
				q: searchTerm,
				page: 1,
				limit: 20,
			}),
		};
	} catch (error) {
		logger.searchError("Direct search failed", error, location);

		return {
			success: false,
			error: error instanceof Error ? error.message : "Search failed",
			totalCount: 0,
			searchParams: parseSearchParams({ page: 1, limit: 20 }),
		};
	}
}

/**
 * Original comprehensive search function preserved for search page compatibility
 */
export async function searchAllContent(
	searchParams: URLSearchParams,
	language: Language,
): Promise<ComprehensiveSearchResult> {
	// Delegate to the direct search function by extracting the search term
	const searchTerm = searchParams.get("q")?.trim() || "";
	return await searchContentForCommandModal(searchTerm, language);
}
