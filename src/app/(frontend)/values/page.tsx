import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import { sanityFetch } from "~/sanity/lib/client";
import { VALUES_PAGE_QUERY } from "~/sanity/lib/queries";
import type { Page } from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "Values | DIGITCORE",
	description:
		"Open infrastructure and environmental research values and principles.",
};

export default async function ValuesPage() {
	const pageData = (await sanityFetch({
		query: VALUES_PAGE_QUERY,
		revalidate: 60,
	})) as Page | null;

	if (!pageData) return null;

	return (
		<PageWrapper>
			<div className="flex flex-col pb-44">
				{pageData.title && <PageHeading title={pageData.title} />}
				{pageData.description && (
					<CustomPortableText
						value={pageData.description as PortableTextBlock[]}
						className="mt-8 text-body"
					/>
				)}
				<div className="flex flex-col gap-20 pt-20 lg:gap-40 lg:pt-40">
					{pageData.content?.map((section) => (
						<section key={section._key} className="flex flex-col gap-5">
							{section._type === "content" && section.heading && (
								<SectionHeading heading={section.heading} />
							)}
							{section._type === "content" && section.body && (
								<CustomPortableText
									value={section.body as PortableTextBlock[]}
									className="text-body [&_p]:mb-1"
								/>
							)}
						</section>
					))}
				</div>
			</div>
		</PageWrapper>
	);
}
