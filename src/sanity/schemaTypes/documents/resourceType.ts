import { TextIcon, WrenchIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { validateUniqueTitle } from "../../lib/validation";

export const resourceType = defineType({
	name: "resource",
	title: "Resource",
	type: "document",
	icon: WrenchIcon,
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
			validation: (Rule) => Rule.required().custom(validateUniqueTitle()),
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
			name: "solutions",
			title: "Solutions",
			description: "Select the solutions that this resource references.",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "solution" } })],
		}),
		defineField({
			name: "mainLink",
			title: "Main Link",
			description:
				"(Optional) Add the main link to the resource. When there is no main link set (for instance when there are multiple links), the links will exist in the rich text without a main link icon.",
			type: "url",
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
		},
	},
});
