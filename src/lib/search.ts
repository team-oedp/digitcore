/**
 * Search functionality for patterns, solutions, and resources
 */

import { z } from "zod";

// Search parameters schema for validation and URL parsing
export const searchParamsSchema = z.object({
	// Search query string
	q: z.string().optional(),
	// Filter arrays - will be comma-separated in URL
	audiences: z.string().optional(),
	themes: z.string().optional(),
	tags: z.string().optional(),
	// Pagination (for future use)
	page: z.coerce.number().min(1).optional().default(1),
	limit: z.coerce.number().min(1).max(100).optional().default(20),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

// Parsed search parameters for internal use
export interface ParsedSearchParams {
	searchTerm: string;
	audiences: string[];
	themes: string[];
	tags: string[];
	page: number;
	limit: number;
}

// Utility to parse URL search params into arrays
export function parseSearchParams(
	searchParams: SearchParams,
): ParsedSearchParams {
	return {
		searchTerm: searchParams.q?.trim() || "",
		audiences: searchParams.audiences
			? searchParams.audiences.split(",").filter(Boolean)
			: [],
		themes: searchParams.themes
			? searchParams.themes.split(",").filter(Boolean)
			: [],
		tags: searchParams.tags ? searchParams.tags.split(",").filter(Boolean) : [],
		page: searchParams.page || 1,
		limit: searchParams.limit || 20,
	};
}

// Utility to serialize search params to URL
export function serializeSearchParams(
	params: Partial<ParsedSearchParams>,
): URLSearchParams {
	const urlParams = new URLSearchParams();

	if (params.searchTerm) {
		urlParams.set("q", params.searchTerm);
	}

	if (params.audiences && params.audiences.length > 0) {
		urlParams.set("audiences", params.audiences.join(","));
	}

	if (params.themes && params.themes.length > 0) {
		urlParams.set("themes", params.themes.join(","));
	}

	if (params.tags && params.tags.length > 0) {
		urlParams.set("tags", params.tags.join(","));
	}

	if (params.page && params.page > 1) {
		urlParams.set("page", params.page.toString());
	}

	if (params.limit && params.limit !== 20) {
		urlParams.set("limit", params.limit.toString());
	}

	return urlParams;
}

// Default empty search state
export const defaultSearchParams: ParsedSearchParams = {
	searchTerm: "",
	audiences: [],
	themes: [],
	tags: [],
	page: 1,
	limit: 20,
};
