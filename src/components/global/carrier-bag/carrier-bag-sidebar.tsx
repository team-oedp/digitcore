"use client";

import type * as React from "react";

import {
	Cancel01Icon,
	SidebarRightIcon,
	WebDesign01Icon,
} from "@hugeicons/core-free-icons";
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
	const items = useCarrierBagStore((state) => state.items);
	const removePattern = useCarrierBagStore((state) => state.removePattern);
	const clearBag = useCarrierBagStore((state) => state.clearBag);
	const documentData = useCarrierBagDocument(items);
	const { toggleSidebar } = useSidebar();

	const handleRemoveItem = (patternId: string) => {
		removePattern(patternId);
	};

	const handleExpandItem = (slug: string) => {
		// Navigate to pattern page
		window.location.href = `/pattern/${slug}`;
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
								onClick={toggleSidebar}
							>
								<Icon icon={WebDesign01Icon} size={16} />
							</Button>
						</Link>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0"
							type="button"
							aria-label="Close Sidebar"
							onClick={toggleSidebar}
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
							items.map((item) => {
								const itemData: CarrierBagItemData = {
									id: item.pattern._id,
									title: item.pattern.title || "Untitled Pattern",
								};
								return (
									<CarrierBagItem
										key={item.pattern._id}
										item={itemData}
										onRemove={() => handleRemoveItem(item.pattern._id)}
										onExpand={() =>
											handleExpandItem(item.pattern.slug?.current || "")
										}
									/>
								);
							})
						)}
					</div>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="flex flex-row flex-wrap items-end justify-between gap-2 p-2">
					<Button
						variant="outline"
						size="sm"
						className="h-auto border-[#dcdcdc] bg-[#fcfcfc] px-[9px] py-[5px] text-[#3d3d3d] text-sm"
						type="button"
						onClick={clearBag}
						disabled={items.length === 0}
					>
						Clear all items
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-auto border-[#dcdcdc] bg-[#fcfcfc] px-[9px] py-[5px] text-[#3d3d3d] text-sm"
						type="button"
						onClick={handleDownloadJson}
						disabled={items.length === 0}
					>
						Download list as JSON
					</Button>
					<PDFPreviewModal
						documentData={documentData}
						disabled={items.length === 0}
					>
						<Button
							variant="outline"
							size="sm"
							className="flex h-auto items-center gap-2 border-[#dcdcdc] bg-[#fcfcfc] px-[9px] py-[5px] text-[#3d3d3d] text-sm"
							type="button"
							disabled={items.length === 0}
						>
							Download as PDF
						</Button>
					</PDFPreviewModal>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
