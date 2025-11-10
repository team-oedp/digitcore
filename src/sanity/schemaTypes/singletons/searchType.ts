import { SearchIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const searchType = defineType({
	name: "search",
	title: "Search",
	type: "document",
	icon: SearchIcon,
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
			name: "searchInputPlaceholder",
			type: "string",
			title: "Search Input Placeholder",
			description:
				"Placeholder text for the main search input field (e.g., 'Search patterns, solutions, resources...')",
		}),
		defineField({
			name: "clearButtonLabel",
			type: "string",
			title: "Clear Button Label",
			description: "Label text for the clear search button",
		}),
		defineField({
			name: "audiencesFilterLabel",
			type: "string",
			title: "Audiences Filter Label",
			description: "Label text for the audiences filter section",
		}),
		defineField({
			name: "audiencesPlaceholder",
			type: "string",
			title: "Audiences Placeholder",
			description: "Placeholder text for the audiences multi-select",
		}),
		defineField({
			name: "audiencesSearchPlaceholder",
			type: "string",
			title: "Audiences Search Placeholder",
			description: "Search input placeholder for the audiences dropdown",
		}),
		defineField({
			name: "audiencesEmptyMessage",
			type: "string",
			title: "Audiences Empty Message",
			description: "Empty state message when no audiences are found",
		}),
		defineField({
			name: "themesFilterLabel",
			type: "string",
			title: "Themes Filter Label",
			description: "Label text for the themes filter section",
		}),
		defineField({
			name: "themesPlaceholder",
			type: "string",
			title: "Themes Placeholder",
			description: "Placeholder text for the themes multi-select",
		}),
		defineField({
			name: "themesSearchPlaceholder",
			type: "string",
			title: "Themes Search Placeholder",
			description: "Search input placeholder for the themes dropdown",
		}),
		defineField({
			name: "themesEmptyMessage",
			type: "string",
			title: "Themes Empty Message",
			description: "Empty state message when no themes are found",
		}),
		defineField({
			name: "tagsFilterLabel",
			type: "string",
			title: "Tags Filter Label",
			description: "Label text for the tags filter section",
		}),
		defineField({
			name: "tagsPlaceholder",
			type: "string",
			title: "Tags Placeholder",
			description: "Placeholder text for the tags multi-select",
		}),
		defineField({
			name: "tagsSearchPlaceholder",
			type: "string",
			title: "Tags Search Placeholder",
			description: "Search input placeholder for the tags dropdown",
		}),
		defineField({
			name: "tagsEmptyMessage",
			type: "string",
			title: "Tags Empty Message",
			description: "Empty state message when no tags are found",
		}),
		defineField({
			name: "suggestionsHeading",
			type: "string",
			title: "Suggestions Heading",
			description:
				"Heading text for the suggestions section (e.g., 'Suggestions for you')",
		}),
		defineField({
			name: "enhanceLabel",
			type: "string",
			title: "Enhance Label",
			description: "Label text for the enhance toggle button (e.g., 'Enhance')",
		}),
		defineField({
			name: "enhanceResultsTitle",
			type: "string",
			title: "Enhance Results Title",
			description:
				"Title text for the enhance hover card (e.g., 'Enhance Results')",
		}),
		defineField({
			name: "audiencePreferencesLabel",
			type: "string",
			title: "Audience Preferences Label",
			description:
				"Label text for audience preferences in enhance hover (e.g., 'audience preferences')",
		}),
		defineField({
			name: "themePreferencesLabel",
			type: "string",
			title: "Theme Preferences Label",
			description:
				"Label text for theme preferences in enhance hover (e.g., 'theme preferences')",
		}),
		defineField({
			name: "preferencesConjunction",
			type: "string",
			title: "Preferences Conjunction",
			description: "Conjunction word to join preferences (e.g., 'and' or 'y')",
		}),
		defineField({
			name: "enhanceHoverDescription",
			type: "string",
			title: "Enhance Hover Description",
			description:
				"Description text for enhance hover card. Use {preferencesText} as placeholder (e.g., 'Results that match your {preferencesText} will be prioritized.')",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
