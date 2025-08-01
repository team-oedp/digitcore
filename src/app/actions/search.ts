"use server";

import type { ParsedSearchParams } from "~/lib/search";
import { parseSearchParams, searchParamsSchema } from "~/lib/search";
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
	_type: "pattern";
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
	try {
		// Extract search parameters from form data
		const rawParams = {
			q: formData.get("q")?.toString(),
			audiences: formData.get("audiences")?.toString(),
			themes: formData.get("themes")?.toString(),
			tags: formData.get("tags")?.toString(),
			page: formData.get("page")?.toString(),
			limit: formData.get("limit")?.toString(),
		};

		// Validate and parse parameters
		const validatedParams = searchParamsSchema.parse(rawParams);
		const parsedParams = parseSearchParams(validatedParams);

		// Prepare GROQ query parameters - ensure arrays are always provided
		const queryParams: Record<string, unknown> = {
			audiences: parsedParams.audiences || [],
			themes: parsedParams.themes || [],
			tags: parsedParams.tags || [],
		};

		// Determine which query to use based on search term
		const hasSearchTerm = parsedParams.searchTerm?.trim();

		let query: string;
		if (hasSearchTerm) {
			query = PATTERN_SEARCH_QUERY;
			// Escape special characters in search term for GROQ
			const escapedSearchTerm = parsedParams.searchTerm
				.trim()
				.replace(/["\\]/g, "\\$&"); // Escape quotes and backslashes
			queryParams.searchTerm = escapedSearchTerm;
		} else {
			query = PATTERN_FILTER_QUERY;
		}

		console.log("Using query:", hasSearchTerm ? "SEARCH" : "FILTER");
		console.log("Search query params:", queryParams);

		// Execute GROQ query
		const results = await client.fetch(query, queryParams);

		console.log(`Search completed: ${results.length} results found`);

		return {
			success: true,
			data: results,
			totalCount: results.length,
			searchParams: parsedParams,
		};
	} catch (error) {
		console.error("Search error:", error);
		console.error("Error type:", typeof error);
		console.error("Error constructor:", error?.constructor?.name);

		// More detailed error logging
		if (error instanceof Error) {
			console.error("Error message:", error.message);
			console.error("Error stack:", error.stack);
		} else if (error === null) {
			console.error("Error is null - this might be a GROQ syntax issue");
		} else {
			console.error("Unknown error type:", typeof error, error);
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
	try {
		const formData = new FormData();

		// Convert URLSearchParams to FormData
		for (const [key, value] of searchParams) {
			formData.append(key, value);
		}

		return await searchPatterns(formData);
	} catch (error) {
		console.error("Search with params error:", error);

		return {
			success: false,
			error: error instanceof Error ? error.message : "Search failed",
			totalCount: 0,
			searchParams: parseSearchParams({ page: 1, limit: 20 }),
		};
	}
}
