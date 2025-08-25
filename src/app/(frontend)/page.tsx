import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { CustomPortableText } from "~/components/global/custom-portable-text";

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
import type { CardCarousel, Page } from "~/sanity/sanity.types";

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

	function isCardCarouselSection(section: unknown): section is {
		_type: "cardCarousel";
		cards?: CardCarousel["cards"];
		title?: string;
	} {
		if (typeof section !== "object" || section === null) return false;
		return (
			"_type" in section &&
			(section as { _type?: unknown })._type === "cardCarousel"
		);
	}

	return (
		<PageWrapper>
			<div className="flex flex-col gap-40 pb-44">
				{data?.description && (
					<CustomPortableText
						value={data.description as PortableTextBlock[]}
						className="text-page-heading lg:mb-20"
					/>
				)}
				{contentSections.length > 0 &&
					contentSections.map((section, index) => (
						<section
							key={section._key || index}
							className="flex flex-col gap-5"
						>
							{section._type === "content" && (
								<div
									title={`Layered Icons ${index * 3 + 1}-${index * 3 + 3}`}
									data-index={`layered-${index}`}
									className="relative h-24 w-24 lg:mb-2.5 lg:h-28 lg:w-28"
								>
									{/* Layer 1 - Bottom icon */}
									<div className="absolute inset-0">
										{getIconByIndex(
											index * 3,
											"w-full h-full fill-icon/20 object-contain opacity-40 text-icon/50",
										)}
									</div>
									{/* Layer 2 - Middle icon */}
									<div className="absolute inset-0">
										{getIconByIndex(
											index * 3 + 1,
											"w-full h-full fill-icon/20 object-contain opacity-40 text-icon/50",
										)}
									</div>
									{/* Layer 3 - Top icon */}
									<div className="absolute inset-0">
										{getIconByIndex(
											index * 3 + 2,
											"w-full h-full fill-icon/20 object-contain opacity-40 text-icon/50",
										)}
									</div>
								</div>
							)}
							{section._type === "content" && section.heading && (
								<SectionHeading heading={section.heading} />
							)}
							{section._type === "content" && section.body && (
								<CustomPortableText
									value={section.body as PortableTextBlock[]}
									className="text-body"
								/>
							)}
							{isCardCarouselSection(section) &&
								Array.isArray(section.cards) &&
								section.cards.length > 0 && (
									<div className="space-y-6">
										{section.cards.slice(0, 6).map((card) => (
											<div key={card._key} className="pl-8">
												<div className="mb-3 pb-2">
													<h3 className="font-medium text-body uppercase">
														{card.title}
													</h3>
												</div>
												{card.description && (
													<CustomPortableText
														value={card.description as PortableTextBlock[]}
														className="mt-3 text-body"
													/>
												)}
											</div>
										))}
									</div>
								)}
						</section>
					))}
			</div>
		</PageWrapper>
	);
}
