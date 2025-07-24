import type { Metadata } from "next";
import { CarrierBagContent } from "./carrier-bag-content";

export const metadata: Metadata = {
	title: "Carrier Bag | DIGITCORE Toolkit",
	description:
		"Personal space to collect and organize patterns inspired by the carrier bag theory.",
};

export default function CarrierBag() {
	return (
		<section className="space-y-10">
			{/* Page header */}
			<header className="space-y-4">
				<h1 className="font-bold text-3xl">Your Carrier Bag</h1>
				<p className="max-w-2xl">
					Inspired by Ursula K. Le Guin's "carrier bag theory," this space lets
					you gather, annotate, and export patterns relevant to your projects.
					Your patterns are automatically saved to your browser's local storage
					and will persist between sessions.
				</p>
			</header>

			<CarrierBagContent />
		</section>
	);
}
