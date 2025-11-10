import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";
import { SearchResultItem } from "~/components/pages/search/search-result-item";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { sanityFetch } from "~/sanity/lib/client";
import {
	PATTERNS_PAGE_QUERY,
	PATTERNS_WITH_THEMES_QUERY,
} from "~/sanity/lib/queries";
import type { PATTERNS_WITH_THEMES_QUERYResult } from "~/sanity/sanity.types";
import type { LanguagePageProps } from "~/types/page-props";

type PatternWithTheme = PATTERNS_WITH_THEMES_QUERYResult[0];

type ThemeGroup = {
	theme: NonNullable<PatternWithTheme["theme"]>;
	patterns: PatternWithTheme[];
};

export const metadata: Metadata = {
	title: "Patterns | DIGITCORE",
	description: "Open environmental research patterns and themes.",
};

export default async function Page({ params }: LanguagePageProps) {
	const { language } = await params;

	const [pageData, allPatterns] = await Promise.all([
		sanityFetch({
			query: PATTERNS_PAGE_QUERY,
			params: { language },
			revalidate: 60,
		}),
		sanityFetch({
			query: PATTERNS_WITH_THEMES_QUERY,
			params: { language },
			revalidate: 60,
		}) as Promise<PATTERNS_WITH_THEMES_QUERYResult>,
	]);

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

	if (!pageData) {
		notFound();
	}

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
							{pageData.emptyStateMessage ||
								"No patterns found in database. Please check again later."}
						</p>
					</div>
				) : (
					Array.from(themeGroups.values()).map(({ theme, patterns }) => (
						<div
							key={theme._id}
							className="mt-8 overflow-hidden rounded-lg border border-neutral-300 border-dashed p-8 md:p-6"
						>
							<div className="flex flex-col gap-5">
								<div className="flex flex-col gap-1">
									<p className="text-neutral-400 text-xxs uppercase">
										{language === "es" ? "Tema" : "Theme"}
									</p>
									<h2 className="text-section-heading">{theme.title}</h2>
								</div>
								<CustomPortableText
									value={theme.description as PortableTextBlock[]}
									className="text-body"
								/>
							</div>

							<div className="space-y-0 pt-8">
								{patterns.map((pattern, index) => (
									<div key={pattern._id}>
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
