import type { FAQS_QUERYResult } from "~/sanity/sanity.types";

export type GroupedFaqCategory = {
	category: NonNullable<FAQS_QUERYResult[0]["category"]>;
	faqs: FAQS_QUERYResult;
};

export type GroupedFaqs = {
	uncategorized: FAQS_QUERYResult;
	grouped: Record<string, GroupedFaqCategory>;
};

/**
 * Groups FAQs by category, separating uncategorized FAQs from categorized ones
 */
export function groupFaqsByCategory(faqs: FAQS_QUERYResult): GroupedFaqs {
	// Separate uncategorized FAQs from categorized ones
	const uncategorized = faqs.filter((faq) => !faq.category);
	const categorized = faqs.filter((faq) => faq.category);

	// Group categorized FAQs by category
	const grouped = categorized.reduce(
		(groups, faq) => {
			if (faq.category) {
				const categoryId = faq.category._id;
				if (!groups[categoryId]) {
					groups[categoryId] = {
						category: faq.category,
						faqs: [],
					};
				}
				groups[categoryId].faqs.push(faq);
			}
			return groups;
		},
		{} as Record<string, GroupedFaqCategory>,
	);

	return { uncategorized, grouped };
}
