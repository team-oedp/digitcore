import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import type { Language } from "~/i18n/config";
import type { PAGE_BY_SLUG_QUERYResult } from "~/sanity/sanity.types";

type ThemesPageViewProps = {
	pageData: PAGE_BY_SLUG_QUERYResult;
	language: Language;
};

export function ThemesPageView({ pageData, language }: ThemesPageViewProps) {
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
				<div className="flex flex-col gap-8 pt-20 lg:pt-60">
					{pageData.content?.map(
						(
							section: NonNullable<
								NonNullable<PAGE_BY_SLUG_QUERYResult>["content"]
							>[number],
						) => (
							<section key={section._key} className="flex flex-col gap-5">
								{section._type === "content" && section.heading && (
									<SectionHeading heading={section.heading} />
								)}
								{section._type === "content" && section.body && (
									<CustomPortableText
										value={section.body as PortableTextBlock[]}
										className="prose"
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

