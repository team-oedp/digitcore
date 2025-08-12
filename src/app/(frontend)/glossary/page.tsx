import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { CurrentLetterIndicator } from "~/components/shared/current-letter-indicator";
import { LetterNavigation } from "~/components/shared/letter-navigation";
import { PageHeader } from "~/components/shared/page-header";
import { PageWrapper } from "~/components/shared/page-wrapper";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { client } from "~/sanity/lib/client";
import {
	GLOSSARY_PAGE_QUERY,
	GLOSSARY_TERMS_QUERY,
} from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";

export const metadata: Metadata = {
	title: "Glossary | DIGITCORE Toolkit",
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
	id: string;
	letter: string;
	term: string;
	description: PortableTextBlock[];
};

type TermsByLetter = Partial<Record<string, ProcessedTerm[]>>;

export default async function GlossaryPage() {
	const isDraftMode = (await draftMode()).isEnabled;

	// Fetch page content and glossary terms in parallel
	const [pageData, glossaryTerms] = await Promise.all([
		client.fetch(
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
		client.fetch(
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
		(glossaryTerms as GlossaryTerm[])?.map((term) => {
			const firstLetter = term.title.charAt(0).toUpperCase();
			return {
				id: term._id,
				letter: firstLetter,
				term: term.title,
				description: term.description,
			};
		}) || [];

	// Sort terms alphabetically
	processedTerms.sort((a, b) => a.term.localeCompare(b.term));

	// Group terms by letter
	const termsByLetter = processedTerms.reduce<TermsByLetter>((acc, term) => {
		const group = acc[term.letter] ?? [];
		group.push(term);
		acc[term.letter] = group;
		return acc;
	}, {});

	// Default description if page data is not available
	const defaultDescription =
		"Building equitable open digital infrastructure requires a shared understanding of key concepts that bridge technology, environmental justice, and community collaboration. This glossary defines essential terms from the DIGITCORE Toolkit, helping researchers, developers, community organizations, and advocates navigate the complex landscape of participatory science and open infrastructure development.";

	// Prepare description for PageHeader - it handles both string and PortableTextBlock[]
	const pageDescription = pageData?.description as
		| PortableTextBlock[]
		| string
		| undefined;

	return (
		<div className="relative">
			<PageWrapper>
				<div className="sticky top-0 z-10 bg-primary-foreground pt-6 pb-2">
					<div className="flex items-start justify-between gap-6">
						<div className="flex-1">
							<PageHeader
								title={pageData?.title || "Glossary"}
								description={pageDescription || defaultDescription}
							/>
						</div>

						<div className="shrink-0">
							<CurrentLetterIndicator
								availableLetters={Object.keys(termsByLetter)}
								contentId="glossary-content"
							/>
						</div>
					</div>
				</div>

				<div className="flex gap-20 space-y-8 pb-[800px]" data-scroll-container>
					<LetterNavigation
						itemsByLetter={termsByLetter}
						contentId="glossary-content"
					/>
					<div id="glossary-content" className="flex-1 space-y-16 lg:pl-20">
						{ALPHABET.map((letter) => {
							const terms = termsByLetter[letter];
							if (!terms || terms.length === 0) return null;

							return (
								<section
									key={letter}
									className="max-w-4xl scroll-mt-40 space-y-4"
									id={`letter-${letter}`}
								>
									<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
										{letter}
									</h2>

									<Accordion type="single" collapsible className="w-full">
										{terms.map((term) => (
											<AccordionItem
												key={term.id}
												value={term.id}
												className="border-zinc-300 border-b border-dashed last:border-b"
												id={term.id}
											>
												<AccordionTrigger
													showPlusMinus
													className="items-center justify-between py-4 text-left font-normal text-neutral-500 text-xl hover:no-underline"
												>
													<span className="text-left">{term.term}</span>
												</AccordionTrigger>
												<AccordionContent className="pt-2 pb-4">
													<div className="prose prose-neutral max-w-none text-base text-neutral-500 leading-relaxed">
														<CustomPortableText
															value={term.description}
															className="[&>*]:text-neutral-500"
														/>
													</div>
												</AccordionContent>
											</AccordionItem>
										))}
									</Accordion>
								</section>
							);
						})}
					</div>
				</div>
			</PageWrapper>
		</div>
	);
}
