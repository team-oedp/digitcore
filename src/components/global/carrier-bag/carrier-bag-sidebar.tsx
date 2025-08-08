"use client";

import type * as React from "react";

import {
	ArrowExpand02Icon,
	Cancel01Icon,
	SidebarRightIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarRail,
} from "~/components/ui/sidebar";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { CarrierBagItem, type CarrierBagItemData } from "./carrier-bag-item";

export const iframeHeight = "800px";

export const description = "A sidebar with a header and a search form.";

export function CarrierBagSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const isHydrated = useCarrierBagStore((state) => state.isHydrated);
	const isOpen = useCarrierBagStore((state) => state.isOpen);
	const setOpen = useCarrierBagStore((state) => state.setOpen);
	const items = useCarrierBagStore((state) => state.items);
	const removePattern = useCarrierBagStore((state) => state.removePattern);
	const clearBag = useCarrierBagStore((state) => state.clearBag);

	const handleRemoveItem = (patternId: string) => {
		removePattern(patternId);
	};

	const handleExpandItem = (slug: string) => {
		// Navigate to pattern page
		window.location.href = `/pattern/${slug}`;
	};

	return (
		<Sidebar
			side="right"
			variant="inset"
			className="top-16.5 right-2 bottom-2 h-[calc(100%-var(--spacing(20))-var(--spacing(8))] rounded-md bg-primary-foreground"
			{...props}
		>
			<div className="flex h-full flex-col rounded-md">
				<SidebarHeader>
					<div className="flex items-start justify-between p-2">
						<h3 className="font-normal text-lg text-primary">Carrier Bag</h3>
						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 p-0"
								type="button"
								aria-label="Pin Sidebar to Page"
								onClick={() => console.log("Pin Sidebar to Page")}
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
										There are no patterns in your carrier bag. Start by saving
										one from the toolkit.
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
					<div className="flex flex-row items-end justify-between gap-2 p-2">
						<Button
							variant="outline"
							size="sm"
							className="h-auto border-[#dcdcdc] bg-[#fcfcfc] px-[9px] py-[5px] text-[#3d3d3d] text-sm"
							type="button"
							onClick={clearBag}
							disabled={!isHydrated || items.length === 0}
						>
							Clear all items
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="h-auto border-[#dcdcdc] bg-[#fcfcfc] px-[9px] py-[5px] text-[#3d3d3d] text-sm"
							type="button"
							onClick={() => console.log("Download list as JSON")}
							disabled={!isHydrated}
						>
							Download list as JSON
						</Button>
					</div>
				</SidebarFooter>
			</div>
		</Sidebar>
	);
}
