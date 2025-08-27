"use client";

import { useSearchParams } from "next/navigation";
import { parseSearchParams, searchParamsSchema } from "~/lib/search";

type SearchResultsHeaderClientProps = {
	resultCount?: number;
	isLoading?: boolean;
};

export function SearchResultsHeaderClient({
	resultCount = 0,
	isLoading = false,
}: SearchResultsHeaderClientProps) {
	const searchParams = useSearchParams();

	// Parse search term from URL
	let searchQuery = "";
	let hasSearchCriteria = false;

	try {
		const rawParams = {
			q: searchParams.get("q") ?? undefined,
			audiences: searchParams.get("audiences") ?? undefined,
			themes: searchParams.get("themes") ?? undefined,
			tags: searchParams.get("tags") ?? undefined,
			page: searchParams.get("page") ?? undefined,
			limit: searchParams.get("limit") ?? undefined,
		};
		const validatedParams = searchParamsSchema.parse(rawParams);
		const parsedParams = parseSearchParams(validatedParams);
		searchQuery = parsedParams.searchTerm || "";

		// Check if we have any search criteria
		hasSearchCriteria =
			!!searchQuery.trim() ||
			parsedParams.audiences.length > 0 ||
			parsedParams.themes.length > 0 ||
			parsedParams.tags.length > 0;
	} catch (error) {
		console.error("Error parsing search params:", error);
	}

	// Don't show anything if no search criteria
	if (!hasSearchCriteria) {
		return null;
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-between">
				<div className="h-6 w-48 animate-pulse rounded bg-zinc-200" />
			</div>
		);
	}

	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<span className="text-zinc-600">
					{resultCount} {resultCount === 1 ? "result" : "results"}
				</span>
				{searchQuery && (
					<span className="text-zinc-400">for "{searchQuery}"</span>
				)}
			</div>
		</div>
	);
}
