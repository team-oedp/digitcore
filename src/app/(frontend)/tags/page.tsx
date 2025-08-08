import type { Metadata } from "next";

import { TagsList } from "~/components/pages/tags/tags-list";
import { CurrentLetterIndicator } from "~/components/shared/current-letter-indicator";
import { PageHeader } from "~/components/shared/page-header";
import { PageWrapper } from "~/components/shared/page-wrapper";

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
export type Tag = (typeof TAGS_DATA)[number];
export type TagsByLetter = Partial<Record<string, Tag[]>>;

export default function Tags() {
	// Group tags by letter
	const tagsByLetter = TAGS_DATA.reduce<TagsByLetter>((acc, tag) => {
		const group = acc[tag.letter] ?? [];
		group.push(tag);
		acc[tag.letter] = group;
		return acc;
	}, {});

	return (
		<div className="relative">
			<PageWrapper>
				<div className="sticky top-0 z-10 bg-primary-foreground pt-6 pb-2">
					<div className="flex items-start justify-between gap-6">
						<div className="flex-1">
							<PageHeader
								title="Tags"
								description="Explore tags to discover new pathways through the toolkit's patterns."
							/>
						</div>

						<div className="shrink-0">
							<CurrentLetterIndicator
								availableLetters={Object.keys(tagsByLetter)}
								contentId="tags-content"
							/>
						</div>
					</div>
				</div>

				<TagsList tagsByLetter={tagsByLetter} alphabet={ALPHABET} />
			</PageWrapper>
		</div>
	);
}
