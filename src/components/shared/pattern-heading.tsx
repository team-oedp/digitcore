"use client";

import { Backpack03Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import { getPatternIconWithMapping } from "~/lib/pattern-icons";
import type { Pattern } from "~/sanity/sanity.types";

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
			<div className="flex flex-col gap-3 md:gap-4">
				<div className="flex items-start gap-2 md:gap-4">
					{PatternIcon && (
						<div className="mt-2 h-8 w-8 flex-shrink-0 md:h-10 md:w-10">
							<PatternIcon className="h-full w-full fill-icon/50 text-icon/50 opacity-40" />
						</div>
					)}
					<h1 className="text-page-heading">{title}</h1>
				</div>
				<div>
					{pattern && (
						<button
							type="button"
							className={cn(
								"flex items-center gap-2 rounded-lg border px-2 py-1 transition-colors md:gap-2.5",
								isInBag
									? "cursor-default border-green-200 bg-green-50"
									: "cursor-pointer border-border bg-white hover:bg-secondary",
							)}
							onClick={isInBag ? undefined : handleSaveToCarrierBag}
							disabled={isInBag || false}
						>
							<Icon
								icon={Backpack03Icon}
								size={14}
								color="#71717a"
								strokeWidth={1.5}
							/>
							<span className="font-normal text-primary text-xs uppercase md:text-sm">
								{isInBag ? "Saved to Carrier Bag" : "Save to Carrier Bag"}
							</span>
						</button>
					)}
				</div>
			</div>
		</header>
	);
}
