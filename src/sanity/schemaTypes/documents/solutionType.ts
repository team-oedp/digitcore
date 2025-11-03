import { BulbOutlineIcon, TextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { validateUniqueTitle } from "../../lib/validation";

export const solutionType = defineType({
	name: "solution",
	title: "Solution",
	type: "document",
	icon: BulbOutlineIcon,
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
			validation: (Rule) => {
				const uniqueTitleValidator = validateUniqueTitle();
				return [
					Rule.required(),
					Rule.custom(async (value, context) => {
						const result = await uniqueTitleValidator(value, context);
						return result === true
							? true
							: "Another solution with this title already exists";
					}).warning("Another solution with this title already exists"),
				];
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
		}),
		defineField({
			name: "audiences",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "audience" } })],
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
		},
	},
});
