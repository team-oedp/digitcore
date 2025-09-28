import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import type { GlossaryTerm } from "~/lib/glossary-utils";
import { client } from "~/sanity/lib/client";
import { GLOSSARY_TERMS_QUERY, HOME_PAGE_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { Page } from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "Home | DIGITCORE",
	description:
		"Community-centered open infrastructure empowering equitable collaboration between researchers, developers, and frontline communities.",
};

export default async function Home() {
	const isDraftMode = (await draftMode()).isEnabled;
	const [data, glossaryTerms] = await Promise.all([
		client.fetch(
			HOME_PAGE_QUERY,
			{},
			isDraftMode
				? { perspective: "previewDrafts", useCdn: false, stega: true, token }
				: { perspective: "published", useCdn: true },
		) as Promise<Page | null>,
		client.fetch(
			GLOSSARY_TERMS_QUERY,
			{},
			isDraftMode
				? { perspective: "previewDrafts", useCdn: false, stega: true, token }
				: { perspective: "published", useCdn: true },
		) as Promise<GlossaryTerm[]>,
	]);

	const contentSections = (data?.content ?? []) as NonNullable<Page["content"]>;

	return (
		<PageWrapper>
			<div className="pb-44">
				<PageHeading title="Home" />
				<div className="flex flex-col gap-20 pt-20 lg:gap-60 lg:pt-60">
					{contentSections.map((section, sectionIndex) => {
						if (section._type === "content") {
							return (
								<section
									key={section._key || `content-${sectionIndex}`}
									className="flex flex-col gap-5"
								>
									{section.heading && (
										<SectionHeading heading={section.heading} />
									)}
									{section.body && (
										<CustomPortableText
											value={section.body as PortableTextBlock[]}
											className="text-body"
											glossaryTerms={glossaryTerms}
										/>
									)}
								</section>
							);
						}

						if (section._type === "contentList") {
							const listItems = section.items || [];
							return (
								<section
									key={section._key || `contentList-${sectionIndex}`}
									className="mt-8 mb-8 space-y-6"
								>
									{Array.isArray(listItems) &&
										listItems.length > 0 &&
										listItems.slice(0, 6).map((item) => (
											<div key={item._key} className="pl-8">
												<div className="mb-3 pb-2">
													<h3 className="text-heading-compact">{item.title}</h3>
												</div>
												{item.description && (
													<CustomPortableText
														value={item.description as PortableTextBlock[]}
														className="mt-3 text-body"
														glossaryTerms={glossaryTerms}
													/>
												)}
											</div>
										))}
								</section>
							);
						}

						return null;
					})}
				</div>
			</div>
		</PageWrapper>
	);
}
