import {defineQuery} from 'next-sanity'

export const PATTERNS_QUERY = defineQuery(`*[_type == "pattern" && defined(slug.current)][]{
  _id, title, slug
}`)

export const PATTERN_QUERY = defineQuery(`*[_type == "pattern" && slug.current == $slug][0]{
  title, body, slug
}`)
