import type { PortableTextBlock } from "next-sanity";
import { groupFaqsByCategory } from "~/app/[language]/(frontend)/faq/faq-helpers";
import { FAQCategorySection } from "~/components/pages/faq/faq-category-section";
import { UncategorizedFAQSection } from "~/components/pages/faq/uncategorized-faq-section";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import type { Language } from "~/i18n/config";
import { sanityFetch } from "~/sanity/lib/client";
import { FAQS_QUERY } from "~/sanity/lib/queries";
import type { PAGE_BY_SLUG_QUERYResult } from "~/sanity/sanity.types";

type FAQPageViewProps = {
	pageData: PAGE_BY_SLUG_QUERYResult;
	language: Language;
};

export async function FAQPageView({
	pageData,
	language,
}: FAQPageViewProps) {
	const faqs = await sanityFetch({
		query: FAQS_QUERY,
		params: { language },
		revalidate: 60,
	});

	const { uncategorized, grouped } = faqs
		? groupFaqsByCategory(faqs)
		: { uncategorized: [], grouped: {} };

	if (!faqs) {
		return null;
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

