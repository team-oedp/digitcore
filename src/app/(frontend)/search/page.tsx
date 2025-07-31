import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import {
	type SearchResult,
	searchPatternsWithParams,
} from "~/app/actions/search";
import { PageHeader } from "~/components/global/page-header";
import { PageWrapper } from "~/components/global/page-wrapper";
import { SearchInterfaceWrapper } from "~/components/pages/search/search-interface-wrapper";
import { SearchResults } from "~/components/pages/search/search-results";
import { SearchResultsHeader } from "~/components/pages/search/search-results-header";
import { Separator } from "~/components/ui/separator";
import { parseSearchParams, searchParamsSchema } from "~/lib/search";
import { sanityFetch } from "~/sanity/lib/live";
import { SEARCH_PAGE_QUERY } from "~/sanity/lib/queries";

export const metadata: Metadata = {
	title: "Search | DIGITCORE Toolkit",
	description: "Search patterns, tags, glossary terms, and resources.",
};

type SearchPageProps = {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
	// Fetch page data
	const { data: pageData } = await sanityFetch({ query: SEARCH_PAGE_QUERY });

	if (!pageData) {
		console.log("No page found, returning 404");
		return notFound();
	}

	// Await searchParams before using its properties
	const resolvedSearchParams = await searchParams;

	// Parse and validate search parameters
	const rawParams = {
		q: Array.isArray(resolvedSearchParams.q)
			? resolvedSearchParams.q[0]
			: (resolvedSearchParams.q ?? undefined),
		audiences: Array.isArray(resolvedSearchParams.audiences)
			? resolvedSearchParams.audiences[0]
			: (resolvedSearchParams.audiences ?? undefined),
		themes: Array.isArray(resolvedSearchParams.themes)
			? resolvedSearchParams.themes[0]
			: (resolvedSearchParams.themes ?? undefined),
		tags: Array.isArray(resolvedSearchParams.tags)
			? resolvedSearchParams.tags[0]
			: (resolvedSearchParams.tags ?? undefined),
		page: Array.isArray(resolvedSearchParams.page)
			? resolvedSearchParams.page[0]
			: (resolvedSearchParams.page ?? undefined),
		limit: Array.isArray(resolvedSearchParams.limit)
			? resolvedSearchParams.limit[0]
			: (resolvedSearchParams.limit ?? undefined),
	};

	let searchResult: SearchResult;
	try {
		const validatedParams = searchParamsSchema.parse(rawParams);
		const parsedParams = parseSearchParams(validatedParams);

		// Create URLSearchParams for the server action
		const urlSearchParams = new URLSearchParams();
		if (parsedParams.searchTerm)
			urlSearchParams.set("q", parsedParams.searchTerm);
		if (parsedParams.audiences.length > 0)
			urlSearchParams.set("audiences", parsedParams.audiences.join(","));
		if (parsedParams.themes.length > 0)
			urlSearchParams.set("themes", parsedParams.themes.join(","));
		if (parsedParams.tags.length > 0)
			urlSearchParams.set("tags", parsedParams.tags.join(","));

		// Execute search
		searchResult = await searchPatternsWithParams(urlSearchParams);
	} catch (error) {
		console.error("Search parameter parsing error:", error);
		searchResult = {
			success: false,
			error: "Invalid search parameters",
			totalCount: 0,
			searchParams: parseSearchParams({ page: 1, limit: 20 }),
		};
	}

	// Extract search term for display
	const searchTerm = searchResult.searchParams.searchTerm;
	const hasActiveFilters =
		searchResult.searchParams.audiences.length > 0 ||
		searchResult.searchParams.themes.length > 0 ||
		searchResult.searchParams.tags.length > 0;

	return (
		<PageWrapper>
			<div className="space-y-12">
				{pageData.description && (
					<PageHeader
						description={pageData.description as PortableTextBlock[]}
					/>
				)}
				<div className="space-y-6">
					<SearchInterfaceWrapper />
					<SearchResultsHeader
						resultCount={searchResult.totalCount}
						searchQuery={searchTerm}
					/>
					<Separator />
					{!searchResult.success ? (
						<div className="py-12 text-center">
							<p className="mb-2 text-red-600">Search Error</p>
							<p className="text-sm text-zinc-500">{searchResult.error}</p>
						</div>
					) : searchResult.totalCount === 0 &&
						(searchTerm || hasActiveFilters) ? (
						<div className="py-12 text-center">
							<p className="mb-2 text-zinc-500">No results found</p>
							<p className="text-sm text-zinc-400">
								Try adjusting your search terms or filters
							</p>
						</div>
					) : (
						<SearchResults patterns={searchResult.data || []} />
					)}
				</div>
			</div>
		</PageWrapper>
	);
}
