"use client";

import { Backpack03Icon } from "@hugeicons/core-free-icons";
import { useEffect, useId, useState } from "react";
import { getPatternIconWithMapping } from "~/lib/pattern-icons";
import { cn } from "~/lib/utils";
import type { PATTERN_QUERYResult } from "~/sanity/sanity.types";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { Icon } from "./icon";

type SaveToCarrierBagButtonProps = {
	isInBag: boolean;
	onClick: () => void;
};

function SaveToCarrierBagButton({
	isInBag,
	onClick,
}: SaveToCarrierBagButtonProps) {
	return (
		<button
			type="button"
			className={cn(
				"flex items-center gap-2 rounded-lg border px-2 py-1 transition-colors md:gap-2.5",
				isInBag
					? "cursor-default border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
					: "cursor-pointer border-border bg-transparent hover:bg-secondary dark:hover:bg-neutral-800",
			)}
			onClick={isInBag ? undefined : onClick}
			disabled={isInBag || false}
		>
			<Icon
				icon={Backpack03Icon}
				size={14}
				className={cn(
					isInBag
						? "text-green-600 dark:text-green-400"
						: "text-neutral-500 dark:text-neutral-400",
				)}
				strokeWidth={1.5}
			/>
			<span
				className={cn(
					"font-normal text-xs uppercase md:text-sm",
					isInBag ? "text-green-600 dark:text-green-400" : "text-primary",
				)}
			>
				{isInBag ? "Saved to Carrier Bag" : "Save to Carrier Bag"}
			</span>
		</button>
	);
}

type PatternHeadingProps = {
	title: string | null;
	slug: string | null;
	pattern?: NonNullable<PATTERN_QUERYResult>;
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
				<div className="flex items-start gap-4 md:gap-6">
					{PatternIcon && (
						<div className="mt-1 h-6 w-6 flex-shrink-0 md:mt-1.5 md:h-8 md:w-8">
							<PatternIcon className="h-full w-full fill-icon/50 text-icon/50 opacity-40" />
						</div>
					)}
					<h1 className="text-page-heading">{title}</h1>
				</div>
				<div className="ml-10 md:ml-14">
					{pattern && (
						<SaveToCarrierBagButton
							isInBag={isInBag}
							onClick={handleSaveToCarrierBag}
						/>
					)}
				</div>
			</div>
		</header>
	);
}
