"use client";

import { CircleArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type * as React from "react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";

interface SearchResultPreviewProps {
	children: React.ReactNode;
	description: string;
	patternTitle: string;
}

export function SearchResultPreview({
	children,
	description,
	patternTitle,
}: SearchResultPreviewProps) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent className="w-80 p-0" align="start" sideOffset={8}>
				<div className="flex flex-col gap-3.5 rounded-lg bg-neutral-100 p-3.5">
					<p className="font-normal text-sm text-zinc-700 leading-[18px]">
						{description}
					</p>
					<button
						type="button"
						className="flex items-center gap-0.5 text-sm text-zinc-700 leading-5 transition-colors hover:text-zinc-900"
					>
						<span>Go to pattern</span>
						<HugeiconsIcon icon={CircleArrowRight02Icon} className="h-5 w-5" />
					</button>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}
