"use client";

import {
	ArrowExpand02Icon,
	Cancel01Icon,
	SidebarRightIcon,
} from "@hugeicons/core-free-icons";
import {
	CarrierBagItem,
	type CarrierBagItemData,
} from "~/components/pages/carrier-bag/carrier-bag-item";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "~/components/ui/sidebar";
import { Button } from "../ui/button";
import { Icon } from "./icon";

// Dummy data for carrier bag items
const dummyCarrierBagItems: CarrierBagItemData[] = [
	{
		id: "1",
		title: "Enhancing frontline communities' agency",
	},
	{
		id: "2",
		title: "Respecting frontline communities' time and effort",
	},
	{
		id: "3",
		title: "Reducing harm to communities",
	},
	{
		id: "4",
		title: "Holding outsiders accountable",
	},
	{
		id: "5",
		title: "Open means different things to different people",
	},
	{
		id: "6",
		title: "Mandated vs. meaningful openness",
	},
	{
		id: "7",
		title: "Pressure to commercialize",
	},
	{
		id: "8",
		title: "Meaning-making takes resources",
	},
	{
		id: "9",
		title: "Openness as a daily practice",
	},
	{
		id: "10",
		title: "Open tools may not be fully usable for frontline communities",
	},
	{
		id: "11",
		title: "Adequate metadata requires capacity",
	},
	{
		id: "12",
		title: "Data quality standards remain to be developed",
	},
	{
		id: "13",
		title: "Isolated open data repositories",
	},
];

export function FloatingSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const handleRemoveItem = (id: string) => {
		console.log("Remove item:", id);
	};

	const handleExpandItem = (id: string) => {
		console.log("Expand item:", id);
	};

	return (
		<Sidebar
			variant="floating"
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			{...props}
		>
			<SidebarHeader>
				<div className="flex items-center justify-between p-5">
					<h3 className="font-semibold text-lg text-primary">Carrier Bag</h3>
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0"
							type="button"
							aria-label="Collapse Sidebar"
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
						>
							<Icon icon={Cancel01Icon} size={16} />
						</Button>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<div className="flex flex-col gap-2 p-2">
						{dummyCarrierBagItems.map((item) => (
							<CarrierBagItem
								key={item.id}
								item={item}
								onRemove={handleRemoveItem}
								onExpand={handleExpandItem}
							/>
						))}
					</div>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<div className="flex flex-col gap-2.5 p-2">
					<div className="flex flex-col items-end justify-end gap-2 px-6 py-4">
						<div className="flex flex-row items-end justify-end gap-2">
							<Button
								variant="outline"
								size="sm"
								className="h-auto border-[#dcdcdc] bg-[#fcfcfc] px-[9px] py-[5px] text-[#3d3d3d] text-sm"
								type="button"
								onClick={() => console.log("Clear all items")}
							>
								Clear all items
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="h-auto border-[#dcdcdc] bg-[#fcfcfc] px-[9px] py-[5px] text-[#3d3d3d] text-sm"
								type="button"
								onClick={() => console.log("Download list as JSON")}
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
