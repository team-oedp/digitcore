import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { SearchClientWrapper } from "~/components/pages/search/search-client-wrapper";
import {
	SearchInterfaceSkeleton,
	SearchInterfaceWrapper,
} from "~/components/pages/search/search-interface-wrapper";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { client } from "~/sanity/lib/client";
import { EXPLORE_PAGE_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { Page } from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "Explore | DIGITCORE Toolkit",
	description: "Explore patterns, tags, glossary terms, and resources.",
};

export default async function ExplorePage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const isDraftMode = (await draftMode()).isEnabled;

	// Fetch page data
	const data = (await client.fetch(
		EXPLORE_PAGE_QUERY,
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
	)) as Page | null;

	if (!data) {
		console.log("No page found, returning 404");
		return notFound();
	}

	return (
		<PageWrapper>
			<div className="flex flex-col gap-10 pb-44">
				{data.title && <PageHeading title={data.title} />}
				{data.description && (
					<CustomPortableText
						value={data.description as PortableTextBlock[]}
						className="mt-8 text-body"
					/>
				)}
				<div className="flex flex-col gap-8">
					<Suspense fallback={<SearchInterfaceSkeleton />}>
						<SearchInterfaceWrapper />
					</Suspense>
					<Suspense
						fallback={
							<div className="h-32 animate-pulse rounded bg-neutral-200" />
						}
					>
						<SearchClientWrapper />
					</Suspense>
				</div>
			</div>
		</PageWrapper>
	);
}
