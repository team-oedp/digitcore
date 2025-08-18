"use client";

import type * as React from "react";
import { useEffect } from "react";

import {
	Cancel01Icon,
	CleaningBucketIcon,
	Download05Icon,
	FileDownloadIcon,
	FolderLibraryIcon,
	SidebarRightIcon,
} from "@hugeicons/core-free-icons";
import { Reorder } from "motion/react";
import Link from "next/link";
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
import { cn } from "~/lib/utils";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { CarrierBagItem, type CarrierBagItemData } from "./carrier-bag-item";

export function CarrierBagSidebar({
	className,
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const isHydrated = useCarrierBagStore((state) => state.isHydrated);
	const isOpen = useCarrierBagStore((state) => state.isOpen);
	const setOpen = useCarrierBagStore((state) => state.setOpen);
	const toggleOpen = useCarrierBagStore((state) => state.toggleOpen);
	const items = useCarrierBagStore((state) => state.items);
	const removePattern = useCarrierBagStore((state) => state.removePattern);
	const setItems = useCarrierBagStore((state) => state.setItems);
	const clearBag = useCarrierBagStore((state) => state.clearBag);
	const documentData = useCarrierBagDocument(items);
	const { setOpen: setSidebarOpen } = useSidebar();

	// Sync Zustand store state to Sidebar component state
	// This is a one-way sync: Zustand store → Sidebar component
	useEffect(() => {
		if (!isHydrated) return;
		setSidebarOpen(isOpen);
	}, [isOpen, setSidebarOpen, isHydrated]);

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
				slug:
					typeof i.pattern.slug === "string"
						? i.pattern.slug
						: i.pattern.slug?.current,
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
				"top-[calc(var(--header-height)+theme(spacing.2))] right-2 bottom-2 flex h-[calc(100svh-var(--header-height)-theme(spacing.4))] min-h-0 flex-col rounded-md bg-primary-foreground",
				className,
			)}
			{...props}
		>
			<SidebarHeader>
				<div className="flex items-start justify-between p-2">
					<h3 className="font-normal text-lg text-primary">Carrier Bag</h3>
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="sm"
							className="hidden h-8 w-8 p-0"
							type="button"
							aria-label="Pin Sidebar to Page"
							onClick={() => console.log("Pin Sidebar to Page")}
							disabled
						>
							<Icon icon={SidebarRightIcon} size={16} />
						</Button>
						<Link href="/carrier-bag" tabIndex={-1}>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0"
								type="button"
								aria-label="Expand Sidebar"
								tabIndex={0}
								onClick={toggleOpen}
							>
								<Icon icon={FolderLibraryIcon} size={16} />
							</Button>
						</Link>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0"
							type="button"
							aria-label="Close Sidebar"
							onClick={() => setOpen(false)}
						>
							<Icon icon={Cancel01Icon} size={16} />
						</Button>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent className="flex-1 overflow-y-auto">
				<SidebarGroup>
					<div className="flex flex-col gap-2 p-2">
						{!isHydrated ? (
							<div className="flex flex-col items-center justify-center px-4 py-8 text-center">
								<p className="font-normal text-muted-foreground text-sm">
									Loading...
								</p>
							</div>
						) : items.length === 0 ? (
							<div className="flex flex-col items-center justify-center px-4 py-8 text-center">
								<p className="font-normal text-muted-foreground text-sm">
									There are no patterns in your carrier bag. Start by saving one
									from the toolkit.
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
								}}
							>
								{items.map((item) => {
									const slug =
										typeof item.pattern.slug === "string"
											? item.pattern.slug
											: item.pattern.slug?.current;
									const itemData: CarrierBagItemData = {
										id: item.pattern._id,
										title: item.pattern.title || "Untitled Pattern",
										slug: slug,
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
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="flex flex-row items-center gap-2 p-2">
					<Button
						variant="outline"
						size="sm"
						className="h-8 w-8 border-[#dcdcdc] bg-[#fcfcfc] p-0 text-[#3d3d3d]"
						type="button"
						onClick={clearBag}
						disabled={items.length === 0}
						aria-label="Clear all items"
						title="Clear all items"
					>
						<Icon icon={CleaningBucketIcon} size={16} />
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-8 w-8 border-[#dcdcdc] bg-[#fcfcfc] p-0 text-[#3d3d3d]"
						type="button"
						onClick={handleDownloadJson}
						disabled={items.length === 0}
						aria-label="Download list as JSON"
						title="Download list as JSON"
					>
						<Icon icon={Download05Icon} size={16} />
					</Button>
					<PDFPreviewModal
						documentData={documentData}
						disabled={items.length === 0}
					>
						<Button
							variant="outline"
							size="sm"
							className="h-8 w-8 border-[#dcdcdc] bg-[#fcfcfc] p-0 text-[#3d3d3d]"
							type="button"
							disabled={items.length === 0}
							aria-label="Download as PDF"
							title="Download as PDF"
						>
							<Icon icon={FileDownloadIcon} size={16} />
						</Button>
					</PDFPreviewModal>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
