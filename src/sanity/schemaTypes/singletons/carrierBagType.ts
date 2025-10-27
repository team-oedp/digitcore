import { BasketIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const carrierBagType = defineType({
	name: "carrierBag",
	title: "Carrier Bag",
	type: "document",
	icon: BasketIcon,
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
			name: "information",
			type: "blockContent",
		}),
		defineField({
			name: "emptyStateMessage",
			type: "text",
			title: "Empty State Message",
			description: "Message displayed when the carrier bag is empty",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
