import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { PatternConnections } from "~/components/pages/pattern/pattern-connections";
import { PatternContentProvider } from "~/components/pages/pattern/pattern-content-provider";
import { Resources } from "~/components/pages/pattern/resources";
import { Solutions } from "~/components/pages/pattern/solutions";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { PatternHeading } from "~/components/shared/pattern-heading";
import type { Language } from "~/i18n/config";
import { i18n } from "~/i18n/config";
import { buildAbsoluteUrl } from "~/lib/metadata";
import { type RouteSlug, normalizeSlug } from "~/lib/slug-utils";
import { sanityFetch } from "~/sanity/lib/client";
import {
	CARRIER_BAG_QUERY,
	PATTERN_PAGES_SLUGS_QUERY,
	PATTERN_QUERY,
	PATTERN_UTILITIES_QUERY,
	SITE_SETTINGS_QUERY,
} from "~/sanity/lib/queries";
import type {
	CARRIER_BAG_QUERYResult,
	PATTERN_PAGES_SLUGS_QUERYResult,
	PATTERN_QUERYResult,
	PATTERN_UTILITIES_QUERYResult,
} from "~/sanity/sanity.types";

type PatternPageProps = {
	params: Promise<{ language: Language; slug: string }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
	const patternParams = await Promise.all(
		i18n.languages.map(async ({ id }) => {
			const patterns = (await sanityFetch({
				query: PATTERN_PAGES_SLUGS_QUERY,
				params: { language: id },
				revalidate: 60,
			})) as PATTERN_PAGES_SLUGS_QUERYResult | null;

			return (patterns ?? []).flatMap((pattern) =>
				pattern.slug
					? [
							{
								language: id,
								slug: pattern.slug,
							},
						]
					: [],
			);
		}),
	);

	return patternParams.flat();
}

export async function generateMetadata(
	props: PatternPageProps,
): Promise<Metadata> {
	const { language, slug } = await props.params;
	const normalizedSlug = normalizeSlug(slug as RouteSlug);

	if (!normalizedSlug) {
		return { title: "Pattern" };
	}

	const [site, pattern] = await Promise.all([
		sanityFetch({ query: SITE_SETTINGS_QUERY, revalidate: 3600 }),
		sanityFetch({
			query: PATTERN_QUERY,
			params: { slug: normalizedSlug, language },
			revalidate: 3600,
		}),
	]);

	const siteUrl = site?.url ?? "https://digitcore.org";
	const readable = normalizedSlug
		.replace(/-/g, " ")
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
	const title = pattern?.title ?? readable;
	const description =
		(pattern as { descriptionPlainText?: string } | null)
			?.descriptionPlainText ??
		site?.seoDescription ??
		site?.description;
	const ogUrl = buildAbsoluteUrl(siteUrl, `/pattern/${normalizedSlug}`);

	return {
		title: `${title} | Pattern`,
		description: description ?? undefined,
		alternates: { canonical: ogUrl },
		openGraph: {
			type: "article",
			url: ogUrl,
			images: [
				{
					url: buildAbsoluteUrl(
						siteUrl,
						`/pattern/${normalizedSlug}/opengraph-image`,
					),
					width: 1200,
					height: 630,
					alt: `${title} | DIGITCORE`,
				},
			],
		},
		twitter: { card: "summary_large_image" },
	};
}

export default async function Page(props: PatternPageProps) {
	const { language, slug } = await props.params;
	const normalizedSlug = normalizeSlug(slug as RouteSlug);

	if (!normalizedSlug) {
		return notFound();
	}

	const [pattern, carrierBagData, patternUtilities] = await Promise.all([
		sanityFetch({
			query: PATTERN_QUERY,
			params: { slug: normalizedSlug, language },
			tags: [
				`pattern:${normalizedSlug}`,
				"solution",
				"resource",
				"audience",
				"tag",
			],
		}) as Promise<PATTERN_QUERYResult | null>,
		sanityFetch({
			query: CARRIER_BAG_QUERY,
			params: { language },
			revalidate: 60,
		}) as Promise<CARRIER_BAG_QUERYResult | null>,
		sanityFetch({
			query: PATTERN_UTILITIES_QUERY,
			params: { language },
			revalidate: 60,
		}) as Promise<PATTERN_UTILITIES_QUERYResult | null>,
	]);

	if (!pattern) {
		return notFound();
	}

	return (
		<PatternContentProvider pattern={pattern}>
			<PageWrapper className="flex flex-col gap-5 pb-20 md:pb-40">
				<PatternHeading
					title={pattern.title}
					slug={pattern.slug}
					pattern={pattern}
					carrierBagData={carrierBagData}
				/>
				<div className="space-y-8 md:space-y-12">
					<div>
						{pattern.description && (
							<CustomPortableText
								value={pattern.description as PortableTextBlock[]}
								className="text-body"
							/>
						)}
						<PatternConnections
							tags={pattern.tags ?? undefined}
							audiences={pattern.audiences ?? undefined}
							theme={pattern.theme ?? undefined}
							patternUtilities={patternUtilities}
						/>
					</div>
					<Solutions
						solutions={pattern.solutions}
						patternName={pattern.title ?? ""}
						patternSlug={normalizedSlug}
						patternUtilities={patternUtilities}
					/>
					<Resources
						resources={pattern.resources ?? []}
						patternUtilities={patternUtilities}
					/>
				</div>
				<div className="h-10 md:h-20" />
			</PageWrapper>
		</PatternContentProvider>
	);
}
