import { CustomPortableText } from "~/components/global/custom-portable-text";
import { Accordion } from "~/components/ui/accordion";
import type { FAQS_QUERYResult } from "~/sanity/sanity.types";
import { FAQAccordionItem } from "./faq-accordion-item";

type FAQCategorySectionProps = {
	category: NonNullable<FAQS_QUERYResult[0]["category"]>;
	faqs: FAQS_QUERYResult;
};

export function FAQCategorySection({
	category,
	faqs,
}: FAQCategorySectionProps) {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-section-heading">{category.title}</h2>
				{category.description && category.description.length > 0 && (
					<CustomPortableText
						value={category.description}
						className="mt-2 text-neutral-600 text-sm"
					/>
				)}
			</div>
			<Accordion type="multiple" className="w-full">
				{faqs.map((faq) => (
					<FAQAccordionItem
						key={faq._id}
						id={faq._id}
						title={faq.title || ""}
						description={faq.description}
					/>
				))}
			</Accordion>
		</div>
	);
}