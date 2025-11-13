import { PresentationIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
// import { isUniqueOtherThanLanguage } from "../../lib/validation";

export const onboardingType = defineType({
	name: "onboarding",
	title: "Orientation",
	type: "document",
	icon: PresentationIcon,
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
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				isUnique: () => true, // disables uniqueness check
				// isUnique: isUniqueOtherThanLanguage,
			},
		}),
		defineField({
			name: "description",
			type: "blockContent",
		}),
		// Global UI labels
		defineField({
			name: "skipLabel",
			title: "Skip label",
			type: "string",
			initialValue: "Skip orientation",
			hidden: true,
		}),
		defineField({
			name: "backLabel",
			title: "Back button label",
			type: "string",
			initialValue: "Back",
			description: "Text for back button on each slide",
		}),
		defineField({
			name: "footerText",
			title: "Footer text",
			type: "string",
			initialValue: "Open Environmental Data Project",
		}),
		defineField({
			name: "breadcrumbs",
			title: "Breadcrumb labels",
			type: "object",
			fields: [
				defineField({
					name: "slide1",
					title: "Slide 1 label",
					type: "string",
					initialValue: "Introduction",
				}),
				defineField({
					name: "slide2",
					title: "Slide 2 label",
					type: "string",
					initialValue: "Audiences",
				}),
				defineField({
					name: "slide3",
					title: "Slide 3 label",
					type: "string",
					initialValue: "Interests",
				}),
			],
		}),
		// Slide 1
		defineField({
			name: "slide1",
			title: "Slide 1",
			type: "object",
			fields: [
				defineField({
					name: "title",
					title: "Title",
					type: "string",
				}),
				defineField({
					name: "body",
					title: "Body",
					type: "blockContent",
				}),
				defineField({
					name: "primaryCtaLabel",
					title: "Primary CTA label",
					type: "string",
					initialValue: "Tell me more about the DIGITCORE library",
				}),
				defineField({
					name: "secondaryCtaText",
					title: "Secondary CTA helper text",
					type: "string",
					initialValue: "Or, go directly to the pattern:",
				}),
				defineField({
					name: "returnToCtaText",
					title: "Return to CTA helper text",
					type: "string",
					initialValue: "Or return to",
					description:
						"Text displayed above the return-to button when user has a returnToPath (different from pattern link)",
				}),
				defineField({
					name: "homePageButtonLabel",
					title: "Home page button label",
					type: "string",
					initialValue: "DIGITCORE Home Page",
					description:
						"Label for the button that links to the home page when skipping orientation",
				}),
			],
		}),
		// Slide 2
		defineField({
			name: "slide2",
			title: "Slide 2",
			type: "object",
			fields: [
				defineField({
					name: "title",
					title: "Title",
					type: "string",
				}),
				defineField({
					name: "body",
					title: "Body",
					type: "blockContent",
				}),
				defineField({
					name: "nextButtonLabel",
					title: "Next button label",
					type: "string",
					initialValue: "NEXT",
				}),
				defineField({
					name: "nextButtonPrefix",
					title: "Next button prefix text",
					type: "string",
					initialValue: "Click",
					description:
						"Text that appears before the NEXT button in the sentence 'Click [NEXT] to continue.' This is the prefix text shown when audiences are selected on Slide 2 (Audiences).",
				}),
				defineField({
					name: "nextButtonSuffix",
					title: "Next button suffix text",
					type: "string",
					initialValue: "to continue.",
					description:
						"Text that appears after the NEXT button in the sentence 'Click [NEXT] to continue.' This is the suffix text shown when audiences are selected on Slide 2 (Audiences).",
				}),
				defineField({
					name: "backButtonPrefix",
					title: "Back button prefix text",
					type: "string",
					initialValue: "Or, go",
					description:
						"Text that appears before the BACK button in the sentence 'Or, go [BACK] to the previous step.' This is the prefix text for the back navigation instruction on Slide 2 (Audiences).",
				}),
				defineField({
					name: "backButtonSuffix",
					title: "Back button suffix text",
					type: "string",
					initialValue: "to the previous step.",
					description:
						"Text that appears after the BACK button in the sentence 'Or, go [BACK] to the previous step.' This is the suffix text for the back navigation instruction on Slide 2 (Audiences).",
				}),
			],
		}),
		// Slide 3
		defineField({
			name: "slide3",
			title: "Slide 3",
			type: "object",
			fields: [
				defineField({
					name: "title",
					title: "Title",
					type: "string",
					initialValue:
						"Help us tailor your experience of this library to your needs.",
				}),
				defineField({
					name: "body",
					title: "Body",
					type: "blockContent",
				}),
				defineField({
					name: "finishButtonLabel",
					title: "Finish button label",
					type: "string",
					initialValue: "FINISH",
				}),
				defineField({
					name: "finishButtonPrefix",
					title: "Finish button prefix text",
					type: "string",
					initialValue: "click",
					description:
						"Text that appears before the FINISH button in the sentence 'click [FINISH] to continue to the toolkit.' This is the prefix text shown when themes are selected on Slide 3 (Themes/Interests).",
				}),
				defineField({
					name: "finishButtonSuffix",
					title: "Finish button suffix text",
					type: "string",
					initialValue: "to continue to the toolkit.",
					description:
						"Text that appears after the FINISH button in the sentence 'click [FINISH] to continue to the toolkit.' This is the suffix text shown when themes are selected on Slide 3 (Themes/Interests).",
				}),
				defineField({
					name: "backButtonPrefix",
					title: "Back button prefix text",
					type: "string",
					initialValue: "Or, go",
					description:
						"Text that appears before the BACK button in the sentence 'Or, go [BACK] to the previous step.' This is the prefix text for the back navigation instruction on Slide 3 (Themes/Interests).",
				}),
				defineField({
					name: "backButtonSuffix",
					title: "Back button suffix text",
					type: "string",
					initialValue: "to the previous step.",
					description:
						"Text that appears after the BACK button in the sentence 'Or, go [BACK] to the previous step.' This is the suffix text for the back navigation instruction on Slide 3 (Themes/Interests).",
				}),
			],
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
