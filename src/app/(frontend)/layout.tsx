import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { sans } from "~/app/(frontend)/fonts";
import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
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

export const viewport: Viewport = {
	colorScheme: "light",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<section className={cn(sans.variable)}>
			<div className="min-h-screen bg-background text-foreground antialiased [--header-height:calc(--spacing(14))]">
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
								className="flex flex-col"
								style={
									{
										"--sidebar-width": "28rem",
									} as React.CSSProperties
								}
							>
								<Header />
								<div className="flex flex-1">
									<SidebarInset>
										<main className="mx-2 mb-2 flex min-h-full flex-1 flex-col rounded-md bg-primary-foreground">
											{children}
										</main>
									</SidebarInset>
									<CarrierBagSidebar />
								</div>
							</SidebarProvider>
						</CarrierBagStoreProvider>
					</TRPCReactProvider>
				</ThemeProvider>
			</div>
		</section>
	);
}
