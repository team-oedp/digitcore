import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { CurrentLetterIndicator } from "~/components/shared/current-letter-indicator";
import { LetterNavigation } from "~/components/shared/letter-navigation";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { toGlossaryAnchorId } from "~/lib/glossary-utils";
import { client } from "~/sanity/lib/client";
import {
	GLOSSARY_PAGE_QUERY,
	GLOSSARY_TERMS_QUERY,
} from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { Page } from "~/sanity/sanity.types";
import { GlossaryScroll } from "./glossary-scroll";

export const metadata: Metadata = {
	title: "Glossary | DIGITCORE",
	description:
		"Searchable reference for key terms and concepts used in the toolkit.",
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Type definitions
type GlossaryTerm = {
	_id: string;
	title: string;
	description: PortableTextBlock[];
};

type ProcessedTerm = {
	docId: string;
	anchorId: string;
	letter: string;
	term: string;
	description: PortableTextBlock[];
};

type TermsByLetter = Partial<Record<string, ProcessedTerm[]>>;

export default async function GlossaryPage() {
	const isDraftMode = (await draftMode()).isEnabled;

	// Fetch page content and glossary terms in parallel
	const [pageData, glossaryTerms] = await Promise.all([
		client.fetch<Page | null>(
			GLOSSARY_PAGE_QUERY,
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
		),
		client.fetch<GlossaryTerm[]>(
			GLOSSARY_TERMS_QUERY,
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
		),
	]);

	// Process glossary terms and group by letter
	const processedTerms: ProcessedTerm[] =
		glossaryTerms?.map((term) => {
			const firstLetter = term.title.charAt(0).toUpperCase();
			return {
				docId: term._id,
				anchorId: toGlossaryAnchorId(term.title),
				letter: firstLetter,
				term: term.title,
				description: term.description,
			};
		}) || [];

	// Group terms by letter and ensure strict alphabetical ordering within each group
	const termsByLetter = processedTerms.reduce<TermsByLetter>((acc, term) => {
		const group = acc[term.letter] ?? [];
		group.push(term);
		// Sort the group alphabetically by term to ensure strict ordering
		group.sort((a, b) => a.term.localeCompare(b.term));
		acc[term.letter] = group;
		return acc;
	}, {});

	return (
		<div className="relative">
			<GlossaryScroll />
			<PageWrapper className="flex min-h-0 flex-col gap-0 md:min-h-screen md:flex-row md:gap-20">
				{/* Sticky nav and section indicator */}
				<div className="sticky top-5 z-10 hidden h-full self-start md:block">
					<div className="flex flex-col items-start justify-start gap-0">
						<CurrentLetterIndicator
							availableLetters={Object.keys(termsByLetter)}
							contentId="glossary-content"
						/>
						<div className="lg:pl-2">
							<LetterNavigation
								itemsByLetter={termsByLetter}
								contentId="glossary-content"
							/>
						</div>
					</div>
				</div>

				<div className="flex flex-col pb-44">
					{pageData?.title && <PageHeading title={pageData.title} />}
					{pageData?.description && (
						<CustomPortableText
							value={pageData.description as PortableTextBlock[]}
							className="mt-8 text-body"
						/>
					)}
					<div
						className="w-full space-y-8 pt-20 pb-[800px] lg:pt-60"
						data-scroll-container
					>
						<div id="glossary-content" className="w-full space-y-16">
							{ALPHABET.map((letter) => {
								const terms = termsByLetter[letter];
								if (!terms || terms.length === 0) return null;

								return (
									<section
										key={letter}
										className="w-full scroll-mt-36 space-y-4"
										id={`letter-${letter}`}
									>
										<h2 className="text-subheading">{letter}</h2>

										<Accordion type="multiple" className="w-full min-w-0">
											{terms.map((term) => (
												<AccordionItem
													key={term.docId}
													value={term.docId}
													className="scroll-mt-80 border-neutral-300 border-b border-dashed last:border-b"
													id={term.anchorId}
												>
													{/* Fallback anchor for document ID-based navigation */}
													<span
														id={term.docId}
														className="block scroll-mt-80"
														aria-hidden="true"
													/>
													<AccordionTrigger
														showPlusMinus
														className="accordion-heading items-center justify-between py-4"
													>
														<span className="text-left">{term.term}</span>
													</AccordionTrigger>
													<AccordionContent className="pt-2 pb-4">
														<CustomPortableText
															value={term.description}
															className="accordion-detail"
														/>
													</AccordionContent>
												</AccordionItem>
											))}
										</Accordion>
									</section>
								);
							})}
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
}
