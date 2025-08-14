import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SearchClientWrapper } from "~/components/pages/search/search-client-wrapper";
import {
	SearchInterfaceSkeleton,
	SearchInterfaceWrapper,
} from "~/components/pages/search/search-interface-wrapper";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { client } from "~/sanity/lib/client";
import { SEARCH_PAGE_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";

export const metadata: Metadata = {
	title: "Search | DIGITCORE Toolkit",
	description: "Search patterns, tags, glossary terms, and resources.",
};

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const isDraftMode = (await draftMode()).isEnabled;

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
			<div className="space-y-6 pt-16">
				<Suspense fallback={<SearchInterfaceSkeleton />}>
					<SearchInterfaceWrapper />
				</Suspense>
				<Suspense
					fallback={<div className="h-32 animate-pulse rounded bg-zinc-100" />}
				>
					<SearchClientWrapper />
				</Suspense>
			</div>
		</PageWrapper>
	);
}
