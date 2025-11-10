import { BasketIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const carrierBagType = defineType({
	name: "carrierBag",
	title: "Carrier Bag",
	type: "document",
	icon: BasketIcon,
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
			type: "blockContent",
		}),
		defineField({
			name: "emptyStateMessage",
			type: "text",
			title: "Empty State Message",
			description: "Message displayed when the carrier bag is empty",
		}),
		defineField({
			name: "pdfButtonLabel",
			type: "string",
			title: "PDF Button Label",
			description: "Label text for the PDF export button",
		}),
		defineField({
			name: "jsonButtonLabel",
			type: "string",
			title: "JSON Button Label",
			description: "Label text for the JSON export button",
		}),
		defineField({
			name: "removeAllButtonLabel",
			type: "string",
			title: "Remove All Button Label",
			description: "Label text for the remove all items button",
		}),
		defineField({
			name: "utilitiesGroupLabel",
			type: "string",
			title: "Utilities Group Label",
			description: "Label for the utilities button group",
		}),
		defineField({
			name: "exportPdfButtonLabel",
			type: "string",
			title: "Export PDF Button Label",
			description: "Label text for the export patterns as PDF button",
		}),
		defineField({
			name: "generateLinkButtonLabel",
			type: "string",
			title: "Generate Link Button Label",
			description: "Label text for the generate link button",
		}),
		defineField({
			name: "shareToSocialsButtonLabel",
			type: "string",
			title: "Share To Socials Button Label",
			description: "Label text for the share to socials button",
		}),
		defineField({
			name: "downloadJsonButtonLabel",
			type: "string",
			title: "Download JSON Button Label",
			description: "Label text for the download list as JSON button",
		}),
		defineField({
			name: "closeCarrierBagButtonLabel",
			type: "string",
			title: "Close Carrier Bag Button Label",
			description: "Label text for the close carrier bag button",
		}),
		defineField({
			name: "applicationSectionLabel",
			type: "string",
			title: "Application Section Label",
			description: "Label for the application information section",
		}),
		defineField({
			name: "filtersLabel",
			type: "string",
			title: "Filters Label",
			description: "Label text for the filters section",
		}),
		defineField({
			name: "sortTitleAzLabel",
			type: "string",
			title: "Sort Title A-Z Label",
			description: "Label text for the sort by title A-Z option",
		}),
		defineField({
			name: "sortTitleZaLabel",
			type: "string",
			title: "Sort Title Z-A Label",
			description: "Label text for the sort by title Z-A option",
		}),
		defineField({
			name: "groupByThemeButtonLabel",
			type: "string",
			title: "Group By Theme Button Label",
			description: "Label text for the group by theme toggle button",
		}),
		defineField({
			name: "groupByThemeButtonLabelActive",
			type: "string",
			title: "Group By Theme Button Label (Active)",
			description:
				"Label text for the group by theme toggle button when active",
		}),
		defineField({
			name: "filterByTagsPlaceholder",
			type: "string",
			title: "Filter By Tags Placeholder",
			description: "Placeholder text for the filter by tags multi-select",
		}),
		defineField({
			name: "filterByTagsSearchPlaceholder",
			type: "string",
			title: "Filter By Tags Search Placeholder",
			description:
				"Search input placeholder text for the filter by tags dropdown",
		}),
		defineField({
			name: "filterByTagsEmptyMessage",
			type: "string",
			title: "Filter By Tags Empty Message",
			description: "Empty state message when no tags are found",
		}),
		defineField({
			name: "filterByTagsGroupHeading",
			type: "string",
			title: "Filter By Tags Group Heading",
			description: "Group heading text for the tags dropdown",
		}),
		defineField({
			name: "filterByAudiencesPlaceholder",
			type: "string",
			title: "Filter By Audiences Placeholder",
			description: "Placeholder text for the filter by audiences multi-select",
		}),
		defineField({
			name: "filterByAudiencesSearchPlaceholder",
			type: "string",
			title: "Filter By Audiences Search Placeholder",
			description:
				"Search input placeholder text for the filter by audiences dropdown",
		}),
		defineField({
			name: "filterByAudiencesEmptyMessage",
			type: "string",
			title: "Filter By Audiences Empty Message",
			description: "Empty state message when no audiences are found",
		}),
		defineField({
			name: "filterByAudiencesGroupHeading",
			type: "string",
			title: "Filter By Audiences Group Heading",
			description: "Group heading text for the audiences dropdown",
		}),
		defineField({
			name: "clearAllButtonLabel",
			type: "string",
			title: "Clear All Button Label",
			description: "Label text for the clear all filters button",
		}),
		defineField({
			name: "savedItemsBadgeText",
			type: "string",
			title: "Saved Items Badge Text",
			description:
				"Text to display after the count in the saved items badge (e.g., 'saved items'). The count will be automatically prepended.",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
