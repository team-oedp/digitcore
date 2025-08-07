"use client";

import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
import { SiteHeader } from "~/components/global/site-header";
import {
	SidebarInset,
	SidebarProvider,
	useSidebar,
} from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import { useCarrierBagStore } from "~/stores/carrier-bag";

type LayoutUIProps = {
	children: React.ReactNode;
};

function LayoutElements({ children }: LayoutUIProps) {
	const { open } = useSidebar();

	return (
		<>
			<SiteHeader />
			<div
				className={cn(
					"flex flex-1 overflow-hidden bg-neutral-200 p-2 pt-16.5",
					open && "gap-2.5",
				)}
			>
				<SidebarInset className="flex flex-1 flex-col overflow-hidden rounded-md">
					<main className="flex flex-1 flex-col overflow-y-auto rounded-md bg-primary-foreground">
						{children}
					</main>
				</SidebarInset>
				<CarrierBagSidebar />
			</div>
		</>
	);
}

export function LayoutUI({ children }: LayoutUIProps) {
	const isModalMode = useCarrierBagStore((state) => state.isModalMode);

	return (
		<SidebarProvider
			className="flex h-screen flex-col gap-2.5"
			style={
				{
					"--sidebar-width": "22rem",
				} as React.CSSProperties
			}
		>
			<LayoutElements>{children}</LayoutElements>
		</SidebarProvider>
	);
}
