import { ChartRelationshipIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { PortableTextBlock } from "@portabletext/types";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { Badge } from "~/components/ui/badge";
import type { PATTERN_QUERYResult } from "~/sanity/sanity.types";
import { ClickableBadge } from "./clickable-badge";
import { SuggestSolutionButton } from "./suggest-solution-button";

type SolutionItem = NonNullable<
	NonNullable<PATTERN_QUERYResult>["solutions"]
>[number];

type SolutionsProps = {
	solutions?: SolutionItem[] | null;
	patternName?: string;
	patternSlug?: string;
};

export function Solutions({
	solutions,
	patternName,
	patternSlug,
}: SolutionsProps) {
	// Generate numbering for solutions (1., 2., 3., etc.)
	const getSolutionNumber = (index: number): string => {
		return `${index + 1}.`;
	};

	if (!solutions || solutions.length === 0) {
		return null;
	}

	return (
		<section
			id="solutions"
			data-section="solutions"
			className="flex flex-col gap-4 md:gap-5"
		>
			<header className="flex flex-row items-center gap-2 md:gap-2.5">
				<h2 className="font-light text-[24px] text-primary md:text-[32px]">
					Solutions
				</h2>
			</header>

			<div className="flex flex-col gap-3 md:gap-[13px]">
				{solutions.map((solution, index) => (
					<div
						key={solution._id}
						className="flex items-baseline gap-4 pb-6 md:gap-8 md:pb-9"
					>
						<div className="flex w-8 min-w-8 flex-col items-start gap-2.5 md:w-10 md:min-w-10">
							<h3 className="font-normal text-base text-body-muted leading-normal md:text-xl md:leading-tight lg:text-[28px] lg:leading-normal">
								{getSolutionNumber(index)}
							</h3>
						</div>

						<div className="flex flex-1 flex-col gap-2 md:gap-2.5">
							<h3 className="font-light text-base text-primary leading-normal md:text-xl md:leading-tight lg:text-[28px] lg:leading-normal">
								{solution.title}
							</h3>
							{solution.description && (
								<CustomPortableText
									value={solution.description as PortableTextBlock[]}
									className="text-body-muted"
								/>
							)}

							{solution.audiences && solution.audiences.length > 0 && (
								<div className="flex flex-wrap gap-1.5 md:gap-2">
									{solution.audiences.map((audience) => (
										<Badge
											key={audience._id}
											variant="audience"
											className="cursor-pointer"
											asChild
										>
											<ClickableBadge
												type="audience"
												id={audience._id}
												title={audience.title ?? undefined}
												icon={
													<HugeiconsIcon
														icon={ChartRelationshipIcon}
														size={12}
														color="currentColor"
														strokeWidth={1.5}
														className="md:h-[14px] md:w-[14px]"
													/>
												}
											>
												{audience.title}
											</ClickableBadge>
										</Badge>
									))}
								</div>
							)}
						</div>
					</div>
				))}
			</div>
			{patternName && patternSlug && (
				<div className="mt-3 mb-3 md:mt-4 md:mb-4">
					<SuggestSolutionButton
						patternName={patternName}
						patternSlug={patternSlug}
					/>
				</div>
			)}
		</section>
	);
}
