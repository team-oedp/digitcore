import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
	name: "siteSettings",
	title: "Site Settings",
	type: "document",
	icon: CogIcon,
	groups: [
		{
			name: "general",
			title: "General",
			default: true,
		},
		{
			name: "seo",
			title: "SEO",
		},
		{
			name: "social",
			title: "Social Media",
		},
		{
			name: "contact",
			title: "Contact",
		},
		{
			name: "analytics",
			title: "Analytics",
		},
	],
	fields: [
    defineField({
      // should match 'languageField' plugin configuration setting in sanity.config.ts, if customized
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
		// General Settings
		defineField({
			name: "title",
			title: "Site Title",
			type: "string",
			group: "general",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "description",
			title: "Site Description",
			type: "text",
			group: "general",
			rows: 3,
		}),
		defineField({
			name: "logo",
			title: "Site Logo",
			type: "image",
			group: "general",
			options: {
				hotspot: true,
			},
		}),
		defineField({
			name: "favicon",
			title: "Favicon",
			type: "image",
			group: "general",
			description: "Upload a 32x32px or 16x16px favicon",
		}),
		defineField({
			name: "url",
			title: "Site URL",
			type: "url",
			group: "general",
			description:
				"The main URL for your site (used for SEO and social sharing)",
		}),

		// SEO Settings
		defineField({
			name: "seoTitle",
			title: "Default SEO Title",
			type: "string",
			group: "seo",
			description: "Fallback title for pages without specific SEO titles",
		}),
		defineField({
			name: "seoDescription",
			title: "Default SEO Description",
			type: "text",
			group: "seo",
			rows: 3,
			validation: (Rule) => Rule.max(160),
			description:
				"Fallback meta description for pages without specific SEO descriptions",
		}),
		defineField({
			name: "seoImage",
			title: "Default SEO Image",
			type: "image",
			group: ["seo", "social"],
			options: {
				hotspot: true,
			},
			description: "Default image for social sharing (recommended: 1200x630px)",
		}),
		defineField({
			name: "keywords",
			title: "Default Keywords",
			type: "array",
			group: "seo",
			of: [{ type: "string" }],
			options: {
				layout: "tags",
			},
		}),

		// Social Media Settings
		defineField({
			name: "socialMedia",
			title: "Social Media Links",
			type: "object",
			group: "social",
			fields: [
				{ name: "facebook", title: "Facebook", type: "url" },
				{ name: "twitter", title: "Twitter/X", type: "url" },
				{ name: "instagram", title: "Instagram", type: "url" },
				{ name: "linkedin", title: "LinkedIn", type: "url" },
				{ name: "youtube", title: "YouTube", type: "url" },
				{ name: "github", title: "GitHub", type: "url" },
			],
		}),
		defineField({
			name: "openGraph",
			title: "Open Graph Settings",
			type: "object",
			group: "social",
			fields: [
				{
					name: "siteName",
					title: "Site Name",
					type: "string",
					description: "The name of your site (for Open Graph)",
				},
				{
					name: "twitterHandle",
					title: "Twitter Handle",
					type: "string",
					description: "Your Twitter username (without @)",
				},
			],
		}),

		// Contact Information
		defineField({
			name: "contact",
			title: "Contact Information",
			type: "object",
			group: "contact",
			fields: [
				{ name: "email", title: "Email", type: "email" },
				{ name: "phone", title: "Phone", type: "string" },
				{
					name: "address",
					title: "Address",
					type: "object",
					fields: [
						{ name: "street", title: "Street Address", type: "string" },
						{ name: "city", title: "City", type: "string" },
						{ name: "state", title: "State/Province", type: "string" },
						{ name: "zipCode", title: "ZIP/Postal Code", type: "string" },
						{ name: "country", title: "Country", type: "string" },
					],
				},
			],
		}),

		// Analytics Settings
		defineField({
			name: "analytics",
			title: "Analytics Settings",
			type: "object",
			group: "analytics",
			fields: [
				{
					name: "googleAnalyticsId",
					title: "Google Analytics ID",
					type: "string",
					description:
						"Your Google Analytics measurement ID (e.g., G-XXXXXXXXXX)",
				},
				{
					name: "googleTagManagerId",
					title: "Google Tag Manager ID",
					type: "string",
					description:
						"Your Google Tag Manager container ID (e.g., GTM-XXXXXXX)",
				},
				{
					name: "facebookPixelId",
					title: "Facebook Pixel ID",
					type: "string",
					description: "Your Facebook Pixel ID",
				},
			],
		}),

		// Additional Settings
		defineField({
			name: "maintenanceMode",
			title: "Maintenance Mode",
			type: "boolean",
			group: "general",
			description: "Enable to show a maintenance page to visitors",
			initialValue: false,
		}),
		defineField({
			name: "maintenanceMessage",
			title: "Maintenance Message",
			type: "blockContent",
			group: "general",
			description: "Message to show when maintenance mode is enabled",
			hidden: ({ document }) => !document?.maintenanceMode,
		}),
	],
	preview: {
		select: {
			title: "title",
			subtitle: "description",
			media: "logo",
		},
	},
});
