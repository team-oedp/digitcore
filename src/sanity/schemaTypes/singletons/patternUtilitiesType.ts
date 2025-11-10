import { WrenchIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const patternUtilitiesType = defineType({
	name: "patternUtilities",
	title: "Pattern Utilities",
	type: "document",
	icon: WrenchIcon,
	fields: [
		defineField({
			name: "language",
			type: "string",
			readOnly: true,
			hidden: true,
		}),
		defineField({
			name: "title",
			type: "string",
			title: "Title",
		}),
		defineField({
			name: "knowOfAnotherResourceOrSolution",
			type: "string",
			title: "Know Of Another Resource Or Solution",
			description:
				"Text displayed above the 'Make a suggestion' button (e.g., 'Know of another resource or solution?')",
		}),
		defineField({
			name: "makeASuggestionButtonLabel",
			type: "string",
			title: "Make A Suggestion Button Label",
			description: "Label text for the 'Make a suggestion' button",
		}),
		defineField({
			name: "suggestSolutionModalTitle",
			type: "string",
			title: "Suggest Solution Modal Title",
			description: "Title text for the suggestion modal dialog",
		}),
		defineField({
			name: "suggestSolutionModalDescription",
			type: "text",
			title: "Suggest Solution Modal Description",
			description:
				"Description text for the suggestion modal dialog (e.g., 'Help us improve the Digital Toolkit...')",
		}),
		defineField({
			name: "patternLabel",
			type: "string",
			title: "Pattern Label",
			description: "Label text for the pattern field in the suggestion form",
		}),
		defineField({
			name: "newSolutionsLabel",
			type: "string",
			title: "New Solutions Label",
			description: "Label text for the new solutions textarea field",
		}),
		defineField({
			name: "newSolutionsPlaceholder",
			type: "text",
			title: "New Solutions Placeholder",
			description:
				"Placeholder text for the new solutions textarea (e.g., 'What new solution(s) would you like to add for this pattern?')",
		}),
		defineField({
			name: "newResourcesLabel",
			type: "string",
			title: "New Resources Label",
			description: "Label text for the new resources textarea field",
		}),
		defineField({
			name: "newResourcesPlaceholder",
			type: "text",
			title: "New Resources Placeholder",
			description:
				"Placeholder text for the new resources textarea (e.g., 'What new resource(s) would you like to add for this pattern? Please reference a solution and provide a URL if applicable.')",
		}),
		defineField({
			name: "additionalFeedbackLabel",
			type: "string",
			title: "Additional Feedback Label",
			description: "Label text for the additional feedback textarea field",
		}),
		defineField({
			name: "additionalFeedbackPlaceholder",
			type: "text",
			title: "Additional Feedback Placeholder",
			description:
				"Placeholder text for the additional feedback textarea (e.g., 'Do you have any additional feedback on the Pattern or Toolkit?')",
		}),
		defineField({
			name: "nameAndAffiliationLabel",
			type: "string",
			title: "Name And Affiliation Label",
			description: "Label text for the name and affiliation input field",
		}),
		defineField({
			name: "nameAndAffiliationPlaceholder",
			type: "text",
			title: "Name And Affiliation Placeholder",
			description:
				"Placeholder text for the name and affiliation input (e.g., 'Would you like your name and affiliation to be listed on the website?')",
		}),
		defineField({
			name: "emailLabel",
			type: "string",
			title: "Email Label",
			description: "Label text for the email input field",
		}),
		defineField({
			name: "emailPlaceholder",
			type: "text",
			title: "Email Placeholder",
			description:
				"Placeholder text for the email input (e.g., 'Please supply an email where we can contact you.')",
		}),
		defineField({
			name: "cancelButtonLabel",
			type: "string",
			title: "Cancel Button Label",
			description: "Label text for the cancel button in the suggestion modal",
		}),
		defineField({
			name: "submitSuggestionButtonLabel",
			type: "string",
			title: "Submit Suggestion Button Label",
			description: "Label text for the submit suggestion button",
		}),
		defineField({
			name: "patternSubmittedSuccessfullyMessage",
			type: "string",
			title: "Pattern Submitted Successfully Message",
			description:
				"Success message displayed after submitting a suggestion (e.g., 'Pattern submitted successfully!')",
		}),
		defineField({
			name: "relatedSolutionLabel",
			type: "string",
			title: "Related Solution Label",
			description:
				"Label text for related solution (singular, e.g., 'Related solution')",
		}),
		defineField({
			name: "relatedSolutionsLabel",
			type: "string",
			title: "Related Solutions Label",
			description:
				"Label text for related solutions (plural, e.g., 'Related solutions')",
		}),
		defineField({
			name: "visitPatternButtonLabel",
			type: "string",
			title: "Visit Pattern Button Label",
			description:
				"Label text for the 'Visit pattern' button (e.g., 'Visit pattern')",
		}),
		defineField({
			name: "solutionsHeading",
			type: "string",
			title: "Solutions Heading",
			description: "Heading text for the Solutions section (e.g., 'Solutions')",
		}),
		defineField({
			name: "resourcesHeading",
			type: "string",
			title: "Resources Heading",
			description: "Heading text for the Resources section (e.g., 'Resources')",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
