import { CustomPortableText } from "~/components/global/custom-portable-text";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import type { FAQS_QUERYResult } from "~/sanity/sanity.types";

type FAQAccordionItemProps = {
	id: string;
	title: string;
	description: FAQS_QUERYResult[0]["description"];
};

export function FAQAccordionItem({
	id,
	title,
	description,
}: FAQAccordionItemProps) {
	return (
		<AccordionItem
			value={id}
			className="border-zinc-300 border-b border-dashed last:border-b"
		>
			<AccordionTrigger
				showPlusMinus
				className="accordion-heading items-center justify-between py-4"
			>
				<span className="text-left">{title}</span>
			</AccordionTrigger>
			<AccordionContent className="pt-2 pb-4">
				<CustomPortableText
					value={description}
					className="accordion-detail"
				/>
			</AccordionContent>
		</AccordionItem>
	);
}