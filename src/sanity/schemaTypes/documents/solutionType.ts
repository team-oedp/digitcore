import { BulbOutlineIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { validateUniqueTitle } from "../../lib/validation";

export const solutionType = defineType({
	name: "solution",
	title: "Solution",
	type: "document",
	icon: BulbOutlineIcon,
	fields: [
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
