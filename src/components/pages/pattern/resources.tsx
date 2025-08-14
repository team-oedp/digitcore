import {
	ArrowRight02Icon,
	ChartRelationshipIcon,
	Link02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { SolutionPreview } from "./solution-preview";

// Because references in Sanity have to be derefenced in order to get access to the fields of the referenced type, we are keying the Pattern query result by "resources"
// Another approach would be to manually create a type with all of the necessary fields
type ResourceReference = {
	_ref: string;
	_type: "reference";
	_weak?: boolean;
	_key: string;
};

export type DereferencedResource = {
	_id: string;
	title?: string | null;
	description?: PortableTextBlock[] | null;
	links?: { href: string }[];
	solutionRefs?: { _ref: string; _type: "reference"; _key: string }[];
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

type ResourcesProps = {
	resources: DereferencedResource[];
};

export function Resources({ resources }: ResourcesProps) {
	if (!resources.length) return null;
	return (
		<section
			id="resources"
			data-section="resources"
			className="flex flex-col gap-5"
		>
			<header className="flex flex-row items-center gap-2.5">
				<h2 className="font-normal text-[32px] text-primary">Resources</h2>
			</header>

			<div className="flex flex-col">
				{resources.map((resource, index) =>
					isDereferencedResource(resource) ? (
						<div
							key={resource.title || resource._id}
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
									{resource.description && (
										<CustomPortableText
											value={resource.description as PortableTextBlock[]}
											className="prose prose-neutral max-w-none prose-p:text-[14px] prose-p:leading-normal"
										/>
									)}
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
										{resource.solutionRefs?.map((solution, index) =>
											isSolutionReference(solution) ? (
												<SolutionPreview
													key={solution._ref || index}
													solutionNumber={String(index + 1)}
													solutionTitle={"Linked Solution"}
													solutionDescription={"No description available"}
												>
													<div className="flex h-6 cursor-pointer items-center gap-2.5 rounded-lg border border-[#a2e636] bg-[#e6fbc5] px-2 py-1.5">
														<span className="font-normal text-[#95b661] text-[14px] tracking-[-0.14px]">
															{`Solution ${index + 1}`}
														</span>
														<HugeiconsIcon
															icon={ChartRelationshipIcon}
															size={14}
															color="#95b661"
															strokeWidth={1.5}
														/>
													</div>
												</SolutionPreview>
											) : null,
										)}
									</div>
								</div>
							</div>
							{index < resources.length - 1 && (
								<div className="absolute right-0 bottom-0 left-0 border-zinc-300 border-b border-dashed" />
							)}
						</div>
					) : null,
				)}
			</div>
		</section>
	);
}
