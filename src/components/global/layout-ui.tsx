"use client";

import { usePathname } from "next/navigation";
import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
import { SiteHeader } from "~/components/global/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

type LayoutUIProps = {
	children: React.ReactNode;
};

export function LayoutUI({ children }: LayoutUIProps) {
	const pathname = usePathname();
	const isCarrierBagRoute = pathname === "/carrier-bag";
	return (
		<SidebarProvider
			className="flex h-full min-h-0 w-full flex-col gap-2"
			style={
				{
					"--sidebar-width": "28rem",
				} as React.CSSProperties
			}
			defaultOpen={false}
		>
			<SiteHeader />
			<div className="flex min-h-0 flex-1 flex-row-reverse gap-2 overflow-hidden bg-neutral-200 pt-14 transition-[gap] md:[&:has([data-slot=sidebar][data-state=collapsed])]:gap-0 md:[&:has([data-slot=sidebar][data-state=collapsed])]:delay-200 md:[&:has([data-slot=sidebar][data-state=collapsed])]:duration-0">
				<CarrierBagSidebar className="peer" />
				<SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden bg-neutral-200">
					<main
						className={cn(
							"flex min-h-0 flex-1 flex-col overflow-y-auto",
							isCarrierBagRoute ? "bg-neutral-200" : "bg-primary-foreground",
						)}
					>
						{children}
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
