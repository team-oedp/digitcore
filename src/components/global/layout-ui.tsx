"use client";

import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
import { SiteHeader } from "~/components/global/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

type LayoutUIProps = {
	children: React.ReactNode;
};

function LayoutElements({ children }: LayoutUIProps) {
	return (
		<>
			<SiteHeader />
			<div
				className={cn(
					"flex flex-1 flex-row-reverse overflow-hidden bg-neutral-200 px-2 pt-16.5 pb-2",
				)}
			>
				<CarrierBagSidebar />
				{/* spacer between sidebar and main, collapses after sidebar is collapsed */}
				<div
					aria-hidden
					className="hidden shrink-0 md:block md:w-2 md:transition-[width] md:duration-200 md:ease-linear md:peer-data-[state=collapsed]:w-0 md:peer-data-[state=collapsed]:delay-200"
				/>
				<SidebarInset className="flex flex-1 flex-col overflow-hidden md:peer-data-[variant=inset]:m-0">
					<main className="flex flex-1 flex-col overflow-y-auto bg-primary-foreground">
						{children}
					</main>
				</SidebarInset>
			</div>
		</>
	);
}

export function LayoutUI({ children }: LayoutUIProps) {
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
