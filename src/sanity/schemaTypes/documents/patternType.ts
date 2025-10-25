import { DocumentTextIcon, TextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { validateUniqueTitle } from "../../lib/validation";

export const patternType = defineType({
	name: "pattern",
	title: "Pattern",
	type: "document",
	icon: DocumentTextIcon,
	groups: [
		{ name: "content", title: "Content", default: true },
		{ name: "icon", title: "Icon" },
	],
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			group: "content",
			validation: (Rule) => Rule.required().custom(validateUniqueTitle()),
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: {
				source: "title",
			},
			group: "content",
		}),
		defineField({
			name: "description",
			type: "array",
			of: [
				defineArrayMember({
					type: "block",
					styles: [{ title: "Normal", value: "normal" }],
					lists: [],
					marks: {
						decorators: [
							{ title: "Strong", value: "strong" },
							{ title: "Emphasis", value: "em" },
						],
						annotations: [
							{
								name: "glossaryTerm",
								type: "object",
								title: "Glossary Term",
								icon: TextIcon,
								fields: [
									defineField({
										name: "glossary",
										title: "Glossary Term",
										type: "reference",
										to: [{ type: "glossary" }],
										validation: (Rule) => Rule.required(),
									}),
								],
							},
							{
								name: "link",
								type: "object",
								title: "Link",
								fields: [
									defineField({
										name: "href",
										title: "URL",
										type: "url",
										validation: (Rule) => Rule.required(),
									}),
									defineField({
										name: "openInNewTab",
										title: "Open in new tab",
										type: "boolean",
										initialValue: false,
									}),
								],
							},
						],
					},
				}),
			],
			group: "content",
		}),
		defineField({
			name: "icon",
			title: "Icon",
			group: "icon",
			type: "reference",
			to: [{ type: "icon" }],
			description: "Upload an icon asset to represent this pattern",
		}),
		// defineField({
		// 	name: "svgIcon",
		// 	title: "SVG Icon",
		// 	group: "icon",
		// 	type: "code",
		// 	description:
		// 		"Paste the full <svg>...</svg> code here. Use currentColor for fill/stroke.",
		// 	options: {
		// 		language: "xml",
		// 		languageAlternatives: [
		// 			{ title: "Javascript", value: "javascript" },
		// 			{ title: "XML", value: "xml" },
		// 		],
		// 		withFilename: true,
		// 	},
		// }),
		defineField({
			name: "tags",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "tag" } })],
			options: {
				layout: "list",
			},
			group: "content",
		}),
		defineField({
			name: "audiences",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "audience" } })],
			validation: (Rule) => Rule.required().min(1),
			options: {
				layout: "list",
			},
			group: "content",
		}),
		defineField({
			name: "theme",
			title: "Theme",
			type: "reference",
			to: [{ type: "theme" }],
			validation: (Rule) => Rule.required(),
			group: "content",
		}),
		defineField({
			name: "solutions",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "solution" } })],
			options: {
				layout: "list",
			},
			group: "content",
		}),
		defineField({
			name: "resources",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "resource" } })],
			validation: (Rule) => Rule.required().min(1),
			options: {
				layout: "list",
			},
			group: "content",
		}),
		defineField({
			name: "publishedAt",
			type: "datetime",
			group: "content",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
		prepare(selection) {
			const { title } = selection;
			return {
				title,
			};
		},
	},
});
