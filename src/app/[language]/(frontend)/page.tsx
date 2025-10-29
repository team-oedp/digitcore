import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { HeadingMorph } from "~/components/shared/heading-morph";
import { MissingTranslationNotice } from "~/components/shared/missing-translation-notice";
import { PageWrapper } from "~/components/shared/page-wrapper";
import PatternCombination from "~/components/shared/pattern-combination-wrapper";
import { SectionHeading } from "~/components/shared/section-heading";
import type { GlossaryTerm } from "~/lib/glossary-utils";
import {
	buildAbsoluteUrl,
	buildDescriptionFromPortableText,
} from "~/lib/metadata";
import { sanityFetch } from "~/sanity/lib/client";
import {
	GLOSSARY_TERMS_QUERY,
	HOME_PAGE_QUERY,
	SITE_SETTINGS_QUERY,
} from "~/sanity/lib/queries";
import type { ContentList, Page as PageType } from "~/sanity/sanity.types";
import type { LanguagePageProps } from "~/types/page-props";
import { i18n, type Language } from "~/i18n/config";

const HOME_LANGUAGES_QUERY = `array::unique(*[_type == 'page' && slug.current == '/' && defined(language)].language)`;

export async function generateStaticParams() {
	const available = (await sanityFetch({
		query: HOME_LANGUAGES_QUERY,
		revalidate: 60,
	})) as string[] | null;
    const allowed = new Set<Language>(i18n.languages.map((l) => l.id));
    return (available ?? [])
        .filter((id) => allowed.has(id as Language))
        .map((id) => ({ language: id as Language }));
}

export async function generateMetadata({
	params,
}: LanguagePageProps): Promise<Metadata> {
	const { language } = await params;

	const [site, page] = await Promise.all([
		sanityFetch({ query: SITE_SETTINGS_QUERY, revalidate: 3600 }),
		sanityFetch({
			query: HOME_PAGE_QUERY,
			params: { language },
			revalidate: 3600,
		}),
	]);
	const siteUrl = site?.url ?? "https://digitcore.org";
	const title = page?.title ? `${page.title}` : "Home";
	const description =
		buildDescriptionFromPortableText(
			page?.description as PortableTextBlock[] | null,
			200,
		) ??
		site?.seoDescription ??
		site?.description;
	const canonical = buildAbsoluteUrl(siteUrl, `/${language}`);
	return {
		title,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			url: canonical,
			images: [
				{
					url: buildAbsoluteUrl(siteUrl, "/opengraph-image"),
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: { card: "summary_large_image" },
	};
}

export default async function Page({ params }: LanguagePageProps) {
	const { language } = await params;

	const [data, glossaryTerms] = await Promise.all([
		sanityFetch({
			query: HOME_PAGE_QUERY,
			params: { language },
			revalidate: 60,
		}) as Promise<PageType | null>,
		sanityFetch({
			query: GLOSSARY_TERMS_QUERY,
			params: { language },
			revalidate: 60,
		}) as Promise<GlossaryTerm[]>,
	]);

	if (!data) {
		return <MissingTranslationNotice language={language} />;
	}

	const contentSections = (data?.content ?? []) as NonNullable<
		PageType["content"]
	>;

	function isContentListSection(
		section: unknown,
	): section is ContentList & { _key?: string } {
		if (typeof section !== "object" || section === null) return false;
		return (
			"_type" in section &&
			(section as { _type?: unknown })._type === "contentList"
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
									? "flex flex-col gap-4 pb-18"
									: "flex flex-col gap-4"
							}
						>
							{/* Render the content section */}
							{group.content && group.content._type === "content" && (
								<>
									{group.content.heading && (
										<>
											{groupIndex > 0 && (
												<div className="flex justify-start pb-4">
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
