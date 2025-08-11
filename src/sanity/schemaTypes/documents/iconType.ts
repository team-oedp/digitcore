import { SparkleIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const iconType = defineType({
	name: "icon",
	title: "Icon",
	type: "document",
	icon: SparkleIcon,
	fields: [
		defineField({
			name: "title",
			title: "Title",
			type: "string",
			description: "Human-friendly name for this icon",
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: "svg",
			title: "SVG",
			type: "image",
			description: "Upload an SVG file to represent this icon.",
			options: {
				accept: ".svg",
			},
			validation: (Rule) =>
				Rule.custom((file) => {
					if (!file) return true; // optional
					const ref = file?.asset?._ref;
					if (ref && !ref.endsWith("-svg")) {
						return "Please upload an SVG file only";
					}
					return true;
				}),
		}),
	],
	preview: {
		select: {
			title: "title",
			image: "svg",
		},
		prepare(selection) {
			const { title, image } = selection as {
				title?: string;
				image?: any;
			};
			return {
				title: title || "Icon (SVG)",
				media: image?.asset?._ref ? image : SparkleIcon,
			};
		},
	},
});
