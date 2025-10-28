import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import type { Language } from "~/i18n/config";
import { sanityFetch } from "~/sanity/lib/client";
import { ABOUT_PAGE_QUERY } from "~/sanity/lib/queries";

export const metadata: Metadata = {
	title: "About | DIGITCORE",
	description:
		"Learn about DIGITCORE and our mission for open infrastructure and environmental research.",
};

type AboutPageProps = {
	params: { language: Language };
};

export default async function AboutPage({ params }: AboutPageProps) {
	const { language } = params;
	const data = await sanityFetch({
		query: ABOUT_PAGE_QUERY,
		params: { language },
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
					{data.content?.map((section) => (
						<section key={section._key} className="flex flex-col gap-5">
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
