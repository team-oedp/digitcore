import { WrenchIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const resourceType = defineType({
	name: "resource",
	title: "Resource",
	type: "document",
	icon: WrenchIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
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
			name: "solution",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "solution" } })],
		}),
		defineField({
			name: "externalLinks",
			title: "External Links",
			type: "array",
			of: [
				defineArrayMember({
					type: "url",
					title: "URL",
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
