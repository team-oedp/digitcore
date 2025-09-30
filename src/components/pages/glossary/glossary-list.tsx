"use client";

import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { toGlossaryAnchorId } from "~/lib/glossary-utils";
import type { GLOSSARY_TERMS_QUERYResult } from "~/sanity/sanity.types";

// Type definitions using Sanity's auto-generated query result types
type TermsByLetter = Partial<Record<string, GLOSSARY_TERMS_QUERYResult>>;

/**
 * GlossaryList component displays glossary terms organized alphabetically with letter navigation.
 *
 * Each letter section uses `scroll-mt-40` (scroll-margin-top: 10rem) to ensure
 * that when scrolling to a letter via the LetterNavigation component, the content
 * is positioned below the fixed header instead of being hidden underneath it.
 * This provides proper visual spacing and prevents content from being cut off.
 */
export function GlossaryList({
	termsByLetter,
	alphabet,
}: {
	termsByLetter: TermsByLetter;
	alphabet: string[];
}) {
	return (
		<div className="space-y-8 pb-[144px] md:pb-[144px]" data-scroll-container>
			<div id="glossary-content" className="flex-1 space-y-4">
				{alphabet.map((letter) => {
					const terms = termsByLetter[letter];
					if (!terms || terms.length === 0) return null;

					return (
						<section
							key={letter}
							className="w-full max-w-4xl scroll-mt-36 space-y-8"
							id={`letter-${letter}`}
						>
							<h2 className="text-subheading">{letter}</h2>

							<Accordion type="multiple" className="w-full min-w-0">
								{terms.map((term) => {
									const anchorId = toGlossaryAnchorId(term.title ?? "");
									return (
										<AccordionItem
											key={term._id}
											value={term._id}
											className="scroll-mt-80 border-neutral-300 border-b border-dashed last:border-b"
											id={anchorId}
										>
											{/* Fallback anchor for document ID-based navigation */}
											<span
												id={term._id}
												className="block scroll-mt-80"
												aria-hidden="true"
											/>
											<AccordionTrigger
												showPlusMinus
												className="accordion-heading items-center justify-between py-4"
											>
												<span className="text-left">{term.title ?? ""}</span>
											</AccordionTrigger>
											<AccordionContent className="pt-2 pb-4">
												<CustomPortableText
													value={term.description as PortableTextBlock[]}
													className="accordion-detail"
												/>
											</AccordionContent>
										</AccordionItem>
									);
								})}
							</Accordion>
						</section>
					);
				})}
			</div>
		</div>
	);
}
