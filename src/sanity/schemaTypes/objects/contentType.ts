import { BlockContentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const contentType = defineType({
	name: "content",
	title: "Content",
	type: "object",
	icon: BlockContentIcon,
	fields: [
		defineField({
			name: "heading",
			type: "string",
			title: "Heading",
		}),
		defineField({
			name: "body",
			type: "blockContent",
			title: "Body",
		}),
	],
	preview: {
		select: {
			title: "heading",
		},
	},
});
