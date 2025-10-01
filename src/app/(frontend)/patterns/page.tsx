import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { SearchResultItem } from "~/components/pages/search/search-result-item";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { cn } from "~/lib/utils";
import { client } from "~/sanity/lib/client";
import {
	PATTERNS_PAGE_QUERY,
	PATTERNS_WITH_THEMES_QUERY,
} from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type {
	PATTERNS_WITH_THEMES_QUERYResult,
	Page,
} from "~/sanity/sanity.types";

type PatternWithTheme = PATTERNS_WITH_THEMES_QUERYResult[0];

type ThemeGroup = {
	theme: NonNullable<PatternWithTheme["theme"]>;
	patterns: PatternWithTheme[];
};

export const metadata: Metadata = {
	title: "Patterns | DIGITCORE",
	description: "Open environmental research patterns and themes.",
};

export default async function PatternsPage() {
	const isDraftMode = (await draftMode()).isEnabled;

	// Fetch page data from Sanity
	const pageData = (await client.fetch(
		PATTERNS_PAGE_QUERY,
		{},
		isDraftMode
			? {
					perspective: "previewDrafts",
					useCdn: false,
					stega: true,
					token,
				}
			: {
					perspective: "published",
					useCdn: true,
				},
	)) as Page | null;

	// Fetch ALL patterns with their themes
	const allPatterns: PATTERNS_WITH_THEMES_QUERYResult = await client.fetch(
		PATTERNS_WITH_THEMES_QUERY,
		{},
		isDraftMode
			? {
					perspective: "previewDrafts",
					useCdn: false,
					stega: true,
					token,
				}
			: {
					perspective: "published",
					useCdn: true,
				},
	);

	// Group patterns by theme
	const themeGroups = new Map<string, ThemeGroup>();
	for (const pattern of allPatterns) {
		if (pattern.theme?._id) {
			const themeId = pattern.theme._id;
			if (!themeGroups.has(themeId)) {
				themeGroups.set(themeId, {
					theme: pattern.theme,
					patterns: [],
				});
			}
			const themeGroup = themeGroups.get(themeId);
			if (themeGroup) {
				themeGroup.patterns.push(pattern);
			}
		}
	}

	if (!pageData) return null;

	return (
		<PageWrapper>
			<div className="pb-16 lg:pb-32">
				{pageData.title && <PageHeading title={pageData.title} />}
				{pageData.description && (
					<CustomPortableText
						value={pageData.description as PortableTextBlock[]}
						className="mt-8 text-body"
					/>
				)}
				{!allPatterns || allPatterns.length === 0 ? (
					<div className="p-8">
						<p className="text-body">
							No patterns found in database. Please check again later.
						</p>
					</div>
				) : (
					Array.from(themeGroups.values()).map(({ theme, patterns }) => (
						<div key={theme._id}>
							<div className="flex flex-col gap-5 pt-12 pb-12 md:pt-36">
								<div className="flex flex-col gap-1">
									<p className="text-neutral-400 text-xxs uppercase">Theme</p>
									<h2 className="text-section-heading">{theme.title}</h2>
								</div>
								<CustomPortableText
									value={theme.description as PortableTextBlock[]}
									className="text-body"
								/>
							</div>

							<div className="space-y-0 pt-12">
								{patterns.map((pattern, index) => (
									<div
										key={pattern._id}
										className={cn(
											index === patterns.length - 1 && "border-dashed-brand-b",
										)}
									>
										<SearchResultItem
											showPatternIcon={true}
											pattern={pattern}
										/>
									</div>
								))}
							</div>
						</div>
					))
				)}
			</div>
		</PageWrapper>
	);
}
