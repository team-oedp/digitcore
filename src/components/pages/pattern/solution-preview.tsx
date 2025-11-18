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
	solutionLabel?: string;
};

export function SolutionPreview({
	children,
	solutionNumber,
	solutionTitle,
	solutionDescription,
	solutionLabel = "Solution",
}: SolutionPreviewProps) {
	return (
		<HoverCard openDelay={100}>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 p-0" align="start" sideOffset={8}>
				<div className="flex flex-col gap-3.5 rounded-lg bg-popover p-3.5">
					<div className="flex flex-col gap-2">
						<h3 className="font-normal text-lg text-popover-foreground leading-[22px]">
							{solutionTitle}
						</h3>
						<span className="w-fit rounded-md bg-muted px-2 py-1 text-muted-foreground text-xs">
							{solutionLabel} {solutionNumber}
						</span>
					</div>
					<p className="font-normal text-muted-foreground text-sm leading-normal">
						{solutionDescription}
					</p>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
