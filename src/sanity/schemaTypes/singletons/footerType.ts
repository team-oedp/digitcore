import { LinkIcon, StackCompactIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const footerType = defineType({
	name: "footer",
	title: "Footer",
	type: "document",
	icon: StackCompactIcon,
	groups: [
		{ name: "externalLinks", title: "External links" },
		{ name: "internalLinks", title: "Internal links" },
	],
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
			name: "externalLinks",
			title: "External links",
			type: "array",
			group: "externalLinks",
			of: [
				{
					type: "object",
					icon: LinkIcon,
					fields: [
						{
							name: "label",
							title: "Link text",
							type: "string",
							validation: (Rule) => Rule.required(),
						},
						{
							name: "url",
							title: "URL",
							type: "url",
							validation: (Rule) => Rule.required(),
						},
					],
					preview: {
						select: {
							title: "label",
							subtitle: "url",
						},
					},
				},
			],
		}),
		defineField({
			name: "internalLinks",
			title: "Internal links",
			type: "array",
			group: "internalLinks",
			of: [
				{
					type: "object",
					icon: LinkIcon,
					fields: [
						{
							name: "label",
							title: "Link text",
							type: "string",
							validation: (Rule) => Rule.required(),
						},
						{
							name: "page",
							title: "Page",
							type: "reference",
							to: [{ type: "page" }],
							validation: (Rule) => Rule.required(),
						},
					],
					preview: {
						select: {
							title: "label",
							subtitle: "page.title",
						},
					},
				},
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
