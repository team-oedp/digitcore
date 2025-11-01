import { FeedbackIcon } from "@sanity/icons";
import {
	orderRankField,
	orderRankOrdering,
} from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export const faqType = defineType({
	name: "faq",
	title: "FAQ",
	type: "document",
	icon: FeedbackIcon,
	orderings: [orderRankOrdering],
	fields: [
		defineField({
			// should match 'languageField' plugin configuration setting in sanity.config.ts, if customized
			name: "language",
			type: "string",
			readOnly: true,
			hidden: true,
		}),
		orderRankField({ type: "category" }),
		defineField({
			name: "title",
			type: "string",
		}),
		defineField({
			name: "category",
			title: "Category",
			type: "reference",
			to: [{ type: "faqCategory" }],
			description:
				"This field is optional. Group FAQs by category for better organization on the FAQ page.",
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
