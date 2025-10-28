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
import { type RouteSlug, normalizeSlug } from "~/lib/slug-utils";
import { sanityFetch } from "~/sanity/lib/client";
import { PATTERN_PAGES_SLUGS_QUERY, PATTERN_QUERY } from "~/sanity/lib/queries";
import type {
	PATTERN_PAGES_SLUGS_QUERYResult,
	PATTERN_QUERYResult,
} from "~/sanity/sanity.types";

type PatternPageProps = PageProps<"/[language]/pattern/[slug]">;

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
	const { slug } = await props.params;
	const normalizedSlug = normalizeSlug(slug as RouteSlug);
	const readable = normalizedSlug
		? normalizedSlug
				.replace(/-/g, " ")
				.split(" ")
				.map(
					(word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
				)
				.join(" ")
		: "Pattern";
	return {
		title: `${readable} | Pattern | DIGITCORE`,
		description: `${readable}.`,
	};
}

export default async function Page(props: PatternPageProps) {
	const { language: languageParam, slug } = await props.params;
	const language = languageParam as Language;
	const normalizedSlug = normalizeSlug(slug as RouteSlug);

	if (!normalizedSlug) {
		return notFound();
	}

	const pattern = (await sanityFetch({
		query: PATTERN_QUERY,
		params: { slug: normalizedSlug, language },
		tags: [
			`pattern:${normalizedSlug}`,
			"solution",
			"resource",
			"audience",
			"tag",
		],
	})) as PATTERN_QUERYResult | null;

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
						patternSlug={normalizedSlug}
					/>
					<Resources resources={pattern.resources ?? []} />
				</div>
				<div className="h-10 md:h-20" />
			</PageWrapper>
		</PatternContentProvider>
	);
}
