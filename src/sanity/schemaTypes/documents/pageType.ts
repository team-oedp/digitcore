import { DesktopIcon } from "@sanity/icons";
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
			name: "content",
			title: "Content",
			type: "array",
			of: [
				defineArrayMember({
					type: "content",
				}),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
		},
	},
});
