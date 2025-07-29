import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { PageHeader } from "~/components/global/page-header";
import { PageWrapper } from "~/components/global/page-wrapper";
import { SearchInterface } from "~/components/pages/search/search-interface";
import { SearchResults } from "~/components/pages/search/search-results";
import { SearchResultsHeader } from "~/components/pages/search/search-results-header";
import { Separator } from "~/components/ui/separator";
import { sanityFetch } from "~/sanity/lib/live";
import { SEARCH_PAGE_QUERY } from "~/sanity/lib/queries";

export const metadata: Metadata = {
	title: "Search | DIGITCORE Toolkit",
	description: "Search patterns, tags, glossary terms, and resources.",
};

export default async function SearchPage() {
	const { data } = await sanityFetch({ query: SEARCH_PAGE_QUERY });

	if (!data) {
		console.log("No page found, returning 404");
		return notFound();
	}

	return (
		<PageWrapper>
			<div className="space-y-12">
				{data.description && (
					<PageHeader description={data.description as PortableTextBlock[]} />
				)}
				<div className="space-y-6">
					<SearchInterface />
					<SearchResultsHeader resultCount={5} searchQuery="maintenance" />
					<Separator />
					<SearchResults />
				</div>
			</div>
		</PageWrapper>
	);
}
