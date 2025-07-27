import { defineQuery } from "next-sanity";

export const PATTERNS_QUERY =
	defineQuery(`*[_type == "pattern" && defined(slug.current)][]{
    _id,
    title,
    "slug": slug.current,
  }`);

export const PATTERN_QUERY =
	defineQuery(`*[_type == "pattern" && slug.current == $slug][0]{
    title,
    description,
    "slug": slug.current,
    tags[]->,
    audiences[]->,
    themes[]->,
    solutions[]->,
    resources[]->,
  }`);

export const PATTERN_PAGES_SLUGS_QUERY =
	defineQuery(`*[_type == "pattern" && defined(slug.current)]{
    "slug": slug.current
  }`);

export const PAGES_SLUGS_QUERY =
	defineQuery(`*[_type == "page" && defined(slug.current)]{
    "slug": slug.current
  }`);

export const SLUGS_BY_TYPE_QUERY =
	defineQuery(`*[_type == $type && defined(slug.current)]{
    "slug": slug.current
  }`);
