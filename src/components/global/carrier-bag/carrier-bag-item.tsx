"use client";

import {
	Cancel01Icon,
	CircleArrowRight01Icon,
	DragDropVerticalIcon,
	Share02Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { getPatternIconWithMapping } from "~/lib/pattern-icons";
import type { Pattern } from "~/sanity/sanity.types";

export type CarrierBagItem = {
	pattern: Pattern;
	dateAdded: string;
	notes?: string;
};

export type CarrierBagItemData = {
	id: string;
	title: string;
	slug?: string;
	icon?: React.ComponentType<React.ComponentPropsWithoutRef<"svg">>;
	subtitle?: string;
};

export type CarrierBagItemProps = {
	item: CarrierBagItemData;
	onRemove?: (id: string) => void;
	onVisit?: (slug?: string) => void;
};

export function CarrierBagItem({
	item,
	onRemove,
	onVisit,
}: CarrierBagItemProps) {
	// Get the pattern icon based on slug, fallback to Share02Icon if no slug
	const PatternIcon = item.slug ? getPatternIconWithMapping(item.slug) : null;

	return (
		<div className="carrier-bag-item-container flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5 transition-colors hover:bg-muted/50 [&:hover_.item-actions]:opacity-100">
			{/* Drag handle */}
			<div className="flex-shrink-0 cursor-grab opacity-60 transition-opacity hover:opacity-100 active:cursor-grabbing">
				<Icon icon={DragDropVerticalIcon} size={16} strokeWidth={3} />
			</div>

			{/* Clickable content (icon + text) */}
			{item.slug ? (
				<Link
					href={`/pattern/${item.slug}`}
					className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					onClick={(e) => e.stopPropagation()}
					onPointerDown={(e) => e.stopPropagation()}
				>
					<div className="flex-shrink-0">
						{PatternIcon ? (
							<div className="h-4 w-4 flex-shrink-0">
								<PatternIcon className="h-full w-full fill-icon/50 text-icon/50" />
							</div>
						) : (
							<Icon icon={Share02Icon} size={16} />
						)}
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate font-normal text-[13px] text-foreground">
							{item.title}
						</p>
						{item.subtitle ? (
							<p className="truncate text-[13px] text-muted-foreground">
								{item.subtitle}
							</p>
						) : null}
					</div>
				</Link>
			) : (
				<>
					<div className="flex-shrink-0">
						{PatternIcon ? (
							<div className="h-4 w-4 flex-shrink-0">
								<PatternIcon className="h-full w-full fill-icon/50 text-icon/50" />
							</div>
						) : (
							<Icon icon={Share02Icon} size={16} />
						)}
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate font-normal text-foreground text-sm">
							{item.title}
						</p>
						{item.subtitle ? (
							<p className="truncate text-muted-foreground text-sm">
								{item.subtitle}
							</p>
						) : null}
					</div>
				</>
			)}

			{/* Actions */}
			<div className="item-actions flex items-center gap-1 opacity-0 transition-opacity">
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0 hover:bg-neutral-200 dark:hover:bg-neutral-800"
					onClick={(e) => {
						e.stopPropagation();
						onRemove?.(item.id);
					}}
					onPointerDown={(e) => e.stopPropagation()}
					aria-label={`Remove ${item.title}`}
				>
					<Icon icon={Cancel01Icon} size={14} />
				</Button>
				{item.slug ? (
					<Link
						href={`/pattern/${item.slug}`}
						onClick={(e) => e.stopPropagation()}
						onPointerDown={(e) => e.stopPropagation()}
					>
						<Button
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0 hover:bg-neutral-200 dark:hover:bg-neutral-800"
							aria-label={`Visit ${item.title}`}
							tabIndex={0}
							onClick={(e) => {
								e.stopPropagation();
								onVisit?.(item.slug);
							}}
							onPointerDown={(e) => e.stopPropagation()}
						>
							<Icon icon={CircleArrowRight01Icon} size={14} />
						</Button>
					</Link>
				) : (
					<Button
						variant="ghost"
						size="sm"
						className="h-6 w-6 p-0 hover:bg-neutral-200 dark:hover:bg-neutral-800"
						disabled
						aria-label={`Visit ${item.title}`}
					>
						<Icon icon={CircleArrowRight01Icon} size={14} />
					</Button>
				)}
			</div>
		</div>
	);
}
