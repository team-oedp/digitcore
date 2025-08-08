import type { Metadata } from "next";
import { PageHeader } from "~/components/shared/page-header";
import { PageWrapper } from "~/components/shared/page-wrapper";

export const metadata: Metadata = {
	title: "Values | DIGITCORE Toolkit",
	description:
		"Open infrastructure and environmental research values and principles.",
};

export default function ValuesPage() {
	return (
		<PageWrapper>
			<div className="space-y-16 pb-16">
				{/* Page Header */}
				<div className="sticky top-0 z-10 bg-primary-foreground pt-6 pb-2">
					<div className="flex items-start justify-between gap-6">
						<div className="flex-1">
							<PageHeader title="Values" description="" sticky={false} />
						</div>
					</div>
				</div>
				<div className="space-y-16 lg:pl-20">
					{/* Overview */}
					<section className="max-w-4xl space-y-4">
						<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
							Overview
						</h2>
						<p className="text-2xl text-neutral-500 leading-snug">
							The Digitcore project seeks to ground open infrastructure
							development in the practice-based work of organizers and their
							collaborators—community organizations, researchers, and open
							source developers.
						</p>
						<p className="text-2xl text-neutral-500 leading-snug">
							Digitcore is at the forefront of the Open Environmental Data
							Project (OEDP), championing transparency and collaboration in
							environmental research. By identifying over 25 patterns of open
							infrastructure, we aim to create a space to grow the global
							conversation on environmental data access and use.
						</p>
					</section>

					{/* Openness is tailored */}
					<section className="max-w-4xl space-y-4">
						<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
							Openness is tailored
						</h2>
						<p className="text-2xl text-neutral-500 leading-snug">
							Collisions of culture, geography, politics, economics, and
							ecosystems create unique contexts in which digital tools are used.
							Open infrastructure should provide situational flexibility
							regarding how information is collected, analyzed, maintained,
							protected, used or shared (or not).
						</p>
					</section>

					{/* Place-based caring */}
					<section className="max-w-4xl space-y-4">
						<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
							Open infrastructure upholds place-based caring
						</h2>
						<p className="text-2xl text-neutral-500 leading-snug">
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
						<p className="text-2xl text-neutral-500 leading-snug">
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
						<p className="text-2xl text-neutral-500 leading-snug">
							Open infrastructure and tools should facilitate accessibility and
							availability of information in a timely manner for communities to
							make informed decisions.
						</p>
					</section>
				</div>
			</div>
		</PageWrapper>
	);
}
