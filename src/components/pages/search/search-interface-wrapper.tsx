"use client";

import { useEffect, useState } from "react";
import {
	type FilterOption,
	fetchFilterOptions,
} from "~/app/actions/filter-options";
import { createLogLocation, logger } from "~/lib/logger";
import { SearchInterface } from "./search-interface";

type FilterOptions = {
	audiences: FilterOption[];
	themes: FilterOption[];
	tags: FilterOption[];
};

export function SearchInterfaceWrapper() {
	const location = createLogLocation(
		"search-interface-wrapper.tsx",
		"SearchInterfaceWrapper",
	);
	const [filterOptions, setFilterOptions] = useState<FilterOptions>({
		audiences: [],
		themes: [],
		tags: [],
	});
	const [isLoading, setIsLoading] = useState(true);
	const [componentId] = useState(() => Math.random().toString(36).substring(7));

	logger.debug(
		"client",
		"SearchInterfaceWrapper mounted",
		{ componentId },
		location,
	);

	useEffect(() => {
		const loadFilterOptions = async () => {
			try {
				logger.debug(
					"client",
					"Calling fetchFilterOptions server action",
					{ componentId },
					location,
				);

				const startTime = Date.now();
				const result = await fetchFilterOptions();
				const endTime = Date.now();

				logger.debug(
					"client",
					"Filter options server action completed",
					{
						componentId,
						executionTime: `${endTime - startTime}ms`,
						success: result.success,
					},
					location,
				);

				if (result.success && result.data) {
					setFilterOptions(result.data);

					logger.debug(
						"client",
						"Filter options loaded successfully",
						{
							componentId,
							audienceCount: result.data.audiences.length,
							themeCount: result.data.themes.length,
							tagCount: result.data.tags.length,
						},
						location,
					);
				} else {
					logger.error(
						"client",
						"Failed to load filter options",
						result.error,
						location,
					);
					// Keep empty arrays as defaults
				}
			} catch (error) {
				logger.error(
					"client",
					"Filter options server action failed",
					error,
					location,
				);
				// Keep empty arrays as defaults
			} finally {
				setIsLoading(false);
			}
		};

		loadFilterOptions();
	}, [componentId, location]);

	// Track component lifecycle
	useEffect(() => {
		return () => {
			logger.debug(
				"client",
				"SearchInterfaceWrapper unmounted",
				{ componentId },
				location,
			);
		};
	}, [componentId, location]);

	if (isLoading) {
		return <div className="h-32 animate-pulse rounded bg-zinc-100" />;
	}

	return (
		<SearchInterface
			audienceOptions={filterOptions.audiences}
			themeOptions={filterOptions.themes}
			tagOptions={filterOptions.tags}
		/>
	);
}

export function SearchInterfaceSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{/* Search Input Skeleton */}
			<div className="relative w-full">
				<div className="flex w-full items-center justify-start px-0 py-3">
					<div className="relative flex flex-1 items-center justify-start gap-2 p-0">
						<div className="h-8 w-full animate-pulse rounded bg-zinc-100" />
					</div>
				</div>
			</div>
			{/* Filter Tools Skeleton */}
			<div className="flex w-full max-w-4xl gap-3 p-0.5">
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-base text-primary">Audiences</div>
					<div className="h-[34px] w-full animate-pulse rounded-lg bg-zinc-100" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-base text-primary">Themes</div>
					<div className="h-[34px] w-full animate-pulse rounded-lg bg-zinc-100" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-base text-primary">Tags</div>
					<div className="h-[34px] w-full animate-pulse rounded-lg bg-zinc-100" />
				</div>
			</div>
		</div>
	);
}
