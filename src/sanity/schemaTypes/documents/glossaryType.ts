import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const glossaryType = defineType({
	name: "glossary",
	title: "Glossary",
	type: "document",
	icon: BookIcon,
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
