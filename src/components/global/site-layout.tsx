"use client";

import { usePathname } from "next/navigation";
import { useMemo, useRef } from "react";
import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
import { SiteHeader } from "~/components/global/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import type { Language } from "~/i18n/config";
import { parseLocalePath } from "~/lib/locale-path";
import { cn } from "~/lib/utils";
import type {
	CARRIER_BAG_QUERYResult,
	FOOTER_QUERYResult,
	HEADER_QUERYResult,
} from "~/sanity/sanity.types";
import { SiteFooter } from "./site-footer";

type SiteLayoutProps = {
	children: React.ReactNode;
	headerData: HEADER_QUERYResult;
	footerData: FOOTER_QUERYResult;
	carrierBagData: CARRIER_BAG_QUERYResult;
	language: Language;
};

export function SiteLayout({
	children,
	headerData,
	footerData,
	carrierBagData,
	language,
}: SiteLayoutProps) {
	const pathname = usePathname();
	const { normalizedPath } = useMemo(
		() => parseLocalePath(pathname),
		[pathname],
	);
	const isCarrierBagRoute = normalizedPath === "/carrier-bag";
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
			<SiteHeader headerData={headerData} language={language} />
			<div className="flex min-h-0 flex-1 flex-row-reverse gap-2 overflow-hidden bg-page-background pt-16 transition-[gap] md:pt-14 md:[&:has([data-slot=sidebar][data-state=collapsed])]:gap-0 md:[&:has([data-slot=sidebar][data-state=collapsed])]:delay-200 md:[&:has([data-slot=sidebar][data-state=collapsed])]:duration-0">
				<CarrierBagSidebar
					className="peer"
					carrierBagData={carrierBagData}
					language={language}
				/>
				<SidebarInset className="relative mx-2 mb-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md md:m-0 md:mb-0">
					<div
						ref={scrollContainerRef}
						className={cn(
							"flex h-full min-h-0 flex-1 flex-col overflow-x-hidden",
							isCarrierBagRoute
								? "overflow-y-hidden"
								: "overflow-y-auto bg-container-background dark:bg-container-background",
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
							{!isCarrierBagRoute && (
								<div>
									<SiteFooter footerData={footerData} language={language} />
								</div>
							)}
						</div>
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
}
