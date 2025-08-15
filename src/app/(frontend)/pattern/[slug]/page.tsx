import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { PatternConnections } from "~/components/pages/pattern/pattern-connections";
import { PatternContentProvider } from "~/components/pages/pattern/pattern-content-provider";
import type { DereferencedResource } from "~/components/pages/pattern/resources";
import { Resources } from "~/components/pages/pattern/resources";
import { Solutions } from "~/components/pages/pattern/solutions";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { PatternHeading } from "~/components/shared/pattern-heading";
import { client } from "~/sanity/lib/client";
import { PATTERN_PAGES_SLUGS_QUERY, PATTERN_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type {
	Audience,
	PATTERN_QUERYResult,
	Pattern,
	Slug,
	Solution,
	Tag,
	Theme,
} from "~/sanity/sanity.types";

export type PatternPageProps = {
	params: Promise<{ slug: string }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
	const data = await client.fetch(
		PATTERN_PAGES_SLUGS_QUERY,
		{},
		{
			perspective: "published",
			useCdn: true,
		},
	);
	return data;
}

export async function generateMetadata({
	params,
}: PatternPageProps): Promise<Metadata> {
	const { slug } = await params;
	const readable = slug
		.replace(/-/g, " ")
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
	return {
		title: `${readable} | Pattern | DIGITCORE Toolkit`,
		description: `Learn how the ${readable} pattern can support community-centered projects.`,
	};
}

export default async function PatternPage({ params }: PatternPageProps) {
	const { slug } = await params;
	const isDraftMode = (await draftMode()).isEnabled;

	const pattern: PATTERN_QUERYResult = await client.fetch(
		PATTERN_QUERY,
		{ slug },
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
	);

	if (!pattern) {
		console.log("No pattern found, returning 404");
		return notFound();
	}

	const themeFromPattern: Theme | undefined = (() => {
		const candidate = pattern as unknown as Partial<{
			theme: Theme;
			themes: Theme[];
		}>;
		if (Array.isArray(candidate.themes) && candidate.themes.length > 0) {
			return candidate.themes[0];
		}
		return candidate.theme;
	})();

	return (
		<PatternContentProvider pattern={pattern}>
			<PageWrapper className="space-y-4">
				<PatternHeading
					title={pattern.title || ""}
					slug={
						typeof pattern.slug === "string"
							? pattern.slug
							: (pattern.slug as Slug | null)?.current || ""
					}
					pattern={pattern as unknown as Pattern}
				/>
				<div className="space-y-12">
					<div>
						<CustomPortableText
							value={pattern.description as PortableTextBlock[]}
							className="prose"
						/>
						<PatternConnections
							tags={(pattern.tags as Tag[]) || undefined}
							audiences={(pattern.audiences as Audience[]) || undefined}
							theme={themeFromPattern}
						/>
					</div>
					<Solutions
						solutions={(pattern.solutions as unknown as Solution[]) || []}
						patternName={pattern.title || ""}
						patternSlug={slug}
					/>
					<Resources
						resources={
							(pattern.resources as unknown as DereferencedResource[]) || []
						}
					/>
				</div>
			</PageWrapper>
		</PatternContentProvider>
	);
}
