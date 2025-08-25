"use client";

import { FlowConnectionIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "~/components/shared/icon";
import { Badge } from "~/components/ui/badge";

// Type definitions
type Tag = {
	id: string;
	name: string;
	letter: string;
	resources: {
		id: string;
		title: string;
		slug: string;
	}[];
};

type TagsByLetter = Partial<Record<string, Tag[]>>;

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
}: { tagsByLetter: TagsByLetter; alphabet: string[] }) {
	return (
		<div className="space-y-8 pb-[200px] md:pb-[800px]" data-scroll-container>
			<div id="tags-content" className="flex-1 space-y-16">
				{alphabet.map((letter) => {
					const tags = tagsByLetter[letter];
					if (!tags || tags.length === 0) return null;

					return (
						<section
							key={letter}
							className="w-full max-w-4xl scroll-mt-[29px] space-y-8"
							id={`letter-${letter}`}
						>
							<h2 className="text-subheading">{letter}</h2>

							{tags.map((tag) => (
								<div key={tag.id} className="mb-12 space-y-4">
									<div className="inline-block w-fit rounded-md bg-neutral-100 px-2 py-1">
										<h3 className="text-subheading">{tag.name}</h3>
									</div>

									<p className="mb-4 text-body-muted">
										Tagged to the following pages. Showing{" "}
										{Math.min(tag.resources.length, 10)}{" "}
										{Math.min(tag.resources.length, 10) === 1
											? "link"
											: "links"}
										.
									</p>

									<div className="flex flex-wrap gap-2">
										{tag.resources.slice(0, 10).map((resource) => (
											<Link
												key={resource.id}
												href={`/pattern/${resource.slug}`}
												className="inline-block w-max whitespace-normal break-words"
											>
												<Badge
													variant="page"
													icon={
														<Icon
															icon={FlowConnectionIcon}
															size={12}
															color="currentColor"
															strokeWidth={1.5}
														/>
													}
												>
													{resource.title}
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
