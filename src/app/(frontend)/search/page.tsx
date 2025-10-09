import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SearchClientWrapper } from "~/components/pages/search/search-client-wrapper";
import { SearchInterfaceServer } from "~/components/pages/search/search-interface-server";
import { SearchInterfaceSkeleton } from "~/components/pages/search/search-interface-skeleton";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { Skeleton } from "~/components/ui/skeleton";
import { sanityFetch } from "~/sanity/lib/client";
import { EXPLORE_PAGE_QUERY } from "~/sanity/lib/queries";
import type { Page } from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "Search | DIGITCORE",
	description: "Search patterns, tags, themes, and audiences.",
};

export default async function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const data = (await sanityFetch({
		query: EXPLORE_PAGE_QUERY,
		revalidate: 60,
	})) as Page | null;

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
						<SearchInterfaceServer />
					</Suspense>
					<Suspense fallback={<Skeleton className="h-32 w-full" />}>
						<SearchClientWrapper />
					</Suspense>
				</div>
			</div>
		</PageWrapper>
	);
}
