"use client";

import { defineQuery } from "next-sanity";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { client } from "~/sanity/lib/client";
import {
	PATTERNS_STALENESS_CHECK_QUERY,
	type PatternStalenessResult,
} from "~/sanity/lib/queries";
import type { PATTERN_QUERYResult, Pattern } from "~/sanity/sanity.types";
import { useCarrierBagStore } from "~/stores/carrier-bag";

// Constants
const STALENESS_CHECK_DEBOUNCE_MS = 500;
const MAX_RETRY_ATTEMPTS = 2;

// Query to fetch a full pattern by ID for refreshing stale content
const PATTERN_BY_ID_QUERY = defineQuery(`
  *[_type == "pattern" && _id == $patternId][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    description,
    "slug": slug.current,
    tags[]->{...},
    audiences[]->{...},
    theme->{...},
    solutions[]->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      description,
      audiences[]->{ _id, title }
    },
    resources[]->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      description,
      links,
      solutions[]->{...},
    },
  }
`);

// Helper function to convert query result to Pattern type
// The carrier bag already works with populated patterns, so we'll use the query result as-is
// with a type assertion since the structures are compatible for our use case
const convertQueryResultToPattern = (
	queryResult: PATTERN_QUERYResult,
): Pattern => {
	return queryResult as unknown as Pattern;
};

type StaleContentResult = {
	isCheckingStale: boolean;
	checkForStaleContent: () => Promise<void>;
	lastChecked: Date | null;
};

export const useStaleContentCheck = (): StaleContentResult => {
	const {
		items,
		setStalePatternIds,
		markPatternFresh,
		updatePattern,
		addUpdatingPattern,
		removeUpdatingPattern,
	} = useCarrierBagStore();
	const stalePatternIds = useCarrierBagStore((state) => state.stalePatternIds);

	const [isCheckingStale, setIsCheckingStale] = useState(false);
	const [lastChecked, setLastChecked] = useState<Date | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	// Create stable dependency for pattern IDs to prevent excessive API calls
	const patternIdsKey = useMemo(
		() =>
			items
				.map((item) => item.pattern._id)
				.sort()
				.join(","),
		[items],
	);

	const checkForStaleContent = useCallback(
		async (retryCount = 0) => {
			if (!items.length) {
				setStalePatternIds([]);
				return;
			}

			// Cancel any existing request
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			// Create new abort controller for this request
			abortControllerRef.current = new AbortController();
			const { signal } = abortControllerRef.current;

			setIsCheckingStale(true);

			try {
				const patternIds = items.map((item) => item.pattern._id);

				const currentVersions: PatternStalenessResult = await client.fetch(
					PATTERNS_STALENESS_CHECK_QUERY,
					{ patternIds },
					{ signal },
				);

				const staleIds: string[] = [];
				const patternsToRefresh: string[] = [];

				for (const item of items) {
					// Skip items without contentVersion (shouldn't happen but defensive)
					if (!item.contentVersion) {
						continue;
					}

					const currentVersion = currentVersions.find(
						(v) => v._id === item.pattern._id,
					);

					if (currentVersion) {
						const currentTime = new Date(currentVersion._updatedAt);
						const storedTime = new Date(item.contentVersion);

						// Only mark as stale if current version is newer
						if (currentTime > storedTime) {
							staleIds.push(item.pattern._id);
							patternsToRefresh.push(item.pattern._id);
						}
					} else {
						// Pattern no longer exists in Sanity - could mark for removal or keep
						console.warn(
							`Pattern ${item.pattern._id} no longer exists in Sanity`,
						);
					}
				}

				if (!signal.aborted) {
					// Set stale patterns temporarily (will be cleared as they're refreshed)
					setStalePatternIds(staleIds);

					// Automatically refresh all stale patterns in the background
					for (const patternId of patternsToRefresh) {
						refreshStalePattern(patternId).catch((error) => {
							console.warn(
								`Failed to auto-refresh pattern ${patternId}:`,
								error,
							);
						});
					}

					setLastChecked(new Date());
				}
			} catch (error: unknown) {
				if (error instanceof Error && error.name === "AbortError") {
					return; // Request was cancelled, ignore
				}

				console.warn("Failed to check content staleness:", error);

				// Retry logic for network failures
				if (retryCount < MAX_RETRY_ATTEMPTS && !signal.aborted) {
					setTimeout(
						() => checkForStaleContent(retryCount + 1),
						1000 * (retryCount + 1),
					);
				} else {
					// Clear stale indicators on persistent failure to avoid confusion
					setStalePatternIds([]);
				}
			} finally {
				if (!abortControllerRef.current?.signal.aborted) {
					setIsCheckingStale(false);
				}
			}
		},
		[items, setStalePatternIds],
	);

	const refreshStalePattern = useCallback(
		async (patternId: string) => {
			// Mark pattern as updating
			addUpdatingPattern(patternId);

			// Ensure minimum display time of 1 second for the updating animation
			const startTime = Date.now();
			const minDisplayTime = 1000; // 1 second

			try {
				// Fetch the full pattern content
				const freshPattern: PATTERN_QUERYResult = await client.fetch(
					PATTERN_BY_ID_QUERY,
					{ patternId },
				);

				if (freshPattern) {
					// Convert query result to Pattern type
					const patternData = convertQueryResultToPattern(freshPattern);
					// Update the pattern content in the store
					updatePattern(patternId, patternData);
					// Remove from stale list since the pattern is now fresh
					const updatedStaleIds = stalePatternIds.filter(
						(id: string) => id !== patternId,
					);
					setStalePatternIds(updatedStaleIds);
				} else {
					console.warn(`Pattern ${patternId} no longer exists in Sanity`);
				}
			} catch (error) {
				console.warn(`Failed to refresh pattern ${patternId}:`, error);
			} finally {
				// Ensure minimum display time before removing updating state
				const elapsed = Date.now() - startTime;
				const remaining = Math.max(0, minDisplayTime - elapsed);

				if (remaining > 0) {
					setTimeout(() => {
						removeUpdatingPattern(patternId);
					}, remaining);
				} else {
					removeUpdatingPattern(patternId);
				}
			}
		},
		[
			updatePattern,
			setStalePatternIds,
			stalePatternIds,
			addUpdatingPattern,
			removeUpdatingPattern,
		],
	);

	// Auto-check when pattern IDs change (not just length)
	useEffect(() => {
		if (patternIdsKey) {
			// Debounce to avoid excessive checks
			const timeoutId = setTimeout(
				checkForStaleContent,
				STALENESS_CHECK_DEBOUNCE_MS,
			);
			return () => clearTimeout(timeoutId);
		}
		// No patterns, clear stale state
		setStalePatternIds([]);
		setLastChecked(null);
	}, [patternIdsKey, checkForStaleContent, setStalePatternIds]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	return {
		isCheckingStale,
		checkForStaleContent,
		lastChecked,
	};
};
