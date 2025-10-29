import { DocumentTextIcon, TextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
	// isUniqueOtherThanLanguage,
	validateUniqueTitle,
} from "../../lib/validation";

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
			// should match 'languageField' plugin configuration setting in sanity.config.ts, if customized
			name: "language",
			type: "string",
			readOnly: true,
			hidden: true,
		}),
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
				isUnique: () => true,
				// isUnique: isUniqueOtherThanLanguage,
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
										name: "linkType",
										title: "Link Type",
										type: "string",
										initialValue: "href",
										options: {
											list: [
												{ title: "URL", value: "href" },
												{ title: "Page", value: "page" },
												{ title: "Pattern", value: "pattern" },
												{ title: "Orientation", value: "onboarding" },
											],
											layout: "radio",
										},
									}),
									defineField({
										name: "href",
										title: "URL",
										type: "url",
										hidden: ({ parent }) =>
											parent?.linkType !== "href" && parent?.linkType != null,
										validation: (Rule) =>
											Rule.custom((value, context) => {
												const parent = context.parent as { linkType?: string };
												if (parent?.linkType === "href" && !value) {
													return "URL is required when Link Type is URL";
												}
												return true;
											}),
									}),
									defineField({
										name: "page",
										title: "Page",
										type: "reference",
										to: [{ type: "page" }],
										hidden: ({ parent }) => parent?.linkType !== "page",
										validation: (Rule) =>
											Rule.custom((value, context) => {
												const parent = context.parent as { linkType?: string };
												if (parent?.linkType === "page" && !value) {
													return "Page reference is required when Link Type is Page";
												}
												return true;
											}),
									}),
									defineField({
										name: "pattern",
										title: "Pattern",
										type: "reference",
										to: [{ type: "pattern" }],
										hidden: ({ parent }) => parent?.linkType !== "pattern",
										validation: (Rule) =>
											Rule.custom((value, context) => {
												const parent = context.parent as { linkType?: string };
												if (parent?.linkType === "pattern" && !value) {
													return "Pattern reference is required when Link Type is a Pattern";
												}
												return true;
											}),
									}),
									defineField({
										name: "openInNewTab",
										title: "Open in new tab",
										type: "boolean",
										initialValue: false,
									}),
								],
							},
							// {
							// 	name: "link",
							// 	type: "object",
							// 	title: "Link",
							// 	fields: [
							// 		defineField({
							// 			name: "href",
							// 			title: "URL",
							// 			type: "url",
							// 			validation: (Rule) => Rule.required(),
							// 		}),
							// 		defineField({
							// 			name: "openInNewTab",
							// 			title: "Open in new tab",
							// 			type: "boolean",
							// 			initialValue: false,
							// 		}),
							// 	],
							// },
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
