import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { PageHeader } from "~/components/global/page-header";
import { PageWrapper } from "~/components/global/page-wrapper";
import { PatternConnections } from "~/components/pages/pattern/pattern-connections";
import { Resources } from "~/components/pages/pattern/resources";
import { Solutions } from "~/components/pages/pattern/solutions";
import { sanityFetch } from "~/sanity/lib/live";
import { PATTERN_PAGES_SLUGS_QUERY, PATTERN_QUERY } from "~/sanity/lib/queries";
import type { Pattern, Slug } from "~/sanity/sanity.types";

export type PatternPageProps = {
	params: Promise<{ slug: string }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
	const { data } = await sanityFetch({
		query: PATTERN_PAGES_SLUGS_QUERY,
		stega: false,
		perspective: "published",
	});
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

	// Promise.all because we may want to add other fetches for glossary data later for example
	const [{ data: pattern }] = await Promise.all([
		sanityFetch({
			query: PATTERN_QUERY,
			params: { slug },
			// Metadata should never contain stega
			stega: false,
		}),
	]);

	if (!pattern) {
		console.log("No pattern found, returning 404");
		return notFound();
	}

	return (
		<PageWrapper>
			<div className="space-y-12">
				<div className="ml-18">
					<PageHeader
						title={pattern.title || ""}
						description={pattern.description as PortableTextBlock[] | undefined}
						slug={
							typeof pattern.slug === "string"
								? pattern.slug
								: (pattern.slug as Slug | null)?.current || ""
						}
						pattern={pattern as unknown as Pattern}
					/>
					<PatternConnections
						tags={pattern.tags || undefined}
						audiences={pattern.audiences || undefined}
						themes={pattern.themes || undefined}
					/>
				</div>
				<Solutions solutions={pattern.solutions || []} />
				<Resources resources={pattern.resources || []} />
			</div>
		</PageWrapper>
	);
}
