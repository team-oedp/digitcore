import { BlockquoteIcon, DesktopIcon, StringIcon } from "@sanity/icons";
import type { SanityDocument } from "sanity";
import { defineArrayMember, defineField, defineType } from "sanity";
// import { isUniqueOtherThanLanguage } from "../../lib/validation";

export const pageType = defineType({
	name: "page",
	title: "Page",
	type: "document",
	icon: DesktopIcon,
	fields: [
		defineField({
			// should match 'languageField' plugin configuration setting in sanity.config.ts, if customized
			name: "language",
			type: "string",
			readOnly: true,
			hidden: true,
		}),
		defineField({
			name: "title",
			title: "Title",
			type: "string",
		}),
		defineField({
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				isUnique: () => true, // disables uniqueness check
				// isUnique: isUniqueOtherThanLanguage,
			},
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "blockContent",
		}),
		defineField({
			name: "heroHeading",
			title: "Hero heading",
			type: "string",
			description: "Heading shown at the top of the home page",
			hidden: ({ document }: { document?: SanityDocument }) => {
				const title = (document as { title?: string } | undefined)?.title;
				const slug = (document as { slug?: { current?: string } } | undefined)
					?.slug?.current;
				return !(title === "Home" || slug === "/");
			},
		}),
		defineField({
			name: "content",
			title: "Content",
			type: "array",
			description:
				"Add different types of content blocks, such a heading and paragraph block, or a content list block.",
			of: [
				defineArrayMember({
					type: "content",
				}),
				defineArrayMember({
					type: "contentList",
					icon: StringIcon,
				}),
				defineArrayMember({
					type: "record",
					icon: BlockquoteIcon,
				}),
			],
		}),
		defineField({
			name: "emptyStateMessage",
			title: "Empty State Message",
			type: "text",
			description: "Message to display when there is no data showing.",
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
		},
	},
});
