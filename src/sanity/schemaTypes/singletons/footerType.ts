import { StackCompactIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const footerType = defineType({
	name: "footer",
	title: "Footer",
	type: "document",
	icon: StackCompactIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
		}),
		defineField({
			name: "information",
			title: "Information",
			type: "blockContent",
		}),
		defineField({
			name: "links",
			title: "Links",
			type: "array",
			of: [
				defineField({
					name: "link",
					type: "link",
				}),
			],
		}),
		defineField({
			name: "license",
			title: "License",
			type: "blockContent",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
