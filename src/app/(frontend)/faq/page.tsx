import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { PageWrapper } from "~/components/shared/page-wrapper";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { client } from "~/sanity/lib/client";
import { FAQS_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";

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
			<div className="space-y-16">
				<section className="max-w-4xl space-y-4">
					<p className="text-base text-neutral-500 leading-snug">
						Welcome to our FAQ page. Here, we aim to clarify important concepts
						that connect technology, environmental justice, and community
						collaboration in the context of using the Digital Toolkit for
						Collaborative Environmental Research. This glossary serves as a
						helpful resource for researchers, developers, community
						organizations, and advocates, guiding you through the intricate
						world of participatory science and the development of open
						infrastructure.
					</p>
				</section>

				{/* FAQ Accordions */}
				<section className="max-w-4xl space-y-4">
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
										className="items-center justify-between py-4 text-left font-normal text-base text-neutral-500 hover:no-underline"
									>
										<span className="text-left">{faq.title}</span>
									</AccordionTrigger>
									<AccordionContent className="pt-2 pb-4">
										<div className="prose prose-neutral max-w-none text-base text-neutral-500 leading-relaxed">
											<CustomPortableText
												value={faq.description}
												className="prose prose-neutral max-w-none [&>*]:text-neutral-500"
											/>
										</div>
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
