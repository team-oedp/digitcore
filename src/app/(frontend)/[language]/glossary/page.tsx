import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { GlossaryList } from "~/components/pages/glossary/glossary-list";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { CurrentLetterIndicator } from "~/components/shared/current-letter-indicator";
import { LetterNavigation } from "~/components/shared/letter-navigation";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { sanityFetch } from "~/sanity/lib/client";
import {
	GLOSSARY_PAGE_QUERY,
	GLOSSARY_TERMS_QUERY,
} from "~/sanity/lib/queries";
import type { GLOSSARY_TERMS_QUERYResult } from "~/sanity/sanity.types";
import { GlossaryScroll } from "./glossary-scroll";
import type { Language } from "~/i18n/config";

export const metadata: Metadata = {
	title: "Glossary | DIGITCORE",
	description:
		"Searchable reference for key terms and concepts used in the toolkit.",
};

const ALPHABET = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(65 + i),
);

export type TermsByLetter = Partial<Record<string, GLOSSARY_TERMS_QUERYResult>>;

export default async function Page(props: PageProps<"/[language]/glossary">) {
	const { language: languageParam } = await props.params;
	const language = languageParam as Language;

	const [pageData, glossaryTerms] = await Promise.all([
		sanityFetch({
			query: GLOSSARY_PAGE_QUERY,
			params: { language },
			revalidate: 60,
		}),
		sanityFetch({
			query: GLOSSARY_TERMS_QUERY,
			params: { language },
			revalidate: 60,
		}),
	]);

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

	if (!pageData) {
		return notFound();
	}

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
