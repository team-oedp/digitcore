import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { Suspense } from "react";
import { SearchClientWrapper } from "~/components/pages/search/search-client-wrapper";
import { SearchInterfaceServer } from "~/components/pages/search/search-interface-server";
import { SearchInterfaceSkeleton } from "~/components/pages/search/search-interface-skeleton";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { Skeleton } from "~/components/ui/skeleton";
import { sanityFetch } from "~/sanity/lib/client";
import { SEARCH_CONFIG_QUERY, SEARCH_PAGE_QUERY } from "~/sanity/lib/queries";
import type { LanguageSearchPageProps } from "~/types/page-props";

export const metadata: Metadata = {
	title: "Search | DIGITCORE",
	description: "Search patterns, tags, themes, and audiences.",
};

export default async function Page({ params }: LanguageSearchPageProps) {
	const { language } = await params;
	const [pageData, searchData] = await Promise.all([
		sanityFetch({
			query: SEARCH_PAGE_QUERY,
			params: { language },
			revalidate: 60,
		}),
		sanityFetch({
			query: SEARCH_CONFIG_QUERY,
			params: { language },
			revalidate: 60,
		}),
	]);

	return (
		<PageWrapper>
			<div className="flex flex-col gap-10 pb-44">
				{pageData?.title && <PageHeading title={pageData.title} />}
				{pageData?.description && (
					<CustomPortableText
						value={pageData.description as PortableTextBlock[]}
						className="mt-8 text-body"
					/>
				)}
				<div className="flex flex-col gap-8">
					<Suspense fallback={<SearchInterfaceSkeleton />}>
						<SearchInterfaceServer language={language} />
					</Suspense>
					<Suspense fallback={<Skeleton className="h-32 w-full" />}>
						<SearchClientWrapper
							language={language}
							emptyStateMessage={pageData?.emptyStateMessage ?? undefined}
							searchData={searchData}
						/>
					</Suspense>
				</div>
			</div>
		</PageWrapper>
	);
}
