"use server";

import type { ParsedSearchParams } from "~/lib/search";
import { parseSearchParams, searchParamsSchema } from "~/lib/search";
import { logger, createLogLocation } from "~/lib/logger";
import { client } from "~/sanity/lib/client";
import {
	PATTERN_FILTER_QUERY,
	PATTERN_SEARCH_QUERY,
} from "~/sanity/lib/queries";

// Result type for search action
export type SearchResult = {
	success: boolean;
	data?: SearchPattern[];
	error?: string;
	totalCount: number;
	searchParams: ParsedSearchParams;
};

export type SearchPattern = {
	_id: string;
	_type: string;
	_score?: number;
	title: string | null;
	description: Array<{
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
	}> | null;
	slug: string | null;
	tags: Array<{
		_id: string;
		title?: string;
	}> | null;
	audiences: Array<{
		_id: string;
		title?: string;
	}> | null;
	themes: Array<{
		_id: string;
		title?: string;
		description?: Array<unknown>;
	}> | null;
	solutions: Array<{
		_id: string;
		title?: string;
		description?: Array<unknown>;
	}> | null;
	resources: Array<{
		_id: string;
		title?: string;
		description?: Array<unknown>;
		solution: Array<{
			_id: string;
			title?: string;
		}> | null;
	}> | null;
};

/**
 * Server action to search patterns with GROQ scoring and filtering
 */
export async function searchPatterns(
	formData: FormData,
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
			page: formData.get("page")?.toString(),
			limit: formData.get("limit")?.toString(),
		};

		logger.search("Raw form data parameters", rawParams, location);

		// Validate and parse parameters
		const validatedParams = searchParamsSchema.parse(rawParams);
		logger.search("Validated parameters", validatedParams, location);
		
		const parsedParams = parseSearchParams(validatedParams);
		logger.search("Parsed parameters", parsedParams, location);

		// Prepare GROQ query parameters - always provide all parameters (empty arrays if no values)
		const queryParams: Record<string, unknown> = {
			audiences: parsedParams.audiences || [],
			themes: parsedParams.themes || [],
			tags: parsedParams.tags || []
		};
		
		logger.search("GROQ query parameters prepared", {
			audiences: queryParams.audiences,
			themes: queryParams.themes,
			tags: queryParams.tags
		}, location);

		// Determine which query to use based on search term
		const hasSearchTerm = parsedParams.searchTerm?.trim();
		logger.search("Has search term", { hasSearchTerm: !!hasSearchTerm, searchTerm: parsedParams.searchTerm }, location);

		let query: string;
		if (hasSearchTerm) {
			query = PATTERN_SEARCH_QUERY;
			// Escape special characters in search term for GROQ
			const escapedSearchTerm = parsedParams.searchTerm
				.trim()
				.replace(/["\\]/g, "\\$&"); // Escape quotes and backslashes
			queryParams.searchTerm = escapedSearchTerm;
			logger.groq("Using PATTERN_SEARCH_QUERY with escaped search term", { original: parsedParams.searchTerm, escaped: escapedSearchTerm }, location);
		} else {
			query = PATTERN_FILTER_QUERY;
			logger.groq("Using PATTERN_FILTER_QUERY (no search term)", undefined, location);
		}

		logger.groq("Final GROQ query parameters", queryParams, location);
		logger.groq("Query type", hasSearchTerm ? "SEARCH" : "FILTER", location);

		// Execute GROQ query
		logger.groq("Executing GROQ query", { queryType: hasSearchTerm ? "SEARCH" : "FILTER" }, location);
		const startTime = Date.now();
		const results = await client.fetch(query, queryParams);
		const endTime = Date.now();
		
		logger.groq("GROQ query completed", { 
			resultCount: results.length, 
			executionTime: `${endTime - startTime}ms` 
		}, location);

		logger.searchInfo("Search completed successfully", { resultCount: results.length }, location);

		return {
			success: true,
			data: results,
			totalCount: results.length,
			searchParams: parsedParams,
		};
	} catch (error) {
		logger.searchError("Search operation failed", error, location);
		logger.error("server", "Search error details", {
			errorType: typeof error,
			errorConstructor: error?.constructor?.name,
			isError: error instanceof Error,
			isNull: error === null
		}, location);

		// More detailed error logging
		if (error instanceof Error) {
			logger.searchError("Error details", {
				message: error.message,
				stack: error.stack,
				name: error.name
			}, location);
		} else if (error === null) {
			logger.searchError("Null error - likely GROQ syntax issue", undefined, location);
		} else {
			logger.searchError("Unknown error type", {
				type: typeof error,
				value: error
			}, location);
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
): Promise<SearchResult> {
	const location = createLogLocation("search.ts", "searchPatternsWithParams");
	
	try {
		logger.searchInfo("Converting URLSearchParams to FormData", 
			Object.fromEntries(searchParams.entries()), location);
			
		const formData = new FormData();

		// Convert URLSearchParams to FormData
		for (const [key, value] of searchParams) {
			formData.append(key, value);
		}

		logger.search("Delegating to searchPatterns", undefined, location);
		return await searchPatterns(formData);
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
