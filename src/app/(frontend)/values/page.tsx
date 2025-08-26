import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import { client } from "~/sanity/lib/client";
import { VALUES_PAGE_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { Page } from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "Values | DIGITCORE Toolkit",
	description:
		"Open infrastructure and environmental research values and principles.",
};

export default async function ValuesPage() {
	const isDraftMode = (await draftMode()).isEnabled;
	const data = (await client.fetch(
		VALUES_PAGE_QUERY,
		{},
		isDraftMode
			? { perspective: "previewDrafts", useCdn: false, stega: true, token }
			: { perspective: "published", useCdn: true },
	)) as Page | null;

	if (!data) return null;

	return (
		<PageWrapper>
			<div className="flex flex-col pb-44">
				{data.title && data.description && (
					<div className="mb-20 lg:mb-60">
						<PageHeading title={data.title} />
						<CustomPortableText
							value={data.description as PortableTextBlock[]}
							className="mt-8 text-body"
						/>
					</div>
				)}
				<div className="flex flex-col gap-8">
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
