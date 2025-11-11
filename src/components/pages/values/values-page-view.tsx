import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import CustomizablePatternCombination from "~/components/shared/customizable-pattern-combination-wrapper";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import type { Language } from "~/i18n/config";
import type { PAGE_BY_SLUG_QUERYResult } from "~/sanity/sanity.types";

type ValuesPageViewProps = {
	pageData: PAGE_BY_SLUG_QUERYResult;
	language: Language;
};

export function ValuesPageView({ pageData, language }: ValuesPageViewProps) {
	return (
		<PageWrapper>
			<div className="flex flex-col pb-44">
				{pageData.title && <PageHeading title={pageData.title} />}
				{pageData.description && (
					<CustomPortableText
						value={pageData.description as PortableTextBlock[]}
						className="mt-8 text-body"
					/>
				)}
				<div className="flex flex-col gap-20 pt-20 lg:gap-40 lg:pt-40">
					{pageData.content?.map(
						(
							section: NonNullable<
								NonNullable<PAGE_BY_SLUG_QUERYResult>["content"]
							>[number],
							index: number,
						) => (
							<section key={section._key} className="flex flex-col gap-5">
								{index > 0 && (
									<div className="flex justify-start pb-4">
										<CustomizablePatternCombination
											randomPatterns={3}
											size="md"
											fillColor="#A67859"
											strokeColor="#A67859"
											fillOpacity={0.5}
											strokeOpacity={0.5}
										/>
									</div>
								)}
								{section._type === "content" && section.heading && (
									<SectionHeading heading={section.heading} />
								)}
								{section._type === "content" && section.body && (
									<CustomPortableText
										value={section.body as PortableTextBlock[]}
										className="text-body [&_p]:mb-1"
									/>
								)}
							</section>
						),
					)}
				</div>
			</div>
		</PageWrapper>
	);
}

