import type { Metadata } from "next";
import { buildAbsoluteUrl } from "~/lib/metadata";
import { sanityFetch } from "~/sanity/lib/client";
import { CARRIER_BAG_QUERY, SITE_SETTINGS_QUERY } from "~/sanity/lib/queries";
import type { LanguagePageProps } from "~/types/page-props";
import { CarrierBagPage } from "./carrier-bag-page";

export async function generateMetadata({
	params,
}: LanguagePageProps): Promise<Metadata> {
	const { language } = await params;
	const [site, carrierBag] = await Promise.all([
		sanityFetch({
			query: SITE_SETTINGS_QUERY,
			revalidate: 3600,
		}),
		sanityFetch({
			query: CARRIER_BAG_QUERY,
			params: { language },
			revalidate: 3600,
		}),
	]);
	const siteUrl = site?.url ?? "https://digitcore.org";
	const title = carrierBag?.title ?? "Carrier Bag";
	const description = site?.seoDescription ?? site?.description;
	const canonical = buildAbsoluteUrl(siteUrl, "/carrier-bag");
	return {
		title,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			url: canonical,
			images: [
				{
					url: buildAbsoluteUrl(siteUrl, "/opengraph-image"),
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: { card: "summary_large_image" },
	};
}

export default async function Page({ params }: LanguagePageProps) {
	const { language } = await params;
	const data = await sanityFetch({
		query: CARRIER_BAG_QUERY,
		params: { language },
		revalidate: 60,
	});

	return <CarrierBagPage data={data ?? undefined} />;
}
