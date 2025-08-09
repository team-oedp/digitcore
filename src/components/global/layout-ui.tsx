"use client";

import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
import { SiteHeader } from "~/components/global/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

type LayoutUIProps = {
	children: React.ReactNode;
};

export function LayoutUI({ children }: LayoutUIProps) {
	return (
		<SidebarProvider
			className="flex h-screen flex-col gap-2"
			style={
				{
					"--sidebar-width": "24rem",
				} as React.CSSProperties
			}
		>
			<SiteHeader />
			<div className="flex flex-1 flex-row-reverse gap-2 overflow-hidden bg-neutral-200 pt-14 transition-[gap] md:[&:has([data-slot=sidebar][data-state=collapsed])]:gap-0 md:[&:has([data-slot=sidebar][data-state=collapsed])]:delay-200 md:[&:has([data-slot=sidebar][data-state=collapsed])]:duration-0">
				<CarrierBagSidebar className="peer" />
				<SidebarInset className="flex flex-1 flex-col overflow-hidden">
					<main className="flex flex-1 flex-col overflow-y-auto bg-primary-foreground">
						{children}
					</main>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
