import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { TagsList } from "~/components/pages/tags/tags-list";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { CurrentLetterIndicator } from "~/components/shared/current-letter-indicator";
import { LetterNavigation } from "~/components/shared/letter-navigation";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { sanityFetch } from "~/sanity/lib/client";
import {
	TAGS_PAGE_QUERY,
	TAGS_WITH_PATTERNS_QUERY,
} from "~/sanity/lib/queries";
import type {
	Page,
	TAGS_WITH_PATTERNS_QUERYResult,
} from "~/sanity/sanity.types";

export const metadata: Metadata = {
	title: "Tags | DIGITCORE",
	description:
		"Explore tags to discover new pathways through the toolkit's patterns.",
};

const ALPHABET = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(65 + i),
);

export type TagsByLetter = Partial<
	Record<string, TAGS_WITH_PATTERNS_QUERYResult>
>;

export default async function Tags() {
	const [pageData, tagsData] = await Promise.all([
		sanityFetch({
			query: TAGS_PAGE_QUERY,
			revalidate: 60,
		}) as Promise<Page | null>,
		sanityFetch({
			query: TAGS_WITH_PATTERNS_QUERY,
			revalidate: 60,
		}) as Promise<TAGS_WITH_PATTERNS_QUERYResult | null>,
	]);

	// Group tags by letter and ensure strict alphabetical ordering within each group
	const tagsByLetter =
		tagsData?.reduce<TagsByLetter>((acc, tag) => {
			const title = tag.title ?? "";
			const letter = title.charAt(0).toUpperCase();
			const group = acc[letter] ?? [];
			group.push(tag);
			// Sort the group alphabetically by title to ensure strict ordering
			group.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
			acc[letter] = group;
			return acc;
		}, {}) ?? {};

	if (!pageData) return null;

	return (
		<div className="relative">
			<PageWrapper className="flex flex-col gap-0 md:flex-row md:gap-20">
				{/* Sticky nav and section indicator */}
				<div className="sticky top-5 z-10 hidden h-full self-start md:block">
					<div className="flex flex-col items-start justify-start gap-0">
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
				<div className="flex flex-col">
					{pageData.title && <PageHeading title={pageData.title} />}
					{pageData.description && (
						<CustomPortableText
							value={pageData.description as PortableTextBlock[]}
							className="mt-8 text-body"
						/>
					)}
					<div className="pt-14 lg:pt-14">
						<TagsList tagsByLetter={tagsByLetter} alphabet={ALPHABET} />
					</div>
				</div>
			</PageWrapper>
		</div>
	);
}
