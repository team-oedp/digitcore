import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import CustomizablePatternCombination from "~/components/shared/customizable-pattern-combination-wrapper";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import { buildAbsoluteUrl } from "~/lib/metadata";
import { sanityFetch } from "~/sanity/lib/client";
import { ABOUT_PAGE_QUERY, SITE_SETTINGS_QUERY } from "~/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
	const [site, page] = await Promise.all([
		sanityFetch({ query: SITE_SETTINGS_QUERY, revalidate: 3600 }),
		sanityFetch({ query: ABOUT_PAGE_QUERY, revalidate: 3600 }),
	]);
	const siteUrl = site?.url ?? "https://digitcore.org";
	const title = page?.title ? `${page.title}` : "About";
	const description = page?.description
		? undefined
		: (site?.seoDescription ?? site?.description);
	const canonical = buildAbsoluteUrl(siteUrl, "/about");
	return {
		title,
		description,
		alternates: { canonical },
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

export default async function AboutPage() {
	const data = await sanityFetch({
		query: ABOUT_PAGE_QUERY,
		revalidate: 60,
	});

	if (!data) {
		return notFound();
	}

	return (
		<PageWrapper>
			<div className="flex flex-col pb-44">
				{data.title && <PageHeading title={data.title} />}
				{data.description && (
					<CustomPortableText
						value={data.description as PortableTextBlock[]}
						className="mt-8 text-body"
					/>
				)}
				<div className="flex flex-col gap-20 pt-20 lg:gap-40 lg:pt-40">
					{data.content?.map((section, index) => (
						<section key={section._key} className="flex flex-col gap-5">
							{/* Add section break before each section (except the first) */}
							{index > 0 && (
								<div className="flex justify-start pb-4">
									<CustomizablePatternCombination
										randomPatterns={3}
										size="md"
										fillColor="#A35C89"
										strokeColor="#A35C89"
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
									className="text-body"
								/>
							)}
						</section>
					))}
				</div>
			</div>
		</PageWrapper>
	);
}
