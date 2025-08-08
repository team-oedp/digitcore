import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { PageHeader } from "~/components/shared/page-header";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { PatternConnections } from "~/components/pages/pattern/pattern-connections";
import { PatternContentProvider } from "~/components/pages/pattern/pattern-content-provider";
import { Resources } from "~/components/pages/pattern/resources";
import { Solutions } from "~/components/pages/pattern/solutions";
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

	// Option 1: Use the improved single query (recommended for simplicity)
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

	// Option 2: Use separate queries for better performance and type safety
	// Uncomment this block and comment out the above if you want to use the fetcher approach
	/*
	import { client } from "~/sanity/lib/client"
	import { fetchPatternWithRelations } from "~/sanity/lib/pattern-fetcher"
	
	const pattern = await fetchPatternWithRelations(client, slug)
	*/

	if (!pattern) {
		console.log("No pattern found, returning 404");
		return notFound();
	}

	return (
		<PatternContentProvider pattern={pattern}>
			<PageWrapper>
				<div className="space-y-12">
					<div className="ml-18">
						<PageHeader
							title={pattern.title || ""}
							description={
								pattern.description as PortableTextBlock[] | undefined
							}
							slug={
								typeof pattern.slug === "string"
									? pattern.slug
									: (pattern.slug as Slug | null)?.current || ""
							}
							pattern={pattern as unknown as Pattern}
						/>
						<PatternConnections
							tags={(pattern.tags as Tag[]) || undefined}
							audiences={(pattern.audiences as Audience[]) || undefined}
							theme={(pattern.theme as unknown as Theme) || undefined}
						/>
					</div>
					<Solutions solutions={(pattern.solutions as Solution[]) || []} />
					<Resources resources={pattern.resources || []} />
				</div>
				<Solutions
					solutions={pattern.solutions || []}
					patternName={pattern.title || ""}
					patternSlug={slug}
				/>
				<Resources resources={pattern.resources || []} />
			</PageWrapper>
		</PatternContentProvider>
	);
}
