"use client";

import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
import { SiteHeader } from "~/components/global/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { CarrierBagSidebarModal } from "./carrier-bag/carrier-bag-sidebar-modal";
import SiteFooter from "./site-footer";

type LayoutUIProps = {
	children: React.ReactNode;
};

export function LayoutUI({ children }: LayoutUIProps) {
	const isModalMode = useCarrierBagStore((state) => state.isModalMode);

	return (
		<SidebarProvider
			className="flex min-h-screen flex-col bg-background pt-[var(--header-height)]"
			style={
				{
					"--sidebar-width": "22rem",
				} as React.CSSProperties
			}
		>
			<SiteHeader />
			<div className="flex flex-1">
				<SidebarInset className="flex flex-1 flex-col">
					<main className="m-2 flex flex-1 flex-col rounded-md bg-primary-foreground">
						{children}
					</main>
				</SidebarInset>
				{!isModalMode && <CarrierBagSidebar />}
			</div>
			{isModalMode && <CarrierBagSidebarModal />}

			<SiteFooter />
		</SidebarProvider>
	);
}
