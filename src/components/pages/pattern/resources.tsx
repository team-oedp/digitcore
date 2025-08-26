import {
	ArrowRight02Icon,
	ChartRelationshipIcon,
	Link02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { Badge } from "~/components/ui/badge";
import { SolutionPreview } from "./solution-preview";

// Because references in Sanity have to be derefenced in order to get access to the fields of the referenced type, we are keying the Pattern query result by "resources"
// Another approach would be to manually create a type with all of the necessary fields
type ResourceReference = {
	_ref: string;
	_type: "reference";
	_weak?: boolean;
	_key: string;
};

type DereferencedSolution = {
	_id: string;
	title?: string | null;
	description?: PortableTextBlock[] | null;
};

export type DereferencedResource = {
	_id: string;
	title?: string | null;
	description?: PortableTextBlock[] | null;
	links?: { href: string }[];
	// When query returns dereferenced solutions (solutions[]->{...})
	solutions?: DereferencedSolution[] | null;
	// Fallback if only references were returned (may contain invalid shapes in tests)
	solutionRefs?: unknown[];
};

function isDereferencedResource(
	resource: unknown,
): resource is DereferencedResource {
	return !!resource && typeof resource === "object" && "title" in resource;
}

function isSolutionReference(
	solution: unknown,
): solution is { _ref: string; _type: "reference"; _key: string } {
	if (!solution || typeof solution !== "object") return false;
	const s = solution as Record<string, unknown>;
	return "_ref" in s && "_type" in s && s._type === "reference";
}

function ptToPlainText(blocks?: PortableTextBlock[] | null): string {
	if (!Array.isArray(blocks)) return "";
	return blocks
		.map((block) =>
			Array.isArray((block as any).children)
				? (block as any).children
						.map((child: any) =>
							typeof child.text === "string" ? child.text : "",
						)
						.join("")
				: "",
		)
		.filter(Boolean)
		.join("\n");
}

type ResourcesProps = {
	resources: DereferencedResource[];
};

export function Resources({ resources }: ResourcesProps) {
	if (!resources.length) return null;
	return (
		<section
			id="resources"
			data-section="resources"
			className="flex flex-col gap-4 md:gap-5"
		>
			<header className="flex flex-row items-center gap-2 md:gap-2.5">
				<h2 className="font-normal text-[24px] text-primary md:text-[32px]">
					Resources
				</h2>
			</header>

			<div className="flex flex-col">
				{resources.map((resource, index) =>
					isDereferencedResource(resource) ? (
						<div
							key={resource.title || resource._id}
							className={`relative w-full ${
								index === 0 ? "border-neutral-300 border-t border-dashed" : ""
							} ${
								index === resources.length - 1
									? "border-neutral-300 border-b border-dashed"
									: ""
							}`}
						>
							<div className="flex flex-col gap-2.5 py-3 pb-6 md:gap-3 md:pb-9">
								<div className="flex flex-col gap-2">
									<div className="flex flex-row items-center gap-2">
										<div className="flex h-7 flex-row items-center gap-2 md:h-8 md:gap-2.5">
											<h3 className="font-normal text-[16px] text-primary md:text-[18px]">
												{resource.title}
											</h3>
										</div>
										{resource.links?.[0]?.href && (
											<a
												href={resource.links?.[0]?.href}
												target="_blank"
												rel="noopener noreferrer"
												className="flex h-7 w-7 items-center justify-center rounded-full bg-background transition-colors hover:bg-secondary md:h-8 md:w-8"
											>
												<HugeiconsIcon
													icon={Link02Icon}
													size={16}
													color="currentColor"
													strokeWidth={1.5}
													className="z-10 md:h-5 md:w-5"
												/>
											</a>
										)}
									</div>
									{resource.description && (
										<CustomPortableText
											value={resource.description as PortableTextBlock[]}
											className="prose max-w-none text-xs leading-normal md:text-sm"
										/>
									)}
								</div>
								<div className="flex flex-col items-start gap-2 md:flex-row md:items-center md:gap-2.5">
									<span className="font-normal text-[#c4c4c8] text-[12px] tracking-[-0.14px] md:text-[14px]">
										From <span className="uppercase">SOLUTION</span>
									</span>
									<HugeiconsIcon
										icon={ArrowRight02Icon}
										size={20}
										color="#c4c4c8"
										strokeWidth={1.5}
										className="hidden md:block md:h-6 md:w-6"
									/>
									<div className="flex flex-wrap gap-1.5 md:gap-2.5">
										{Array.isArray(resource.solutions) &&
										resource.solutions.length > 0
											? resource.solutions.map((solution, sIdx) => (
													<SolutionPreview
														key={solution._id || sIdx}
														solutionNumber={String(sIdx + 1)}
														solutionTitle={
															solution.title || `Solution ${sIdx + 1}`
														}
														solutionDescription={
															ptToPlainText(solution.description) ||
															"No description available"
														}
													>
														<Badge
															variant="solution"
															className="border-green-200 bg-green-100 text-green-800 hover:border-green-300"
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
															{solution.title || `Solution ${sIdx + 1}`}
														</Badge>
													</SolutionPreview>
												))
											: resource.solutionRefs?.map((solution, sIdx) =>
													isSolutionReference(solution) ? (
														<SolutionPreview
															key={solution._ref || sIdx}
															solutionNumber={String(sIdx + 1)}
															solutionTitle={"Linked Solution"}
															solutionDescription={"No description available"}
														>
															<Badge
																variant="solution"
																className="border-green-200 bg-green-100 text-green-800 hover:border-green-300"
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
																{`Solution ${sIdx + 1}`}
															</Badge>
														</SolutionPreview>
													) : null,
												)}
									</div>
								</div>
							</div>
							{index < resources.length - 1 && (
								<div className="absolute right-0 bottom-0 left-0 border-neutral-300 border-b border-dashed" />
							)}
						</div>
					) : null,
				)}
			</div>
		</section>
	);
}
