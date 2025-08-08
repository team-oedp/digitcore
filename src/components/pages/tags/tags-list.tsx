"use client";

import Link from "next/link";
import type { TagsByLetter } from "~/app/(frontend)/tags/page";
import { LetterNavigation } from "~/components/shared/letter-navigation";
import { useScrollToTarget } from "~/hooks/use-scroll-to-target";

export function TagsList({
	tagsByLetter,
	alphabet,
}: { tagsByLetter: TagsByLetter; alphabet: string[] }) {
	const activeLetter = useScrollToTarget({
		highlight: true,
		groupSelector: "[data-letter]",
		debounceMs: 150,
	});

	return (
		<div className="flex gap-20 space-y-8 pb-[800px]">
			<LetterNavigation itemsByLetter={tagsByLetter} contentId="tags-content" />
			<div id="tags-content" className="flex-1 space-y-16 lg:pl-20">
				{alphabet.map((letter) => {
					const tags = tagsByLetter[letter];
					if (!tags || tags.length === 0) return null;

					return (
						<section
							key={letter}
							className="max-w-4xl space-y-8"
							id={`letter-${letter}`}
						>
							<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
								{letter}
							</h2>

							{tags.map((tag) => (
								<div key={tag.id} className="space-y-4">
									<h3 className="font-normal text-neutral-500 text-xl">
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
