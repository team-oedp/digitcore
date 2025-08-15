"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
	type SearchResult,
	searchPatternsWithParams,
} from "~/app/actions/search";
import { createLogLocation, logger } from "~/lib/logger";
import { parseSearchParams, searchParamsSchema } from "~/lib/search";
import { SearchResultsSkeleton } from "./search-result-skeleton";
import { SearchResults } from "./search-results";
import { SearchResultsHeaderClient } from "./search-results-header-client";

export function SearchClientWrapper() {
	const location = createLogLocation(
		"search-client-wrapper.tsx",
		"SearchClientWrapper",
	);
	const searchParams = useSearchParams();
	const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [searchId] = useState(() => Math.random().toString(36).substring(7));
	const abortControllerRef = useRef<AbortController | null>(null);
	const lastSearchParamsRef = useRef<string>("");

	logger.debug("client", "SearchClientWrapper mounted", { searchId }, location);

	useEffect(() => {
		const performSearch = async () => {
			// Create a string representation of search params for deduplication
			const currentSearchString = searchParams.toString();

			// Prevent duplicate searches for the same parameters
			if (currentSearchString === lastSearchParamsRef.current) {
				logger.debug(
					"client",
					"Skipping duplicate search",
					{ searchId, currentSearchString },
					location,
				);
				return;
			}

			// Parse parameters to check if we have any search criteria
			const rawParams = {
				q: searchParams.get("q") ?? undefined,
				audiences: searchParams.get("audiences") ?? undefined,
				themes: searchParams.get("themes") ?? undefined,
				tags: searchParams.get("tags") ?? undefined,
				page: searchParams.get("page") ?? undefined,
				limit: searchParams.get("limit") ?? undefined,
			};

			const validatedParams = searchParamsSchema.parse(rawParams);
			const parsedParams = parseSearchParams(validatedParams);

			// Check if we have any actual search criteria
			const hasSearchTerm = parsedParams.searchTerm?.trim();
			const hasFilters =
				parsedParams.audiences.length > 0 ||
				parsedParams.themes.length > 0 ||
				parsedParams.tags.length > 0;

			// If no search criteria, don't search - just show empty state
			if (!hasSearchTerm && !hasFilters) {
				logger.debug(
					"client",
					"No search criteria - showing empty state",
					{ searchId },
					location,
				);
				lastSearchParamsRef.current = currentSearchString;
				setSearchResult(null);
				setIsLoading(false);
				return;
			}

			// Cancel any ongoing search
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
				logger.debug(
					"client",
					"Aborted previous search",
					{ searchId },
					location,
				);
			}

			// Create new abort controller for this search
			abortControllerRef.current = new AbortController();
			lastSearchParamsRef.current = currentSearchString;

			logger.debug(
				"client",
				"Starting client-side search",
				{
					searchId,
					searchParams: currentSearchString,
					hasSearchTerm: !!hasSearchTerm,
					hasFilters,
				},
				location,
			);
			setIsLoading(true);

			try {
				logger.debug("client", "Raw URL search params", rawParams, location);
				logger.debug(
					"client",
					"Validated search params",
					validatedParams,
					location,
				);
				logger.debug("client", "Parsed search params", parsedParams, location);

				// Create URLSearchParams for the server action
				const urlSearchParams = new URLSearchParams();
				if (parsedParams.searchTerm) {
					urlSearchParams.set("q", parsedParams.searchTerm);
					logger.debug(
						"client",
						"Added search term",
						parsedParams.searchTerm,
						location,
					);
				}
				if (parsedParams.audiences.length > 0) {
					urlSearchParams.set("audiences", parsedParams.audiences.join(","));
					logger.debug(
						"client",
						"Added audiences",
						parsedParams.audiences,
						location,
					);
				}
				if (parsedParams.themes.length > 0) {
					urlSearchParams.set("themes", parsedParams.themes.join(","));
					logger.debug("client", "Added themes", parsedParams.themes, location);
				}
				if (parsedParams.tags.length > 0) {
					urlSearchParams.set("tags", parsedParams.tags.join(","));
					logger.debug("client", "Added tags", parsedParams.tags, location);
				}

				logger.debug(
					"client",
					"Calling server action with URLSearchParams",
					Object.fromEntries(urlSearchParams.entries()),
					location,
				);

				// Execute search
				const startTime = Date.now();
				const result = await searchPatternsWithParams(urlSearchParams);
				const endTime = Date.now();

				logger.info(
					"client",
					"Search completed",
					{
						success: result.success,
						resultCount: result.totalCount,
						executionTime: `${endTime - startTime}ms`,
						error: result.error,
					},
					location,
				);

				setSearchResult(result);
			} catch (error) {
				// Don't log errors for aborted requests
				if (error instanceof Error && error.name === "AbortError") {
					logger.debug("client", "Search was aborted", { searchId }, location);
					return;
				}

				logger.error("client", "Client-side search error", error, location);
				setSearchResult({
					success: false,
					error: "Search failed",
					totalCount: 0,
					searchParams: parseSearchParams({ page: 1, limit: 20 }),
				});
			} finally {
				setIsLoading(false);
				abortControllerRef.current = null;
				logger.debug(
					"client",
					"Search loading state set to false",
					{ searchId },
					location,
				);
			}
		};

		performSearch();
	}, [searchParams, location, searchId]);

	// Cleanup effect to abort ongoing requests when component unmounts
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
				logger.debug(
					"client",
					"SearchClientWrapper unmounted - aborting search",
					{ searchId },
					location,
				);
			}
		};
	}, [location, searchId]);

	// Check current search criteria from URL
	const currentSearchTerm = searchParams.get("q")?.trim() || "";
	const currentAudiences =
		searchParams.get("audiences")?.split(",").filter(Boolean) || [];
	const currentThemes =
		searchParams.get("themes")?.split(",").filter(Boolean) || [];
	const currentTags =
		searchParams.get("tags")?.split(",").filter(Boolean) || [];

	const hasSearchCriteria =
		!!currentSearchTerm ||
		currentAudiences.length > 0 ||
		currentThemes.length > 0 ||
		currentTags.length > 0;

	// Extract search term for display from results
	const searchTerm = searchResult?.searchParams?.searchTerm;
	const hasActiveFilters =
		(searchResult?.searchParams?.audiences?.length ?? 0) > 0 ||
		(searchResult?.searchParams?.themes?.length ?? 0) > 0 ||
		(searchResult?.searchParams?.tags?.length ?? 0) > 0;

	return (
		<div className="space-y-6">
			<SearchResultsHeaderClient
				resultCount={searchResult?.totalCount || 0}
				isLoading={isLoading && hasSearchCriteria}
			/>

			{!hasSearchCriteria ? (
				// No search criteria - show empty state instead of loading
				<div className="py-12 text-left">
					<p className="mb-2 text-zinc-500">Start your search</p>
					<p className="text-base text-zinc-400">
						Enter a search term or select filters to find patterns
					</p>
				</div>
			) : isLoading ? (
				<SearchResultsSkeleton count={6} />
			) : !searchResult?.success ? (
				<div className="py-12 text-center">
					<p className="mb-2 text-red-600">Search Error</p>
					<p className="text-base text-zinc-500">{searchResult?.error}</p>
				</div>
			) : searchResult.totalCount === 0 ? (
				<div className="py-12 text-center">
					<p className="mb-2 text-zinc-500">No results found</p>
					<p className="text-base text-zinc-400">
						Try adjusting your search terms or filters
					</p>
				</div>
			) : (
				<SearchResults
					patterns={searchResult.data || []}
					searchTerm={currentSearchTerm}
				/>
			)}
		</div>
	);
}
