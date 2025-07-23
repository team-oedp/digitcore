import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const patternType = defineType({
  name: 'pattern',
  title: 'Pattern',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
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
    defineField({
      name: 'tags',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'tag'}})],
    }),
    defineField({
      name: 'audiences',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'audience'}})],
    }),
    defineField({
      name: 'themes',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: {type: 'theme'}})],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      tagTitles: 'tags[].title',
    },
    prepare(selection) {
      const {title, tagTitles} = selection
      return {
        title,
        subtitle: Array.isArray(tagTitles) && tagTitles.length > 0 ? tagTitles.join(', ') : '',
      }
    },
  },
})
