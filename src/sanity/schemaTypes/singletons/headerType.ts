import { InsertAboveIcon, LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const headerType = defineType({
	name: "header",
	title: "Header",
	type: "document",
	icon: InsertAboveIcon,
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
			title: "Information",
			type: "blockContent",
		}),
		defineField({
			name: "internalLinks",
			title: "Navigation links",
			description:
				"Links that appear in the header. Items linking to 'orientation' or 'about' pages will appear in the main menu, all others will appear in the Explore dropdown.",
			type: "array",
			of: [
				{
					type: "object",
					icon: LinkIcon,
					fields: [
						{
							name: "label",
							title: "Link text",
							type: "string",
							validation: (Rule) => Rule.required(),
						},
						{
							name: "page",
							title: "Page",
							type: "reference",
							to: [{ type: "page" }],
							validation: (Rule) => Rule.required(),
						},
					],
					preview: {
						select: {
							title: "label",
							subtitle: "page.title",
						},
					},
				},
			],
		}),
		defineField({
			name: "languageSelectorButtonLabel",
			title: "Language selector button label",
			description: "Accessibility label for the language selector button",
			type: "string",
		}),
		defineField({
			name: "fontToggleButtonLabel",
			title: "Font toggle button label",
			description: "Accessibility label for the font toggle button",
			type: "string",
		}),
		defineField({
			name: "fontToggleSrOnlyLabel",
			title: "Font toggle screen reader label",
			description: "Screen reader only label for the font toggle button",
			type: "string",
		}),
		defineField({
			name: "fontSerifLabel",
			title: "Serif font label",
			description: "Label for the serif font option",
			type: "string",
		}),
		defineField({
			name: "fontSansSerifLabel",
			title: "Sans-serif font label",
			description: "Label for the sans-serif font option",
			type: "string",
		}),
		defineField({
			name: "modeToggleButtonLabel",
			title: "Theme toggle button label",
			description: "Accessibility label for the theme toggle button",
			type: "string",
		}),
		defineField({
			name: "modeToggleSrOnlyLabel",
			title: "Theme toggle screen reader label",
			description: "Screen reader only label for the theme toggle button",
			type: "string",
		}),
		defineField({
			name: "themeLightLabel",
			title: "Light theme label",
			description: "Label for the light theme option",
			type: "string",
		}),
		defineField({
			name: "themeDarkLabel",
			title: "Dark theme label",
			description: "Label for the dark theme option",
			type: "string",
		}),
		defineField({
			name: "themeSystemLabel",
			title: "System theme label",
			description: "Label for the system theme option",
			type: "string",
		}),
		defineField({
			name: "exploreButtonLabel",
			title: "Explore button label",
			description: "Label for the explore menu button",
			type: "string",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
