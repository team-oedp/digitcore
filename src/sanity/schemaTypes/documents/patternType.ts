import { DocumentTextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const patternType = defineType({
	name: "pattern",
	title: "Pattern",
	type: "document",
	icon: DocumentTextIcon,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: {
				source: "title",
			},
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
		}),
		defineField({
			name: "icon",
			title: "Icon",
			type: "reference",
			to: [{ type: "icon" }],
			description: "Select an icon document (SVG) to represent this pattern",
		}),
		defineField({
			name: "tags",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "tag" } })],
			options: {
				layout: "list",
			},
		}),
		defineField({
			name: "audiences",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "audience" } })],
			options: {
				layout: "list",
			},
		}),
		defineField({
			name: "theme",
			title: "Theme",
			type: "reference",
			to: [{ type: "theme" }],
		}),
		defineField({
			name: "solutions",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "solution" } })],
			options: {
				layout: "list",
			},
		}),
		defineField({
			name: "resources",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "resource" } })],
			options: {
				layout: "list",
			},
		}),
		defineField({
			name: "publishedAt",
			type: "datetime",
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
