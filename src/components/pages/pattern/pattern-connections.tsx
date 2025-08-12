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
	return (
		<section className="flex flex-col gap-4 pt-8">
			{/* Audiences */}
			<div className="flex flex-row items-center gap-4">
				<div className="flex flex-row items-center gap-2">
					{audiences?.map((audience) => (
						<div
							key={audience._id}
							className="flex h-6 items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-100 py-2 pr-3 pl-[9px]"
						>
							<span className="text-nowrap font-normal text-[#1e40ae] text-[14px]">
								{audience.title}
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
			</div>

			{/* Tags */}
			<div className="flex flex-row items-center gap-4">
				<div className="flex flex-row items-center gap-2">
					{tags?.map((tag) => (
						<div
							key={tag._id}
							className="flex h-6 items-center gap-2.5 rounded-lg border border-violet-200 bg-violet-100 py-2 pr-3 pl-[9px]"
						>
							<span className="text-nowrap font-normal text-[#5b20b6] text-[14px] capitalize">
								{tag.title}
							</span>
							<HugeiconsIcon
								icon={Tag01Icon}
								size={14}
								color="#5b20b6"
								strokeWidth={1.5}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Theme */}
			{theme && (
				<div className="flex h-6 items-center gap-2.5 self-start rounded-lg border border-orange-200 bg-orange-100 py-2 pr-[3px] pl-[9px]">
					<span className="text-nowrap font-normal text-[14px] text-orange-800">
						{theme.title}
					</span>
					<div className="flex h-[18px] items-center justify-center rounded border border-orange-200 px-1.5 py-0">
						<span className="font-normal text-[12px] text-orange-800 tracking-[-0.14px]">
							Theme
						</span>
					</div>
				</div>
			)}
		</section>
	);
}
