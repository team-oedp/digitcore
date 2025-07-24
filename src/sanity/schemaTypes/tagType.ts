import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const tagType = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) =>
        Rule.required().custom(async (title, context) => {
          if (!title) return true

          const {document, getClient} = context
          const client = getClient({apiVersion: '2023-05-03'})
          const id = document?._id?.replace(/^drafts\./, '')

          const query = '*[_type == "tag" && title == $title && _id != $id][0]'
          const params = {title, id}
          const existing = await client.fetch(query, params)

          return existing ? 'A tag with this title already exists' : true
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const {title} = selection
      return {
        title: title ? title.charAt(0).toUpperCase() + title.slice(1).toLowerCase() : 'Untitled',
      }
    },
  },
})
