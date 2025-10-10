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
import { sanityFetch } from "~/sanity/lib/client";
import { PATTERN_PAGES_SLUGS_QUERY, PATTERN_QUERY } from "~/sanity/lib/queries";
import type {
	Audience,
	PATTERN_QUERYResult,
	Pattern,
	Slug,
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
	const readable = slug
		.replace(/-/g, " ")
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
	return {
		title: `${readable} | Pattern | DIGITCORE`,
		description: `${readable}.`,
	};
}

export default async function PatternPage({ params }: PatternPageProps) {
	const { slug } = await params;

	const pattern = (await sanityFetch({
		query: PATTERN_QUERY,
		params: { slug },
		tags: [`pattern:${slug}`, "solution", "resource", "audience", "tag"],
	})) as PATTERN_QUERYResult;

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
			<PageWrapper className="flex flex-col gap-5 pb-20 md:pb-40">
				<PatternHeading
					title={pattern.title || ""}
					slug={
						typeof pattern.slug === "string"
							? pattern.slug
							: (pattern.slug as Slug | null)?.current || ""
					}
					pattern={pattern as unknown as Pattern}
				/>
				<div className="space-y-8 md:space-y-12">
					<div>
						<CustomPortableText
							value={pattern.description as PortableTextBlock[]}
							className="text-body"
						/>
						<PatternConnections
							tags={(pattern.tags as Tag[]) || undefined}
							audiences={(pattern.audiences as Audience[]) || undefined}
							theme={themeFromPattern}
						/>
					</div>
					<Solutions
						solutions={pattern.solutions || []}
						patternName={pattern.title || ""}
						patternSlug={slug}
					/>
					<Resources resources={pattern.resources || []} />
				</div>
				<div className="h-10 md:h-20" />
			</PageWrapper>
		</PatternContentProvider>
	);
}
