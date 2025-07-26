import { ChartRelationshipIcon, Tag01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type PatternConnectionsProps = {
	audiences?: string[];
	tags?: string[];
	theme?: string;
};

const defaultAudiences = ["Open Source Developers", "Researchers"];
const defaultTags = ["Strategy", "Workflow", "Data", "Tool", "Communication"];
const defaultTheme = "Ensuring benefit to frontline communities";

export function PatternConnections({ 
	audiences = defaultAudiences, 
	tags = defaultTags, 
	theme = defaultTheme 
}: PatternConnectionsProps) {
	return (
		<section className="flex flex-col gap-4 pt-3">
			{/* Audiences */}
			<div className="flex flex-row gap-4 items-center">
				<div className="flex flex-row gap-2 items-center">
					{audiences.map((audience) => (
						<div
							key={audience}
							className="bg-blue-100 border border-blue-200 rounded-lg h-6 flex items-center gap-2.5 pl-[9px] pr-3 py-2"
						>
							<span className="font-normal text-[14px] text-[#1e40ae] text-nowrap">
								{audience}
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
			<div className="flex flex-row gap-4 items-center">
				<div className="flex flex-row gap-2 items-center">
					{tags.map((tag) => (
						<div
							key={tag}
							className="bg-violet-100 border border-violet-200 rounded-lg h-6 flex items-center gap-2.5 pl-[9px] pr-3 py-2"
						>
							<span className="font-normal text-[14px] text-[#5b20b6] text-nowrap">
								{tag}
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
			<div className="bg-orange-100 border border-orange-200 rounded-lg h-6 flex items-center gap-2.5 pl-[9px] pr-[3px] py-2 self-start">
				<span className="font-normal text-[14px] text-orange-800 text-nowrap">
					{theme}
				</span>
				<div className="h-[18px] rounded border border-orange-200 flex items-center justify-center px-1.5 py-0">
					<span className="font-normal text-[12px] text-orange-800 tracking-[-0.14px]">
						Theme
					</span>
				</div>
			</div>
		</section>
	);
}