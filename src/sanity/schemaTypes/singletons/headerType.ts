import { LinkIcon, InsertAboveIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const headerType = defineType({
	name: "header",
	title: "Header",
	type: "document",
	icon: InsertAboveIcon,
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
			type: "string",
		}),
		defineField({
			name: "information",
			title: "Information",
			type: "blockContent",
		}),
		defineField({
			name: "internalLinks",
			title: "Navigation links",
			description:
				"Links that appear in the header. Items linking to 'orientation' or 'about' pages will appear in the main menu, all others will appear in the Explore dropdown.",
			type: "array",
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
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
