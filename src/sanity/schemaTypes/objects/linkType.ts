import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Link schema object. This link object lets the user first select the type of link and then
 * then enter the URL, page reference, or pattern reference - depending on the type selected.
 * Learn more: https://www.sanity.io/docs/object-type
 */

export const linkType = defineType({
	name: "link",
	title: "Link",
	type: "object",
	icon: LinkIcon,
	fields: [
		defineField({
			name: "label",
			title: "Link Label",
			type: "string",
			description: "Text to display for this link",
		}),
		defineField({
			name: "linkType",
			title: "Link Type",
			type: "string",
			initialValue: "url",
			options: {
				list: [
					{ title: "URL", value: "href" },
					{ title: "Page", value: "page" },
					{ title: "Pattern", value: "pattern" },
					{ title: "Orientation", value: "orientation" },
				],
				layout: "radio",
			},
		}),
		defineField({
			name: "href",
			title: "URL",
			type: "url",
			hidden: ({ parent }: { parent?: { linkType?: string } }) =>
				parent?.linkType !== "href",
			validation: (Rule) =>
				// Custom validation to ensure URL is provided if the link type is 'href'
				Rule.custom((value, context) => {
					const parent = context.parent as { linkType?: string };
					if (parent?.linkType === "href" && !value) {
						return "URL is required when Link Type is URL";
					}
					return true;
				}),
		}),
		defineField({
			name: "page",
			title: "Page",
			type: "reference",
			to: [{ type: "page" }],
			hidden: ({ parent }) => parent?.linkType !== "page",
			validation: (Rule) =>
				// Custom validation to ensure page reference is provided if the link type is 'page'
				Rule.custom((value, context) => {
					const parent = context.parent as { linkType?: string };
					if (parent?.linkType === "page" && !value) {
						return "Page reference is required when Link Type is Page";
					}
					return true;
				}),
		}),
		defineField({
			name: "pattern",
			title: "Pattern",
			type: "reference",
			to: [{ type: "pattern" }],
			hidden: ({ parent }) => parent?.linkType !== "pattern",
			validation: (Rule) =>
				// Custom validation to ensure pattern reference is provided if the link type is 'pattern'
				Rule.custom((value, context) => {
					const parent = context.parent as { linkType?: string };
					if (parent?.linkType === "pattern" && !value) {
						return "Pattern reference is required when Link Type is Pattern";
					}
					return true;
				}),
		}),
	],
});
