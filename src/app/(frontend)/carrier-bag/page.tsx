import type { Metadata } from "next";
import { CarrierBagPage } from "./carrier-bag-page";

export const metadata: Metadata = {
	title: "Carrier Bag | DIGITCORE Toolkit",
	description:
		"Personal space to collect and organize patterns inspired by the carrier bag theory.",
};

export default function CarrierBag() {
	return <CarrierBagPage />;
}
