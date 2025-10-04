"use client";

import { Backpack03Icon } from "@hugeicons/core-free-icons";
import { useEffect, useId, useState } from "react";
import { getPatternIconWithMapping } from "~/lib/pattern-icons";
import { cn } from "~/lib/utils";
import type { Pattern } from "~/sanity/sanity.types";
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

	const headingId = useId();
	return (
		<header id={headingId} className="relative max-w-4xl pt-5">
			<div className="flex flex-col gap-3 md:gap-4">
				<div className="flex items-baseline gap-2 md:gap-4">
					{PatternIcon && (
						<div className="h-6 w-6 flex-shrink-0 md:h-8 md:w-8">
							<PatternIcon className="h-full w-full fill-icon/50 text-icon/50 opacity-40" />
						</div>
					)}
					<h1 className="text-page-heading">{title}</h1>
				</div>
				<div className="md:ml-12 lg:ml-14">
					{pattern && (
						<button
							type="button"
							className={cn(
								"flex items-center gap-2 rounded-lg border px-2 py-1 transition-colors md:gap-2.5",
								isInBag
									? "cursor-default border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
									: "cursor-pointer border-border bg-background hover:bg-secondary dark:hover:bg-neutral-800",
							)}
							onClick={isInBag ? undefined : handleSaveToCarrierBag}
							disabled={isInBag || false}
						>
							<Icon
								icon={Backpack03Icon}
								size={14}
								className="text-neutral-500 dark:text-neutral-400"
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
