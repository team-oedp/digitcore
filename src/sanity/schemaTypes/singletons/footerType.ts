import { LinkIcon, StackCompactIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const footerType = defineType({
	name: "footer",
	title: "Footer",
	type: "document",
	icon: StackCompactIcon,
	groups: [
		{ name: "externalLinks", title: "External links" },
		{ name: "internalLinks", title: "Internal links" },
	],
	fields: [
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
			name: "externalLinks",
			title: "External links",
			type: "array",
			group: "externalLinks",
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
							name: "linkType",
							title: "Link Type",
							type: "string",
							initialValue: "url",
							options: {
								list: [
									{ title: "URL", value: "url" },
									{ title: "Email", value: "email" },
								],
								layout: "radio",
							},
						},
						{
							name: "url",
							title: "URL",
							type: "url",
							hidden: ({ parent }) => parent?.linkType !== "url",
							validation: (Rule) =>
								Rule.custom((value, context) => {
									const parent = context.parent as { linkType?: string };
									if (parent?.linkType === "url" && !value) {
										return "URL is required when Link Type is URL";
									}
									return true;
								}),
						},
						{
							name: "email",
							title: "Email",
							type: "email",
							hidden: ({ parent }) => parent?.linkType !== "email",
							validation: (Rule) =>
								Rule.custom((value, context) => {
									const parent = context.parent as { linkType?: string };
									if (parent?.linkType === "email" && !value) {
										return "Email is required when Link Type is Email";
									}
									return true;
								}),
						},
					],
					preview: {
						select: {
							title: "label",
							url: "url",
							email: "email",
							linkType: "linkType",
						},
						prepare(selection) {
							const { title, url, email, linkType } = selection;
							return {
								title,
								subtitle: linkType === "email" ? email : url,
							};
						},
					},
				},
			],
		}),
		defineField({
			name: "internalLinks",
			title: "Internal links",
			type: "array",
			group: "internalLinks",
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
			name: "license",
			title: "License",
			type: "blockContent",
		}),
	],
	preview: {
		select: {
			title: "title",
		},
	},
});
