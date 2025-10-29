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
import { buildAbsoluteUrl } from "~/lib/metadata";
import { sanityFetch } from "~/sanity/lib/client";
import {
	PATTERN_PAGES_SLUGS_QUERY,
	PATTERN_QUERY,
	SITE_SETTINGS_QUERY,
} from "~/sanity/lib/queries";
import type { PATTERN_QUERYResult } from "~/sanity/sanity.types";

export type PatternPageProps = {
	params: Promise<{ slug: string }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
	const data = await sanityFetch({
		query: PATTERN_PAGES_SLUGS_QUERY,
		revalidate: 60,
	});
	return data;
}

export async function generateMetadata({
	params,
}: PatternPageProps): Promise<Metadata> {
	const { slug } = await params;
	const [site, pattern] = await Promise.all([
		sanityFetch({ query: SITE_SETTINGS_QUERY, revalidate: 3600 }),
		sanityFetch({ query: PATTERN_QUERY, params: { slug }, revalidate: 3600 }),
	]);
	const siteUrl = site?.url ?? "https://digitcore.org";
	const title = pattern?.title ?? slug.replace(/-/g, " ");
	const description =
		pattern?.descriptionPlainText ?? site?.seoDescription ?? site?.description;
	const ogUrl = buildAbsoluteUrl(siteUrl, `/pattern/${slug}`);
	return {
		title: `${title} | Pattern`,
		description: description ?? undefined,
		alternates: { canonical: ogUrl },
		openGraph: {
			type: "article",
			url: ogUrl,
			images: [
				{
					url: buildAbsoluteUrl(siteUrl, `/pattern/${slug}/opengraph-image`),
					width: 1200,
					height: 630,
					alt: `${title} | DIGITCORE`,
				},
			],
		},
		twitter: { card: "summary_large_image" },
	};
}

export default async function PatternPage({ params }: PatternPageProps) {
	const { slug } = await params;

	const pattern: PATTERN_QUERYResult = await sanityFetch({
		query: PATTERN_QUERY,
		params: { slug },
		tags: [`pattern:${slug}`, "solution", "resource", "audience", "tag"],
	});

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
						/>
					</div>
					<Solutions
						solutions={pattern.solutions}
						patternName={pattern.title ?? ""}
						patternSlug={slug}
					/>
					<Resources resources={pattern.resources ?? []} />
				</div>
				<div className="h-10 md:h-20" />
			</PageWrapper>
		</PatternContentProvider>
	);
}
