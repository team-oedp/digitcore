"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "~/components/ui/input";
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectGroup,
	MultiSelectItem,
	MultiSelectTrigger,
	MultiSelectValue,
} from "~/components/ui/multiselect";
import { createLogLocation, logger } from "~/lib/logger";
import {
	type ParsedSearchParams,
	parseSearchParams,
	searchParamsSchema,
	serializeSearchParams,
} from "~/lib/search";

type FilterOption = {
	value: string;
	label: string;
};

type SearchInterfaceProps = {
	audienceOptions?: FilterOption[];
	themeOptions?: FilterOption[];
	tagOptions?: FilterOption[];
};

export function SearchInterface({
	audienceOptions = [],
	themeOptions = [],
	tagOptions = [],
}: SearchInterfaceProps) {
	const location = createLogLocation("search-interface.tsx", "SearchInterface");
	const [componentId] = useState(() => Math.random().toString(36).substring(7));
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	logger.debug(
		"client",
		"SearchInterface initialized",
		{
			componentId,
			audienceCount: audienceOptions.length,
			themeCount: themeOptions.length,
			tagCount: tagOptions.length,
		},
		location,
	);

	// Parse current URL parameters - this is our single source of truth
	const currentParams: ParsedSearchParams = useMemo(() => {
		try {
			return parseSearchParams(
				searchParamsSchema.parse({
					q: searchParams.get("q") ?? undefined,
					audiences: searchParams.get("audiences") ?? undefined,
					themes: searchParams.get("themes") ?? undefined,
					tags: searchParams.get("tags") ?? undefined,
					page: searchParams.get("page") ?? undefined,
					limit: searchParams.get("limit") ?? undefined,
				}),
			);
		} catch (error) {
			console.error("Error parsing search params:", error);
			// Fall back to default params if parsing fails
			return parseSearchParams({ page: 1, limit: 20 });
		}
	}, [searchParams]);

	// Completely isolated search input state - no URL sync
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearchTerm = useDebouncedCallback((value: string) => {
		updateSearchParams({ searchTerm: value });
	}, 300);

	// Initialize search term from URL once when currentParams is available
	const isInitialized = useRef(false);
	useEffect(() => {
		if (!isInitialized.current && currentParams) {
			setSearchTerm(currentParams.searchTerm || "");
			isInitialized.current = true;
		}
	}, [currentParams]); // Fix: use the whole object, not just searchTerm

	// Add optimistic local state for filters
	const [optimisticAudiences, setOptimisticAudiences] = useState<string[]>(
		currentParams.audiences,
	);
	const [optimisticThemes, setOptimisticThemes] = useState<string[]>(
		currentParams.themes,
	);
	const [optimisticTags, setOptimisticTags] = useState<string[]>(
		currentParams.tags,
	);

	// Sync filter states from URL changes
	useEffect(() => {
		setOptimisticAudiences(currentParams.audiences);
	}, [currentParams.audiences]);

	useEffect(() => {
		setOptimisticThemes(currentParams.themes);
	}, [currentParams.themes]);

	useEffect(() => {
		setOptimisticTags(currentParams.tags);
	}, [currentParams.tags]);

	// Use a ref to always have access to the latest params without causing re-renders
	const currentParamsRef = useRef(currentParams);
	currentParamsRef.current = currentParams;

	// Update URL with new search parameters
	const updateSearchParams = useCallback(
		(updates: Partial<ParsedSearchParams>) => {
			logger.debug(
				"client",
				"Updating search parameters",
				{ updates, current: currentParamsRef.current },
				location,
			);

			const newParams = { ...currentParamsRef.current, ...updates };
			const urlParams = serializeSearchParams(newParams);
			const newUrl = urlParams.toString()
				? `${pathname}?${urlParams.toString()}`
				: pathname;

			logger.debug(
				"client",
				"Navigating to new URL",
				{
					newUrl,
					urlParams: urlParams.toString(),
					newParams,
				},
				location,
			);

			router.push(newUrl);
		},
		[pathname, router, location],
	);

	// Handle search input changes
	const handleSearchChange = useCallback(
		(value: string) => {
			setSearchTerm(value);
			debouncedSearchTerm(value);
		},
		[debouncedSearchTerm],
	);

	// Handle audience filter changes with optimistic updates
	const handleAudienceChange = useCallback(
		(audiences: string[]) => {
			setOptimisticAudiences(audiences);
			updateSearchParams({ audiences });
		},
		[updateSearchParams],
	);

	// Handle theme filter changes with optimistic updates
	const handleThemeChange = useCallback(
		(themes: string[]) => {
			setOptimisticThemes(themes);
			updateSearchParams({ themes });
		},
		[updateSearchParams],
	);

	// Handle tags filter changes with optimistic updates
	const handleTagsChange = useCallback(
		(tags: string[]) => {
			setOptimisticTags(tags);
			updateSearchParams({ tags });
		},
		[updateSearchParams],
	);

	// Handle Enter key for search
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter") {
				logger.debug(
					"client",
					"Search triggered by Enter key",
					{ componentId },
					location,
				);
			}
		},
		[componentId, location],
	);

	// Track component lifecycle
	useEffect(() => {
		return () => {
			logger.debug(
				"client",
				"SearchInterface unmounted",
				{ componentId },
				location,
			);
		};
	}, [componentId, location]);

	return (
		<div className="flex flex-col gap-4">
			{/* Search Input */}
			<div className="relative w-full">
				<div className="flex w-full items-center justify-start px-0 py-3">
					<div className="relative flex flex-1 items-center justify-start gap-2 p-0">
						<Input
							type="text"
							value={searchTerm}
							onChange={(e) => handleSearchChange(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Start typing to search patterns, solutions, and resources..."
							className="h-8 rounded-none border-0 border-zinc-300 border-b bg-transparent px-0 py-1 pr-16 text-base text-zinc-500 shadow-none placeholder:text-zinc-500 focus-visible:border-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
						{searchTerm && (
							<button
								onClick={() => handleSearchChange("")}
								type="button"
								className="absolute right-0 cursor-pointer text-base text-zinc-400 transition-colors hover:text-zinc-600"
								title="Clear search"
							>
								Clear
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Filter Tools */}
			<div className="flex w-full max-w-4xl gap-3 p-0.5">
				{/* Audience Multiselect */}
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-primary text-xs">Audiences</div>
					<MultiSelect
						values={optimisticAudiences}
						onValuesChange={handleAudienceChange}
					>
						<MultiSelectTrigger className="h-[34px] w-full gap-2 rounded-lg text-[14px] text-primary shadow-none">
							<MultiSelectValue
								placeholder="Select audiences"
								overflowBehavior="cutoff"
							/>
						</MultiSelectTrigger>
						<MultiSelectContent
							search={{
								placeholder: "Search audiences...",
								emptyMessage: "No audiences found.",
							}}
						>
							<MultiSelectGroup>
								{audienceOptions.map((option) => (
									<MultiSelectItem key={option.value} value={option.value}>
										{option.label}
									</MultiSelectItem>
								))}
							</MultiSelectGroup>
						</MultiSelectContent>
					</MultiSelect>
				</div>

				{/* Theme Multiselect */}
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-primary text-xs">Themes</div>
					<MultiSelect
						values={optimisticThemes}
						onValuesChange={handleThemeChange}
					>
						<MultiSelectTrigger className="h-[34px] w-full gap-2 rounded-lg text-[14px] text-primary shadow-none">
							<MultiSelectValue
								placeholder="Select themes"
								overflowBehavior="cutoff"
							/>
						</MultiSelectTrigger>
						<MultiSelectContent
							search={{
								placeholder: "Search themes...",
								emptyMessage: "No themes found.",
							}}
						>
							<MultiSelectGroup>
								{themeOptions.map((option) => (
									<MultiSelectItem key={option.value} value={option.value}>
										{option.label}
									</MultiSelectItem>
								))}
							</MultiSelectGroup>
						</MultiSelectContent>
					</MultiSelect>
				</div>

				{/* Tags Multiselect */}
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-primary text-xs">Tags</div>
					<MultiSelect
						values={optimisticTags}
						onValuesChange={handleTagsChange}
					>
						<MultiSelectTrigger className="h-[34px] w-full gap-2 rounded-lg text-[14px] text-primary shadow-none">
							<MultiSelectValue
								placeholder="Select tags"
								overflowBehavior="cutoff"
							/>
						</MultiSelectTrigger>
						<MultiSelectContent
							search={{
								placeholder: "Search tags...",
								emptyMessage: "No tags found.",
							}}
						>
							<MultiSelectGroup>
								{tagOptions.map((option) => (
									<MultiSelectItem key={option.value} value={option.value}>
										{option.label}
									</MultiSelectItem>
								))}
							</MultiSelectGroup>
						</MultiSelectContent>
					</MultiSelect>
				</div>
			</div>
		</div>
	);
}
