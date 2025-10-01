import { Accordion } from "~/components/ui/accordion";
import type { FAQS_QUERYResult } from "~/sanity/sanity.types";
import { FAQAccordionItem } from "./faq-accordion-item";

type UncategorizedFAQSectionProps = {
	faqs: FAQS_QUERYResult;
};

export function UncategorizedFAQSection({
	faqs,
}: UncategorizedFAQSectionProps) {
	if (faqs.length === 0) return null;

	return (
		<div className="space-y-6">
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
