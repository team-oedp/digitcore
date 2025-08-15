import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { client } from "~/sanity/lib/client";
import { FAQ_PAGE_QUERY, FAQS_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { Page } from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "FAQ | DIGITCORE Toolkit",
	description:
		"Frequently asked questions about the DIGITCORE Toolkit for Collaborative Environmental Research.",
};

type FAQFromSanity = {
	_id: string;
	title: string;
	description: PortableTextBlock[];
};

export default async function FAQPage() {
	const isDraftMode = (await draftMode()).isEnabled;

	// Fetch page data from Sanity
	const pageData = (await client.fetch(
		FAQ_PAGE_QUERY,
		{},
		isDraftMode
			? { perspective: "previewDrafts", useCdn: false, stega: true, token }
			: { perspective: "published", useCdn: true },
	)) as Page | null;

	// Fetch FAQs from Sanity
	const faqs = await client.fetch<FAQFromSanity[]>(
		FAQS_QUERY,
		{},
		isDraftMode
			? {
					perspective: "previewDrafts",
					useCdn: false,
					stega: true,
					token,
				}
			: {
					perspective: "published",
					useCdn: true,
				},
	);

	return (
		<PageWrapper>
			<div className="flex flex-col gap-10 pb-44">
				{pageData?.title && pageData?.description && (
					<PageHeading
						title={pageData.title}
						description={pageData.description as PortableTextBlock[]}
					/>
				)}

				{/* FAQ Accordions */}
				<section className="max-w-4xl">
					{faqs && faqs.length > 0 ? (
						<Accordion type="single" collapsible className="w-full">
							{faqs.map((faq) => (
								<AccordionItem
									key={faq._id}
									value={faq._id}
									className="border-zinc-300 border-b border-dashed last:border-b"
								>
						<AccordionTrigger
							showPlusMinus
							className="items-center justify-between py-4 text-left text-lg text-primary font-normal hover:no-underline"
						>
							<span className="text-left">{faq.title}</span>
						</AccordionTrigger>
						<AccordionContent className="pt-2 pb-4">
							<CustomPortableText
								value={faq.description}
								className="accordion-detail"
							/>
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
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
