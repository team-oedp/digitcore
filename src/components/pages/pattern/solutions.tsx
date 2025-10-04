import { ChartRelationshipIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { PortableTextBlock } from "@portabletext/types";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { Badge } from "~/components/ui/badge";
import type { Solution } from "~/sanity/sanity.types";
import { ClickableBadge } from "./clickable-badge";
import { SuggestSolutionButton } from "./suggest-solution-button";

type AudienceDisplay = {
	_id?: string;
	_key?: string;
	_ref?: string;
	title?: string;
};

type SolutionsProps = {
	solutions?: Solution[] | null;
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
				{solutions.map((solution: Solution, index: number) => (
					<div
						key={solution._id}
						className="flex items-start gap-4 pb-6 md:gap-8 md:pb-9"
					>
						<div className="flex w-8 min-w-8 flex-col items-start gap-2.5 md:w-10 md:min-w-10">
							<span className="font-normal text-[16px] text-primary leading-[20px] md:text-[18px] md:leading-[22px]">
								{getSolutionNumber(index)}
							</span>
						</div>

						<div className="flex flex-1 flex-col gap-2 md:gap-2.5">
							<h3 className="font-normal text-[16px] text-primary leading-[20px] md:text-[18px] md:leading-[22px]">
								{solution.title}
							</h3>
							{solution.description && (
								<CustomPortableText
									value={solution.description as PortableTextBlock[]}
									className="text-body"
								/>
							)}

							{solution.audiences && solution.audiences.length > 0 && (
								<div className="flex flex-wrap gap-1.5 md:gap-2">
									{solution.audiences.map((audience: AudienceDisplay) => (
										<ClickableBadge
											key={audience._id ?? audience._key ?? audience._ref}
											type="audience"
											id={audience._id ?? audience._ref ?? ""}
											title={audience.title ?? undefined}
										>
											<Badge
												variant="audience"
												className="cursor-pointer transition-colors duration-200 hover:bg-blue-150"
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
												{audience.title ?? audience._ref}
											</Badge>
										</ClickableBadge>
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
