import {
	ArrowRight02Icon,
	ChartRelationshipIcon,
	Link02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { Badge } from "~/components/ui/badge";
import { ptToPlainText } from "~/lib/portable-text-utils";
import { cn } from "~/lib/utils";
import type { PATTERN_QUERYResult } from "~/sanity/sanity.types";
import { SolutionPreview } from "./solution-preview";

type ResourceFromQuery = NonNullable<
	NonNullable<PATTERN_QUERYResult>["resources"]
>[number];

type SolutionFromQuery = NonNullable<ResourceFromQuery["solutions"]>[number];

type ResourcesProps = {
	resources: ResourceFromQuery[];
};

type SolutionBadgeProps = {
	solution: SolutionFromQuery;
	index: number;
};

function SolutionBadge({ solution, index }: SolutionBadgeProps) {
	const title = solution.title || `Solution ${index + 1}`;
	const description =
		ptToPlainText(solution.description as PortableTextBlock[]) ||
		"No description available";

	return (
		<SolutionPreview
			key={solution._id || index}
			solutionNumber={String(index + 1)}
			solutionTitle={title}
			solutionDescription={description}
		>
			<Badge
				variant="solution"
				icon={
					<HugeiconsIcon
						icon={ChartRelationshipIcon}
						size={12}
						color="currentColor"
						strokeWidth={1.5}
						className="md:h-[14px] md:w-[14px]"
					/>
				}
			>
				{title}
			</Badge>
		</SolutionPreview>
	);
}

export function Resources({ resources }: ResourcesProps) {
	if (!resources.length) return null;

	return (
		<section
			id="resources"
			data-section="resources"
			className="flex flex-col gap-4 md:gap-5"
		>
			<header className="flex flex-row items-center gap-2 md:gap-2.5">
				<h2 className="font-light text-[24px] text-primary md:text-[32px]">
					Resources
				</h2>
			</header>

			<div className="flex flex-col">
				{resources.map((resource, index) => {
					const solutions = resource.solutions;
					const hasSolutions = solutions && solutions.length > 0;
					const isFirst = index === 0;
					const isLast = index === resources.length - 1;
					const solutionCount = solutions?.length || 0;

					return (
						<div
							key={resource._id}
							className={cn(
								"relative w-full",
								isFirst && "border-neutral-300 border-t border-dashed",
								isLast && "border-neutral-300 border-b border-dashed",
							)}
						>
							<div className="flex flex-col gap-2.5 pt-6 pb-6 md:gap-3 md:pt-9 md:pb-9">
								<div className="flex flex-col gap-2.5 md:gap-2">
									<div className="flex flex-row items-center gap-2">
										<h3 className="font-light text-base text-primary leading-normal md:text-xl md:leading-tight lg:text-[28px] lg:leading-normal">
											{resource.title}
										</h3>
									</div>
									{resource.description && (
										<CustomPortableText
											value={resource.description as PortableTextBlock[]}
											className="text-body-muted"
										/>
									)}
								</div>

								{hasSolutions && (
									<div className="flex flex-col items-start gap-2 md:flex-row md:items-start md:gap-2.5">
										<div className="flex flex-row items-center gap-2 md:gap-2.5">
											<span className="whitespace-nowrap font-normal text-[#c4c4c8] text-[12px] tracking-[-0.14px] md:text-[14px]">
												Related {solutionCount > 1 ? "solutions" : "solution"}
											</span>
											<HugeiconsIcon
												icon={ArrowRight02Icon}
												size={16}
												color="#c4c4c8"
												strokeWidth={1.5}
												className="hidden md:block md:h-4 md:w-4"
											/>
										</div>
										<div className="flex flex-wrap gap-1.5 md:gap-2.5">
											{solutions.map((solution, sIdx) => (
												<SolutionBadge
													key={solution._id || sIdx}
													solution={solution}
													index={sIdx}
												/>
											))}
										</div>
									</div>
								)}
							</div>
							{!isLast && (
								<div className="absolute right-0 bottom-0 left-0 border-neutral-300 border-b border-dashed" />
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
}
