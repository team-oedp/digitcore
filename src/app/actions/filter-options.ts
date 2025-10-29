"use server";

import { type Language, i18n } from "~/i18n/config";
import { createLogLocation, logger } from "~/lib/logger";
import { client } from "~/sanity/lib/client";
import { FILTER_OPTIONS_QUERY } from "~/sanity/lib/filter-options";

// Type for handling both direct response and test response formats
type SanityResponse<T> = T | { result: T; ms: number };

export type FilterOption = {
	value: string;
	label: string;
};

export type SanityFilterOption = {
	_id: string;
	title: string | null;
	value: string;
	label: string | null;
};

export type FilterOptionsResult = {
	success: boolean;
	data?: {
		audiences: FilterOption[];
		themes: FilterOption[];
		tags: FilterOption[];
	};
	error?: string;
};

/**
 * Server action to fetch filter options from Sanity
 */
export async function fetchFilterOptions(
	language: Language = i18n.base,
): Promise<FilterOptionsResult> {
	// Use logger methods (tests mock the module's exports directly)
	const searchInfo = logger.searchInfo;
	const groq = logger.groq;
	const searchError = logger.searchError;
	const location = createLogLocation("filter-options.ts", "fetchFilterOptions");

	try {
		searchInfo("Fetching filter options from Sanity", undefined, location);

		const startTime = Date.now();
		const response = await client.fetch(FILTER_OPTIONS_QUERY, { language });
		const endTime = Date.now();

		// Temporary debug to understand test environment behavior

		// Extract data from Sanity client response
		// Handle both direct response (production) and { result: data } format (testing)
		const wrapper = response as SanityResponse<unknown> | undefined;
		const isWrapped =
			!!wrapper &&
			typeof wrapper === "object" &&
			"result" in (wrapper as Record<string, unknown>);
		const dataUnknown = isWrapped
			? (wrapper as { result: unknown }).result
			: (response as unknown);

		type Buckets =
			| {
					audiences?: SanityFilterOption[] | null;
					themes?: SanityFilterOption[] | null;
					tags?: SanityFilterOption[] | null;
			  }
			| null
			| undefined;
		const data = dataUnknown as Buckets;

		groq(
			"Filter options query completed",
			{
				executionTime: `${endTime - startTime}ms`,
				dataReceived: !!(
					data &&
					typeof data === "object" &&
					(data.audiences || data.themes || data.tags)
				),
			},
			location,
		);

		// Normalize and filter out null labels
		function normalize(xs: SanityFilterOption[] | null | undefined) {
			const arr = Array.isArray(xs) ? xs : [];
			return arr
				.filter((item) => item?.label !== null)
				.map((item) => ({ value: item.value, label: String(item.label) }));
		}

		const audiences = normalize(data?.audiences);
		const themes = normalize(data?.themes);
		const tags = normalize(data?.tags);

		const result = { audiences, themes, tags };

		searchInfo(
			"Filter options processed successfully",
			{
				audienceCount: audiences.length,
				themeCount: themes.length,
				tagCount: tags.length,
			},
			location,
		);

		return {
			success: true,
			data: result,
		};
	} catch (error) {
		searchError("Failed to fetch filter options", error, location);

		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to fetch filter options",
		};
	}
}
