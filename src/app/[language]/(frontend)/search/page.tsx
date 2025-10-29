import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { Suspense } from "react";
import { SearchClientWrapper } from "~/components/pages/search/search-client-wrapper";
import { SearchInterfaceServer } from "~/components/pages/search/search-interface-server";
import { SearchInterfaceSkeleton } from "~/components/pages/search/search-interface-skeleton";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { MissingTranslationNotice } from "~/components/shared/missing-translation-notice";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { Skeleton } from "~/components/ui/skeleton";
import { sanityFetch } from "~/sanity/lib/client";
import { SEARCH_PAGE_QUERY } from "~/sanity/lib/queries";
import type { LanguagePageProps } from "~/types/page-props";

export const metadata: Metadata = {
	title: "Search | DIGITCORE",
	description: "Search patterns, tags, themes, and audiences.",
};

export default async function Page({ params }: LanguagePageProps) {
	const { language } = await params;
	const pageData = await sanityFetch({
		query: SEARCH_PAGE_QUERY,
		params: { language },
		revalidate: 60,
	});

	if (!pageData) {
		return <MissingTranslationNotice language={language} />;
	}

	return (
		<PageWrapper>
			<div className="flex flex-col gap-10 pb-44">
				{pageData.title && <PageHeading title={pageData.title} />}
				{pageData.description && (
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
							emptyStateMessage={pageData.emptyStateMessage ?? undefined}
						/>
					</Suspense>
				</div>
			</div>
		</PageWrapper>
	);
}
