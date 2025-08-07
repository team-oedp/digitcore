"use client";

import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
import { SiteHeader } from "~/components/global/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
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
			className="flex min-h-screen flex-col"
			style={
				{
					"--sidebar-width": "22rem",
				} as React.CSSProperties
			}
		>
			<SiteHeader />
			<div className="flex flex-1">
				<SidebarInset
					className={cn(
						"flex flex-1 flex-col",
						!isModalMode && ["md:mr-[var(--sidebar-width)]", "md:m-2 md:mr-2"],
					)}
				>
					<main className="mx-2 mb-2 flex flex-1 flex-col rounded-md bg-primary-foreground">
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
