"use client";

import { usePathname } from "next/navigation";
import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
import { SiteHeader } from "~/components/global/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import { SiteFooter } from "./site-footer";

type SiteLayoutProps = {
	children: React.ReactNode;
};

export function SiteLayout({ children }: SiteLayoutProps) {
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
			<div className="flex min-h-0 flex-1 flex-row-reverse gap-2 overflow-hidden bg-neutral-200 pt-16 transition-[gap] md:pt-14 md:[&:has([data-slot=sidebar][data-state=collapsed])]:gap-0 md:[&:has([data-slot=sidebar][data-state=collapsed])]:delay-200 md:[&:has([data-slot=sidebar][data-state=collapsed])]:duration-0">
				<CarrierBagSidebar className="peer" />
				<SidebarInset className="mx-2 mb-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md bg-neutral-200 md:m-0 md:mb-0">
					<div
						className={cn(
							"flex h-full min-h-0 flex-1 flex-col overflow-y-auto",
							isCarrierBagRoute ? "bg-neutral-200" : "bg-primary-foreground",
						)}
					>
						<div className="flex min-h-screen flex-col">
							<main className="flex-1">{children}</main>
							{!isCarrierBagRoute && <SiteFooter />}
						</div>
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
