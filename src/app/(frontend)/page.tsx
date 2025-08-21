import { ArrangeIcon, Atom01Icon } from "@hugeicons/core-free-icons";
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
import { Icon } from "~/components/shared/icon";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
			<div className="flex flex-col gap-16 pb-44">
				{data?.description && (
					<CustomPortableText
						value={data.description as PortableTextBlock[]}
						className="text-page-heading"
					/>
				)}
				<div className="h-32 w-32 md:h-64 md:w-64">
					<DigitcoreLogoIcon
						className="h-full w-full stroke-icon/20 text-icon/20 opacity-40"
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
								{section._type === "content" && index > 0 && (
									<div
										className="icon-item mb-6 md:mb-8"
										title={`Icon ${(index % 5) + 1}`}
										data-index={index % 5}
									>
										{getIconByIndex(
											index,
											"h-32 w-32 md:h-64 md:w-64 fill-icon/20 object-contain text-icon/50",
										)}
									</div>
								)}
								{section._type === "content" && section.heading && (
									<SectionHeading heading={section.heading} />
								)}
								{section._type === "content" && section.body && (
									<CustomPortableText
										value={section.body as PortableTextBlock[]}
										className="prose max-w-none"
									/>
								)}
								{isCardCarouselSection(section) &&
									Array.isArray(section.cards) &&
									section.cards.length > 0 && (
										<div className="columns-1 gap-x-6 sm:columns-2">
											{section.cards.slice(0, 6).map((card) => {
												const sectionTitle = (section as { title?: string })
													.title;
												const titleIcon =
													sectionTitle === "Audiences"
														? ArrangeIcon
														: sectionTitle === "Values"
															? Atom01Icon
															: undefined;
												return (
													<div
														key={card._key}
														className="mb-6 break-inside-avoid"
													>
														<Card className="h-fit shadow-none">
															<CardHeader className="py-4">
																<div className="relative">
																	{titleIcon ? (
																		<Icon
																			icon={titleIcon}
																			size={20}
																			className="absolute top-0 left-0 shrink-0"
																		/>
																	) : null}
																	<CardTitle
																		className={titleIcon ? "pl-8" : undefined}
																	>
																		{card.title}
																	</CardTitle>
																</div>
															</CardHeader>
															<CardContent className="overflow-auto text-sm leading-snug">
																{card.description && (
																	<CustomPortableText
																		value={
																			card.description as PortableTextBlock[]
																		}
																		className="prose prose-sm max-w-none leading-snug"
																	/>
																)}
															</CardContent>
														</Card>
													</div>
												);
											})}
										</div>
									)}
							</div>
						</section>
					))}
			</div>
		</PageWrapper>
	);
}
