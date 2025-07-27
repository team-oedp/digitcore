"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

type SearchFilters = {
	audience: string[];
	theme: string;
	tags: string[];
	sortBy: string;
};

const audienceOptions = [
	"Researchers",
	"Open source technologists",
	"Community leaders",
	"Policy makers",
];

const themeOptions = [
	"Ensuring benefit to frontline communities",
	"Data sovereignty",
	"Community engagement",
	"Ethical technology",
];

const tagOptions = [
	"Tools",
	"Strategy",
	"Workflow",
	"Data",
	"Communication",
	"Assessment",
];

const sortOptions = [
	{ value: "relevance", label: "Relevance" },
	{ value: "alphabetical", label: "Alphabetical" },
	{ value: "recent", label: "Most Recent" },
	{ value: "popular", label: "Most Popular" },
];

export function SearchInterface() {
	const [searchQuery, setSearchQuery] = useState("");
	const [filters, setFilters] = useState<SearchFilters>({
		audience: ["Researchers", "Open source technologists"],
		theme: "Ensuring benefit to frontline communities",
		tags: ["Tools", "Strategy"],
		sortBy: "None selected",
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
					<div className="flex flex-1 items-center justify-start gap-2 p-0">
						<Input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Start typing to search"
							className="h-8 rounded-none border-0 border-zinc-300 border-b bg-transparent px-0 py-1 text-sm text-zinc-500 shadow-none placeholder:text-zinc-500 focus-visible:border-zinc-300 focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
					</div>
					<div className="flex h-7 items-center justify-start gap-2 p-0">
						<button
							onClick={handleSearch}
							type="button"
							className="cursor-pointer text-sm text-zinc-500 transition-colors hover:text-zinc-700"
						>
							Search
						</button>
					</div>
				</div>
			</div>

			{/* Filter Tools */}
			<div className="flex w-full flex-wrap items-start gap-3 p-[2px]">
				{/* Audience Dropdown */}
				<div className="flex flex-col items-start justify-center gap-3 p-0">
					<Select>
						<SelectTrigger className="h-[34px] w-[255px] gap-2 rounded-md border-0 bg-neutral-50 px-[11px] py-[7px] text-[14px] text-zinc-500">
							<SelectValue placeholder="Audience: Researchers, Open source technologists" />
						</SelectTrigger>
						<SelectContent>
							{audienceOptions.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Theme Dropdown */}
				<Select>
					<SelectTrigger className="h-[34px] w-[255px] max-w-[255px] gap-2 rounded-md border-0 bg-neutral-200 px-2 py-1.5 text-[14px] text-zinc-500">
						<SelectValue placeholder="Theme: Ensuring benefit to frontline communities" />
					</SelectTrigger>
					<SelectContent>
						{themeOptions.map((option) => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Tags Dropdown */}
				<Select>
					<SelectTrigger className="h-[34px] w-[255px] gap-2 rounded-md border-0 bg-neutral-200 px-2 py-1.5 text-[14px] text-zinc-500">
						<SelectValue placeholder="Tags: Tools, Strategy" />
					</SelectTrigger>
					<SelectContent>
						{tagOptions.map((option) => (
							<SelectItem key={option} value={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{/* Sort By Dropdown */}
				<Select>
					<SelectTrigger className="h-[34px] w-[255px] gap-2 rounded-md border-0 bg-neutral-200 px-2 py-1.5 text-[14px] text-zinc-500">
						<SelectValue placeholder="Sort by: None selected" />
					</SelectTrigger>
					<SelectContent>
						{sortOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
