import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { groupFaqsByCategory } from "~/app/[language]/(frontend)/faq/faq-helpers";
import { FAQCategorySection } from "~/components/pages/faq/faq-category-section";
import { UncategorizedFAQSection } from "~/components/pages/faq/uncategorized-faq-section";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { sanityFetch } from "~/sanity/lib/client";
import { FAQS_QUERY, FAQ_PAGE_QUERY } from "~/sanity/lib/queries";
import type { LanguagePageProps } from "~/types/page-props";

export const metadata: Metadata = {
	title: "FAQ | DIGITCORE",
	description:
		"Frequently asked questions about the DIGITCORE Toolkit for Collaborative Environmental Research.",
};

export default async function Page({ params }: LanguagePageProps) {
	const { language } = await params;

	const [pageData, faqs] = await Promise.all([
		sanityFetch({
			query: FAQ_PAGE_QUERY,
			params: { language },
			revalidate: 60,
		}),
		sanityFetch({
			query: FAQS_QUERY,
			params: { language },
			revalidate: 60,
		}),
	]);

	const { uncategorized, grouped } = faqs
		? groupFaqsByCategory(faqs)
		: { uncategorized: [], grouped: {} };

	if (!pageData || !faqs) {
		notFound();
	}

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
