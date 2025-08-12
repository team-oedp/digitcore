import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { PageHeader } from "~/components/shared/page-header";
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

	if (!data) {
		return (
			<PageWrapper>
				<div className="space-y-16 pb-16">
					<div className="sticky top-0 z-10 bg-primary-foreground pt-6 pb-2">
						<div className="flex items-start justify-between gap-6">
							<div className="flex-1">
								<PageHeader title="Values" description="" />
							</div>
						</div>
					</div>
					<div className="space-y-16 lg:pl-20">
						<p className="text-2xl text-neutral-500">No content available.</p>
					</div>
				</div>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<div className="space-y-16 pb-16">
				{/* Page Header */}
				<div className="sticky top-0 z-10 bg-primary-foreground pt-6 pb-2">
					<div className="flex items-start justify-between gap-6">
						<div className="flex-1">
							<PageHeader title={data.title || "Values"} description="" />
						</div>
					</div>
				</div>

				<div className="space-y-16 lg:pl-20">
					{/* Page Description */}
					{data.description && (
						<section className="max-w-4xl">
							<CustomPortableText
								value={data.description as PortableTextBlock[]}
								className="prose-2xl prose-neutral-500 max-w-none prose-headings:font-normal prose-headings:text-neutral-500 prose-p:text-neutral-500 prose-headings:uppercase prose-p:leading-snug prose-headings:tracking-wide"
							/>
						</section>
					)}

					{/* Content Sections */}
					{data.content?.map((section) => (
						<section key={section._key} className="max-w-4xl space-y-4">
							{section.heading && (
								<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
									{section.heading}
								</h2>
							)}
							{section.body && (
								<CustomPortableText
									value={section.body as PortableTextBlock[]}
									className="prose-2xl prose-neutral-500 max-w-none prose-p:text-neutral-500 prose-p:leading-snug"
								/>
							)}
						</section>
					))}
				</div>
			</div>
		</PageWrapper>
	);
}
