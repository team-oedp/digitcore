import "~/styles/globals.css";

import type { Metadata, Viewport } from "next";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import { sans } from "~/app/(frontend)/fonts";
import { DisableDraftMode } from "~/components/global/disable-draft-mode";
import { LayoutUI } from "~/components/global/layout-ui";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { cn } from "~/lib/utils";
import { CarrierBagStoreProvider } from "~/stores/carrier-bag";
import { PageContentStoreProvider } from "~/stores/page-content";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
	title: "Digitcore",
	description: "Digital Toolkit for Collaborative Environmental Research",
	icons: [{ rel: "icon", url: "/oedp-icon.png" }],
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
			<div className="h-screen bg-background text-foreground antialiased [--header-height:calc(--spacing(14))]">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TRPCReactProvider>
						<CarrierBagStoreProvider>
							<PageContentStoreProvider>
								<LayoutUI>{children}</LayoutUI>
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
