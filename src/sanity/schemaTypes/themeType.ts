import {AsteriskIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const themeType = defineType({
  name: 'theme',
  title: 'Theme',
  type: 'document',
  icon: AsteriskIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
})
