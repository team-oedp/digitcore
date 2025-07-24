import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const tagType = defineType({
	name: "tag",
	title: "Tag",
	type: "document",
	icon: TagIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
		prepare(selection) {
			const { title } = selection;
			return {
				title: title
					? title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
					: "Untitled",
			};
		},
	},
});
