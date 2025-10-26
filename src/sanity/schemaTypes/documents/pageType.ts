import { DesktopIcon, StringIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const pageType = defineType({
	name: "page",
	title: "Page",
	type: "document",
	icon: DesktopIcon,
	fields: [
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
			},
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "blockContent",
		}),
		defineField({
			name: "emptyStateMessage",
			title: "Empty State Message",
			type: "text",
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
