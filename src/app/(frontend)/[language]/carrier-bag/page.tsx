import type { Metadata } from "next";
import { sanityFetch } from "~/sanity/lib/client";
import { CARRIER_BAG_QUERY } from "~/sanity/lib/queries";
import { CarrierBagPage } from "./carrier-bag-page";
import type { Language } from "~/i18n/config";

export const metadata: Metadata = {
	title: "Carrier Bag | DIGITCORE",
	description:
		"Collect and organize patterns in this personal store inspired by Ursula Le Guin's concept of the carrier bag.",
};

export default async function Page(
	props: PageProps<"/[language]/carrier-bag">,
) {
	const { language: languageParam } = await props.params;
	const language = languageParam as Language;
	const data = await sanityFetch({
		query: CARRIER_BAG_QUERY,
		params: { language },
		revalidate: 60,
	});

	return <CarrierBagPage data={data ?? undefined} />;
}
