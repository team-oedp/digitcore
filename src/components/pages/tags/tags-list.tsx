"use client";

import Link from "next/link";
import { LetterNavigation } from "~/components/shared/letter-navigation";

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
		<div className="flex gap-20 space-y-8 pb-[800px]" data-scroll-container>
			<LetterNavigation itemsByLetter={tagsByLetter} contentId="tags-content" />
			<div id="tags-content" className="flex-1 space-y-16 lg:pl-20">
				{alphabet.map((letter) => {
					const tags = tagsByLetter[letter];
					if (!tags || tags.length === 0) return null;

					return (
						<section
							key={letter}
							className="max-w-4xl scroll-mt-40 space-y-8"
							id={`letter-${letter}`}
						>
							<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
								{letter}
							</h2>

							{tags.map((tag) => (
								<div key={tag.id} className="space-y-4">
									<h3 className="font-normal text-neutral-500 text-xl capitalize">
										{tag.name}
									</h3>

									<p className="mb-4 text-base text-neutral-500 leading-relaxed">
										Tagged to the following pages. Showing first{" "}
										{Math.min(tag.resources.length, 10)} links.
									</p>

									<div className="flex flex-wrap gap-2">
										{tag.resources.slice(0, 10).map((resource) => (
											<Link
												key={resource.id}
												href={`/pattern/${resource.slug}`}
												className="flex h-6 items-center gap-2.5 rounded-lg border border-[#d1a7f3] bg-[#ead1fa] py-2 pr-3 pl-[9px] transition-opacity hover:opacity-80"
											>
												<span className="whitespace-nowrap text-[#4f065f] text-[14px]">
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
