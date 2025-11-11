import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { Record } from "~/components/shared/record";
import { SectionHeading } from "~/components/shared/section-heading";
import type { Language } from "~/i18n/config";
import type { PAGE_BY_SLUG_QUERYResult } from "~/sanity/sanity.types";

type AcknowledgementsPageViewProps = {
	pageData: PAGE_BY_SLUG_QUERYResult;
	language: Language;
};

export function AcknowledgementsPageView({
	pageData,
	language,
}: AcknowledgementsPageViewProps) {
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
				<div className="flex flex-col gap-10 pt-20 lg:pt-20">
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
								{section._type === "record" && (
									<Record
										name={section.name}
										description={
											section.description as PortableTextBlock[] | null
										}
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

