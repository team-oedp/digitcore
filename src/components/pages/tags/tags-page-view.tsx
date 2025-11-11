import type { PortableTextBlock } from "next-sanity";
import { TagsList } from "~/components/pages/tags/tags-list";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import { CurrentLetterIndicator } from "~/components/shared/current-letter-indicator";
import { LetterNavigation } from "~/components/shared/letter-navigation";
import { PageHeading } from "~/components/shared/page-heading";
import { PageWrapper } from "~/components/shared/page-wrapper";
import type { Language } from "~/i18n/config";
import { sanityFetch } from "~/sanity/lib/client";
import { TAGS_WITH_PATTERNS_QUERY } from "~/sanity/lib/queries";
import type {
	PAGE_BY_SLUG_QUERYResult,
	TAGS_WITH_PATTERNS_QUERYResult,
} from "~/sanity/sanity.types";

const ALPHABET = Array.from({ length: 26 }, (_, i) =>
	String.fromCharCode(65 + i),
);

export type TagsByLetter = Partial<
	Record<string, TAGS_WITH_PATTERNS_QUERYResult>
>;

type TagsPageViewProps = {
	pageData: PAGE_BY_SLUG_QUERYResult;
	language: Language;
};

export async function TagsPageView({
	pageData,
	language,
}: TagsPageViewProps) {
	const tagsData = await sanityFetch({
		query: TAGS_WITH_PATTERNS_QUERY,
		params: { language },
		revalidate: 60,
	}) as Promise<TAGS_WITH_PATTERNS_QUERYResult | null>;

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

