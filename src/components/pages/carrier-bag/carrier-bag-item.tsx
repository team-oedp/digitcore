"use client";

import {
	Cancel01Icon,
	CircleArrowRight01Icon,
	DragDropVerticalIcon,
	Share02Icon,
} from "@hugeicons/core-free-icons";
import { Icon } from "~/components/global/icon";
import { Button } from "~/components/ui/button";

export type CarrierBagItemData = {
	id: string;
	title: string;
	icon?: React.ComponentType;
};

type CarrierBagItemProps = {
	item: CarrierBagItemData;
	onRemove?: (id: string) => void;
	onExpand?: (id: string) => void;
};

export function CarrierBagItem({
	item,
	onRemove,
	onExpand,
}: CarrierBagItemProps) {
	return (
		<div className="group flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 transition-colors hover:bg-muted/50">
			{/* Drag handle */}
			<div className="flex-shrink-0 cursor-grab opacity-60 transition-opacity active:cursor-grabbing group-hover:opacity-100">
				<Icon icon={DragDropVerticalIcon} size={16} strokeWidth={3} />
			</div>

			{/* Item icon */}
			<div className="flex-shrink-0">
				<Icon icon={Share02Icon} size={16} />
			</div>

			{/* Item content */}
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium text-foreground text-sm">
					{item.title}
				</p>
			</div>

			{/* Actions */}
			<div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0"
					onClick={() => onRemove?.(item.id)}
					aria-label={`Remove ${item.title}`}
				>
					<Icon icon={Cancel01Icon} size={14} />
				</Button>
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0"
					onClick={() => onExpand?.(item.id)}
					aria-label={`Expand ${item.title}`}
				>
					<Icon icon={CircleArrowRight01Icon} size={14} />
				</Button>
			</div>
		</div>
	);
}
