import { FeedbackIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const suggestionType = defineType({
	name: "suggestion",
	title: "Suggestion",
	type: "document",
	icon: FeedbackIcon,
	fields: [
		defineField({
			name: "patternName",
			title: "Pattern Name",
			type: "string",
		}),
		defineField({
			name: "patternSlug",
			title: "Pattern Slug",
			type: "string",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "newSolutions",
			title: "New Solutions",
			type: "text",
		}),
		defineField({
			name: "newResources",
			title: "New Resources",
			type: "text",
		}),
		defineField({
			name: "additionalFeedback",
			title: "Additional Feedback",
			type: "text",
		}),
		defineField({
			name: "nameAndAffiliation",
			title: "Name and Affiliation",
			type: "string",
		}),
		defineField({
			name: "email",
			title: "Email",
			type: "string",
		}),
		defineField({
			name: "submittedAt",
			title: "Submitted At",
			type: "datetime",
			initialValue: () => new Date().toISOString(),
			readOnly: true,
		}),
	],
	preview: {
		select: {
			title: "patternName",
			subtitle: "submittedAt",
		},
	},
});
