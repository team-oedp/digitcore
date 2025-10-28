import type { Metadata } from "next";
import type { Language } from "~/i18n/config";
import { sanityFetch } from "~/sanity/lib/client";
import { CARRIER_BAG_QUERY } from "~/sanity/lib/queries";
import { CarrierBagPage } from "./carrier-bag-page";

export const metadata: Metadata = {
	title: "Carrier Bag | DIGITCORE",
	description:
		"Collect and organize patterns in this personal store inspired by Ursula Le Guin's concept of the carrier bag.",
};

type CarrierBagPageProps = {
	params: { language: Language };
};

export default async function CarrierBag({ params }: CarrierBagPageProps) {
	const { language } = params;
	const data = await sanityFetch({
		query: CARRIER_BAG_QUERY,
		params: { language },
		revalidate: 60,
	});

	return <CarrierBagPage data={data ?? undefined} />;
}
