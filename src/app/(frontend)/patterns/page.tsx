import { draftMode } from "next/headers";
import { SearchResultItem } from "~/components/pages/search/search-result-item";
import { client } from "~/sanity/lib/client";
import { PATTERNS_GROUPED_BY_THEME_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type {
	PATTERNS_GROUPED_BY_THEME_QUERYResult,
	Theme,
} from "~/sanity/sanity.types";

export default async function PatternsPage() {
	const isDraftMode = (await draftMode()).isEnabled;

	const themeGroups: PATTERNS_GROUPED_BY_THEME_QUERYResult = await client.fetch(
		PATTERNS_GROUPED_BY_THEME_QUERY,
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

	return (
		<div className="relative size-full overflow-clip rounded-lg bg-white">
			{/* Header Section */}
			<div className="top-0 left-0 box-border flex w-[834px] flex-col content-stretch items-start justify-start gap-5 pt-5 pr-0 pb-0 pl-7">
				<div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-2.5 p-0">
					<div className="relative flex shrink-0 flex-col justify-center text-nowrap text-left font-sans text-[#3d3d3d] text-[32px] capitalize not-italic leading-[0]">
						<h1 className="block whitespace-pre leading-[normal]">Patterns</h1>
					</div>
				</div>
				<div className="relative min-w-full shrink-0 text-left font-sans text-[#3d3d3d] text-[16px] not-italic leading-[0]">
					<p className="block leading-[normal]">
						Explore patterns to discover new open environmental research to
						share and incorporate into your own work.
					</p>
				</div>
			</div>

			{/* Patterns Content */}
			<div className="absolute top-[164px] left-0 box-border flex flex-col content-stretch items-start justify-start bg-white py-0 pr-0 pl-5">
				{!themeGroups || themeGroups.length === 0 ? (
					<div className="p-8">
						<p className="text-gray-500">
							No themes or patterns found. Please check your Sanity database.
						</p>
					</div>
				) : (
					themeGroups.map((group) => (
						<div key={group._id} className="mb-12">
							{/* Theme Section Header */}
							<div className="relative box-border flex w-full shrink-0 flex-col content-stretch items-start justify-start gap-2.5 px-0 pt-0 pb-9">
								<div className="relative box-border flex w-[834px] shrink-0 flex-col content-stretch items-start justify-start gap-5 py-0 pr-0 pl-2">
									<div className="relative box-border flex shrink-0 flex-row content-stretch items-center justify-center gap-2.5 p-0">
										<div className="relative flex shrink-0 flex-col justify-center text-nowrap text-left font-sans text-[#3d3d3d] text-[32px] capitalize not-italic leading-[0]">
											<p className="block whitespace-pre leading-[normal]">
												{group.title}
											</p>
										</div>
									</div>
									{group.description && (
										<div className="relative min-w-full shrink-0 text-left font-sans text-[#3d3d3d] text-[16px] not-italic leading-[0]">
											<p className="block leading-[normal]">
												{Array.isArray(group.description)
													? group.description
															.map(
																(block: NonNullable<Theme["description"]>[0]) =>
																	block.children
																		?.map(
																			(
																				child: NonNullable<
																					NonNullable<
																						Theme["description"]
																					>[0]["children"]
																				>[0],
																			) => child.text || "",
																		)
																		.join("") || "",
															)
															.join(" ")
													: group.description}
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Pattern Items using SearchResultItem */}
							<div className="space-y-0">
								{group.patterns && group.patterns.length > 0 ? (
									group.patterns.map((pattern) => (
										<SearchResultItem key={pattern._id} pattern={pattern} />
									))
								) : (
									<div className="p-4 text-gray-500 italic">
										No patterns found for this theme.
									</div>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
