"use server";

import { createLogLocation, logger } from "~/lib/logger";
import { client } from "~/sanity/lib/client";
import { FILTER_OPTIONS_QUERY } from "~/sanity/lib/filter-options";

export type FilterOption = {
	value: string;
	label: string;
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
export async function fetchFilterOptions(): Promise<FilterOptionsResult> {
	const location = createLogLocation("filter-options.ts", "fetchFilterOptions");

	try {
		logger.searchInfo(
			"Fetching filter options from Sanity",
			undefined,
			location,
		);

		const startTime = Date.now();
		const data = await client.fetch(FILTER_OPTIONS_QUERY);
		const endTime = Date.now();

		logger.groq(
			"Filter options query completed",
			{
				executionTime: `${endTime - startTime}ms`,
				dataReceived: !!data,
			},
			location,
		);

		// Provide default options if fetch fails and filter out null labels
		const audiences = (data?.audiences || []).filter(
			(item): item is typeof item & { label: string } => item.label !== null,
		);
		const themes = (data?.themes || []).filter(
			(item): item is typeof item & { label: string } => item.label !== null,
		);
		const tags = (data?.tags || []).filter(
			(item): item is typeof item & { label: string } => item.label !== null,
		);

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
