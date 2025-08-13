import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { SearchResultItem } from "~/components/pages/search/search-result-item";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { client } from "~/sanity/lib/client";
import { PATTERNS_WITH_THEMES_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { PATTERNS_WITH_THEMES_QUERYResult } from "~/sanity/sanity.types";

type PatternWithTheme = PATTERNS_WITH_THEMES_QUERYResult[0];

export default async function PatternsPage() {
	const isDraftMode = (await draftMode()).isEnabled;

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

	// Log to see what we're getting
	console.log("Total patterns fetched:", allPatterns.length);
	console.log(
		"Pattern details:",
		allPatterns.map((p) => ({
			title: p.title,
			theme: p.theme ? { id: p.theme._id, title: p.theme.title } : "No theme",
		})),
	);

	// Group patterns by theme
	const themeGroups = new Map<
		string,
		{
			theme: NonNullable<PatternWithTheme["theme"]>;
			patterns: PatternWithTheme[];
		}
	>();
	const ungroupedPatterns: PatternWithTheme[] = [];

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
		} else {
			ungroupedPatterns.push(pattern);
		}
	}

	return (
		<div className="relative">
			<PageWrapper>
				<div className="flex flex-col gap-20 space-y-14">
					{!allPatterns || allPatterns.length === 0 ? (
						<div className="p-8">
							<p className="text-primary">
								No patterns found. Please try again later.
							</p>
						</div>
					) : (
						<>
							{/* Render patterns grouped by theme */}
							{Array.from(themeGroups.values()).map(({ theme, patterns }) => (
								<div key={theme._id} className="mb-12">
									<div className="flex flex-col items-start justify-start gap-8">
										<h2 className="font-light text-[32px] text-primary capitalize">
											{theme.title}
										</h2>
										<CustomPortableText
											value={theme.description as PortableTextBlock[]}
										/>
									</div>

									{/* Pattern items using SearchResultItem */}
									<div className="space-y-0 pt-12">
										{patterns.map((pattern) => (
											<SearchResultItem
												key={pattern._id}
												pattern={{
													...pattern,
													theme: pattern.theme
														? {
																_id: pattern.theme._id,
																title:
																	pattern.theme.title === null
																		? undefined
																		: pattern.theme.title,
																description: pattern.theme.description as
																	| unknown[]
																	| undefined,
															}
														: null,
													audiences:
														pattern.audiences?.map((aud) => ({
															...aud,
															title: aud.title === null ? undefined : aud.title,
														})) ?? null,
													resources:
														pattern.resources?.map((resource) => ({
															...resource,
															solution: resource.solutions || null,
														})) ?? null,
												}}
											/>
										))}
									</div>
								</div>
							))}

							{/* Section for patterns without a theme */}
							{ungroupedPatterns.length > 0 && (
								<div className="mb-12">
									<div className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-start gap-2.5 px-0 pt-0 pb-9">
										<div className="relative box-border flex w-[834px] shrink-0 flex-col content-stretch items-start justify-start gap-5 py-0 pr-0 pl-2">
											<div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-2.5 p-0">
												<div className="relative flex shrink-0 flex-col justify-center text-nowrap text-left font-sans text-[#3d3d3d] text-[32px] capitalize not-italic leading-[0]">
													<p className="block whitespace-pre leading-[normal]">
														Additional Patterns
													</p>
												</div>
											</div>
											<div className="relative min-w-full shrink-0 text-left font-sans text-[#3d3d3d] text-[16px] not-italic leading-[0]">
												<p className="block leading-[normal]">
													Patterns that haven't been categorized into a theme
													yet.
												</p>
											</div>
										</div>
									</div>

									<div className="space-y-0">
										{ungroupedPatterns.map((pattern) => (
											<SearchResultItem
												key={pattern._id}
												pattern={{
													...pattern,
													theme: null,
													audiences:
														pattern.audiences?.map((aud) => ({
															...aud,
															title: aud.title === null ? undefined : aud.title,
														})) ?? null,
													resources:
														pattern.resources?.map((resource) => ({
															...resource,
															solution: resource.solutions || null,
														})) ?? null,
												}}
											/>
										))}
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</PageWrapper>
		</div>
	);
}
