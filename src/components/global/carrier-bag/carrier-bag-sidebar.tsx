"use client";

import {
	AlertCircleIcon,
	Cancel01Icon,
	Delete02Icon,
	Download05Icon,
	FileDownloadIcon,
	FolderLibraryIcon,
	SidebarRightIcon,
} from "@hugeicons/core-free-icons";
import { Reorder } from "motion/react";
import Link from "next/link";
import type * as React from "react";
import { useEffect } from "react";
import { PDFPreviewModal } from "~/components/pdf/pdf-preview-modal";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	useSidebar,
} from "~/components/ui/sidebar";
import { useCarrierBagDocument } from "~/hooks/use-pattern-content";
import type { Language } from "~/i18n/config";
import { buildLocaleHref } from "~/lib/locale-path";
import { cn } from "~/lib/utils";
import type { CARRIER_BAG_QUERYResult } from "~/sanity/sanity.types";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { CarrierBagItem, type CarrierBagItemData } from "./carrier-bag-item";

type CarrierBagSidebarProps = React.ComponentProps<typeof Sidebar> & {
	carrierBagData?: CARRIER_BAG_QUERYResult;
	language: Language;
};

export function CarrierBagSidebar({
	className,
	carrierBagData,
	language,
	...props
}: CarrierBagSidebarProps) {
	const isHydrated = useCarrierBagStore((state) => state.isHydrated);
	const isOpen = useCarrierBagStore((state) => state.isOpen);
	const setOpen = useCarrierBagStore((state) => state.setOpen);
	const toggleOpen = useCarrierBagStore((state) => state.toggleOpen);
	const items = useCarrierBagStore((state) => state.items);
	const removePattern = useCarrierBagStore((state) => state.removePattern);
	const setItems = useCarrierBagStore((state) => state.setItems);
	const clearBag = useCarrierBagStore((state) => state.clearBag);
	const isPatternStale = useCarrierBagStore((state) => state.isPatternStale);
	const isPatternUpdating = useCarrierBagStore(
		(state) => state.isPatternUpdating,
	);
	const isPatternRecentlyUpdated = useCarrierBagStore(
		(state) => state.isPatternRecentlyUpdated,
	);
	const showClearConfirmation = useCarrierBagStore(
		(state) => state.showClearConfirmation,
	);
	const showClearConfirmationPane = useCarrierBagStore(
		(state) => state.showClearConfirmationPane,
	);
	const hideClearConfirmationPane = useCarrierBagStore(
		(state) => state.hideClearConfirmationPane,
	);
	const documentData = useCarrierBagDocument(items);
	const { setOpen: setSidebarOpen, setOpenMobile, isMobile } = useSidebar();

	// Sync Zustand store state to Sidebar component state
	// This is a one-way sync: Zustand store → Sidebar component
	// Handle both desktop and mobile sidebar states
	useEffect(() => {
		if (!isHydrated) return;
		if (isMobile) {
			setOpenMobile(isOpen);
		} else {
			setSidebarOpen(isOpen);
		}
	}, [isOpen, setSidebarOpen, setOpenMobile, isMobile, isHydrated]);

	const handleRemoveItem = (patternId: string) => {
		removePattern(patternId);
	};

	const handleDownloadJson = () => {
		const payload = {
			generatedAt: new Date().toISOString(),
			count: items.length,
			patterns: items.map((i) => ({
				id: i.pattern._id,
				title: i.pattern.title,
				slug: i.pattern.slug ?? undefined,
				notes: i.notes,
				dateAdded: i.dateAdded,
			})),
		};
		const blob = new Blob([JSON.stringify(payload, null, 2)], {
			type: "application/json",
		});
		const href = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = href;
		a.download = "carrier-bag.json";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(href);
	};

	return (
		<Sidebar
			side="right"
			variant="inset"
			className={cn(
				"top-[calc(var(--header-height)+theme(spacing.2))] right-2 bottom-2 flex h-[calc(100svh-var(--header-height)-theme(spacing.4))] min-h-0 flex-col rounded-md bg-container-background",
				className,
			)}
			{...props}
		>
			<SidebarHeader className="bg-container-background">
				<div className="flex items-start justify-between p-2">
					<div className="flex flex-col">
						<h3 className="text-heading-compact">
							{carrierBagData?.title || "Carrier Bag"}
						</h3>
						{/* Background updates only - no loading UI to avoid confusion */}
					</div>
					<div className="flex items-center gap-1">
						<button
							type="button"
							className="hidden h-7 items-center rounded-md px-2 py-0.5 outline-none transition-colors duration-150 ease-linear"
							aria-label="Pin Sidebar to Page"
							onClick={() => console.log("Pin Sidebar to Page")}
							disabled
						>
							<Icon
								icon={SidebarRightIcon}
								size={16}
								className="text-muted-foreground transition-colors"
							/>
						</button>
						<Link
							href={buildLocaleHref(language, "/carrier-bag")}
							tabIndex={-1}
						>
							<button
								type="button"
								className="flex h-7 items-center rounded-md px-2 py-0.5 outline-none transition-colors duration-150 ease-linear"
								aria-label="Expand Sidebar"
								tabIndex={0}
								onClick={toggleOpen}
							>
								<Icon
									icon={FolderLibraryIcon}
									size={16}
									className="text-muted-foreground transition-colors hover:text-foreground"
								/>
							</button>
						</Link>
						<button
							type="button"
							className="flex h-7 items-center rounded-md px-2 py-0.5 outline-none transition-colors duration-150 ease-linear"
							aria-label="Close Sidebar"
							onClick={() => setOpen(false)}
						>
							<Icon
								icon={Cancel01Icon}
								size={16}
								className="text-muted-foreground transition-colors hover:text-foreground"
							/>
						</button>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent className="flex-1 bg-container-background">
				<SidebarGroup className="flex h-full min-h-0 flex-col">
					{showClearConfirmation ? (
						<div className="flex h-full flex-col items-start justify-start gap-4 px-3 pt-12 pb-3 text-left">
							<div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/50">
								<Icon
									icon={AlertCircleIcon}
									size={24}
									className="text-red-800 dark:text-red-200"
								/>
							</div>
							<div className="space-y-2">
								<h3 className="font-normal text-foreground text-lg">
									Remove all items?
								</h3>
								<p className="text-muted-foreground text-prose text-sm">
									This will remove all {items.length} pattern
									{items.length !== 1 ? "s" : ""} from your carrier bag. This
									action cannot be undone.
								</p>
							</div>
							<div className="flex w-full gap-3 pt-2">
								<Button
									variant="default"
									size="sm"
									onClick={hideClearConfirmationPane}
									className="flex-1"
								>
									Cancel
								</Button>
								<Button
									variant="destructive"
									size="sm"
									onClick={() => {
										clearBag();
										hideClearConfirmationPane();
									}}
									className="flex-1"
								>
									Remove All
								</Button>
							</div>
						</div>
					) : (
						<div className="flex h-full min-h-0 flex-col gap-2 rounded-2xl border border-border border-dashed p-2">
							{!isHydrated ? (
								<div className="flex flex-1 flex-col items-start justify-start px-4 py-8">
									<p className="text-left font-normal text-muted-foreground text-sm">
										Loading...
									</p>
								</div>
							) : items.length === 0 ? (
								<div className="flex flex-1 flex-col items-start justify-start px-4 py-8">
									<p className="text-left font-normal text-muted-foreground text-sm">
										{carrierBagData?.emptyStateMessage ||
											"There are no patterns in your carrier bag. Start by saving one from the toolkit."}
									</p>
								</div>
							) : (
								<Reorder.Group
									axis="y"
									values={items}
									onReorder={(newOrder) => setItems(newOrder)}
									layoutScroll
									as="div"
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "0.5rem",
										overflowY: "auto",
									}}
								>
									{items.map((item) => {
										const itemData: CarrierBagItemData = {
											id: item.pattern._id,
											title: item.pattern.title || "Untitled Pattern",
											slug: item.pattern.slug ?? undefined,
											isStale: isPatternStale(item.pattern._id),
											isUpdating: isPatternUpdating(item.pattern._id),
											isRecentlyUpdated: isPatternRecentlyUpdated(
												item.pattern._id,
											),
										};
										return (
											<Reorder.Item
												as="div"
												key={item.pattern._id}
												value={item}
												style={{ position: "relative" }}
											>
												<CarrierBagItem
													item={itemData}
													onRemove={() => handleRemoveItem(item.pattern._id)}
												/>
											</Reorder.Item>
										);
									})}
								</Reorder.Group>
							)}
						</div>
					)}
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className="bg-container-background">
				<div className="flex flex-row items-center gap-2 p-2">
					<PDFPreviewModal
						documentData={documentData}
						disabled={items.length === 0}
					>
						<button
							type="button"
							className="group/pdf flex h-7 items-center gap-2 rounded-md px-2 py-0.5 outline-none transition-colors duration-150 ease-linear disabled:cursor-not-allowed disabled:opacity-50"
							disabled={items.length === 0}
							aria-label="PDF"
						>
							<Icon
								icon={FileDownloadIcon}
								size={14}
								className="text-muted-foreground transition-colors group-hover/pdf:text-foreground"
							/>
							<span className="hidden font-normal text-muted-foreground text-sm capitalize transition-colors group-hover/pdf:text-foreground md:inline">
								{carrierBagData?.pdfButtonLabel || "PDF"}
							</span>
						</button>
					</PDFPreviewModal>
					<button
						type="button"
						className="group/json flex h-7 items-center gap-2 rounded-md px-2 py-0.5 outline-none transition-colors duration-150 ease-linear disabled:cursor-not-allowed disabled:opacity-50"
						onClick={handleDownloadJson}
						disabled={items.length === 0}
						aria-label="Download list as JSON"
					>
						<Icon
							icon={Download05Icon}
							size={14}
							className="text-muted-foreground transition-colors group-hover/json:text-foreground"
						/>
						<span className="hidden font-normal text-muted-foreground text-sm capitalize transition-colors group-hover/json:text-foreground md:inline">
							{carrierBagData?.jsonButtonLabel || "JSON"}
						</span>
					</button>
					<button
						type="button"
						className="group/delete flex h-7 items-center gap-2 rounded-md px-2 py-0.5 outline-none transition-colors duration-150 ease-linear disabled:cursor-not-allowed disabled:opacity-50"
						onClick={showClearConfirmationPane}
						disabled={items.length === 0}
						aria-label="Remove all items"
					>
						<Icon
							icon={Delete02Icon}
							size={14}
							className="text-muted-foreground transition-colors group-hover/delete:text-foreground"
						/>
						<span className="hidden font-normal text-muted-foreground text-sm capitalize transition-colors group-hover/delete:text-foreground md:inline">
							{carrierBagData?.removeAllButtonLabel || "Remove all"}
						</span>
					</button>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
