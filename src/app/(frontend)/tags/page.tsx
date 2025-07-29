import type { Metadata } from "next";
import Link from "next/link";
import { CurrentLetterIndicator } from "~/components/shared/current-letter-indicator";
import { LetterNavigation } from "~/components/shared/letter-navigation";

export const metadata: Metadata = {
	title: "Tags | DIGITCORE Toolkit",
	description:
		"Explore tags to discover new pathways through the toolkit's patterns.",
};

// Mock data that would typically come from a GROQ query like:
// *[_type == "tag"] | order(name asc) {
//   _id,
//   name,
//   "resources": *[_type == "pattern" && references(^._id)] {
//     _id,
//     title,
//     slug
//   }
// }
const TAGS_DATA = [
	{
		id: "advocacy-networks",
		name: "Advocacy Networks",
		letter: "A",
		resources: [
			{
				id: "enhancing-frontline-communities",
				title: "Enhancing Frontline Communities' Agency",
				slug: "enhancing-frontline-communities-agency",
			},
			{
				id: "respecting-frontline-communities",
				title: "Respecting Frontline Communities' Time And Effort",
				slug: "respecting-frontline-communities-time-effort",
			},
		],
	},
	{
		id: "civil-society-organizations",
		name: "Civil Society Organizations",
		letter: "C",
		resources: [
			{
				id: "enhancing-frontline-communities-2",
				title: "Enhancing Frontline Communities' Agency",
				slug: "enhancing-frontline-communities-agency",
			},
			{
				id: "open-means-different",
				title: "Open Means Different Things To Different People",
				slug: "open-means-different-things",
			},
		],
	},
	{
		id: "community-groups",
		name: "Community Groups",
		letter: "C",
		resources: [
			{
				id: "enhancing-frontline-communities-3",
				title: "Enhancing Frontline Communities' Agency",
				slug: "enhancing-frontline-communities-agency",
			},
		],
	},
	{
		id: "grassroots-organizations",
		name: "Grassroots Organizations",
		letter: "G",
		resources: [
			{
				id: "enhancing-frontline-communities-4",
				title: "Enhancing Frontline Communities' Agency",
				slug: "enhancing-frontline-communities-agency",
			},
			{
				id: "open-means-different-2",
				title: "Open Means Different Things To Different People",
				slug: "open-means-different-things",
			},
			{
				id: "respecting-frontline-communities-2",
				title: "Respecting Frontline Communities' Time And Effort",
				slug: "respecting-frontline-communities-time-effort",
			},
		],
	},
	{
		id: "nonprofit-entities",
		name: "Nonprofit Entities",
		letter: "N",
		resources: [
			{
				id: "enhancing-frontline-communities-5",
				title: "Enhancing Frontline Communities' Agency",
				slug: "enhancing-frontline-communities-agency",
			},
			{
				id: "open-means-different-3",
				title: "Open Means Different Things To Different People",
				slug: "open-means-different-things",
			},
			{
				id: "respecting-frontline-communities-3",
				title: "Respecting Frontline Communities' Time And Effort",
				slug: "respecting-frontline-communities-time-effort",
			},
			{
				id: "data-quality-standards",
				title: "Data Quality Standards Remain To Be Developed",
				slug: "data-quality-standards-remain-developed",
			},
			{
				id: "adequate-metadata",
				title: "Adequate Metadata Requires Capacity",
				slug: "adequate-metadata-requires-capacity",
			},
		],
	},
	{
		id: "public-interest-groups",
		name: "Public Interest Groups",
		letter: "P",
		resources: [
			{
				id: "enhancing-frontline-communities-6",
				title: "Enhancing Frontline Communities' Agency",
				slug: "enhancing-frontline-communities-agency",
			},
			{
				id: "open-means-different-4",
				title: "Open Means Different Things To Different People",
				slug: "open-means-different-things",
			},
		],
	},
] as const;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Grouped tags keyed by their starting letter
type Tag = (typeof TAGS_DATA)[number];
type TagsByLetter = Partial<Record<string, Tag[]>>;

export default function TagsPage() {
	// Group tags by letter
	const tagsByLetter = TAGS_DATA.reduce<TagsByLetter>((acc, tag) => {
		const group = acc[tag.letter] ?? [];
		group.push(tag);
		acc[tag.letter] = group;
		return acc;
	}, {});

	return (
		<div className="relative flex h-screen flex-col">
			{/* Letter Navigation Sidebar - Fixed positioning */}
			<LetterNavigation itemsByLetter={tagsByLetter} contentId="tags-content" />

			{/* Fixed Header Content */}
			<div className="flex-shrink-0 space-y-8 p-5 lg:pl-20">
				{/* Header */}
				<section className="max-w-4xl">
					<h1 className="font-light text-4xl text-neutral-500 leading-tight">
						Tags
					</h1>
				</section>

				{/* Introduction */}
				<section className="max-w-4xl">
					<p className="text-base text-neutral-500 leading-relaxed">
						Explore tags to discover new pathways through the toolkit's
						patterns.
					</p>
				</section>

				{/* Current Letter Indicator */}
				<CurrentLetterIndicator
					availableLetters={Object.keys(tagsByLetter)}
					contentId="tags-content"
				/>
			</div>

			{/* Scrollable Content - Tags only */}
			<div
				id="tags-content"
				className="scrollbar-hide flex-1 space-y-16 overflow-y-auto p-5 lg:pl-20"
			>
				{/* Tags by Letter */}
				{ALPHABET.map((letter) => {
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
