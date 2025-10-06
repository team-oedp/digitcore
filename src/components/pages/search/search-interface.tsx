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
import { useOnboardingStore } from "~/stores/onboarding";
import { EnhanceToggle } from "./enhance-toggle";

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

	// Get onboarding preferences for enhance toggle - use individual selectors to avoid object recreation
	const selectedAudienceIds = useOnboardingStore(
		(state) => state.selectedAudienceIds,
	);
	const selectedThemeIds = useOnboardingStore(
		(state) => state.selectedThemeIds,
	);
	const hasCompletedOnboarding = useOnboardingStore(
		(state) => state.hasCompletedOnboarding,
	);

	const onboardingPreferences = {
		selectedAudienceIds,
		selectedThemeIds,
		hasCompletedOnboarding,
	};

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
					q: searchParams?.get("q") ?? undefined,
					audiences: searchParams?.get("audiences") ?? undefined,
					themes: searchParams?.get("themes") ?? undefined,
					tags: searchParams?.get("tags") ?? undefined,
					enhance: searchParams?.get("enhance") ?? undefined,
					page: searchParams?.get("page") ?? undefined,
					limit: searchParams?.get("limit") ?? undefined,
				}),
			);
		} catch (error) {
			console.error("Error parsing search params:", error);
			// Fall back to default params if parsing fails
			return parseSearchParams({ page: 1, limit: 20 });
		}
	}, [searchParams]);

	// Check if user has preferences from onboarding
	const hasPreferences =
		onboardingPreferences.hasCompletedOnboarding &&
		(onboardingPreferences.selectedAudienceIds.length > 0 ||
			onboardingPreferences.selectedThemeIds.length > 0);

	// Get enhance state from URL, default to true if preferences exist and no URL parameter
	const enhanceEnabled =
		currentParams.enhance !== undefined
			? currentParams.enhance
			: hasPreferences;

	// Helper functions to get preference labels for hover text
	const getAudienceLabels = (ids: string[]) =>
		ids
			.map((id) => audienceOptions.find((opt) => opt.value === id)?.label)
			.filter(Boolean) as string[];

	const getThemeLabels = (ids: string[]) =>
		ids
			.map((id) => themeOptions.find((opt) => opt.value === id)?.label)
			.filter(Boolean) as string[];

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

			if (newUrl) router.push(newUrl);
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

	// Handle enhance toggle changes
	const handleEnhanceToggle = useCallback(
		(enabled: boolean) => {
			updateSearchParams({ enhance: enabled });
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
							placeholder="Search patterns, solutions, resources..."
							className="h-8 rounded-none border-0 border-neutral-300 border-b bg-transparent px-0 py-1 pr-16 text-foreground text-sm shadow-none placeholder:text-muted-foreground focus-visible:border-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:border-neutral-700 dark:bg-transparent dark:focus-visible:border-neutral-500"
						/>
						{searchTerm && (
							<button
								onClick={() => handleSearchChange("")}
								type="button"
								className="absolute right-0 cursor-pointer text-muted-foreground text-sm transition-colors hover:text-foreground"
								title="Clear search"
							>
								Clear
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Enhance Toggle */}
			<EnhanceToggle
				enabled={enhanceEnabled}
				onToggle={handleEnhanceToggle}
				audiencePreferences={getAudienceLabels(
					onboardingPreferences.selectedAudienceIds,
				)}
				themePreferences={getThemeLabels(
					onboardingPreferences.selectedThemeIds,
				)}
			/>

			{/* Filter Tools */}
			<div className="flex w-full max-w-4xl flex-col gap-3 p-0.5 md:flex-row">
				{/* Audience Multiselect */}
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-primary text-xs">Audiences</div>
					<MultiSelect
						values={optimisticAudiences}
						onValuesChange={handleAudienceChange}
					>
						<MultiSelectTrigger className="h-[34px] w-full gap-2 rounded-lg bg-transparent text-[14px] text-primary shadow-none hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent">
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
						<MultiSelectTrigger className="h-[34px] w-full gap-2 rounded-lg bg-transparent text-[14px] text-primary shadow-none hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent">
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
						<MultiSelectTrigger className="h-[34px] w-full gap-2 rounded-lg bg-transparent text-[14px] text-primary shadow-none hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent">
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
