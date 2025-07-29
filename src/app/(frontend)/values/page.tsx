import type { Metadata } from "next";

import { PageWrapper } from "~/components/global/page-wrapper";

export const metadata: Metadata = {
	title: "Values | DIGITCORE Toolkit",
	description:
		"Open infrastructure and environmental research values and principles.",
};

export default function ValuesPage() {
	return (
		<PageWrapper>
			<div className="space-y-16">
				{/* Page Heading */}
				<section className="max-w-4xl space-y-8">
					<h1 className="font-light text-4xl text-neutral-500 leading-tight">
						Values — Open infrastructure and environmental research
					</h1>
				</section>

				{/* Overview */}
				<section className="max-w-4xl space-y-4">
					<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
						Overview
					</h2>
					<p className="text-base text-neutral-500 leading-relaxed">
						The Digitcore project seeks to ground open infrastructure
						development in the practice-based work of organizers and their
						collaborators—community organizations, researchers, and open source
						developers.
					</p>
					<p className="text-base text-neutral-500 leading-relaxed">
						Digitcore is at the forefront of the Open Environmental Data Project
						(OEDP), championing transparency and collaboration in environmental
						research. By identifying over 25 patterns of open infrastructure, we
						aim to create a space to grow the global conversation on
						environmental data access and use.
					</p>
				</section>

				{/* Openness is tailored */}
				<section className="max-w-4xl space-y-4">
					<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
						Openness is tailored
					</h2>
					<p className="text-base text-neutral-500 leading-relaxed">
						Collisions of culture, geography, politics, economics, and
						ecosystems create unique contexts in which digital tools are used.
						Open infrastructure should provide situational flexibility regarding
						how information is collected, analyzed, maintained, protected, used
						or shared (or not).
					</p>
				</section>

				{/* Place-based caring */}
				<section className="max-w-4xl space-y-4">
					<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
						Open infrastructure upholds place-based caring
					</h2>
					<p className="text-base text-neutral-500 leading-relaxed">
						Environmental justice efforts generate strategies to take care of
						place and people. Open infrastructure must be developed in
						conversation with, and related to, community practices of care.
					</p>
				</section>

				{/* Mobilisation */}
				<section className="max-w-4xl space-y-4">
					<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
						Open infrastructure prioritises mobilisation
					</h2>
					<p className="text-base text-neutral-500 leading-relaxed">
						Open technologies are implemented by individuals and organisations
						whose role is to motivate, engage, and encourage. Open practices,
						tools, and objects should be responsive to mobilisation toward
						action.
					</p>
				</section>

				{/* Availability of information */}
				<section className="max-w-4xl space-y-4">
					<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
						Open infrastructure meets the demand for readily available
						information
					</h2>
					<p className="text-base text-neutral-500 leading-relaxed">
						Open infrastructure and tools should facilitate accessibility and
						availability of information in a timely manner for communities to
						make informed decisions.
					</p>
				</section>
			</div>
		</PageWrapper>
	);
}
