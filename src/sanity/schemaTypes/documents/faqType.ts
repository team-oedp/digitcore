import { FeedbackIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const faqType = defineType({
	name: "faq",
	title: "FAQ",
	type: "document",
	icon: FeedbackIcon,
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
