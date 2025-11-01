"use client";

import {
	ArrowExpand02Icon,
	Cancel01Icon,
	SidebarRightIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import {
	CarrierBagItem,
	type CarrierBagItemData,
} from "~/components/global/carrier-bag/carrier-bag-item";
import { Icon } from "~/components/shared/icon";
import { Button } from "~/components/ui/button";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "../../ui/sidebar";

export function CarrierBagSidebarModal() {
	const isHydrated = useCarrierBagStore((state) => state.isHydrated);
	const isOpen = useCarrierBagStore((state) => state.isOpen);
	const setOpen = useCarrierBagStore((state) => state.setOpen);
	const items = useCarrierBagStore((state) => state.items);
	const removePattern = useCarrierBagStore((state) => state.removePattern);
	const clearBag = useCarrierBagStore((state) => state.clearBag);
	const router = useRouter();

	const handleRemoveItem = (patternId: string) => {
		removePattern(patternId);
	};

	const handleVisitItem = (slug?: string) => {
		if (!slug) return;
		router.push(`/pattern/${slug}`);
	};

	if (!isOpen) return null;

	return (
		<Sidebar className="fixed top-20 right-4 bottom-4 left-auto z-50 flex w-[var(--sidebar-width)] flex-col rounded-md border border-sidebar-border bg-sidebar shadow-lg">
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
											onVisit={() =>
												handleVisitItem(item.pattern.slug ?? undefined)
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
							Remove all items
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
