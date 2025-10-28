"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	type SearchResult,
	searchPatternsWithParams,
	searchPatternsWithPreferences,
} from "~/app/actions/search";
import type { Language } from "~/i18n/config";
import { createLogLocation, logger } from "~/lib/logger";
import { parseSearchParams, searchParamsSchema } from "~/lib/search";
import { useOrientationStore } from "~/stores/orientation";
import { SearchResultsSkeleton } from "./search-result-skeleton";
import { SearchResults } from "./search-results";
import { SearchResultsHeaderClient } from "./search-results-header-client";

type SearchClientWrapperProps = {
	emptyStateMessage?: string;
	language: Language;
};

export function SearchClientWrapper({
	emptyStateMessage,
	language,
}: SearchClientWrapperProps) {
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

	// Get orientation preferences for result boosting - use individual selectors to avoid object recreation
	const selectedAudienceIds = useOrientationStore(
		(state) => state.selectedAudienceIds,
	);
	const selectedThemeIds = useOrientationStore(
		(state) => state.selectedThemeIds,
	);
	const hasCompletedOrientation = useOrientationStore(
		(state) => state.hasCompletedOrientation,
	);

	const orientationPreferences = useMemo(
		() => ({
			selectedAudienceIds,
			selectedThemeIds,
			hasCompletedOrientation,
		}),
		[selectedAudienceIds, selectedThemeIds, hasCompletedOrientation],
	);

	logger.debug("client", "SearchClientWrapper mounted", { searchId }, location);

	const performSearch = useCallback(async () => {
		// Create a string representation of search params for deduplication
		const currentSearchString = searchParams?.toString() ?? "";

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
			q: searchParams?.get("q") ?? undefined,
			audiences: searchParams?.get("audiences") ?? undefined,
			themes: searchParams?.get("themes") ?? undefined,
			tags: searchParams?.get("tags") ?? undefined,
			enhance: searchParams?.get("enhance") ?? undefined,
			page: searchParams?.get("page") ?? undefined,
			limit: searchParams?.get("limit") ?? undefined,
		};

		const validatedParams = searchParamsSchema.parse(rawParams);
		const parsedParams = parseSearchParams(validatedParams);

		// Check if we have any actual search criteria
		const searchTerm = parsedParams.searchTerm?.trim();
		const hasValidSearchTerm = searchTerm && searchTerm.length >= 4;
		const hasFilters =
			parsedParams.audiences.length > 0 ||
			parsedParams.themes.length > 0 ||
			parsedParams.tags.length > 0;

		logger.debug(
			"client",
			"Search criteria validation",
			{
				searchId,
				searchTerm,
				searchTermLength: searchTerm?.length ?? 0,
				hasValidSearchTerm,
				hasFilters,
				requiresMinimumChars: !hasValidSearchTerm && !hasFilters,
			},
			location,
		);

		// If no valid search criteria, don't search - just show empty state
		// Require at least 4 characters for search terms to avoid excessive queries
		if (!hasValidSearchTerm && !hasFilters) {
			logger.debug(
				"client",
				"No valid search criteria - showing empty state (need 4+ chars or filters)",
				{ searchId, searchTerm, searchTermLength: searchTerm?.length ?? 0 },
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
			logger.debug("client", "Aborted previous search", { searchId }, location);
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
				hasValidSearchTerm,
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

			// Execute search - use preferences if enhance is enabled and preferences exist
			const startTime = Date.now();
			const hasPreferences =
				orientationPreferences.hasCompletedOrientation &&
				(orientationPreferences.selectedAudienceIds.length > 0 ||
					orientationPreferences.selectedThemeIds.length > 0);

			const shouldEnhance = parsedParams.enhance && hasPreferences;

			const result = shouldEnhance
				? await searchPatternsWithPreferences(
						urlSearchParams,
						{
							selectedAudienceIds: orientationPreferences.selectedAudienceIds,
							selectedThemeIds: orientationPreferences.selectedThemeIds,
						},
						language,
					)
				: await searchPatternsWithParams(urlSearchParams, language);
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
	}, [searchParams, location, searchId, orientationPreferences, language]);

	useEffect(() => {
		performSearch();
	}, [performSearch]);

	// Note: performSearch is now handled by the main useEffect above

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
	const currentSearchTerm = searchParams?.get("q")?.trim() || "";
	const currentAudiences =
		searchParams?.get("audiences")?.split(",").filter(Boolean) || [];
	const currentThemes =
		searchParams?.get("themes")?.split(",").filter(Boolean) || [];
	const currentTags =
		searchParams?.get("tags")?.split(",").filter(Boolean) || [];

	const hasSearchCriteria =
		!!currentSearchTerm ||
		currentAudiences.length > 0 ||
		currentThemes.length > 0 ||
		currentTags.length > 0;

	// Extract search term for display from results
	const _searchTerm = searchResult?.searchParams?.searchTerm;
	const _hasActiveFilters =
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
				// No search criteria - show blank area
				<div className="py-12" />
			) : isLoading ? (
				<SearchResultsSkeleton count={6} />
			) : searchResult && !searchResult.success ? (
				<div className="py-12 text-left">
					<p className="mb-2 text-base text-prose text-red-800 dark:text-red-200">
						Search Error
					</p>
					<p className="text-base text-muted-foreground text-prose">
						{searchResult.error}
					</p>
				</div>
			) : searchResult && searchResult.totalCount === 0 ? (
				<div className="py-12 text-left">
					{emptyStateMessage ? (
						<p className="text-base text-muted-foreground text-prose">
							{emptyStateMessage}
						</p>
					) : (
						<p className="text-base text-muted-foreground text-prose">
							No results found. Try adjusting your search terms or filters
						</p>
					)}
				</div>
			) : searchResult ? (
				<SearchResults
					patterns={searchResult.data || []}
					searchTerm={currentSearchTerm}
				/>
			) : (
				// searchResult is null, show blank area (blocked searches)
				<div className="py-12" />
			)}
		</div>
	);
}
