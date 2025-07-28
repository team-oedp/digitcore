import "~/styles/globals.css";

import type { Metadata } from "next";
import { sans } from "~/app/(frontend)/fonts";
import { AppSidebar } from "~/components/global/app-sidebar";
import { Header } from "~/components/global/header";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import { SanityLive } from "~/sanity/lib/live";
import { CarrierBagStoreProvider } from "~/stores/carrier-bag";
import { TRPCReactProvider } from "~/trpc/react";
import { handleError } from "./client-utils";

export const metadata: Metadata = {
	title: "Digitcore",
	description: "Digital Toolkit for Collaborative Environmental Research",
	icons: [{ rel: "icon", url: "/icon.png" }],
};

export default function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<section className={cn(sans.variable)}>
			<div className="min-h-screen bg-background text-foreground antialiased">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
					<SanityLive onError={handleError} />
					<TRPCReactProvider>
						<CarrierBagStoreProvider>
							<SidebarProvider
								style={
									{
										"--sidebar-width": "19rem",
									} as React.CSSProperties
								}
							>
								<SidebarInset>
									<Header />
									<main className="mx-2 mb-2 min-h-full rounded-md bg-primary-foreground">
										{children}
									</main>
								</SidebarInset>
								<AppSidebar />
							</SidebarProvider>
						</CarrierBagStoreProvider>
					</TRPCReactProvider>
				</ThemeProvider>
			</div>
		</section>
	);
}
