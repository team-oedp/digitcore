import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import Image from "next/image";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import Icon01 from "~/components/icons/digitcore/icon-01";
import Icon02 from "~/components/icons/digitcore/icon-02";
import Icon03 from "~/components/icons/digitcore/icon-03";
import Icon04 from "~/components/icons/digitcore/icon-04";
import Icon05 from "~/components/icons/digitcore/icon-05";
import { PageHeader } from "~/components/shared/page-header";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { client } from "~/sanity/lib/client";
import { HOME_PAGE_QUERY, ICONS_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { Page } from "~/sanity/sanity.types";

// Temporary interface until types are regenerated
interface Icon {
	_id: string;
	_type: "icon";
	title: string;
	svg?: {
		asset?: {
			_ref: string;
			_type: "reference";
		};
		_type: "image";
	};
}

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

	// Keep the icons fetch for now (as requested) but we won't use it
	const icons = (await client.fetch(
		ICONS_QUERY,
		{},
		isDraftMode
			? { perspective: "previewDrafts", useCdn: false, stega: true, token }
			: { perspective: "published", useCdn: true },
	)) as Icon[];

	// Log icons data to debug
	console.log("Icons fetched from Sanity:", icons);

	const contentSections = (data?.content ?? []) as NonNullable<Page["content"]>;

	return (
		<PageWrapper>
			<div className="space-y-16 pb-16">
				<div className="sticky top-0 z-10 bg-primary-foreground pt-6 pb-2">
					<div className="flex items-start justify-between gap-6">
						<div className="flex-1">
							<PageHeader
								title={data?.title ?? "DIGITCORE"}
								description={
									data?.description as unknown as PortableTextBlock[]
								}
							/>
						</div>
					</div>
				</div>

				<div className="pb-4 lg:pl-20">
					<div className="relative h-44 max-w-4xl">
						<div className="flex justify-start">
							<Image
								src="/pattern-logo-600w.svg"
								alt="DIGITCORE Pattern Logo"
								width={500}
								height={144}
								className="h-44 w-auto object-contain"
							/>
						</div>
					</div>
				</div>

				{contentSections.length > 0 && (
					<div className="space-y-8 lg:pl-20">
						{contentSections.map((section, index) => (
							<div key={section._key || index}>
								<section className="max-w-4xl space-y-4">
									{section.heading && (
										<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
											{section.heading}
										</h2>
									)}
									{section.body && (
										<CustomPortableText
											value={section.body as unknown as PortableTextBlock[]}
											className="prose-2xl prose-neutral-500 max-w-none prose-p:text-neutral-500 prose-p:leading-snug"
										/>
									)}
								</section>

								{/* Display icon between sections (except after the last one) */}
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
