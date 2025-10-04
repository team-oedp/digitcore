import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { HeadingMorph } from "~/components/shared/heading-morph";
import { PageWrapper } from "~/components/shared/page-wrapper";
import PatternCombination from "~/components/shared/pattern-combination-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import type { GlossaryTerm } from "~/lib/glossary-utils";
import { client } from "~/sanity/lib/client";
import { GLOSSARY_TERMS_QUERY, HOME_PAGE_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { ContentList, Page } from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "Home | DIGITCORE",
	description:
		"DIGITCORE outlines challenges, problems, and phenomena experienced or observed by community organizations, researchers, and open source technologists working on collaborative environmental research. This toolkit is designed to help you make decisions about tools, modes of interaction, research design, and process.",
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

	function isContentListSection(
		section: unknown,
	): section is ContentList & { _key?: string } {
		if (typeof section !== "object" || section === null) return false;
		return (
			"_type" in section &&
			((section as { _type?: unknown })._type === "contentList" ||
				(section as { _type?: unknown })._type === "cardCarousel") // Support legacy data
		);
	}

	// Group content sections with their following content lists
	function groupSections() {
		const groups: Array<{
			content?: (typeof contentSections)[0];
			contentLists: Array<(typeof contentSections)[0]>;
		}> = [];

		let currentGroup: {
			content?: (typeof contentSections)[0];
			contentLists: Array<(typeof contentSections)[0]>;
		} = { contentLists: [] };

		for (const section of contentSections) {
			if (section._type === "content") {
				// If we have a previous group, push it
				if (currentGroup.content || currentGroup.contentLists.length > 0) {
					groups.push(currentGroup);
				}
				// Start a new group with this content section
				currentGroup = { content: section, contentLists: [] };
			} else if (isContentListSection(section)) {
				// Add this content list to the current group
				currentGroup.contentLists.push(section);
			}
		}

		// Push the final group if it has content
		if (currentGroup.content || currentGroup.contentLists.length > 0) {
			groups.push(currentGroup);
		}

		return groups;
	}

	const sectionGroups = groupSections();

	return (
		<PageWrapper>
			<div className="pb-44">
				<HeadingMorph
					text="Welcome to the Digital Toolkit for Collaborative Environmental Research"
					transitionText="DIGITCORE"
					morphDistancePx={{ base: 240, sm: 260, md: 320, lg: 360, xl: 400 }}
					containerClass="overflow-y-auto"
					randomizeSelection
					fadeNonTarget
					fadeSelectedInPlace
					uppercasePrefix
					headerHeightVh={90}
					scrollLockDistancePx={{ base: 80, md: 120, lg: 140 }}
					distanceToDisappear={{
						base: 360,
						sm: 380,
						md: 460,
						lg: 520,
						xl: 560,
					}}
					breakpoints={{ md: 765 }}
				/>
				<div className="flex flex-col gap-16">
					{sectionGroups.map((group, groupIndex) => (
						<section
							key={group.content?._key || `group-${groupIndex}`}
							className={
								groupIndex === 0
									? "flex flex-col gap-4 pb-[4.5rem]"
									: "flex flex-col gap-4"
							}
						>
							{/* Render the content section */}
							{group.content && group.content._type === "content" && (
								<>
									{group.content.heading && (
										<>
											{groupIndex > 0 && (
												<div className="flex justify-center pb-4 md:justify-start">
													<PatternCombination randomPatterns={3} size="md" />
												</div>
											)}
											<SectionHeading heading={group.content.heading} />
										</>
									)}
									{group.content.body && (
										<CustomPortableText
											value={group.content.body as PortableTextBlock[]}
											className="text-body"
											glossaryTerms={glossaryTerms}
										/>
									)}
								</>
							)}

							{/* Render all content lists that belong to this content section */}
							{group.contentLists.map((contentList, listIndex) => {
								if (!isContentListSection(contentList)) return null;

								const listItems = (contentList as ContentList).items || [];

								return (
									<div
										key={contentList._key || `list-${listIndex}`}
										className="space-y-6"
									>
										{Array.isArray(listItems) &&
											listItems.length > 0 &&
											listItems.slice(0, 6).map((item) => (
												<div key={item._key} className="pl-8">
													<div className="mb-3 pb-2">
														<h3 className="text-heading-compact">
															{item.title}
														</h3>
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
									</div>
								);
							})}
						</section>
					))}
				</div>
			</div>
		</PageWrapper>
	);
}
