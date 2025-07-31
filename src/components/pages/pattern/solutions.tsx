import { ChartRelationshipIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { PortableTextBlock } from "@portabletext/types";
import { CustomPortableText } from "~/components/global/portable-text";
import type { Solution } from "~/sanity/sanity.types";
import { SuggestSolutionButton } from "./suggest-solution-button";

type SolutionsProps = {
	solutions?: Solution[];
	patternName?: string;
};

export function Solutions({ solutions, patternName }: SolutionsProps) {
	// Generate numbering for solutions (i., ii., iii., etc.)
	const getSolutionNumber = (index: number): string => {
		const romanNumerals = [
			"i",
			"ii",
			"iii",
			"iv",
			"v",
			"vi",
			"vii",
			"viii",
			"ix",
			"x",
		];
		return `${romanNumerals[index]}.`;
	};

	if (!solutions || solutions.length === 0) {
		return null;
	}

	return (
		<section className="flex flex-col gap-5">
			<header className="flex flex-row items-center gap-2.5">
				<h2 className="font-light text-[32px] text-primary">Solutions</h2>
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7f7f7] px-4 py-1.5">
					<HugeiconsIcon
						icon={ChartRelationshipIcon}
						size={20}
						color="currentColor"
						strokeWidth={1.5}
					/>
				</div>
			</header>

			<div className="flex flex-col gap-[13px]">
				{solutions.map((solution, index) => (
					<div key={solution._id} className="flex items-start gap-8 pb-9">
						<div className="flex w-10 min-w-10 flex-col items-start gap-2.5">
							<span className="font-normal text-[18px] text-primary leading-[22px]">
								{getSolutionNumber(index)}
							</span>
						</div>

						<div className="flex flex-1 flex-col gap-2.5">
							<h3 className="font-normal text-[18px] text-primary leading-[22px]">
								{solution.title}
							</h3>
							{solution.description && (
								<CustomPortableText
									value={solution.description as PortableTextBlock[]}
									className="prose-sm prose-p:font-normal prose-p:text-[14px] prose-p:text-zinc-500 prose-p:leading-normal"
								/>
							)}

							{solution.audiences && solution.audiences.length > 0 && (
								<div className="flex gap-2">
									{solution.audiences.map((audience) => (
										<div
											key={audience._key}
											className="flex h-6 items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-100 px-[9px] py-2"
										>
											<span className="text-nowrap font-normal text-[#1e40ae] text-[14px]">
												{audience._ref}
											</span>
											<HugeiconsIcon
												icon={ChartRelationshipIcon}
												size={14}
												color="#1e40ae"
												strokeWidth={1.5}
											/>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			{patternName && (
				<div className="mt-8">
					<SuggestSolutionButton patternName={patternName} />
				</div>
			)}
		</section>
	);
}
