import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { FAQCategorySection } from "~/components/pages/faq/faq-category-section";
import { UncategorizedFAQSection } from "~/components/pages/faq/uncategorized-faq-section";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { sanityFetch } from "~/sanity/lib/client";
import { FAQS_QUERY, FAQ_PAGE_QUERY } from "~/sanity/lib/queries";
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
	const pageData = (await sanityFetch({
		query: FAQ_PAGE_QUERY,
		revalidate: 60,
	})) as FAQ_PAGE_QUERYResult | null;

	const faqs = (await sanityFetch({
		query: FAQS_QUERY,
		revalidate: 60,
	})) as FAQS_QUERYResult | null;

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
