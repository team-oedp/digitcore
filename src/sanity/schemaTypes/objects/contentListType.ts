import { StringIcon, VersionsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const contentListType = defineType({
	name: "contentList",
	title: "Content list",
	type: "object",
	icon: VersionsIcon,
	description:
		"A list of content items. Each item has a title and a description.",
	fields: [
		defineField({
			name: "title",
			title: "Section title (optional)",
			type: "string",
		}),
		defineField({
			name: "items",
			title: "Items",
			type: "array",
			of: [
				defineArrayMember({
					name: "item",
					title: "Item",
					type: "object",
					icon: StringIcon,
					fields: [
						defineField({ name: "title", title: "Title", type: "string" }),
						defineField({
							name: "description",
							title: "Description",
							type: "blockContent",
						}),
					],
					preview: {
						select: { title: "title" },
					},
				}),
			],
			validation: (Rule) => Rule.required().min(1),
		}),
	],
	preview: {
		select: { title: "title", items: "items" },
		prepare(selection) {
			const { title, items } = selection as {
				title?: string;
				items?: unknown[];
			};
			return {
				title: title || "Content list",
				subtitle:
					items && Array.isArray(items) ? `${items.length} item(s)` : "",
			};
		},
	},
});
