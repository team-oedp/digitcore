import { ChartRelationshipIcon, Tag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Audience, Tag, Theme } from "~/sanity/sanity.types";

type PatternConnectionsProps = {
	audiences?: Audience[];
	tags?: Tag[];
	theme?: Theme;
};

export function PatternConnections({
	audiences,
	tags,
	theme,
}: PatternConnectionsProps) {
	// Only render if there are any connections
	if (!audiences?.length && !tags?.length && !theme) {
		return null;
	}

	return (
		<section className="flex flex-col gap-3 pt-6 md:gap-4 md:pt-8">
			<div className="flex flex-row flex-wrap items-start gap-2 md:gap-4">
				{/* Audiences */}
				{audiences?.map((audience) => (
					<div
						key={audience._id}
						className="flex h-6 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-100 py-2 pr-2 pl-[7px] md:gap-2.5 md:pr-3 md:pl-[9px]"
					>
						<span className="text-nowrap font-normal text-[#1e40ae] text-[12px] md:text-[14px]">
							{audience.title}
						</span>
						<HugeiconsIcon
							icon={ChartRelationshipIcon}
							size={12}
							color="#1e40ae"
							strokeWidth={1.5}
							className="md:h-[14px] md:w-[14px]"
						/>
					</div>
				))}

				{/* Tags */}
				{tags?.map((tag) => (
					<div
						key={tag._id}
						className="flex h-6 items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-100 py-2 pr-2 pl-[7px] md:gap-2.5 md:pr-3 md:pl-[9px]"
					>
						<span className="text-nowrap font-normal text-[#5b20b6] text-[12px] capitalize md:text-[14px]">
							{tag.title}
						</span>
						<HugeiconsIcon
							icon={Tag01Icon}
							size={12}
							color="#5b20b6"
							strokeWidth={1.5}
							className="md:h-[14px] md:w-[14px]"
						/>
					</div>
				))}

				{/* Theme */}
				{theme && (
					<div className="flex h-6 items-center gap-1.5 rounded-lg border border-orange-200 bg-orange-100 py-2 pr-[3px] pl-[7px] md:gap-2.5 md:pl-[9px]">
						<span className="text-nowrap font-normal text-[12px] text-orange-800 md:text-[14px]">
							{theme.title}
						</span>
						<div className="flex h-[16px] items-center justify-center rounded border border-orange-200 px-1 py-0 md:h-[18px] md:px-1.5">
							<span className="font-normal text-[10px] text-orange-800 tracking-[-0.14px] md:text-[12px]">
								Theme
							</span>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
