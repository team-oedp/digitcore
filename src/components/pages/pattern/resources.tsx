import {
	ArrowRight02Icon,
	ChartRelationshipIcon,
	Link02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "~/components/global/portable-text";
import type { PATTERN_QUERYResult } from "~/sanity/sanity.types";
import { SolutionPreview } from "./solution-preview";

// Because references in Sanity have to be derefenced in order to get access to the fields of the referenced type, we are keying the Pattern query result by "resources"
// Another approach would be to manually create a type with all of the necessary fields
type ResourcesProps = {
	resources: NonNullable<NonNullable<PATTERN_QUERYResult>["resources"]>;
};

export function Resources({ resources }: ResourcesProps) {
	if (!resources) return null;
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
									{resource.links?.[0]?.href && (
										<a
											href={resource.links?.[0]?.href}
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
									{resource.description && (
										<CustomPortableText
											value={resource.description as PortableTextBlock[]}
										/>
									)}
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
									{resource.solution?.map((solution, index) => (
										<SolutionPreview
											key={solution._id}
											solutionNumber={String(index + 1)}
											solutionTitle={solution.title || "Solution"}
											solutionDescription={
												solution.description
													? "Solution description"
													: "No description available"
											}
										>
											<div className="flex h-6 cursor-pointer items-center gap-2.5 rounded-lg border border-[#a2e636] bg-[#e6fbc5] px-2 py-1.5">
												<span className="font-normal text-[#95b661] text-[14px] tracking-[-0.14px]">
													{solution.title || `Solution ${index + 1}`}
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
