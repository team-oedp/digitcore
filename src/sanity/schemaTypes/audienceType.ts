import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const audienceType = defineType({
	name: "audience",
	title: "Audience",
	type: "document",
	icon: UserIcon,
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
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
		},
	},
});
