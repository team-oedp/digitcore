"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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
import {
	type ParsedSearchParams,
	parseSearchParams,
	searchParamsSchema,
	serializeSearchParams,
} from "~/lib/search";

interface FilterOption {
	value: string;
	label: string;
}

interface SearchInterfaceProps {
	audienceOptions?: FilterOption[];
	themeOptions?: FilterOption[];
	tagOptions?: FilterOption[];
}

// Remove once not needed for early development stages
// Default options for development/fallback
const defaultAudienceOptions = [
	{ value: "researchers", label: "Researchers" },
	{ value: "open-source-technologists", label: "Open source technologists" },
	{ value: "community-leaders", label: "Community leaders" },
	{ value: "policy-makers", label: "Policy makers" },
];

const defaultThemeOptions = [
	{
		value: "frontline-communities",
		label: "Ensuring benefit to frontline communities",
	},
	{ value: "data-sovereignty", label: "Data sovereignty" },
	{ value: "community-engagement", label: "Community engagement" },
	{ value: "ethical-technology", label: "Ethical technology" },
];

const defaultTagOptions = [
	{ value: "tools", label: "Tools" },
	{ value: "strategy", label: "Strategy" },
	{ value: "workflow", label: "Workflow" },
	{ value: "data", label: "Data" },
	{ value: "communication", label: "Communication" },
	{ value: "assessment", label: "Assessment" },
];

export function SearchInterface({
	audienceOptions = defaultAudienceOptions,
	themeOptions = defaultThemeOptions,
	tagOptions = defaultTagOptions,
}: SearchInterfaceProps = {}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Parse current URL parameters - this is our single source of truth
	let currentParams: ParsedSearchParams;
	try {
		currentParams = parseSearchParams(
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
		currentParams = parseSearchParams({ page: 1, limit: 20 });
	}

	// Use local state for the search input to prevent controlled component performance issues
	const [localSearchValue, setLocalSearchValue] = useState(
		currentParams.searchTerm || "",
	);

	// Keep local state in sync with URL params when they change externally
	useEffect(() => {
		setLocalSearchValue(currentParams.searchTerm || "");
	}, [currentParams.searchTerm]);

	// Use a ref to always have access to the latest params without causing re-renders
	const currentParamsRef = useRef(currentParams);
	currentParamsRef.current = currentParams;

	// Update URL with new search parameters
	const updateSearchParams = useCallback(
		(updates: Partial<ParsedSearchParams>) => {
			const newParams = { ...currentParamsRef.current, ...updates };
			const urlParams = serializeSearchParams(newParams);
			const newUrl = urlParams.toString()
				? `${pathname}?${urlParams.toString()}`
				: pathname;
			router.push(newUrl);
		},
		[pathname, router],
	);

	// Debounced function to update URL params
	const debouncedSearchChange = useDebouncedCallback((value: string) => {
		updateSearchParams({ searchTerm: value });
	}, 300);

	// Handle search input changes
	const handleSearchChange = useCallback(
		(value: string) => {
			setLocalSearchValue(value);
			debouncedSearchChange(value);
		},
		[debouncedSearchChange],
	);

	// Handle audience filter changes
	const handleAudienceChange = useCallback(
		(audiences: string[]) => {
			updateSearchParams({ audiences });
		},
		[updateSearchParams],
	);

	// Handle theme filter changes
	const handleThemeChange = useCallback(
		(themes: string[]) => {
			updateSearchParams({ themes });
		},
		[updateSearchParams],
	);

	// Handle tags filter changes
	const handleTagsChange = useCallback(
		(tags: string[]) => {
			updateSearchParams({ tags });
		},
		[updateSearchParams],
	);

	// Handle Enter key for search
	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			// Search is already triggered by URL change, but we could add analytics here
			console.log("Search triggered by Enter key");
		}
	}, []);

	return (
		<div className="flex flex-col gap-4">
			{/* Search Input */}
			<div className="relative w-full">
				<div className="flex w-full items-center justify-start px-0 py-3">
					<div className="relative flex flex-1 items-center justify-start gap-2 p-0">
						<Input
							type="text"
							value={localSearchValue}
							onChange={(e) => handleSearchChange(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Start typing to search patterns, solutions, and resources..."
							className="h-8 rounded-none border-0 border-zinc-300 border-b bg-transparent px-0 py-1 pr-16 text-sm text-zinc-500 shadow-none placeholder:text-zinc-500 focus-visible:border-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
						{localSearchValue && (
							<button
								onClick={() => handleSearchChange("")}
								type="button"
								className="absolute right-0 cursor-pointer text-sm text-zinc-400 transition-colors hover:text-zinc-600"
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
						values={currentParams.audiences}
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
						values={currentParams.themes}
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
						values={currentParams.tags}
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
