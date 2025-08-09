import type { Metadata } from "next";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { CarrierBagContent } from "./carrier-bag-content";

export const metadata: Metadata = {
	title: "Carrier Bag | DIGITCORE Toolkit",
	description:
		"Personal space to collect and organize patterns inspired by the carrier bag theory.",
};

export default function CarrierBag() {
	return (
		<PageWrapper>
			<CarrierBagContent />
		</PageWrapper>
	);
}
