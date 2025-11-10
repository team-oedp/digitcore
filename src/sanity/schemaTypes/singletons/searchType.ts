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
				"Label text that appears before audience preference values in the Enhance toggle hover card on the search page. This text prefixes the actual preference values in parentheses (e.g., 'audience preferences' in 'audience preferences (Researcher, Developer)').",
		}),
		defineField({
			name: "themePreferencesLabel",
			type: "string",
			title: "Theme Preferences Label",
			description:
				"Label text that appears before theme preference values in the Enhance toggle hover card on the search page. This text prefixes the actual preference values in parentheses (e.g., 'theme preferences' in 'theme preferences (Community Engagement)').",
		}),
		defineField({
			name: "preferencesConjunction",
			type: "string",
			title: "Preferences Conjunction",
			description: "Conjunction word to join preferences (e.g., 'and' or 'y')",
		}),
		defineField({
			name: "enhanceHoverDescriptionPrefix",
			type: "string",
			title: "Enhance Hover Description Prefix",
			description:
				"Text that appears before the preferences in the enhance hover description (e.g., 'Results that match your')",
		}),
		defineField({
			name: "enhanceHoverDescriptionSuffix",
			type: "string",
			title: "Enhance Hover Description Suffix",
			description:
				"Text that appears after the preferences in the enhance hover description (e.g., 'will be prioritized.')",
		}),
		defineField({
			name: "commandMenuInputPlaceholder",
			type: "string",
			title: "Command Menu Input Placeholder",
			description:
				"Placeholder text for the command menu search input (e.g., 'Search patterns, solutions, and resources...')",
		}),
		defineField({
			name: "commandMenuLoadingText",
			type: "string",
			title: "Command Menu Loading Text",
			description:
				"Text shown while searching in command menu (e.g., 'Searching...')",
		}),
		defineField({
			name: "commandMenuEmptyState",
			type: "string",
			title: "Command Menu Empty State",
			description:
				"Text shown when no results are found in command menu (e.g., 'No results found.')",
		}),
		defineField({
			name: "commandMenuOnThisPageHeading",
			type: "string",
			title: "Command Menu 'On This Page' Heading",
			description:
				"Heading text for page content results section (e.g., 'On this page')",
		}),
		defineField({
			name: "commandMenuPatternsHeading",
			type: "string",
			title: "Command Menu Patterns Heading",
			description: "Heading text for patterns section (e.g., 'Patterns')",
		}),
		defineField({
			name: "commandMenuSolutionsHeading",
			type: "string",
			title: "Command Menu Solutions Heading",
			description: "Heading text for solutions section (e.g., 'Solutions')",
		}),
		defineField({
			name: "commandMenuResourcesHeading",
			type: "string",
			title: "Command Menu Resources Heading",
			description: "Heading text for resources section (e.g., 'Resources')",
		}),
		defineField({
			name: "commandMenuTagsHeading",
			type: "string",
			title: "Command Menu Tags Heading",
			description: "Heading text for tags section (e.g., 'Tags')",
		}),
		defineField({
			name: "commandMenuStatusText",
			type: "string",
			title: "Command Menu Status Text",
			description:
				"Status text prefix for current page. The page name will be automatically appended (e.g., 'You are on the')",
		}),
		defineField({
			name: "commandMenuNavigationLabel",
			type: "string",
			title: "Command Menu Navigation Label",
			description:
				"Label text for navigation keyboard shortcut hint (e.g., 'Navigation')",
		}),
		defineField({
			name: "commandMenuOpenResultLabel",
			type: "string",
			title: "Command Menu Open Result Label",
			description:
				"Label text for open result keyboard shortcut hint (e.g., 'Open result')",
		}),
		defineField({
			name: "commandMenuInPatternText",
			type: "string",
			title: "Command Menu 'In Pattern' Text",
			description:
				"Text template showing pattern context. The pattern name will be automatically inserted (e.g., 'in')",
		}),
		defineField({
			name: "commandMenuPatternCountText",
			type: "string",
			title: "Command Menu Pattern Count Text",
			description:
				"Text template for pattern count. The count number and plural form will be automatically inserted (e.g., 'pattern' or 'patterns')",
		}),
		defineField({
			name: "commandMenuMatchInTitleTooltip",
			type: "string",
			title: "Command Menu Match In Title Tooltip",
			description:
				"Tooltip text for match indicator in title (e.g., 'Match in title')",
		}),
		defineField({
			name: "commandMenuMatchInDescriptionTooltip",
			type: "string",
			title: "Command Menu Match In Description Tooltip",
			description:
				"Tooltip text for match indicator in description (e.g., 'Match in description')",
		}),
		defineField({
			name: "commandMenuMatchInTagTooltip",
			type: "string",
			title: "Command Menu Match In Tag Tooltip",
			description:
				"Tooltip text for match indicator in tag name (e.g., 'Match in tag name')",
		}),
		defineField({
			name: "resultsHeaderResultText",
			type: "string",
			title: "Results Header Result Text (Singular)",
			description: "Text for singular result count (e.g., 'result')",
		}),
		defineField({
			name: "resultsHeaderResultsText",
			type: "string",
			title: "Results Header Results Text (Plural)",
			description: "Text for plural result count (e.g., 'results')",
		}),
		defineField({
			name: "resultsHeaderForText",
			type: "string",
			title: "Results Header 'For' Text",
			description: "Text that appears before the search query (e.g., 'for')",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
