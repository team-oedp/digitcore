import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { client } from "~/sanity/lib/client";
import { CARRIER_BAG_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { CarrierBag as CarrierBagDocument } from "~/sanity/sanity.types";
import { CarrierBagPage } from "./carrier-bag-page";

export const metadata: Metadata = {
	title: "Carrier Bag | DIGITCORE",
	description:
		"Collect and organize patterns in this personal store inspired by Ursula Le Guin's concept of the carrier bag.",
};

export default async function CarrierBag() {
	const isDraftMode = (await draftMode()).isEnabled;
	const data = (await client.fetch(
		CARRIER_BAG_QUERY,
		{},
		isDraftMode
			? { perspective: "previewDrafts", useCdn: false, stega: true, token }
			: { perspective: "published", useCdn: true },
	)) as CarrierBagDocument | null;

	return <CarrierBagPage data={data ?? undefined} />;
}
