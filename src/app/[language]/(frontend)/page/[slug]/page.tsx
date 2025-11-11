import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutPageView } from "~/components/pages/about/about-page-view";
import { AcknowledgementsPageView } from "~/components/pages/acknowledgements/acknowledgements-page-view";
import { FAQPageView } from "~/components/pages/faq/faq-page-view";
import { GlossaryPageView } from "~/components/pages/glossary/glossary-page-view";
import { PatternsPageView } from "~/components/pages/patterns/patterns-page-view";
import { TagsPageView } from "~/components/pages/tags/tags-page-view";
import { ThemesPageView } from "~/components/pages/themes/themes-page-view";
import { ValuesPageView } from "~/components/pages/values/values-page-view";
import { type Language, i18n } from "~/i18n/config";
import { buildAbsoluteUrl, buildDescriptionFromPortableText } from "~/lib/metadata";
import { buildHreflang } from "~/lib/seo";
import { sanityFetch } from "~/sanity/lib/client";
import {
	PAGE_BY_SLUG_QUERY,
	PAGES_BY_PAGE_ID_QUERY,
	PAGES_SLUGS_QUERY,
	SITE_SETTINGS_QUERY,
} from "~/sanity/lib/queries";
import type {
	PAGE_BY_SLUG_QUERYResult,
	PAGES_SLUGS_QUERYResult,
} from "~/sanity/sanity.types";
import type { LanguagePageProps } from "~/types/page-props";

type PageSlugProps = {
	params: Promise<{ language: Language; slug: string }>;
};

export async function generateStaticParams() {
	const pageParams = await Promise.all(
		i18n.languages.map(async ({ id }) => {
			const pages = (await sanityFetch({
				query: PAGES_SLUGS_QUERY,
				params: { language: id },
				revalidate: 60,
			})) as PAGES_SLUGS_QUERYResult | null;

			return (pages ?? [])
				.filter((page) => page.slug && page.slug !== "/") // Exclude home
				.map((page) => ({
					language: id,
					slug: page.slug,
				}));
		}),
	);

	return pageParams.flat();
}

export async function generateMetadata({
	params,
}: PageSlugProps): Promise<Metadata> {
	const { language, slug } = await params;

	const [site, pageData] = await Promise.all([
		sanityFetch({ query: SITE_SETTINGS_QUERY, revalidate: 3600 }),
		sanityFetch({
			query: PAGE_BY_SLUG_QUERY,
			params: { slug, language },
			revalidate: 3600,
		}),
	]);

	if (!pageData) {
		return {
			title: "Page | DIGITCORE",
		};
	}

	const siteUrl = site?.url ?? "https://digitcore.org";
	const title = pageData.title ? `${pageData.title}` : "Page";
	const description =
		buildDescriptionFromPortableText(pageData.description, 200) ??
		site?.seoDescription ??
		site?.description;

	// Get all language versions of this page for hreflang
	const allPageVersions = await sanityFetch({
		query: PAGES_BY_PAGE_ID_QUERY,
		params: { pageId: pageData.pageId },
		revalidate: 3600,
	}) as Array<{ language: Language; slug: string }> | null;

	const languageSlugs =
		allPageVersions?.map((page) => page.language) ?? [language];
	const slugMap =
		allPageVersions?.reduce(
			(acc, page) => {
				acc[page.language as Language] = page.slug;
				return acc;
			},
			{} as Record<Language, string>,
		) ?? { [language]: slug };

	const canonical = buildAbsoluteUrl(siteUrl, `/${language}/${slug}`);
	const hreflang = buildHreflang(siteUrl, `/${slug}`, languageSlugs, slugMap);

	return {
		title,
		description,
		alternates: {
			canonical,
			languages: hreflang,
		},
		openGraph: {
			type: "website",
			url: canonical,
			images: [
				{
					url: buildAbsoluteUrl(siteUrl, "/opengraph-image"),
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: { card: "summary_large_image" },
	};
}

export default async function Page({ params }: PageSlugProps) {
	const { language, slug } = await params;

	const pageData = await sanityFetch({
		query: PAGE_BY_SLUG_QUERY,
		params: { slug, language },
		revalidate: 60,
	}) as PAGE_BY_SLUG_QUERYResult | null;

	if (!pageData) {
		notFound();
	}

	// Route to appropriate view based on pageId
	switch (pageData.pageId) {
		case "glossary":
			return (
				<GlossaryPageView pageData={pageData} language={language} />
			);
		case "about":
			return <AboutPageView pageData={pageData} language={language} />;
		case "tags":
			return <TagsPageView pageData={pageData} language={language} />;
		case "values":
			return <ValuesPageView pageData={pageData} language={language} />;
		case "themes":
			return <ThemesPageView pageData={pageData} language={language} />;
		case "faq":
			return <FAQPageView pageData={pageData} language={language} />;
		case "acknowledgements":
			return (
				<AcknowledgementsPageView
					pageData={pageData}
					language={language}
				/>
			);
		case "patterns":
			return (
				<PatternsPageView pageData={pageData} language={language} />
			);
		default:
			// Generic page view for any other pageId or fallback
			return (
				<div>
					<h1>{pageData.title}</h1>
					{pageData.description && (
						<div>{JSON.stringify(pageData.description)}</div>
					)}
				</div>
			);
	}
}

