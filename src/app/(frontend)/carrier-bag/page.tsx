import type { Metadata } from "next";
import { CarrierBagContent } from "./carrier-bag-content";

export const metadata: Metadata = {
	title: "Carrier Bag | DIGITCORE Toolkit",
	description:
		"Personal space to collect and organize patterns inspired by the carrier bag theory.",
};

export default function CarrierBag() {
	return (
		<div className="min-h-screen bg-background">
			<CarrierBagContent />
		</div>
	);
}
