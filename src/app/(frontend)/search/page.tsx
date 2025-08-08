import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "~/components/global/page-header";
import { PageWrapper } from "~/components/global/page-wrapper";
import { SearchClientWrapper } from "~/components/pages/search/search-client-wrapper";
import {
	SearchInterfaceSkeleton,
	SearchInterfaceWrapper,
} from "~/components/pages/search/search-interface-wrapper";
import { sanityFetch } from "~/sanity/lib/live";
import { SEARCH_PAGE_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";

export const metadata: Metadata = {
	title: "Search | DIGITCORE Toolkit",
	description: "Search patterns, tags, glossary terms, and resources.",
};

export default async function SearchPage() {
	// Fetch page data
	const pageData = await client.fetch(
		SEARCH_PAGE_QUERY,
		{},
		isDraftMode
			? {
					perspective: "previewDrafts",
					useCdn: false,
					stega: true,
					token,
				}
			: {
					perspective: "published",
					useCdn: true,
				},
	);

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
					<Suspense fallback={<SearchInterfaceSkeleton />}>
						<SearchInterfaceWrapper />
					</Suspense>
					<Suspense
						fallback={
							<div className="h-32 animate-pulse rounded bg-zinc-100" />
						}
					>
						<SearchClientWrapper />
					</Suspense>
				</div>
			</div>
		</PageWrapper>
	);
}
