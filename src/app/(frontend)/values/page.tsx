import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import CustomizablePatternCombination from "~/components/shared/customizable-pattern-combination-wrapper";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import { sanityFetch } from "~/sanity/lib/client";
import { VALUES_PAGE_QUERY } from "~/sanity/lib/queries";

export const metadata: Metadata = {
	title: "Values | DIGITCORE",
	description:
		"Open infrastructure and environmental research values and principles.",
};

export default async function ValuesPage() {
	const pageData = await sanityFetch({
		query: VALUES_PAGE_QUERY,
		revalidate: 60,
	});

	if (!pageData) {
		return notFound();
	}

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
					{pageData.content?.map((section, index) => (
						<section key={section._key} className="flex flex-col gap-5">
							{index > 0 && (
								<div className="flex justify-start pb-4">
									<CustomizablePatternCombination
										randomPatterns={3}
										size="md"
										fillColor="#A67859"
										strokeColor="#A67859"
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
