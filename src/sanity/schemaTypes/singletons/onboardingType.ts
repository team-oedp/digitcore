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
			],
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
