"use client";

import { useSearchParams } from "next/navigation";
import { Skeleton } from "~/components/ui/skeleton";
import type { Language } from "~/i18n/config";
import { parseSearchParams, searchParamsSchema } from "~/lib/search";
import type { SEARCH_CONFIG_QUERYResult } from "~/sanity/sanity.types";

type SearchResultsHeaderClientProps = {
	resultCount?: number;
	isLoading?: boolean;
	searchData?: SEARCH_CONFIG_QUERYResult;
	language?: Language;
};

export function SearchResultsHeaderClient({
	resultCount = 0,
	isLoading = false,
	searchData,
	language = "en",
}: SearchResultsHeaderClientProps) {
	const searchParams = useSearchParams();
	const isSpanish = language === "es";

	// Parse search term from URL
	let searchQuery = "";
	let hasSearchCriteria = false;

	try {
		const rawParams = {
			q: searchParams?.get("q") ?? undefined,
			audiences: searchParams?.get("audiences") ?? undefined,
			themes: searchParams?.get("themes") ?? undefined,
			tags: searchParams?.get("tags") ?? undefined,
			page: searchParams?.get("page") ?? undefined,
			limit: searchParams?.get("limit") ?? undefined,
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
		return <Skeleton className="h-6 w-48" />;
	}

	const resultText =
		resultCount === 1
			? (searchData?.resultsHeaderResultText ??
				(isSpanish ? "resultado" : "result"))
			: (searchData?.resultsHeaderResultsText ??
				(isSpanish ? "resultados" : "results"));

	const forText =
		searchData?.resultsHeaderForText ?? (isSpanish ? "para" : "for");

	return (
		<div className="flex items-center gap-1">
			<span className="text-base text-muted-foreground text-prose">
				{resultCount} {resultText}
			</span>
			{searchQuery && (
				<span className="text-base text-muted-foreground text-prose">
					{forText} "{searchQuery}"
				</span>
			)}
		</div>
	);
}
