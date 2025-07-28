"use client";

import {
	ArrowExpand02Icon,
	Cancel01Icon,
	SidebarRightIcon,
} from "@hugeicons/core-free-icons";
import {
	CarrierBagItem,
	type CarrierBagItemData,
} from "~/components/global/carrier-bag/carrier-bag-item";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
} from "~/components/ui/sidebar";
import { Button } from "../../ui/button";
import { Icon } from "../icon";

// Dummy data for carrier bag items
const dummyCarrierBagItems: CarrierBagItemData[] = [
	{
		id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
		title: "Enhancing frontline communities' agency",
	},
	{
		id: "b2c3d4e5-f6g7-8901-bcde-f23456789012",
		title: "Respecting frontline communities' time and effort",
	},
	{
		id: "c3d4e5f6-g7h8-9012-cdef-345678901234",
		title: "Reducing harm to communities",
	},
	{
		id: "d4e5f6g7-h8i9-0123-defa-456789012345",
		title: "Holding outsiders accountable",
	},
	{
		id: "e5f6g7h8-i9j0-1234-efab-567890123456",
		title: "Open means different things to different people",
	},
	{
		id: "f6g7h8i9-j0k1-2345-fabc-678901234567",
		title: "Mandated vs. meaningful openness",
	},
	{
		id: "g7h8i9j0-k1l2-3456-abcd-789012345678",
		title: "Pressure to commercialize",
	},
	{
		id: "h8i9j0k1-l2m3-4567-bcde-890123456789",
		title: "Meaning-making takes resources",
	},
	{
		id: "i9j0k1l2-m3n4-5678-cdef-901234567890",
		title: "Openness as a daily practice",
	},
	{
		id: "j0k1l2m3-n4o5-6789-defa-012345678901",
		title: "Open tools may not be fully usable for frontline communities",
	},
	{
		id: "k1l2m3n4-o5p6-7890-efab-123456789012",
		title: "Adequate metadata requires capacity",
	},
	{
		id: "l2m3n4o5-p6q7-8901-fabc-234567890123",
		title: "Data quality standards remain to be developed",
	},
	{
		id: "m3n4o5p6-q7r8-9012-abcd-345678901234",
		title: "Isolated open data repositories",
	},
];

export function CarrierBagSidebar({
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
					<h3 className="font-normal text-lg text-primary">Carrier Bag</h3>
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
