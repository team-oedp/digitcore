import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { PresentationLineChart01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { client } from "~/sanity/lib/client";
import { ABOUT_PAGE_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { Page } from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "About | DIGITCORE Toolkit",
	description:
		"Learn about DIGITCORE and our mission for open infrastructure and environmental research.",
};

export default async function AboutPage() {
	const isDraftMode = (await draftMode()).isEnabled;
	const data = (await client.fetch(
		ABOUT_PAGE_QUERY,
		{},
		isDraftMode
			? { perspective: "previewDrafts", useCdn: false, stega: true, token }
			: { perspective: "published", useCdn: true },
	)) as Page | null;

	if (!data) return null;

	return (
		<PageWrapper>
			<div className="flex flex-col gap-10 pb-44">
				{data.title && data.description && (
					<PageHeading
						title={data.title}
						description={data.description as PortableTextBlock[]}
					/>
				)}
				<Button asChild className="w-fit">
					<Link href="/onboarding" className="flex items-center gap-2">
						Start our onboarding to personalise the toolkit
						<Icon icon={PresentationLineChart01Icon} size={16} />
					</Link>
				</Button>
				{data.content?.map((section) => (
					<section key={section._key} className="flex flex-col gap-5">
						{section.heading && <SectionHeading heading={section.heading} />}
						{section.body && (
							<CustomPortableText
								value={section.body as PortableTextBlock[]}
								className="prose"
							/>
						)}
					</section>
				))}
			</div>
		</PageWrapper>
	);
}
