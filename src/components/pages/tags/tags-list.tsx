"use client";

import Link from "next/link";

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
		<div className="space-y-8 pb-[800px]" data-scroll-container>
			<div id="tags-content" className="flex-1 space-y-16">
				{alphabet.map((letter) => {
					const tags = tagsByLetter[letter];
					if (!tags || tags.length === 0) return null;

					return (
						<section
							key={letter}
							className="max-w-4xl scroll-mt-40 space-y-8"
							id={`letter-${letter}`}
						>
							<h2 className="font-normal text-lg text-neutral-500 uppercase tracking-wide">
								{letter}
							</h2>

							{tags.map((tag) => (
								<div key={tag.id} className="space-y-4">
									<h3 className="font-normal text-lg text-primary capitalize">
										{tag.name}
									</h3>

									<p className="mb-4 text-primary text-sm leading-relaxed">
										Tagged to the following pages. Showing first{" "}
										{Math.min(tag.resources.length, 10)} links.
									</p>

									<div className="flex flex-wrap gap-2">
										{tag.resources.slice(0, 10).map((resource) => (
											<Link
												key={resource.id}
												href={`/pattern/${resource.slug}`}
												className="flex h-6 items-center gap-2.5 rounded-lg border border-neutral-300 bg-neutral-100 py-2 pr-3 pl-[9px] transition-opacity hover:opacity-80"
											>
												<span className="whitespace-nowrap text-primary text-sm">
													{resource.title}
												</span>
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
