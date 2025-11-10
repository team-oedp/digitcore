import { DashboardSquareEditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { PATTERN_UTILITIES_QUERYResult } from "~/sanity/sanity.types";
import { SuggestSolutionModal } from "./suggest-solution-modal";

type SuggestSolutionButtonProps = {
	patternName: string;
	patternSlug: string;
	patternUtilities?: PATTERN_UTILITIES_QUERYResult | null;
};

export function SuggestSolutionButton({
	patternName,
	patternSlug,
	patternUtilities,
}: SuggestSolutionButtonProps) {
	const knowOfAnotherText =
		patternUtilities?.knowOfAnotherResourceOrSolution ??
		"Know of another resource or solution?";
	const makeASuggestionText =
		patternUtilities?.makeASuggestionButtonLabel ?? "Make a suggestion";

	return (
		<div className="flex flex-col gap-2 md:gap-2.5">
			<p className="font-normal text-primary text-xs md:text-sm">
				{knowOfAnotherText}
			</p>
			<SuggestSolutionModal
				patternName={patternName}
				patternSlug={patternSlug}
				patternUtilities={patternUtilities}
				trigger={
					<button
						type="button"
						className="flex w-fit cursor-pointer items-start gap-2 rounded-lg border border-border bg-transparent px-2 py-1 transition-colors hover:bg-secondary md:gap-2.5 dark:hover:bg-neutral-800"
					>
						<HugeiconsIcon
							icon={DashboardSquareEditIcon}
							size={14}
							color="currentColor"
							strokeWidth={1.5}
							className="mt-[1px] text-neutral-500 md:mt-[3px] dark:text-neutral-400"
						/>
						<span className="text-left font-normal text-primary text-xs uppercase md:text-sm">
							{makeASuggestionText}
						</span>
					</button>
				}
			/>
		</div>
	);
}
