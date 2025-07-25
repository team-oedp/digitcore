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
			name: "themes",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "theme" } })],
			options: {
				layout: "list",
			},
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
			name: "externalLinks",
			title: "External Links",
			type: "array",
			of: [
				defineArrayMember({
					type: "object",
					fields: [
						defineField({
							name: "label",
							type: "string",
							title: "Label",
						}),
						defineField({
							name: "url",
							type: "url",
							title: "URL",
						}),
					],
					preview: {
						select: {
							title: "label",
							subtitle: "url",
						},
					},
				}),
			],
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
