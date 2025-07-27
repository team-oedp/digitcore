"use client";

import {
	ArrowRight02Icon,
	ChartRelationshipIcon,
	Share02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SearchResultPreview } from "./search-result-preview";

type Audience = {
	id: string;
	name: string;
};

type SearchResultItemProps = {
	title: string;
	source: string;
	category: string;
	audiences: Audience[];
	url?: string;
	description: string;
};

export function SearchResultItem({
	title = "Explore financially sustainable models",
	source = "PATTERN",
	category = "Open Tools Need Ongoing Maintenance",
	audiences = [
		{ id: "79750DD5-566C-4E21-A722-F917F691251C", name: "Open source technologists" },
		{ id: "7445C1BE-8E22-4D9C-9510-0ACFC13B9BB5", name: "Researchers" }
	],
	url = "#",
	description = "Default pattern description",
}: SearchResultItemProps) {
	return (
		<div className="relative w-full pb-9">
			{/* Dashed border at bottom */}
			<div className="absolute right-0 bottom-0 left-0 h-px border-zinc-300 border-t border-dashed" />

			<div className="py-[15px]">
				<div className="flex items-start justify-between gap-[150px]">
					{/* Left Content */}
					<div className="w-[600px] max-w-[600px] flex-shrink-0">
						{/* Title */}
						<h3 className="mb-4 w-[700px] font-light text-[#323232] text-[28px] leading-[37.8px] tracking-[-0.9px]">
							{title}
						</h3>

						{/* Pattern Badge */}
						<div className="mb-4 flex w-full items-center gap-2.5 overflow-hidden">
							<div className="whitespace-nowrap text-[14px] text-zinc-500 tracking-[-0.14px]">
								<span>From </span>
								<span className="uppercase">{source}</span>
							</div>

							<div className="flex h-6 w-6 items-center justify-center">
								<HugeiconsIcon
									icon={ArrowRight02Icon}
									className="h-4 w-4 text-zinc-500"
								/>
							</div>

							<SearchResultPreview description={description} patternTitle={category}>
								<div className="flex h-6 items-center gap-2.5 rounded-lg border border-zinc-300 px-2 py-1.5 cursor-pointer">
									<span className="whitespace-nowrap text-[14px] text-zinc-500 capitalize tracking-[-0.28px]">
										{category}
									</span>
									<HugeiconsIcon
										icon={Share02Icon}
										className="h-3.5 w-3.5 text-zinc-500"
									/>
								</div>
							</SearchResultPreview>
						</div>

						{/* Audiences Badges */}
						<div className="flex items-center gap-2">
							{audiences.map((audience) => (
								<div
									key={audience.id}
									className="flex h-6 items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-100 py-2 pr-3 pl-[9px]"
								>
									<span className="whitespace-nowrap text-[#1e40ae] text-[14px]">
										{audience.name}
									</span>
									<HugeiconsIcon
										icon={ChartRelationshipIcon}
										className="h-3.5 w-3.5 text-[#1e40ae]"
									/>
								</div>
							))}
						</div>
					</div>

					{/* Right Button */}
					<div className="flex-shrink-0 pt-0.5">
						<a
							href={url}
							className="flex items-center gap-2 rounded-md border border-[#d1a7f3] bg-[#ead1fa] px-[9px] py-[5px] transition-opacity hover:opacity-80"
						>
							<span className="font-normal text-[#4f065f] text-[14px] uppercase leading-[20px]">
								Visit Solution
							</span>
							<HugeiconsIcon
								icon={Share02Icon}
								className="h-3.5 w-3.5 text-[#4f065f]"
							/>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
