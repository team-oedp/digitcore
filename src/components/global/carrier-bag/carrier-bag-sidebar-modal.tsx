"use client";

import { Command, X } from "lucide-react";
import { useCarrierBagStore } from "~/stores/carrier-bag";

import {
	CarrierBagItem,
	type CarrierBagItemData,
} from "~/components/global/carrier-bag/carrier-bag-item";
import { Button } from "~/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
} from "../../ui/sidebar";

export function CarrierBagSidebarModal() {
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

	if (!isOpen) return null;

	return (
		<Sidebar className="fixed top-20 right-4 bottom-4 left-auto z-50 flex w-[var(--sidebar-width)] flex-col rounded-md border border-sidebar-border bg-sidebar shadow-lg">
			{/* Header */}
			<div className="flex items-center justify-between border-sidebar-border border-b p-4">
				<div className="flex items-center gap-2">
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						<Command className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium text-sidebar-foreground">
							DIGITCORE
						</span>
						<span className="truncate text-sidebar-foreground/70 text-xs">
							Patterns
						</span>
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6 text-sidebar-foreground/70 hover:text-sidebar-foreground"
					onClick={() => setOpen(false)}
				>
					<X className="h-4 w-4" />
				</Button>
			</div>

			{/* Content */}
			<SidebarContent className="flex-1 overflow-auto p-2">
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

			{/* Footer */}
			{/* <div className="border-sidebar-border border-t p-2">
					<NavUser user={data.user} />
				</div> */}
			<SidebarFooter>
				<div className="flex flex-col gap-2.5 p-2">
					<div className="flex flex-col items-end justify-end gap-2 px-6 py-4">
						<div className="flex flex-row items-end justify-end gap-2">
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
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	);
}
