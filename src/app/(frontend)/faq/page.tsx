import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { FAQCategorySection } from "~/components/pages/faq/faq-category-section";
import { UncategorizedFAQSection } from "~/components/pages/faq/uncategorized-faq-section";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { client, sanityFetch } from "~/sanity/lib/client";
import { FAQS_QUERY, FAQ_PAGE_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type {
	FAQS_QUERYResult,
	FAQ_PAGE_QUERYResult,
} from "~/sanity/sanity.types";
import { groupFaqsByCategory } from "~/utils/faq-helpers";

export const metadata: Metadata = {
	title: "FAQ | DIGITCORE",
	description:
		"Frequently asked questions about the DIGITCORE Toolkit for Collaborative Environmental Research.",
};

export default async function FAQPage() {
	const isDraftMode = (await draftMode()).isEnabled;

	const pageData = isDraftMode
		? await client.fetch<FAQ_PAGE_QUERYResult | null>(
				FAQ_PAGE_QUERY,
				{},
				{ perspective: "previewDrafts", stega: true, token },
			)
		: await sanityFetch<typeof FAQ_PAGE_QUERY>({
				query: FAQ_PAGE_QUERY,
				tags: ["faq-page"],
			});

	const faqs = isDraftMode
		? await client.fetch<FAQS_QUERYResult | null>(
				FAQS_QUERY,
				{},
				{ perspective: "previewDrafts", stega: true, token },
			)
		: await sanityFetch<typeof FAQS_QUERY>({
				query: FAQS_QUERY,
				tags: ["faq"],
			});

	const { uncategorized, grouped } = faqs
		? groupFaqsByCategory(faqs)
		: { uncategorized: [], grouped: {} };

	return (
		<PageWrapper>
			<div className="flex flex-col gap-20 pb-32">
				{pageData?.title && pageData?.description && (
					<div>
						<PageHeading title={pageData.title} />
						<CustomPortableText
							value={pageData.description as PortableTextBlock[]}
							className="mt-8 text-body"
						/>
					</div>
				)}

				{/* FAQ Accordions */}
				<section className="max-w-4xl">
					{faqs && faqs.length > 0 ? (
						<div className="space-y-12">
							<UncategorizedFAQSection faqs={uncategorized} />

							{Object.entries(grouped).map(
								([categoryId, { category, faqs: categoryFaqs }]) => (
									<FAQCategorySection
										key={categoryId}
										category={category}
										faqs={categoryFaqs}
									/>
								),
							)}
						</div>
					) : (
						<p className="text-neutral-500">
							No FAQs available at the moment. Please check back later.
						</p>
					)}
				</section>
			</div>
		</PageWrapper>
	);
}
