import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import { sans } from "~/app/(frontend)/fonts";
import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
import { DisableDraftMode } from "~/components/global/disable-draft-mode";
import Footer from "~/components/global/footer";
import { Header } from "~/components/global/header";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";
import { CarrierBagStoreProvider } from "~/stores/carrier-bag";
import { PageContentStoreProvider } from "~/stores/page-content";
import { TRPCReactProvider } from "~/trpc/react";

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

export default async function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const isDraftMode = (await draftMode()).isEnabled;

	return (
		<section className={cn(sans.variable)}>
			<div className="min-h-screen bg-background text-foreground antialiased [--header-height:calc(--spacing(14))]">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TRPCReactProvider>
						<CarrierBagStoreProvider>
							<PageContentStoreProvider>
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
									<Footer />
								</SidebarProvider>
							</PageContentStoreProvider>
						</CarrierBagStoreProvider>
					</TRPCReactProvider>
					{isDraftMode && (
						<>
							<VisualEditing />
							<DisableDraftMode />
						</>
					)}
				</ThemeProvider>
			</div>
		</section>
	);
}
