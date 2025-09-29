"use client";

import { CircleArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";

type SearchResultPreviewProps = {
	children: React.ReactNode;
	patternTitle: string;
	patternDescription: string;
};

export function SearchResultPreview({
	children,
	patternTitle,
	patternDescription,
}: SearchResultPreviewProps) {
	return (
		<HoverCard openDelay={100}>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 p-0" align="start" sideOffset={8}>
				<div className="flex flex-col gap-3.5 rounded-lg bg-neutral-100 p-3.5">
					<p className="font-normal text-neutral-800 text-sm leading-normal">
						{patternDescription}
					</p>
					<button
						type="button"
						className="flex items-center gap-0.5 text-neutral-800 text-sm leading-normal transition-colors hover:text-neutral-900"
					>
						<span>Visit pattern</span>
						<HugeiconsIcon icon={CircleArrowRight02Icon} className="h-5 w-5" />
					</button>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
