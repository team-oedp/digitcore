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
		<SuggestSolutionModal
			patternName={patternName}
			patternSlug={patternSlug}
			trigger={
				<button
					type="button"
					className="group inline-flex items-center gap-1 rounded-md border border-gray-800 border-dashed bg-white px-3 py-1 text-neutral-600 text-sm uppercase transition-all duration-500 ease-in-out hover:bg-gray-800 hover:text-white"
				>
					<HugeiconsIcon
						icon={DashboardSquareEditIcon}
						size={16}
						color="currentColor"
						strokeWidth={1.5}
					/>
					<span>Know of another resource or solution? Suggest one</span>
				</button>
			}
		/>
	);
}
