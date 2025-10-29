import type { Metadata } from "next";
import { Suspense } from "react";
import { sans, signifier } from "~/app/[language]/fonts";
import { GlossaryProvider } from "~/components/global/glossary-provider";
import { OrientationRedirect } from "~/components/global/orientation-redirect";
import { SiteLayout } from "~/components/global/site-layout";
import type { Language } from "~/i18n/config";
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
export const metadata: Metadata = {
	title: "DIGITCORE",
	description: "Digital Toolkit for Collaborative Environmental Research",
};

export default async function Layout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ language: Language }>;
}>) {
	const { language } = await params;

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
						<OrientationStoreProvider>
							<CarrierBagStoreProvider>
								<PageContentStoreProvider>
									<ExploreMenuStoreProvider>
										<Suspense fallback={null}>
											<OrientationRedirect />
										</Suspense>
										<GlossaryProvider>
											<SiteLayout
												language={language}
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
			</div>
		</section>
	);
}
