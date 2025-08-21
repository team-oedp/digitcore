import { WrenchIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
import { validateUniqueTitle } from "../../lib/validation";

export const resourceType = defineType({
	name: "resource",
	title: "Resource",
	type: "document",
	icon: WrenchIcon,
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
			name: "solutions",
			title: "Solutions",
			description: "Select the solutions that this resource references.",
			type: "array",
			of: [defineArrayMember({ type: "reference", to: { type: "solution" } })],
		}),
		defineField({
			name: "links",
			title: "Links",
			description: "(Optional) Add any links to the resource.",
			type: "array",
			of: [
				defineArrayMember({
					type: "link",
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
