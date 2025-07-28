import { BookIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const glossaryType = defineType({
	name: "glossary",
	title: "Glossary",
	type: "document",
	icon: BookIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
		}),
		defineField({
			name: "description",
			type: "blockContent",
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
		},
	},
});
