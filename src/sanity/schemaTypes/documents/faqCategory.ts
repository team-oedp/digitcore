import { TagIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { validateUniqueTitle } from "../../lib/validation";

export const faqCategoryType = defineType({
	name: "faqCategory",
	title: "FAQ Category",
	type: "document",
	icon: TagIcon,
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
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
		},
	},
});
