"use client";

import {
	ArrowExpand02Icon,
	Cancel01Icon,
	SidebarRightIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import {
	CarrierBagItem,
	type CarrierBagItemData,
} from "~/components/global/carrier-bag/carrier-bag-item";
import { PDFPreviewModal } from "~/components/pdf/pdf-preview-modal";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "~/components/ui/sidebar";
import { useCarrierBagDocument } from "~/hooks/use-pattern-content";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { Button } from "../../ui/button";
import { Icon } from "../icon";

export function CarrierBagSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const { isPinned, togglePin, setOpen, items, removePattern, clearBag } =
		useCarrierBagStore();
	const documentData = useCarrierBagDocument(items);

	const handleRemoveItem = (patternId: string) => {
		removePattern(patternId);
	};

	const handleExpandItem = (slug: string) => {
		// Navigate to pattern page
		window.location.href = `/pattern/${slug}`;
	};

	return (
		<Sidebar
			variant="floating"
			className={`top-(--header-height) h-[calc(100svh-var(--header-height))]! ${
				isPinned ? "fixed right-0 z-50 shadow-2xl" : ""
			}`}
			{...props}
		>
			<SidebarHeader>
				<div className="flex items-center justify-between p-5">
					<h3 className="font-normal text-lg text-primary">Carrier Bag</h3>
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0"
							type="button"
							aria-label="Pin Sidebar to Page"
							onClick={togglePin}
						>
							<Icon icon={SidebarRightIcon} size={16} />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0"
							type="button"
							aria-label="Expand Sidebar"
						>
							<Icon icon={ArrowExpand02Icon} size={16} />
						</Button>
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
			<SidebarContent>
				<SidebarGroup>
					<div className="flex flex-col gap-2 p-2">
						{items.length === 0 ? (
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
				<div className="flex flex-col gap-2.5 p-2">
					<div className="flex flex-col items-end justify-end gap-2 px-6 py-4">
						<div className="flex flex-col items-end justify-end gap-2">
							<div className="flex flex-row items-end justify-end gap-2">
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
									onClick={() => console.log("Download list as JSON")}
									disabled={items.length === 0}
								>
									Download list as JSON
								</Button>
							</div>
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
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
