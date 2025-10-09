import type { Metadata } from "next";
import { sanityFetch } from "~/sanity/lib/client";
import { CARRIER_BAG_QUERY } from "~/sanity/lib/queries";
import type { CarrierBag as CarrierBagDocument } from "~/sanity/sanity.types";
import { CarrierBagPage } from "./carrier-bag-page";

export const metadata: Metadata = {
	title: "Carrier Bag | DIGITCORE",
	description:
		"Collect and organize patterns in this personal store inspired by Ursula Le Guin's concept of the carrier bag.",
};

export default async function CarrierBag() {
	const data = (await sanityFetch({
		query: CARRIER_BAG_QUERY,
		revalidate: 60,
	})) as CarrierBagDocument | null;

	return <CarrierBagPage data={data ?? undefined} />;
}
