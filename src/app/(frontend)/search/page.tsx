import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { PageHeader } from "~/components/global/page-header";
import { PageWrapper } from "~/components/global/page-wrapper";
import { SearchClientWrapper } from "~/components/pages/search/search-client-wrapper";
import { SearchInterfaceWrapper } from "~/components/pages/search/search-interface-wrapper";
import { SearchResultsHeader } from "~/components/pages/search/search-results-header";
import { Separator } from "~/components/ui/separator";
import { sanityFetch } from "~/sanity/lib/live";
import { SEARCH_PAGE_QUERY } from "~/sanity/lib/queries";

export const metadata: Metadata = {
	title: "Search | DIGITCORE Toolkit",
	description: "Search patterns, tags, glossary terms, and resources.",
};

export default async function SearchPage() {
	// Fetch page data
	const { data: pageData } = await sanityFetch({ query: SEARCH_PAGE_QUERY });

	if (!pageData) {
		console.log("No page found, returning 404");
		return notFound();
	}

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
					<SearchClientWrapper />
				</div>
			</div>
		</PageWrapper>
	);
}
