import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const externalLinkType = defineType({
	name: "externalLink",
	title: "External Link",
	type: "object",
	icon: LinkIcon,
	fields: [
		defineField({
			name: "label",
			title: "Label",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "url",
			title: "URL",
			type: "url",
			validation: (Rule) => Rule.required(),
		}),
	],
	preview: {
		select: {
			title: "label",
			subtitle: "url",
		},
	},
});