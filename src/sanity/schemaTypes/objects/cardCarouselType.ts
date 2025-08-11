import { VersionsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const cardCarouselType = defineType({
	name: "cardCarousel",
	title: "Card Carousel",
	type: "object",
	icon: VersionsIcon,
	description:
		"A horizontal carousel of cards. Each card has a title and a portable-text description.",
	fields: [
		defineField({
			name: "title",
			title: "Section title (optional)",
			type: "string",
		}),
		defineField({
			name: "cards",
			title: "Cards",
			type: "array",
			of: [
				defineArrayMember({
					name: "card",
					title: "Card",
					type: "object",
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
		select: { title: "title", cards: "cards" },
		prepare(selection) {
			const { title, cards } = selection as {
				title?: string;
				cards?: unknown[];
			};
			return {
				title: title || "Card Carousel",
				subtitle:
					cards && Array.isArray(cards) ? `${cards.length} card(s)` : "",
			};
		},
	},
});
