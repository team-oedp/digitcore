import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { PageWrapper } from "~/components/shared/page-wrapper";
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
			<div className="space-y-8 pb-16">
				{data.description && (
					<section className="max-w-4xl">
						<CustomPortableText
							value={data.description as PortableTextBlock[]}
							className="prose prose-neutral max-w-none"
						/>
					</section>
				)}
				{data.content?.map((section) => (
					<section key={section._key} className="max-w-4xl space-y-4">
						{section.heading && (
							<h2 className="font-normal text-lg text-primary uppercase tracking-wide">
								{section.heading}
							</h2>
						)}
						{section.body && (
							<CustomPortableText
								value={section.body as PortableTextBlock[]}
								className="prose prose-neutral max-w-none"
							/>
						)}
					</section>
				))}
			</div>
		</PageWrapper>
	);
}
