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
import { client } from "~/sanity/lib/client";
import { HOME_PAGE_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { Page } from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "DIGITCORE Toolkit | Home",
	description:
		"Community-centered open infrastructure empowering equitable collaboration between researchers, developers, and frontline communities.",
};

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
			<div className="flex flex-col gap-4 pb-16">
				{data?.description && (
					<CustomPortableText
						value={data.description as PortableTextBlock[]}
						className="prose prose-neutral max-w-none"
					/>
				)}
				<div className="mt-4 mb-10">
					<div className="h-64 w-64">
						<DigitcoreLogoIcon
							className="h-full w-full stroke-icon/20 text-icon/20"
							stroke="currentColor"
						/>
					</div>
				</div>
				{contentSections.length > 0 && (
					<div>
						{contentSections.map((section, index) => (
							<div key={section._key || index}>
								<section className="max-w-4xl space-y-4">
									{section.heading && (
										<h2 className="prose mt-4">{section.heading}</h2>
									)}
									{section.body && (
										<CustomPortableText
											value={section.body as PortableTextBlock[]}
											className="prose max-w-none"
										/>
									)}
								</section>
								{index < contentSections.length - 1 && (
									<div className="flex justify-start py-4">
										<div
											className="icon-item"
											title={`Icon ${(index % 5) + 1}`}
											data-index={index % 5}
										>
											{index % 5 === 0 && (
												<Icon01 className="h-[120px] w-[120px] fill-icon/20 object-contain text-icon/50" />
											)}
											{index % 5 === 1 && (
												<Icon02 className="h-[120px] w-[120px] fill-icon/20 object-contain text-icon/50" />
											)}
											{index % 5 === 2 && (
												<Icon03 className="h-[120px] w-[120px] fill-icon/20 object-contain text-icon/50" />
											)}
											{index % 5 === 3 && (
												<Icon04 className="h-[120px] w-[120px] fill-icon/20 object-contain text-icon/50" />
											)}
											{index % 5 === 4 && (
												<Icon05 className="h-[120px] w-[120px] fill-icon/20 object-contain text-icon/50" />
											)}
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</PageWrapper>
	);
}
