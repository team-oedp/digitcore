import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { GlossaryList } from "~/components/pages/glossary/glossary-list";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { CurrentLetterIndicator } from "~/components/shared/current-letter-indicator";
import { LetterNavigation } from "~/components/shared/letter-navigation";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { client } from "~/sanity/lib/client";
import {
	GLOSSARY_PAGE_QUERY,
	GLOSSARY_TERMS_QUERY,
} from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type {
	GLOSSARY_PAGE_QUERYResult,
	GLOSSARY_TERMS_QUERYResult,
} from "~/sanity/sanity.types";
import { GlossaryScroll } from "./glossary-scroll";

export const metadata: Metadata = {
	title: "Glossary | DIGITCORE",
	description:
		"Searchable reference for key terms and concepts used in the toolkit.",
};

const ALPHABET = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(65 + i),
);

export type TermsByLetter = Partial<Record<string, GLOSSARY_TERMS_QUERYResult>>;

export default async function GlossaryPage() {
	const isDraftMode = (await draftMode()).isEnabled;

	const pageData = (await client.fetch(
		GLOSSARY_PAGE_QUERY,
		{},
		isDraftMode
			? { perspective: "previewDrafts", useCdn: false, stega: true, token }
			: { perspective: "published", useCdn: true },
	)) as GLOSSARY_PAGE_QUERYResult | null;

	// Fetch glossary terms from Sanity
	const glossaryTerms = (await client.fetch(
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
	)) as GLOSSARY_TERMS_QUERYResult | null;

	// Group terms by letter and ensure strict alphabetical ordering within each group
	const termsByLetter =
		glossaryTerms?.reduce<TermsByLetter>((acc, term) => {
			const title = term.title ?? "";
			const letter = title.charAt(0).toUpperCase();
			const group = acc[letter] ?? [];
			group.push(term);
			// Sort the group alphabetically by title to ensure strict ordering
			group.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
			acc[letter] = group;
			return acc;
		}, {}) ?? {};

	if (!pageData) return null;

	return (
		<div className="relative">
			<GlossaryScroll />
			<PageWrapper className="flex flex-col gap-0 md:flex-row md:gap-20">
				{/* Sticky nav and section indicator */}
				<div className="sticky top-5 z-10 hidden h-full self-start md:block">
					<div className="flex flex-col items-start justify-start gap-0">
						{/* Anchor used as the intersection threshold for current-letter detection */}
						<div id="letter-anchor" />
						<CurrentLetterIndicator
							availableLetters={Object.keys(termsByLetter)}
							contentId="glossary-content"
							// implicit anchorId defaults to 'letter-anchor'
						/>
						<div className="lg:pl-2">
							<LetterNavigation
								itemsByLetter={termsByLetter}
								contentId="glossary-content"
							/>
						</div>
					</div>
				</div>

				{/* Scrolling section */}
				<div className="flex flex-col">
					{pageData.title && <PageHeading title={pageData.title} />}
					{pageData.description && (
						<CustomPortableText
							value={pageData.description as PortableTextBlock[]}
							className="mt-8 text-body"
						/>
					)}
					<div className="pt-14 lg:pt-14">
						<GlossaryList termsByLetter={termsByLetter} alphabet={ALPHABET} />
					</div>
				</div>
			</PageWrapper>
		</div>
	);
}
