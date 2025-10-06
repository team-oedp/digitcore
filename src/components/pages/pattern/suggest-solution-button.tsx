import { DashboardSquareEditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SuggestSolutionModal } from "./suggest-solution-modal";

type SuggestSolutionButtonProps = {
	patternName: string;
	patternSlug: string;
};

export function SuggestSolutionButton({
	patternName,
	patternSlug,
}: SuggestSolutionButtonProps) {
	return (
		<div className="flex flex-col gap-2 md:gap-2.5">
			<p className="font-normal text-primary text-xs md:text-sm">
				Know of another resource or solution?
			</p>
			<SuggestSolutionModal
				patternName={patternName}
				patternSlug={patternSlug}
				trigger={
					<button
						type="button"
						className="flex w-fit cursor-pointer items-start gap-2 rounded-lg border border-border bg-background px-2 py-1 transition-colors hover:bg-secondary md:gap-2.5 dark:hover:bg-neutral-800"
					>
						<HugeiconsIcon
							icon={DashboardSquareEditIcon}
							size={14}
							color="currentColor"
							strokeWidth={1.5}
							className="mt-[1px] text-neutral-500 md:mt-[3px] dark:text-neutral-400"
						/>
						<span className="text-left font-normal text-primary text-xs uppercase md:text-sm">
							Make a suggestion
						</span>
					</button>
				}
			/>
		</div>
	);
}
