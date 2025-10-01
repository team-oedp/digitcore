"use client";

import { usePathname } from "next/navigation";
import { useRef } from "react";
import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
import { SiteHeader } from "~/components/global/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import type { FOOTER_QUERYResult } from "~/sanity/sanity.types";
import { SiteFooter } from "./site-footer";

type SiteLayoutProps = {
	children: React.ReactNode;
	footerData: FOOTER_QUERYResult;
};

export function SiteLayout({ children, footerData }: SiteLayoutProps) {
	const pathname = usePathname();
	const isCarrierBagRoute = pathname === "/carrier-bag";
	const scrollContainerRef = useRef<HTMLDivElement>(null);
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
			<div className="flex min-h-0 flex-1 flex-row-reverse gap-2 overflow-hidden bg-secondary pt-16 transition-[gap] md:pt-14 md:[&:has([data-slot=sidebar][data-state=collapsed])]:gap-0 md:[&:has([data-slot=sidebar][data-state=collapsed])]:delay-200 md:[&:has([data-slot=sidebar][data-state=collapsed])]:duration-0">
				<CarrierBagSidebar className="peer" />
				<SidebarInset className="relative mx-2 mb-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md md:m-0 md:mb-0">
					<div
						ref={scrollContainerRef}
						className={cn(
							"flex h-full min-h-0 flex-1 flex-col",
							isCarrierBagRoute
								? "overflow-hidden"
								: "overflow-y-auto bg-container-background",
						)}
					>
						<div
							className={cn(
								"flex flex-col",
								isCarrierBagRoute ? "h-full" : "min-h-screen",
							)}
						>
							<main
								className={cn(
									"flex-1",
									isCarrierBagRoute ? "h-full min-h-0 overflow-hidden" : "",
								)}
							>
								{children}
							</main>
							{!isCarrierBagRoute && <SiteFooter footerData={footerData} />}
						</div>
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
