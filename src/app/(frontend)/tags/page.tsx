import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { client } from "~/sanity/lib/client";
import { TAGS_WITH_PATTERNS_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";
import { TagsList } from "~/components/pages/tags/tags-list";
import { CurrentLetterIndicator } from "~/components/shared/current-letter-indicator";
import { PageHeader } from "~/components/shared/page-header";
import { PageWrapper } from "~/components/shared/page-wrapper";

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
	const transformedTags: Tag[] = (tagsData as TagFromSanity[])?.map((tag) => {
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
