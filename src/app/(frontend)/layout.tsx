import "~/styles/globals.css";

import type { Metadata } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import { sans, signifier } from "~/app/(frontend)/fonts";
import { GlossaryProvider } from "~/components/global/glossary-provider";
import { OnboardingRedirect } from "~/components/global/onboarding-redirect";
import { SiteLayout } from "~/components/global/site-layout";
import { DisableDraftMode } from "~/components/sanity/disable-draft-mode";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { cn } from "~/lib/utils";
import { client } from "~/sanity/lib/client";
import { FOOTER_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { FOOTER_QUERYResult } from "~/sanity/sanity.types";
import { CarrierBagStoreProvider } from "~/stores/carrier-bag";
import { FontStoreProvider } from "~/stores/font";
import { OnboardingStoreProvider } from "~/stores/onboarding";
import { PageContentStoreProvider } from "~/stores/page-content";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
	title: "DIGITCORE",
	description: "Digital Toolkit for Collaborative Environmental Research",
};

export default async function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const isDraftMode = (await draftMode()).isEnabled;

	// Fetch footer data
	const footerData = (await client.fetch(
		FOOTER_QUERY,
		{},
		isDraftMode
			? {
					perspective: "previewDrafts",
					useCdn: false,
					stega: true,
					token,
				}
			: {
					perspective: "published",
					useCdn: true,
				},
	)) as FOOTER_QUERYResult;

	return (
		<section className={cn(sans.variable, signifier.variable, "overflow-x-hidden")}>
			<div className="h-screen overflow-x-hidden text-foreground antialiased [--header-height:calc(--spacing(14))]">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<TRPCReactProvider>
						<FontStoreProvider>
							<OnboardingStoreProvider>
								<CarrierBagStoreProvider>
									<PageContentStoreProvider>
										<Suspense fallback={null}>
											<OnboardingRedirect />
										</Suspense>
										<GlossaryProvider>
											<SiteLayout footerData={footerData}>
												{children}
											</SiteLayout>
										</GlossaryProvider>
									</PageContentStoreProvider>
								</CarrierBagStoreProvider>
							</OnboardingStoreProvider>
						</FontStoreProvider>
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
