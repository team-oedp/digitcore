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
import {
	getStaleItemClasses,
	getStaleStatusText,
} from "~/lib/stale-content-utils";
import type { Pattern } from "~/sanity/sanity.types";

export type CarrierBagItem = {
	pattern: Pattern;
	dateAdded: string;
	notes?: string;
	contentVersion?: string; // Store pattern._updatedAt when added
};

export type CarrierBagItemData = {
	id: string;
	title: string;
	slug?: string;
	icon?: React.ComponentType;
	subtitle?: string;
	isStale?: boolean;
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
	return (
		<div
			className={getStaleItemClasses(item.isStale)}
			aria-label={getStaleStatusText(item.isStale)}
		>
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
						<Icon icon={Share02Icon} size={16} />
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate font-normal text-[13px] text-foreground hover:underline">
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
						<Icon icon={Share02Icon} size={16} />
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
			<div className="item-actions flex items-center gap-1 opacity-0 transition-opacity max-sm:opacity-100 sm:opacity-0">
				{item.isStale && (
					/* Visual stale indicator for mobile (always visible) - content is being updated automatically */
					<div
						className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-500 sm:hidden dark:bg-amber-400"
						aria-hidden="true"
						title="Content is being updated automatically"
					/>
				)}
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0 hover:bg-neutral-200 dark:hover:bg-neutral-800"
					onClick={(e) => {
						e.stopPropagation();
						onRemove?.(item.id);
					}}
					onPointerDown={(e) => e.stopPropagation()}
					aria-label={`Remove ${item.title} from carrier bag`}
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
