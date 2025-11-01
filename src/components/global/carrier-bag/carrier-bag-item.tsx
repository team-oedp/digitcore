"use client";

import {
	Cancel01Icon,
	CircleArrowRight01Icon,
	DragDropVerticalIcon,
	Share02Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { buildLocaleHref, parseLocalePath } from "~/lib/locale-path";
import { getPatternIconWithMapping } from "~/lib/pattern-icons";
import {
	getStaleItemClasses,
	getStaleStatusText,
} from "~/lib/stale-content-utils";
import { cn } from "~/lib/utils";
import type {
	PATTERNS_BY_SLUGS_QUERYResult,
	PATTERN_QUERYResult,
} from "~/sanity/sanity.types";

export type PatternForCarrierBag =
	| NonNullable<PATTERN_QUERYResult>
	| PATTERNS_BY_SLUGS_QUERYResult[number];

export type CarrierBagItem = {
	pattern: PatternForCarrierBag;
	dateAdded: string;
	notes?: string;
	contentVersion?: string;
};

export type CarrierBagItemData = {
	id: string;
	title: string;
	slug?: string;
	icon?: React.ComponentType<React.ComponentPropsWithoutRef<"svg">>;
	subtitle?: string;
	isStale?: boolean;
	isUpdating?: boolean;
	isRecentlyUpdated?: boolean;
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
	const pathname = usePathname();
	const { language } = parseLocalePath(pathname);

	const patternHref = item.slug
		? buildLocaleHref(language, `/pattern/${item.slug}`)
		: null;

	const PatternIcon = item.slug ? getPatternIconWithMapping(item.slug) : null;

	const showUpdateAnimation = item.isUpdating || item.isRecentlyUpdated;

	return (
		<div
			className={cn(
				getStaleItemClasses(item.isStale),
				showUpdateAnimation &&
					"animate-pulse rounded-md border-2 border-yellow-500/60 shadow-sm shadow-yellow-500/20",
			)}
			aria-label={getStaleStatusText(item.isStale)}
		>
			{/* Drag handle */}
			<div className="shrink-0 cursor-grab opacity-60 transition-opacity hover:opacity-100 active:cursor-grabbing">
				<Icon icon={DragDropVerticalIcon} size={16} strokeWidth={3} />
			</div>

			{/* Clickable content (icon + text) */}
			{item.slug && patternHref ? (
				<Link
					href={patternHref}
					className="relative flex min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
					onClick={(e) => e.stopPropagation()}
					onPointerDown={(e) => e.stopPropagation()}
				>
					<div className="mt-0.5 shrink-0">
						{PatternIcon ? (
							<div className="h-4 w-4 shrink-0 opacity-40">
								<PatternIcon className="h-full w-full fill-icon/50 text-icon/50" />
							</div>
						) : (
							<Icon icon={Share02Icon} size={16} className="opacity-40" />
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
				<div className="relative flex min-w-0 flex-1 items-start gap-3 rounded-md">
					<div className="mt-0.5 shrink-0">
						{PatternIcon ? (
							<div className="h-4 w-4 shrink-0 opacity-40">
								<PatternIcon className="h-full w-full fill-icon/50 text-icon/50" />
							</div>
						) : (
							<Icon icon={Share02Icon} size={16} className="opacity-40" />
						)}
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate font-normal text-foreground text-sm uppercase">
							{item.title}
						</p>
						{item.subtitle ? (
							<p className="truncate text-muted-foreground text-sm capitalize">
								{item.subtitle}
							</p>
						) : null}
					</div>
				</div>
			)}

			{/* Actions */}
			<div className="item-actions relative flex items-center gap-1 opacity-0 transition-opacity max-sm:opacity-100 sm:opacity-0">
				{item.isStale && (
					/* Visual stale indicator for mobile (always visible) - content is being updated automatically */
					<div
						className="h-2 w-2 shrink-0 rounded-full bg-amber-500 sm:hidden dark:bg-amber-400"
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
				{item.slug && patternHref ? (
					<Link
						href={patternHref}
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
