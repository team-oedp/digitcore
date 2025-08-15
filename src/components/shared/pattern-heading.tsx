"use client";

import { Backpack03Icon } from "@hugeicons/core-free-icons";
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
	const isPatternInBag = useCarrierBagStore((s) =>
		pattern ? s.hasPattern(pattern._id) : false,
	);

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
					<h1 className="font-light text-[32px] text-primary capitalize">
						{title}
					</h1>
				</div>
				<div>
					{pattern && (
						<button
							type="button"
							className={cn(
								"flex items-center gap-2.5 rounded-lg border border-border px-2 py-1 transition-colors",
								isPatternInBag
									? "cursor-default border-green-200 bg-green-50"
									: "cursor-pointer bg-white hover:bg-secondary",
							)}
							onClick={isPatternInBag ? undefined : handleSaveToCarrierBag}
							disabled={isPatternInBag}
						>
							<span className="font-normal text-primary text-sm uppercase">
								{isPatternInBag
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
