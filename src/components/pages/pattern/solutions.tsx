import { ChartRelationshipIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type Solution = {
	number: string;
	title: string;
	description: string;
	audiences: string[];
};

type SolutionsProps = {
	solutions?: Solution[];
};

const defaultSolutions: Solution[] = [
	{
		number: "i.",
		title: "Iterative co-creation",
		description:
			"Co-develop research or design goals, prioritizing transparency in decision making and enabling flexibility and adaptation. Researchers and developers support community agency and data sovereignty when they remain flexible and transparent, recognizing that community members may hold differing views or that priorities may evolve over time.",
		audiences: ["Open source technologists", "Researchers"],
	},
	{
		number: "ii.",
		title: "Consent to share",
		description:
			"Discuss the possibility of sharing information and publicizing research outputs as well as the mechanisms through which they will be shared. Obtain community consent before sharing. And for indigenous data in particular, consider the use of data licenses or labels for respecting cultural protocols around the sharing and use of knowledge.",
		audiences: ["Open source technologists", "Researchers"],
	},
	{
		number: "iii.",
		title: "Community data co-/ownership",
		description:
			"Ensure that communities can retain control over data about them or collected by them. Use agreements that clearly delineate what can be shared publicly. When using open platforms and repositories to share data or documentation, opt for those that enable differentiated access and privacy.",
		audiences: ["Open source technologists", "Researchers"],
	},
	{
		number: "iv.",
		title: "Meeting communities where they are",
		description:
			"Prioritize interventions and practices that support or leverage communities' known and accepted settings and activities. Create documentation in local languages.",
		audiences: ["Open source technologists", "Researchers"],
	},
];

export function Solutions({ solutions = defaultSolutions }: SolutionsProps) {
	return (
		<section className="flex flex-col gap-5">
			<header className="flex flex-row items-center gap-2.5">
				<h2 className="font-light text-[32px] text-primary">Solutions</h2>
				<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f7f7f7] px-4 py-1.5">
					<HugeiconsIcon
						icon={ChartRelationshipIcon}
						size={20}
						color="currentColor"
						strokeWidth={1.5}
					/>
				</div>
			</header>

			<div className="flex flex-col gap-[13px]">
				{solutions.map((solution) => (
					<div key={solution.title} className="flex items-start gap-8 pb-9">
						<div className="flex w-10 min-w-10 flex-col items-start gap-2.5">
							<span className="font-normal text-[18px] text-primary leading-[22px]">
								{solution.number}
							</span>
						</div>

						<div className="flex flex-1 flex-col gap-2.5">
							<h3 className="font-normal text-[18px] text-primary leading-[22px]">
								{solution.title}
							</h3>
							<p className="font-normal text-[14px] text-zinc-500 leading-normal">
								{solution.description}
							</p>

							<div className="flex gap-2">
								{solution.audiences.map((audience) => (
									<div
										key={audience}
										className="flex h-6 items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-100 px-[9px] py-2"
									>
										<span className="text-nowrap font-normal text-[#1e40ae] text-[14px]">
											{audience}
										</span>
										<HugeiconsIcon
											icon={ChartRelationshipIcon}
											size={14}
											color="#1e40ae"
											strokeWidth={1.5}
										/>
									</div>
								))}
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
