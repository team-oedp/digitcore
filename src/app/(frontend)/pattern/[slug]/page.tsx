import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "~/components/global/page-header";
import { PageWrapper } from "~/components/global/page-wrapper";
import { PatternConnections } from "~/components/pages/pattern/pattern-connections";
import { Resources } from "~/components/pages/pattern/resources";
import { Solutions } from "~/components/pages/pattern/solutions";
import { sanityFetch } from "~/sanity/lib/live";
import { PATTERN_PAGES_SLUGS_QUERY, PATTERN_QUERY } from "~/sanity/lib/queries";

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
	const readable = slug.replace(/-/g, " ");
	return {
		title: `${readable} | Pattern | DIGITCORE Toolkit`,
		description: `Learn how the ${readable} pattern can support community-centered projects.`,
	};
}

export default async function PatternPage({ params }: PatternPageProps) {
	const { slug } = await params;
	const readable = slug.replace(/-/g, " ");

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

	console.log({ pattern });

	return (
		<PageWrapper>
			<div className="space-y-12">
				<div className="ml-18">
					<PageHeader
						slug={slug}
						description={
							"Agency emerges when frontline communities lead or co-lead in decision-making. When researchers or technology developers set goals without community input, they risk overlooking local knowledge and undermining self-determination. For example, analysis of monitoring or sensor data without input from or discussion with communities risks the sharing of incomplete knowledge that can demotivate further collaboration or intervention as analytical assumptions might not reflect the communities' lived experience. Achieving this level of input from communities may demand forms of communication that go beyond typical research or technology development activities, such as participating in community organizing activities, storytelling, or simply one-on-one or in-person conversations."
						}
					/>
					<PatternConnections />
				</div>
				<Solutions />
				<Resources />
			</div>
		</PageWrapper>
	);
}
