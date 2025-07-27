import {
	ArrowRight02Icon,
	ChartRelationshipIcon,
	Link02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { SolutionPreview } from "./solution-preview";

type Solution = {
	name: string;
	number: string;
	title: string;
	description: string;
};

type Resource = {
	title: string;
	description: string;
	url?: string;
	solutions: Solution[];
};

type ResourcesProps = {
	resources?: Resource[];
};

const defaultResources: Resource[] = [
	{
		title: "Animikii's Pathfinding process",
		description:
			"Animikii's Pathfinding process supports co-design of technology specifically with Indigenous communities.",
		url: "https://example.com",
		solutions: [{
			name: "Iterative co-creation",
			number: "i.",
			title: "Iterative co-creation",
			description: "A collaborative approach that involves iterative cycles of design, feedback, and refinement with community stakeholders to ensure technology solutions meet real needs and respect cultural values."
		}],
	},
	{
		title: "LiteFarm's Informed Consent Form and Privacy Policy",
		description:
			"LiteFarm's Informed Consent Form and Privacy Policy is a good example of a mechanism for obtaining informed consent to share environmental data collected by individual community members—in this case, farmers using the open source LiteFarm app to record information about their farm management practices, which includesing potentially sensitive data.",
		url: "https://example.com",
		solutions: [{
			name: "Iterative co-creation",
			number: "i.",
			title: "Iterative co-creation",
			description: "A collaborative approach that involves iterative cycles of design, feedback, and refinement with community stakeholders to ensure technology solutions meet real needs and respect cultural values."
		}],
	},
	{
		title: "OpenTEAM's Data Use Documents",
		description:
			"OpenTEAM's Data Use Documents include good examples of tools to request and manage consent to share or use data. In particular, see the Agriculturalists' Bill of Data Rights and the Data Hosting and Storage Agreement.",
		url: "https://example.com",
		solutions: [{
			name: "Iterative co-creation",
			number: "i.",
			title: "Iterative co-creation",
			description: "A collaborative approach that involves iterative cycles of design, feedback, and refinement with community stakeholders to ensure technology solutions meet real needs and respect cultural values."
		}],
	},
	{
		title: "Local Contexts' Data Labels",
		description:
			"Local Contexts' Data Labels identify and clarify indigenous communities' rules, expectations, and responsibilities for Traditional Knowledge and Biocultural information.",
		url: "https://example.com",
		solutions: [
			{
				name: "Secure consent before sharing",
				number: "ii.",
				title: "Consent to share",
				description: "Establish clear protocols for obtaining explicit consent before sharing any community data, ensuring transparency about how the data will be used and stored."
			},
			{
				name: "Let communities own their data",
				number: "iii.",
				title: "Community data co-/ownership",
				description: "Implement systems that give communities full control and ownership over their data, including the right to access, modify, or delete their information at any time."
			},
		],
	},
];

export function Resources({ resources = defaultResources }: ResourcesProps) {
	return (
		<section className="flex flex-col gap-5">
			<header className="flex flex-row items-center gap-2.5">
				<h2 className="font-normal text-[32px] text-primary">Resources</h2>
			</header>

			<div className="flex flex-col">
				{resources.map((resource, index) => (
					<div
						key={resource.title}
						className={`relative w-full ${
							index === 0 ? "border-zinc-300 border-t border-dashed" : ""
						} ${
							index === resources.length - 1
								? "border-zinc-300 border-b border-dashed"
								: ""
						}`}
					>
						<div className="flex flex-col gap-3 py-3 pb-9">
							<div className="flex flex-col gap-2">
								<div className="flex flex-row items-center gap-2">
									<div className="flex h-8 flex-row items-center gap-2.5">
										<h3 className="font-normal text-[18px] text-primary">
											{resource.title}
										</h3>
									</div>
									{resource.url && (
										<a
											href={resource.url}
											target="_blank"
											rel="noopener noreferrer"
											className="flex h-8 w-8 items-center justify-center rounded-full bg-background transition-colors hover:bg-secondary"
										>
											<HugeiconsIcon
												icon={Link02Icon}
												size={20}
												color="currentColor"
												strokeWidth={1.5}
												className="z-10"
											/>
										</a>
									)}
								</div>
								<p className="font-normal text-[14px] text-zinc-500 leading-normal">
									{resource.description}
								</p>
							</div>

							<div className="flex flex-row items-center gap-2.5">
								<span className="font-normal text-[#c4c4c8] text-[14px] tracking-[-0.14px]">
									From <span className="uppercase">SOLUTION</span>
								</span>
								<HugeiconsIcon
									icon={ArrowRight02Icon}
									size={24}
									color="#c4c4c8"
									strokeWidth={1.5}
								/>
								<div className="flex gap-2.5">
									{resource.solutions.map((solution) => (
										<SolutionPreview
											key={solution.name}
											solutionNumber={solution.number}
											solutionTitle={solution.title}
											solutionDescription={solution.description}
										>
											<div className="flex h-6 items-center gap-2.5 rounded-lg border border-[#a2e636] bg-[#e6fbc5] px-2 py-1.5 cursor-pointer">
												<span className="font-normal text-[#95b661] text-[14px] tracking-[-0.14px]">
													{solution.name}
												</span>
												<HugeiconsIcon
													icon={ChartRelationshipIcon}
													size={14}
													color="#95b661"
													strokeWidth={1.5}
												/>
											</div>
										</SolutionPreview>
									))}
								</div>
							</div>
						</div>

						{index < resources.length - 1 && (
							<div className="absolute right-0 bottom-0 left-0 border-zinc-300 border-b border-dashed" />
						)}
					</div>
				))}
			</div>
		</section>
	);
}
