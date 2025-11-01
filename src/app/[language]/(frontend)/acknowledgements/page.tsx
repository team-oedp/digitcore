import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { Record } from "~/components/shared/record";
import { SectionHeading } from "~/components/shared/section-heading";
import { sanityFetch } from "~/sanity/lib/client";
import { ACKNOWLEDGEMENTS_PAGE_QUERY } from "~/sanity/lib/queries";
import type { LanguagePageProps } from "~/types/page-props";

export const metadata: Metadata = {
	title: "Acknowledgements | DIGITCORE",
	description:
		"Acknowledgements and credits for the DIGITCORE project and its contributors.",
};

export default async function Page({ params }: LanguagePageProps) {
	const { language } = await params;
	const data = await sanityFetch({
		query: ACKNOWLEDGEMENTS_PAGE_QUERY,
		params: { language },
		revalidate: 60,
	});

	if (!data) {
		notFound();
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
				<div className="flex flex-col gap-10 pt-20 lg:pt-20">
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
							{section._type === "record" && (
								<Record
									name={section.name}
									description={
										section.description as PortableTextBlock[] | null
									}
								/>
							)}
						</section>
					))}
				</div>
			</div>
		</PageWrapper>
	);
}
