import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

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
		defineField({
			name: "svgIcon",
			title: "SVG Icon",
			group: "icon",
			type: "code",
			description:
				"Paste the full <svg>...</svg> code here. Use currentColor for fill/stroke.",
			options: {
				language: "xml",
				languageAlternatives: [
					{ title: "Javascript", value: "javascript" },
					{ title: "XML", value: "xml" },
				],
				withFilename: true,
			},
		}),
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
