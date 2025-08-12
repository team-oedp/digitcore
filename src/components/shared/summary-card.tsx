import { NanoTechnologyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function SummaryCard() {
	return (
		<div className="flex h-80 w-120 flex-none snap-start flex-col justify-between rounded-lg bg-neutral-200/25 p-8">
			<div className="space-y-6">
				<h3 className="font-normal text-black text-xl leading-tight">
					Ensuring Benefit To Frontline Communities
				</h3>
				<p className="line-clamp-6 text-base text-neutral-500 leading-relaxed">
					Within the development of open infrastructure, ensuring benefit to
					frontline communities means going beyond access and inclusion to
					prioritizing ownership and collaboration. This may involve co-
					leadership in decision making, providing resources for collaborating,
					minimizing harm and maximizing benefit, supporting data sovereignty,
					and accountability mechanisms.
				</p>
			</div>
			<div className="flex items-center gap-3 text-base text-neutral-500">
				<HugeiconsIcon
					icon={NanoTechnologyIcon}
					size={16}
					color="currentColor"
					strokeWidth={1.5}
				/>
				<span>Visit patterns</span>
			</div>
		</div>
	);
}
