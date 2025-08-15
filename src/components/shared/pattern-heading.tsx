"use client";

import { Backpack03Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import type { Pattern } from "~/sanity/sanity.types";
import { getPatternIconWithMapping } from "~/utils/pattern-icons";

import { cn } from "~/lib/utils";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { Icon } from "./icon";

type PatternHeadingProps = {
	title?: string;
	slug?: string;
	pattern?: Pattern;
};

export function PatternHeading({ title, slug, pattern }: PatternHeadingProps) {
	const PatternIcon = getPatternIconWithMapping(slug || "");

	const addPatternToBag = useCarrierBagStore((s) => s.addPattern);
	const isHydrated = useCarrierBagStore((s) => s.isHydrated);
	const isPatternInBag = useCarrierBagStore((s) =>
		pattern ? s.hasPattern(pattern._id) : false,
	);

	// Use local state to prevent hydration mismatch
	const [isInBag, setIsInBag] = useState(false);

	useEffect(() => {
		// Only update after hydration completes
		if (isHydrated) {
			setIsInBag(isPatternInBag);
		}
	}, [isHydrated, isPatternInBag]);

	function handleSaveToCarrierBag() {
		if (!pattern) return;
		addPatternToBag(pattern);
	}

	return (
		<header id="page-header" className="relative max-w-4xl">
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-3">
					{PatternIcon && (
						<div className="h-10 w-10 flex-shrink-0">
							<PatternIcon className="h-full w-full fill-icon/50 text-icon/50" />
						</div>
					)}
					<h1 className="text-heading">{title}</h1>
				</div>
				<div>
				{pattern && (
					<button
						type="button"
						className={cn(
							"flex items-center gap-2.5 rounded-lg border px-2 py-1 transition-colors",
							isInBag
								? "cursor-default border-green-200 bg-green-50"
								: "cursor-pointer border-border bg-white hover:bg-secondary",
						)}
						onClick={isInBag ? undefined : handleSaveToCarrierBag}
						disabled={isInBag || false}
					>
						<span className="font-normal text-primary text-sm uppercase">
							{isInBag
								? "Saved to Carrier Bag"
								: "Save to Carrier Bag"}
						</span>
						<Icon
							icon={Backpack03Icon}
							size={14}
							color="#71717a"
							strokeWidth={1.5}
						/>
					</button>
				)}
				</div>
			</div>
		</header>
	);
}
