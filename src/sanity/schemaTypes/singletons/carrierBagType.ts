import { BasketIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const carrierBagType = defineType({
	name: "carrierBag",
	title: "Carrier Bag",
	type: "document",
	icon: BasketIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
		}),
		defineField({
			name: "information",
			type: "blockContent",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
