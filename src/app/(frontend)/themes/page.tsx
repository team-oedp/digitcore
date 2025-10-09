import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import { sanityFetch } from "~/sanity/lib/client";
import { THEMES_PAGE_QUERY } from "~/sanity/lib/queries";
import type { Page } from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "Themes | DIGITCORE",
	description:
		"Explore the six themes that organize environmental research best practices.",
};

export default async function ThemesPage() {
	const data = (await sanityFetch({
		query: THEMES_PAGE_QUERY,
		revalidate: 60,
	})) as Page | null;

	if (!data) return null;

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
				<div className="flex flex-col gap-8 pt-20 lg:pt-60">
					{data.content?.map((section) => (
						<section key={section._key} className="flex flex-col gap-5">
							{section._type === "content" && section.heading && (
								<SectionHeading heading={section.heading} />
							)}
							{section._type === "content" && section.body && (
								<CustomPortableText
									value={section.body as PortableTextBlock[]}
									className="prose"
								/>
							)}
						</section>
					))}
				</div>
			</div>
		</PageWrapper>
	);
}
