import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import { TagsList } from "~/components/pages/tags/tags-list";
import { CurrentLetterIndicator } from "~/components/shared/current-letter-indicator";
import { LetterNavigation } from "~/components/shared/letter-navigation";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { client } from "~/sanity/lib/client";
import { TAGS_PAGE_QUERY, TAGS_WITH_PATTERNS_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import type { Page } from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "Tags | DIGITCORE Toolkit",
	description:
		"Explore tags to discover new pathways through the toolkit's patterns.",
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Type definitions
type Pattern = {
	_id: string;
	title: string;
	slug: string;
};

type TagFromSanity = {
	_id: string;
	title: string;
	patterns: Pattern[];
};

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

export type TagsByLetter = Partial<Record<string, Tag[]>>;

export default async function Tags() {
	const isDraftMode = (await draftMode()).isEnabled;

	// Fetch page data from Sanity
	const pageData = (await client.fetch(
		TAGS_PAGE_QUERY,
		{},
		isDraftMode
			? { perspective: "previewDrafts", useCdn: false, stega: true, token }
			: { perspective: "published", useCdn: true },
	)) as Page | null;

	// Fetch tags with patterns from Sanity
	const tagsData = await client.fetch(
		TAGS_WITH_PATTERNS_QUERY,
		{},
		isDraftMode
			? {
					perspective: "previewDrafts",
					useCdn: false,
					stega: true,
					token,
				}
			: {
					perspective: "published",
					useCdn: true,
				},
	);

	// Transform Sanity data to match the component's expected format
	const transformedTags: Tag[] =
		(tagsData as TagFromSanity[])?.map((tag) => {
			const firstLetter = tag.title.charAt(0).toUpperCase();
			return {
				id: tag._id,
				name: tag.title,
				letter: firstLetter,
				resources: tag.patterns.map((pattern) => ({
					id: pattern._id,
					title: pattern.title,
					slug: pattern.slug,
				})),
			};
		}) || [];

	// Group tags by letter
	const tagsByLetter = transformedTags.reduce<TagsByLetter>((acc, tag) => {
		const group = acc[tag.letter] ?? [];
		group.push(tag);
		acc[tag.letter] = group;
		return acc;
	}, {});

	return (
		<div className="relative">
			<PageWrapper className="flex gap-20">
				{/* Sticky nav and section indicator */}
				<div className="sticky top-6 z-10 h-full self-start">
					<div className="flex flex-col items-start justify-start gap-5">
						{/* Anchor used as the intersection threshold for current-letter detection */}
						<div id="letter-anchor" />
						<CurrentLetterIndicator
							availableLetters={Object.keys(tagsByLetter)}
							contentId="tags-content"
							// implicit anchorId defaults to 'letter-anchor'
						/>
						<div className="lg:pl-2">
							<LetterNavigation
								itemsByLetter={tagsByLetter}
								contentId="tags-content"
							/>
						</div>
					</div>
				</div>

				{/* Scrolling section */}
				<div className="flex flex-col gap-40">
					{pageData?.title && pageData?.description && (
						<PageHeading
							title={pageData.title}
							description={pageData.description as PortableTextBlock[]}
						/>
					)}
					<TagsList tagsByLetter={tagsByLetter} alphabet={ALPHABET} />
				</div>
			</PageWrapper>
		</div>
	);
}
