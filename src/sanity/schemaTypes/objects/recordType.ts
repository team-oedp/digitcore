import { BlockquoteIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const recordType = defineType({
	name: "record",
	title: "Record",
	type: "object",
	icon: BlockquoteIcon,
	fields: [
		defineField({
			name: "name",
			title: "Name",
			type: "string",
		}),
		defineField({
			name: "description",
			title: "Description",
			type: "blockContent",
		}),
	],
});
