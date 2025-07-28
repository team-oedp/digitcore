"use client";

import type * as React from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";

type SolutionPreviewProps = {
	children: React.ReactNode;
	solutionNumber: string;
	solutionTitle: string;
	solutionDescription: string;
};

export function SolutionPreview({
	children,
	solutionNumber,
	solutionTitle,
	solutionDescription,
}: SolutionPreviewProps) {
	return (
		<HoverCard openDelay={100}>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 p-0" align="start" sideOffset={8}>
				<div className="flex flex-col gap-3.5 rounded-lg bg-neutral-100 p-3.5">
					<div className="flex flex-col gap-2">
						<h3 className="font-normal text-lg text-primary leading-[22px]">
							{solutionTitle}
						</h3>
						<span className="w-fit rounded-md bg-neutral-200 px-2 py-1 text-neutral-600 text-xs">
							Solution {solutionNumber}
						</span>
					</div>
					<p className="font-normal text-sm text-zinc-500 leading-normal">
						{solutionDescription}
					</p>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
