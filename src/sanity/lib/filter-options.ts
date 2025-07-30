import { defineQuery } from "next-sanity";

// Query to fetch all available audiences
export const AUDIENCES_QUERY = defineQuery(`
  *[_type == "audience"] | order(title asc) {
    _id,
    title,
    "value": _id,
    "label": title
  }
`);

// Query to fetch all available themes
export const THEMES_QUERY = defineQuery(`
  *[_type == "theme"] | order(title asc) {
    _id,
    title,
    "value": _id,
    "label": title
  }
`);

// Query to fetch all available tags
export const TAGS_QUERY = defineQuery(`
  *[_type == "tag"] | order(title asc) {
    _id,
    title,
    "value": _id,
    "label": title
  }
`);

// Combined query to fetch all filter options
export const FILTER_OPTIONS_QUERY = defineQuery(`
  {
    "audiences": *[_type == "audience"] | order(title asc) {
      _id,
      title,
      "value": _id,
      "label": title
    },
    "themes": *[_type == "theme"] | order(title asc) {
      _id,
      title,
      "value": _id,
      "label": title
    },
    "tags": *[_type == "tag"] | order(title asc) {
      _id,
      title,
      "value": _id,
      "label": title
    }
  }
`);
