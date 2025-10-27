import "~/styles/globals.css";

import type { Metadata } from "next";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import { sans, signifier } from "~/app/(frontend)/fonts";
import { GlossaryProvider } from "~/components/global/glossary-provider";
import { OrientationRedirect } from "~/components/global/orientation-redirect";
import { SiteLayout } from "~/components/global/site-layout";
import { DisableDraftMode } from "~/components/sanity/disable-draft-mode";
import { getLanguage } from "~/lib/get-language";
import { cn } from "~/lib/utils";
import { sanityFetch } from "~/sanity/lib/client";
import {
	CARRIER_BAG_QUERY,
	FOOTER_QUERY,
	HEADER_QUERY,
} from "~/sanity/lib/queries";
import { CarrierBagStoreProvider } from "~/stores/carrier-bag";
import { ExploreMenuStoreProvider } from "~/stores/explore-menu";
import { FontStoreProvider } from "~/stores/font";
import { LanguageStoreProvider } from "~/stores/language";
import { OrientationStoreProvider } from "~/stores/orientation";
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
	const language = await getLanguage();

	const [headerData, footerData, carrierBagData] = await Promise.all([
		sanityFetch({
			query: HEADER_QUERY,
			params: { language },
			revalidate: 60,
		}),
		sanityFetch({
			query: FOOTER_QUERY,
			params: { language },
			revalidate: 60,
		}),
		sanityFetch({
			query: CARRIER_BAG_QUERY,
			params: { language },
			revalidate: 60,
		}),
	]);

	return (
		<section
			className={cn(sans.variable, signifier.variable, "overflow-x-hidden")}
		>
			<div className="h-screen overflow-x-hidden text-foreground antialiased [--header-height:calc(--spacing(14))]">
				<TRPCReactProvider>
					<FontStoreProvider>
						<LanguageStoreProvider>
							<OrientationStoreProvider>
								<CarrierBagStoreProvider>
									<PageContentStoreProvider>
										<ExploreMenuStoreProvider>
											<Suspense fallback={null}>
												<OrientationRedirect />
											</Suspense>
											<GlossaryProvider>
												<SiteLayout
													headerData={headerData}
													footerData={footerData}
													carrierBagData={carrierBagData}
												>
													{children}
												</SiteLayout>
											</GlossaryProvider>
										</ExploreMenuStoreProvider>
									</PageContentStoreProvider>
								</CarrierBagStoreProvider>
							</OrientationStoreProvider>
						</LanguageStoreProvider>
					</FontStoreProvider>
				</TRPCReactProvider>
				{isDraftMode && (
					<>
						<VisualEditing />
						<DisableDraftMode />
					</>
				)}
			</div>
		</section>
	);
}
