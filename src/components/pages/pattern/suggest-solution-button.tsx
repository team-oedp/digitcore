import { PlusSignIcon } from "@hugeicons/core-free-icons";
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
					className="inline-flex items-center gap-1 rounded-md border border-gray-800 border-dashed bg-white px-3 py-1 text-gray-600 text-sm uppercase transition-colors hover:bg-gray-50"
				>
					<span>Know of another solution? Suggest One</span>
					<HugeiconsIcon
						icon={PlusSignIcon}
						size={16}
						color="#525252"
						strokeWidth={1.5}
					/>
				</button>
			}
		/>
	);
}
