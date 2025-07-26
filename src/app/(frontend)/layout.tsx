import "~/styles/globals.css";

import type { Metadata } from "next";
import { sans } from "~/app/(frontend)/fonts";
import { Header } from "~/components/global/header";
import { ThemeProvider } from "~/components/theme-provider";
import { cn } from "~/lib/utils";
import { CarrierBagStoreProvider } from "~/stores/carrier-bag";
import { TRPCReactProvider } from "~/trpc/react";

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
					<TRPCReactProvider>
						<CarrierBagStoreProvider>
							<>
								<Header />
								<main className="mx-2 mb-2 min-h-full rounded-md bg-primary-foreground">
									{children}
								</main>
							</>
						</CarrierBagStoreProvider>
					</TRPCReactProvider>
				</ThemeProvider>
			</div>
		</section>
	);
}
