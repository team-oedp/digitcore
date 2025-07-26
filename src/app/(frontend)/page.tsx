import { BookOpen02Icon, NanoTechnologyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "DIGITCORE Toolkit | Home",
	description:
		"Community-centered open infrastructure empowering equitable collaboration between researchers, developers, and frontline communities.",
};

export default function Home() {
	return (
		<div className="space-y-16 p-5">
			{/* Hero Section */}
			<section className="max-w-4xl space-y-8 ">
				<h1 className="font-light text-4xl text-neutral-500 leading-tight">
					Welcome to the Digital Toolkit for Collaborative Environmental
					Research,
					<br />
					or, Digitcore
				</h1>
			</section>

			{/* Introduction */}
			<section className="max-w-4xl space-y-4">
				<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
					INTRODUCTION
				</h2>
				<p className="text-2xl text-neutral-500 leading-snug">
					Digitcore is at the forefront of the Open Environmental Data Project
					(OEDP), championing transparency and collaboration in environmental
					research. By identifying over 25 patterns of open infrastructure, we
					aim to create a space to grow the global conversation on environmental
					data access and use.
				</p>
			</section>

			{/* Methodology */}
			<section className="max-w-4xl space-y-4">
				<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
					METHODOLOGY
				</h2>
				<p className="text-2xl text-neutral-500 leading-snug">
					Digitcore serves as a repository for modular solutions or 'recipes for
					success', identified in our research on the role of open
					infrastructure in collaborative environmental research. Digitcore
					allows users to explore patterns based on themes, audiences, and
					values.
				</p>
			</section>

			{/* Open Infrastructure */}
			<section className="max-w-4xl space-y-4">
				<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
					OPEN INFRASTRUCTURE
				</h2>
				<p className="text-2xl text-neutral-500 leading-snug">
					Open digital infrastructure refers to elements of digital
					infrastructure—including but not limited to hardware, software, data,
					code, platforms, and standards—that are intentionally made freely
					available for everyone's use, without copyright or patent protections
					or the expectation of payment.
				</p>
			</section>

			{/* Patterns */}
			<section className="max-w-4xl space-y-4">
				<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
					PATTERNS
				</h2>
				<p className="text-2xl text-neutral-500 leading-snug">
					Our research has identified 25+ patterns for how open infrastructure
					shows up in environmental research. Each identified pattern will have
					one or more associated solutions. Each solution may also respond to
					different patterns. PDF templates, articles, and other resources will
					be offered as part of a solution to address different patterns.
					Resources should be connected by or linked to one or many solutions
					and/ or patterns.
				</p>
			</section>

			{/* Themes */}
			<section className="max-w-4xl space-y-4">
				<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
					THEMES
				</h2>
				<p className="text-2xl text-neutral-500 leading-snug">
					The themes centre around ways of practicing openness, the distinction
					between data and information, the influence of academic culture and
					norms, the importance of long-term viability, and the commitment to
					ensuring benefits for frontline communities are foundational to the
					Digitcore toolkit. These themes guide users in understanding how to
					effectively engage with data while fostering transparency and
					inclusivity.
				</p>
			</section>

			<section className="w-full">
				<div className="scrollbar-hidden flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pr-6 pb-4 pl-6">
					<div className="flex h-80 w-120 flex-none snap-start flex-col justify-between rounded-lg bg-neutral-200/25 p-8">
						<div className="space-y-6">
							<h3 className="font-normal text-black text-xl leading-tight">
								Ensuring Benefit To Frontline Communities
							</h3>
							<p className="line-clamp-6 text-base text-neutral-500 leading-relaxed">
								Within the development of open infrastructure, ensuring benefit
								to frontline communities means going beyond access and inclusion
								to prioritizing ownership and collaboration. This may involve
								co- leadership in decision making, providing resources for
								collaborating, minimizing harm and maximizing benefit,
								supporting data sovereignty, and accountability mechanisms.
							</p>
						</div>
						<div className="flex items-center gap-3 text-base text-neutral-500">
							<HugeiconsIcon
								icon={NanoTechnologyIcon}
								size={16}
								color="currentColor"
								strokeWidth={1.5}
							/>
							<span>Visit patterns</span>
						</div>
					</div>

					<div className="flex h-80 w-120 flex-none snap-start flex-col justify-between rounded-lg bg-neutral-200/25 p-8">
						<div className="space-y-6">
							<h3 className="font-normal text-black text-xl leading-tight">
								Practicing Openness
							</h3>
							<p className="line-clamp-6 text-base text-neutral-500 leading-relaxed">
								Openness is a core principle of open infrastructure, but its
								meaning and implementation can vary widely. Finding alignment
								between stakeholders on its use within the project can
								necessitate balancing competing needs, including addressing
								commercialization pressures, and creating processes to make it a
								daily practice.
							</p>
						</div>
						<div className="flex items-center gap-3 text-base text-neutral-500">
							<HugeiconsIcon
								icon={NanoTechnologyIcon}
								size={16}
								color="currentColor"
								strokeWidth={1.5}
							/>
							<span>Visit patterns</span>
						</div>
					</div>

					<div className="flex h-80 w-120 flex-none snap-start flex-col justify-between rounded-lg bg-neutral-200/25 p-8">
						<div className="space-y-6">
							<h3 className="font-normal text-black text-xl leading-tight">
								Data Does Not Equal Information
							</h3>
							<p className="line-clamp-6 text-base text-neutral-500 leading-relaxed">
								Open infrastructure should make data available; it should also
								aim to make data understandable, usable, and interpretable. This
								can be accomplished through thoughtful interface design,
								community-centered design decisions, as well as resource
								allocation that enables communities to interpret data.
							</p>
						</div>
						<div className="flex items-center gap-3 text-base text-neutral-500">
							<HugeiconsIcon
								icon={NanoTechnologyIcon}
								size={16}
								color="currentColor"
								strokeWidth={1.5}
							/>
							<span>Visit patterns</span>
						</div>
					</div>
				</div>
			</section>

			{/* Audiences */}
			<section className="max-w-4xl space-y-4">
				<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
					AUDIENCES
				</h2>
				<p className="text-2xl text-neutral-500 leading-snug">
					These are the audiences that may find these patterns in the Digitcore
					toolkit most applicable.
				</p>
			</section>

			<section className="w-full">
				<div className="scrollbar-hidden flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pr-6 pb-4 pl-6">
					<div className="flex h-80 w-120 flex-none snap-start flex-col justify-between rounded-lg bg-neutral-200/25 p-8">
						<div className="space-y-6">
							<h3 className="font-normal text-black text-xl leading-tight">
								Open Source Technologists
							</h3>
							<p className="line-clamp-6 text-base text-neutral-500 leading-relaxed">
								Open source technologists are a diverse group of innovators and
								developers who thrive on collaboration and transparency. They
								are passionate about leveraging community-driven projects to
								create impactful software solutions.
							</p>
						</div>
						<div className="flex items-center gap-3 text-base text-neutral-500">
							<HugeiconsIcon
								icon={BookOpen02Icon}
								size={16}
								color="currentColor"
								strokeWidth={1.5}
							/>
							<span>Read more</span>
						</div>
					</div>

					<div className="flex h-80 w-120 flex-none snap-start flex-col justify-between rounded-lg bg-neutral-200/25 p-8">
						<div className="space-y-6">
							<h3 className="font-normal text-black text-xl leading-tight">
								Community Groups
							</h3>
							<p className="line-clamp-6 text-base text-neutral-500 leading-relaxed">
								Community groups consist of engaged individuals who come
								together to share ideas and resources. They are dedicated to
								fostering connections and supporting one another in various
								initiatives, often focusing on local issues or shared interests.
							</p>
						</div>
						<div className="flex items-center gap-3 text-base text-neutral-500">
							<HugeiconsIcon
								icon={BookOpen02Icon}
								size={16}
								color="currentColor"
								strokeWidth={1.5}
							/>
							<span>Read more</span>
						</div>
					</div>

					<div className="flex h-80 w-120 flex-none snap-start flex-col justify-between rounded-lg bg-neutral-200/25 p-8">
						<div className="space-y-6">
							<h3 className="font-normal text-black text-xl leading-tight">
								Funders
							</h3>
							<p className="line-clamp-6 text-base text-neutral-500 leading-relaxed">
								Funders are a diverse group of organizations who are supportive
								of innovative approaches to building relationships and
								connecting data, often channeling their efforts into impactful
								projects that resonate with community needs.
							</p>
						</div>
						<div className="flex items-center gap-3 text-base text-neutral-500">
							<HugeiconsIcon
								icon={BookOpen02Icon}
								size={16}
								color="currentColor"
								strokeWidth={1.5}
							/>
							<span>Read more</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
