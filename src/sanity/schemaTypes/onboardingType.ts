import { PresentationIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const onboardingType = defineType({
	name: "onboarding",
	title: "Onboarding",
	type: "document",
	icon: PresentationIcon,
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
		},
	},
});
