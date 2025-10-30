import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { GlossaryList } from "~/components/pages/glossary/glossary-list";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { CurrentLetterIndicator } from "~/components/shared/current-letter-indicator";
import { LetterNavigation } from "~/components/shared/letter-navigation";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { type Language, i18n } from "~/i18n/config";
import { buildAbsoluteUrl } from "~/lib/metadata";
import { buildHreflang } from "~/lib/seo";
import { sanityFetch } from "~/sanity/lib/client";
import {
	GLOSSARY_PAGE_QUERY,
	GLOSSARY_TERMS_QUERY,
	SITE_SETTINGS_QUERY,
} from "~/sanity/lib/queries";
import type { GLOSSARY_TERMS_QUERYResult } from "~/sanity/sanity.types";
import type { LanguagePageProps } from "~/types/page-props";
import { GlossaryScroll } from "./glossary-scroll";

const GLOSSARY_LANGUAGES_QUERY = `array::unique(*[_type == 'page' && slug.current == 'glossary' && defined(language)].language)`;

export async function generateStaticParams() {
	const available = (await sanityFetch({
		query: GLOSSARY_LANGUAGES_QUERY,
		revalidate: 60,
	})) as string[] | null;
	const allowed = new Set<Language>(i18n.languages.map((l) => l.id));
	return (available ?? [])
		.filter((id) => allowed.has(id as Language))
		.map((id) => ({ language: id as Language }));
}

export async function generateMetadata({ params }: LanguagePageProps) {
	const { language } = await params;
	const site = await sanityFetch({
		query: SITE_SETTINGS_QUERY,
		revalidate: 3600,
	});
	const siteUrl = site?.url ?? "https://digitcore.org";
	const canonical = buildAbsoluteUrl(siteUrl, `/${language}/glossary`);
	const available = (await sanityFetch({
		query: GLOSSARY_LANGUAGES_QUERY,
		revalidate: 60,
	})) as string[] | null;
	const allowed = new Set<Language>(i18n.languages.map((l) => l.id));
	const languages = (available ?? []).filter((id) =>
		allowed.has(id as Language),
	) as Language[];
	return {
		title: "Glossary | DIGITCORE",
		description:
			"Searchable reference for key terms and concepts used in the toolkit.",
		alternates: {
			canonical,
			languages: buildHreflang(siteUrl, "/glossary", languages),
		},
	};
}

// metadata is generated via generateMetadata above

const ALPHABET = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(65 + i),
);

export type TermsByLetter = Partial<Record<string, GLOSSARY_TERMS_QUERYResult>>;

export default async function Page({ params }: LanguagePageProps) {
	const { language } = await params;

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
	const termsByLetter: TermsByLetter = (glossaryTerms ?? []).reduce(
		(acc: TermsByLetter, term: GLOSSARY_TERMS_QUERYResult[number]) => {
			const title = term.title ?? "";
			const letter = title.charAt(0).toUpperCase();
			const group = acc[letter] ?? [];
			group.push(term);
			// Sort the group alphabetically by title to ensure strict ordering
			group.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
			acc[letter] = group;
			return acc;
		},
		{},
	);

	if (!pageData) {
		notFound();
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
