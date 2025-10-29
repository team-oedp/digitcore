import "~/styles/globals.css";

import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import { sans, signifier } from "~/app/(frontend)/fonts";
import { GlossaryProvider } from "~/components/global/glossary-provider";
import { OrientationRedirect } from "~/components/global/orientation-redirect";
import { SiteLayout } from "~/components/global/site-layout";
import { DisableDraftMode } from "~/components/sanity/disable-draft-mode";
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
import { OrientationStoreProvider } from "~/stores/orientation";
import { PageContentStoreProvider } from "~/stores/page-content";
import { TRPCReactProvider } from "~/trpc/react";

// Inherit metadata from root layout; no page-level metadata here

export default async function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const isDraftMode = (await draftMode()).isEnabled;

	const [headerData, footerData, carrierBagData] = await Promise.all([
		sanityFetch({
			query: HEADER_QUERY,
			revalidate: 60,
		}),
		sanityFetch({
			query: FOOTER_QUERY,
			revalidate: 60,
		}),
		sanityFetch({
			query: CARRIER_BAG_QUERY,
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
