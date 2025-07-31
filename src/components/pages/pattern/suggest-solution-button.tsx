import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SuggestSolutionModal } from "./suggest-solution-modal";

type SuggestSolutionButtonProps = {
	patternName: string;
};

export function SuggestSolutionButton({
	patternName,
}: SuggestSolutionButtonProps) {
	return (
		<SuggestSolutionModal
			patternName={patternName}
			trigger={
				<button
					type="button"
					className="flex w-full items-center justify-between rounded-lg border-2 border-gray-800 border-dashed bg-white px-3 py-3 text-left text-2xl text-gray-600 uppercase transition-colors hover:bg-gray-50"
				>
					<span>Suggest Solution</span>
					<HugeiconsIcon
						icon={PlusSignIcon}
						size={24}
						color="#525252"
						strokeWidth={1.5}
					/>
				</button>
			}
		/>
	);
}
