import { TextIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";
/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export const blockContentType = defineType({
	title: "Block Content",
	name: "blockContent",
	type: "array",
	of: [
		defineArrayMember({
			type: "block",
			// Styles let you define what blocks can be marked up as. The default
			// set corresponds with HTML tags, but you can set any title or value
			// you want, and decide how you want to deal with it where you want to
			// use your content.
			styles: [
				{ title: "Normal", value: "normal" },
				{ title: "H1", value: "h1" },
				{ title: "H2", value: "h2" },
				{ title: "H3", value: "h3" },
				{ title: "H4", value: "h4" },
				{ title: "Quote", value: "blockquote" },
			],
			lists: [{ title: "Bullet", value: "bullet" }],
			// Marks let you mark up inline text in the Portable Text Editor
			marks: {
				// Decorators usually describe a single property – e.g. a typographic
				// preference or highlighting
				decorators: [
					{ title: "Strong", value: "strong" },
					{ title: "Emphasis", value: "em" },
				],
				// Annotations can be any object structure – e.g. a link or a footnote.
				annotations: [
					// Glossary term annotation: lets editors explicitly mark a term and reference a glossary doc
					{
						name: "glossaryTerm",
						type: "object",
						title: "Glossary Term",
						icon: TextIcon,
						fields: [
							defineField({
								name: "glossary",
								title: "Glossary Term",
								type: "reference",
								to: [{ type: "glossary" }],
								validation: (Rule) => Rule.required(),
							}),
						],
					},
					{
						name: "link",
						type: "object",
						title: "Link",
						fields: [
							defineField({
								name: "linkType",
								title: "Link Type",
								type: "string",
								initialValue: "href",
								options: {
									list: [
										{ title: "URL", value: "href" },
										{ title: "Page", value: "page" },
										{ title: "Pattern", value: "pattern" },
										{ title: "Orientation", value: "onboarding" },
									],
									layout: "radio",
								},
							}),
							defineField({
								name: "href",
								title: "URL",
								type: "url",
								hidden: ({ parent }) =>
									parent?.linkType !== "href" && parent?.linkType != null,
								validation: (Rule) =>
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
									Rule.custom((value, context) => {
										const parent = context.parent as { linkType?: string };
										if (parent?.linkType === "pattern" && !value) {
											return "Pattern reference is required when Link Type is a Pattern";
										}
										return true;
									}),
							}),
							defineField({
								name: "openInNewTab",
								title: "Open in new tab",
								type: "boolean",
								initialValue: false,
							}),
						],
					},
				],
			},
		}),
		// You can add additional types here. Note that you can't use
		// primitive types such as 'string' and 'number' in the same array
		// as a block type.
	],
});
