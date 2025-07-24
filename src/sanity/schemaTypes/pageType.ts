import { DesktopIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const pageType = defineType({
	name: "page",
	title: "Page",
	type: "document",
	icon: DesktopIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
		}),
		defineField({
			name: "slug",
			type: "slug",
			options: {
				source: "title",
			},
		}),
		defineField({
			name: "description",
			type: "text",
		}),
		defineField({
			name: "body",
			type: "array",
			of: [
				defineArrayMember({
					type: "block",
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
