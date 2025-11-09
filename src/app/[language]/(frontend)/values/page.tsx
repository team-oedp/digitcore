import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import CustomizablePatternCombination from "~/components/shared/customizable-pattern-combination-wrapper";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import { type Language, i18n } from "~/i18n/config";
import { buildAbsoluteUrl } from "~/lib/metadata";
import { buildHreflang } from "~/lib/seo";
import { sanityFetch } from "~/sanity/lib/client";
import { SITE_SETTINGS_QUERY, VALUES_PAGE_QUERY } from "~/sanity/lib/queries";
import type { VALUES_PAGE_QUERYResult } from "~/sanity/sanity.types";
import type { LanguagePageProps } from "~/types/page-props";

const VALUES_LANGUAGES_QUERY = `array::unique(*[_type == 'page' && slug.current == 'values' && defined(language)].language)`;

export async function generateStaticParams() {
	const available = (await sanityFetch({
		query: VALUES_LANGUAGES_QUERY,
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
	const canonical = buildAbsoluteUrl(siteUrl, `/${language}/values`);
	const available = (await sanityFetch({
		query: VALUES_LANGUAGES_QUERY,
		revalidate: 60,
	})) as string[] | null;
	const allowed = new Set<Language>(i18n.languages.map((l) => l.id));
	const languages = (available ?? []).filter((id) =>
		allowed.has(id as Language),
	) as Language[];
	return {
		title: "Values | DIGITCORE",
		description:
			"Open infrastructure and environmental research values and principles.",
		alternates: {
			canonical,
			languages: buildHreflang(siteUrl, "/values", languages),
		},
	};
}

// metadata is generated via generateMetadata above

export default async function Page({ params }: LanguagePageProps) {
	const { language } = await params;
	const pageData = await sanityFetch({
		query: VALUES_PAGE_QUERY,
		params: { language },
		revalidate: 60,
	});

	if (!pageData) {
		notFound();
	}

	return (
		<PageWrapper>
			<div className="flex flex-col pb-44">
				{pageData.title && <PageHeading title={pageData.title} />}
				{pageData.description && (
					<CustomPortableText
						value={pageData.description as PortableTextBlock[]}
						className="mt-8 text-body"
					/>
				)}
				<div className="flex flex-col gap-20 pt-20 lg:gap-40 lg:pt-40">
					{pageData.content?.map(
						(
							section: NonNullable<
								NonNullable<VALUES_PAGE_QUERYResult>["content"]
							>[number],
							index: number,
						) => (
							<section key={section._key} className="flex flex-col gap-5">
								{index > 0 && (
									<div className="flex justify-start pb-4">
										<CustomizablePatternCombination
											randomPatterns={3}
											size="md"
											fillColor="#A67859"
											strokeColor="#A67859"
											fillOpacity={0.5}
											strokeOpacity={0.5}
										/>
									</div>
								)}
								{section._type === "content" && section.heading && (
									<SectionHeading heading={section.heading} />
								)}
								{section._type === "content" && section.body && (
									<CustomPortableText
										value={section.body as PortableTextBlock[]}
										className="text-body [&_p]:mb-1"
									/>
								)}
							</section>
						),
					)}
				</div>
			</div>
		</PageWrapper>
	);
}
