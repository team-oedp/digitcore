"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import MultipleSelector, { type Option } from "~/components/ui/multiselect";

type SearchFilters = {
	audience: string[];
	theme: string[];
	tags: string[];
};

const audienceOptions: Option[] = [
	{ value: "researchers", label: "Researchers" },
	{ value: "open-source-technologists", label: "Open source technologists" },
	{ value: "community-leaders", label: "Community leaders" },
	{ value: "policy-makers", label: "Policy makers" },
];

const themeOptions: Option[] = [
	{
		value: "frontline-communities",
		label: "Ensuring benefit to frontline communities",
	},
	{ value: "data-sovereignty", label: "Data sovereignty" },
	{ value: "community-engagement", label: "Community engagement" },
	{ value: "ethical-technology", label: "Ethical technology" },
];

const tagOptions: Option[] = [
	{ value: "tools", label: "Tools" },
	{ value: "strategy", label: "Strategy" },
	{ value: "workflow", label: "Workflow" },
	{ value: "data", label: "Data" },
	{ value: "communication", label: "Communication" },
	{ value: "assessment", label: "Assessment" },
];

export function SearchInterface() {
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<SearchFilters>({
		audience: [],
		theme: [],
		tags: [],
	});

	const handleSearch = () => {
		console.log("Searching for:", searchQuery, "with filters:", filters);
		// TODO: Implement actual search functionality
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Search Input */}
			<div className="relative w-full">
				<div className="flex w-full items-center justify-start px-0 py-3">
					<div className="relative flex flex-1 items-center justify-start gap-2 p-0">
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Start typing to search"
							className="h-8 rounded-none border-0 border-zinc-300 border-b bg-transparent px-0 py-1 pr-16 text-sm text-zinc-500 shadow-none placeholder:text-zinc-500 focus-visible:border-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
						<button
							onClick={handleSearch}
							type="button"
							className="absolute right-0 cursor-pointer text-primary text-sm transition-colors hover:text-primary/50"
						>
							Search
						</button>
					</div>
				</div>
			</div>

			{/* Filter Tools */}
			<div className="flex w-full max-w-4xl gap-3 p-0.5">
				{/* Audience Multiselect */}
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-primary text-xs">Audiences</div>
					<MultipleSelector
						value={filters.audience.map(
							(value) =>
								audienceOptions.find((opt) => opt.value === value) || {
									value,
									label: value,
								},
						)}
						onChange={(selected) => {
							setFilters((prev) => ({
								...prev,
								audience: selected.map((opt) => opt.value),
							}));
						}}
						defaultOptions={audienceOptions}
						placeholder="Select audiences"
						className="h-[34px] w-full gap-2 rounded-lg text-[14px] text-primary shadow-none"
						emptyIndicator="No options found."
						hidePlaceholderWhenSelected
					/>
				</div>

				{/* Theme Multiselect */}
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-primary text-xs">Themes</div>
					<MultipleSelector
						value={filters.theme.map(
							(value) =>
								themeOptions.find((opt) => opt.value === value) || {
									value,
									label: value,
								},
						)}
						onChange={(selected) => {
							setFilters((prev) => ({
								...prev,
								theme: selected.map((opt) => opt.value),
							}));
						}}
						defaultOptions={themeOptions}
						placeholder="Select themes"
						className="h-[34px] w-full gap-2 rounded-lg text-[14px] text-primary shadow-none"
						emptyIndicator="No options found."
						hidePlaceholderWhenSelected
					/>
				</div>

				{/* Tags Multiselect */}
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-primary text-xs">Tags</div>
					<MultipleSelector
						value={filters.tags.map(
							(value) =>
								tagOptions.find((opt) => opt.value === value) || {
									value,
									label: value,
								},
						)}
						onChange={(selected) => {
							setFilters((prev) => ({
								...prev,
								tags: selected.map((opt) => opt.value),
							}));
						}}
						defaultOptions={tagOptions}
						placeholder="Select tags"
						className="h-[34px] w-full gap-2 rounded-lg text-[14px] text-primary shadow-none"
						emptyIndicator="No options found."
						hidePlaceholderWhenSelected
					/>
				</div>
			</div>
		</div>
	);
}
