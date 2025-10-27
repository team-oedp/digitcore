import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { validateUniqueTitle } from "../../lib/validation";

export const tagType = defineType({
	name: "tag",
	title: "Tag",
	type: "document",
	icon: TagIcon,
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
	],
	preview: {
		select: {
			title: "title",
		},
		prepare(selection) {
			const { title } = selection;
			return {
				title: title
					? title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
					: "Untitled",
			};
		},
	},
});
