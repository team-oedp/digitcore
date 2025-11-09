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
	],
	preview: {
		select: {
			title: "title",
		},
	},
});

