"use client";

import { FlowConnectionIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "~/components/shared/icon";
import { Badge } from "~/components/ui/badge";
import type { TAGS_WITH_PATTERNS_QUERYResult } from "~/sanity/sanity.types";

// Type definitions using Sanity's auto-generated query result types
type TagsByLetter = Partial<Record<string, TAGS_WITH_PATTERNS_QUERYResult>>;

/**
 * TagsList component displays tags organized alphabetically with letter navigation.
 *
 * Each letter section uses `scroll-mt-40` (scroll-margin-top: 10rem) to ensure
 * that when scrolling to a letter via the LetterNavigation component, the content
 * is positioned below the fixed header instead of being hidden underneath it.
 * This provides proper visual spacing and prevents content from being cut off.
 */
export function TagsList({
	tagsByLetter,
	alphabet,
}: {
	tagsByLetter: TagsByLetter;
	alphabet: string[];
}) {
	return (
		<div className="space-y-8 pb-[144px] md:pb-[144px]" data-scroll-container>
			<div id="tags-content" className="flex-1 space-y-4">
				{alphabet.map((letter) => {
					const tags = tagsByLetter[letter];
					if (!tags || tags.length === 0) return null;

					return (
						<section
							key={letter}
							className="w-full max-w-4xl scroll-mt-36 space-y-8"
							id={`letter-${letter}`}
						>
							<h2 className="text-subheading">{letter}</h2>

							{tags.map((tag) => (
								<div key={tag._id} className="mb-12 space-y-4">
									<div className="inline-block w-fit rounded-md bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
										<h3 className="text-neutral-800 text-subheading dark:text-neutral-200">
											{tag.title ?? ""}
										</h3>
									</div>

									<p className="mb-4 text-body-muted">
										Tagged to the following {Math.min(tag.patterns.length, 10)}{" "}
										{Math.min(tag.patterns.length, 10) === 1 ? "page" : "pages"}
										.
									</p>

									<div className="flex flex-wrap gap-2">
										{tag.patterns.slice(0, 10).map((pattern) => (
											<Link
												key={pattern._id}
												href={`/pattern/${pattern.slug ?? ""}`}
												className="inline-block w-max whitespace-normal break-words"
											>
												<Badge
													variant="pattern"
													icon={
														<Icon
															icon={FlowConnectionIcon}
															size={12}
															color="currentColor"
															strokeWidth={1.5}
														/>
													}
												>
													{pattern.title ?? ""}
												</Badge>
											</Link>
										))}
									</div>
								</div>
							))}
						</section>
					);
				})}
			</div>
		</div>
	);
}
