"use server";

import { type Language, i18n } from "~/i18n/config";
import { createLogLocation, logger } from "~/lib/logger";
import { client } from "~/sanity/lib/client";
import { FILTER_OPTIONS_QUERY } from "~/sanity/lib/queries";

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
	const location = createLogLocation("filter-options.ts", "fetchFilterOptions");

	try {
		logger.searchInfo(
			"Fetching filter options from Sanity",
			undefined,
			location,
		);

		const startTime = Date.now();
		const response = await client.fetch(FILTER_OPTIONS_QUERY, { language });
		const endTime = Date.now();

		// Extract data from Sanity client response
		// Handle both direct response (production) and { result: data } format (testing)
		const responseAsAny = response as SanityResponse<typeof response>;
		const data =
			"result" in responseAsAny && responseAsAny.result !== undefined
				? responseAsAny.result
				: response;

		logger.groq(
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

		// Provide default options if fetch fails and filter out null labels
		const audiences = (data?.audiences || [])
			.filter((item: SanityFilterOption) => item.label !== null)
			.map((item: SanityFilterOption) => ({
				value: item.value,
				label: item.label as string,
			}));
		const themes = (data?.themes || [])
			.filter((item: SanityFilterOption) => item.label !== null)
			.map((item: SanityFilterOption) => ({
				value: item.value,
				label: item.label as string,
			}));
		const tags = (data?.tags || [])
			.filter((item: SanityFilterOption) => item.label !== null)
			.map((item: SanityFilterOption) => ({
				value: item.value,
				label: item.label as string,
			}));

		const result = { audiences, themes, tags };

		logger.searchInfo(
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
		logger.searchError("Failed to fetch filter options", error, location);

		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to fetch filter options",
		};
	}
}
