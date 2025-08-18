import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const tagType = defineType({
	name: "tag",
	title: "Tag",
	type: "document",
	icon: TagIcon,
	fields: [
		defineField({
			name: "title",
			type: "string",
			validation: (Rule) =>
				Rule.required().custom(async (title, context) => {
					if (!title) return true;

					const { document, getClient } = context;
					const client = getClient({ apiVersion: "2025-07-23" });
					
					// Get the current document ID (could be draft or published)
					const currentId = document?._id;
					if (!currentId) {
						// For new documents, just check if any document with this title exists
						const query = '*[_type == "tag" && title == $title][0]';
						const existing = await client.fetch(query, { title });
						return existing ? `A tag with this title already exists` : true;
					}
					
					// For existing documents, exclude both draft and published versions of the same document
					const baseId = currentId.replace(/^drafts\./, "");
					const draftId = `drafts.${baseId}`;
					
					const query = '*[_type == "tag" && title == $title && _id != $currentId && _id != $baseId && _id != $draftId][0]';
					const params = { title, currentId, baseId, draftId };
					
					const existing = await client.fetch(query, params);
					return existing ? `A tag with this title already exists` : true;
				}),
		}),
	],
	preview: {
		select: {
			title: "title",
		},
		prepare(selection) {
			const { title } = selection;
			return {
				title: title
					? title.charAt(0).toUpperCase() + title.slice(1).toLowerCase()
					: "Untitled",
			};
		},
	},
});
