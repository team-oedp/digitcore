import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { DigitcoreLogoIcon } from "~/components/icons/logos/digitcore";
import Icon01 from "~/components/icons/shapes/icon-01";
import Icon02 from "~/components/icons/shapes/icon-02";
import Icon03 from "~/components/icons/shapes/icon-03";
import Icon04 from "~/components/icons/shapes/icon-04";
import Icon05 from "~/components/icons/shapes/icon-05";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import { client } from "~/sanity/lib/client";
import { HOME_PAGE_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { Page } from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "DIGITCORE Toolkit | Home",
	description:
		"Community-centered open infrastructure empowering equitable collaboration between researchers, developers, and frontline communities.",
};

function getIconByIndex(index: number, className: string) {
	const icons = [Icon01, Icon02, Icon03, Icon04, Icon05] as const;
	const Icon = icons[index % icons.length] ?? Icon01;
	return <Icon className={className} />;
}

export default async function Home() {
	const isDraftMode = (await draftMode()).isEnabled;
	const data = (await client.fetch(
		HOME_PAGE_QUERY,
		{},
		isDraftMode
			? { perspective: "previewDrafts", useCdn: false, stega: true, token }
			: { perspective: "published", useCdn: true },
	)) as Page | null;

	const contentSections = (data?.content ?? []) as NonNullable<Page["content"]>;

	return (
		<PageWrapper>
			<div className="flex flex-col gap-12 pb-44">
				{data?.description && (
					<CustomPortableText
						value={data.description as PortableTextBlock[]}
						className="text-page-heading"
					/>
				)}
				<div className="h-32 w-32 md:h-64 md:w-64">
					<DigitcoreLogoIcon
						className="h-full w-full stroke-icon/20 text-icon/20"
						stroke="currentColor"
					/>
				</div>
				{contentSections.length > 0 &&
					contentSections.map((section, index) => (
						<section
							key={section._key || index}
							className="flex flex-col gap-16"
						>
							<div className="flex flex-col gap-5">
								{section._type === "content" && section.heading && (
									<SectionHeading heading={section.heading} />
								)}
								{section._type === "content" && section.body && (
									<CustomPortableText
										value={section.body as PortableTextBlock[]}
										className="prose max-w-none"
									/>
								)}
								{index < contentSections.length - 1 && (
									<div
										className="icon-item"
										title={`Icon ${(index % 5) + 1}`}
										data-index={index % 5}
									>
										{getIconByIndex(
											index,
											"h-32 w-32 md:h-64 md:w-64 fill-icon/20 object-contain text-icon/50",
										)}
									</div>
								)}
							</div>
						</section>
					))}
			</div>
		</PageWrapper>
	);
}
