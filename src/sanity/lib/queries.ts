import { defineQuery } from "next-sanity";

export const PATTERNS_QUERY =
	defineQuery(`*[_type == "pattern" && defined(slug.current)][]{
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    tags[]->,
    audiences[]->,
    themes[]->,
    solutions[]->,
    resources[]->{
      ...,
      solutions[]->{...},
    },
  }`);

export const PATTERN_QUERY =
	defineQuery(`*[_type == "pattern" && slug.current == $slug][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    description,
    "slug": slug.current,
    tags[]->{
      _id,
      _type,
      title
    },
    audiences[]->{
      _id,
      _type,
      title,
      description
    },
    theme->{
      _id,
      _type,
      title
    },
    solutions[]->{
      _id,
      _type,
      title,
      description,
      audiences[]
    },
    resources[]->{
      _id,
      _type,
      title,
      description,
      links,
      "solutionRefs": solutions[]
    }
  }`);

export const PATTERN_PAGES_SLUGS_QUERY =
	defineQuery(`*[_type == "pattern" && defined(slug.current)]{
    "slug": slug.current
  }`);

// Separate queries to avoid nested reference issues
export const PATTERN_BASE_QUERY =
	defineQuery(`*[_type == "pattern" && slug.current == $slug][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    description,
    "slug": slug.current,
    "tagIds": tags[]._ref,
    "audienceIds": audiences[]._ref,
    "themeId": theme._ref,
    "solutionIds": solutions[]._ref,
    "resourceIds": resources[]._ref
  }`);

export const SOLUTIONS_BY_IDS_QUERY =
	defineQuery(`*[_type == "solution" && _id in $ids]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    description,
    audiences[]->{
      _id,
      _type,
      title
    }
  }`);

export const RESOURCES_BY_IDS_QUERY =
	defineQuery(`*[_type == "resource" && _id in $ids]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    description,
    links,
    "solutionIds": solutions[]._ref
  }`);

export const TAGS_BY_IDS_QUERY = defineQuery(`*[_type == "tag" && _id in $ids]{
    _id,
    _type,
    title
  }`);

export const AUDIENCES_BY_IDS_QUERY =
	defineQuery(`*[_type == "audience" && _id in $ids]{
    _id,
    _type,
    title,
    description
  }`);

export const THEME_BY_ID_QUERY =
	defineQuery(`*[_type == "theme" && _id == $id][0]{
    _id,
    _type,
    title
  }`);

export const SLUGS_BY_TYPE_QUERY =
	defineQuery(`*[_type == $type && defined(slug.current)]{
    "slug": slug.current
  }`);

export const PAGES_SLUGS_QUERY =
	defineQuery(`*[_type == "page" && defined(slug.current)]{
    "slug": slug.current
  }`);

export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    description,
  }`);

export const SEARCH_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'search'][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    description,
  }`);

export const PATTERNS_WITH_THEMES_QUERY = defineQuery(`
  *[_type == "pattern" && defined(slug.current)][]{
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    tags[]->,
    audiences[]->{
      _id,
      title
    },
    theme->{
      _id,
      title,
      description
    },
    solutions[]->,
    resources[]->{
      ...,
      solutions[]->{...},
    },
  }`);

export const PATTERNS_GROUPED_BY_THEME_QUERY = defineQuery(`
  *[_type == "theme" && defined(_id)] | order(title asc) {
    _id,
    title,
    description,
    "patterns": *[_type == "pattern" && defined(slug.current) && references(^._id)] {
      _id,
      _type,
      title,
      description,
      "slug": slug.current,
      tags[]->,
      audiences[]->{
        _id,
        title
      },
      theme->{
        _id,
        title,
        description
      },
      solutions[]->,
      resources[]->{
        ...,
        solutions[]->{...},
      },
    }
  }[count(patterns) > 0]
`);

// Search query with scoring and filtering
export const PATTERN_SEARCH_QUERY = defineQuery(`
  *[_type == "pattern" && defined(slug.current)
    // Apply audience filter if provided
    && (!defined($audiences) || count($audiences) == 0 || count((audiences[]._ref)[@ in $audiences]) > 0)
    // Apply theme filter if provided  
    && (!defined($themes) || count($themes) == 0 || count((themes[]._ref)[@ in $themes]) > 0)
    // Apply tags filter if provided
    && (!defined($tags) || count($tags) == 0 || count((tags[]._ref)[@ in $tags]) > 0)
  ]
  // Apply search scoring if search term is provided
  | score(
      boost(title match $searchTerm + "*", 5),
      boost(title match $searchTerm, 4), 
      boost(pt::text(description) match $searchTerm + "*", 3),
      boost(pt::text(description) match $searchTerm, 2)
    )
  // Order by relevance score, then by title
  | order(_score desc, title asc)
  {
    _id,
    _type,
    _score,
    title,
    description,
    "slug": slug.current,
    tags[]->{
      _id,
      title
    },
    audiences[]->{
      _id,
      title
    },
    themes[]->{
      _id,
      title,
      description
    },
    solutions[]->{
      _id,
      title,
      description
    },
    resources[]->{
      _id,
      title,
      description,
      solution[]->{
        _id,
        title
      }
    }
  }
`);

// Simple query without scoring for when there's no search term
export const PATTERN_FILTER_QUERY = defineQuery(`
  *[_type == "pattern" && defined(slug.current)
    // Apply audience filter if provided
    && (!defined($audiences) || count($audiences) == 0 || count((audiences[]._ref)[@ in $audiences]) > 0)
    // Apply theme filter if provided  
    && (!defined($themes) || count($themes) == 0 || count((themes[]._ref)[@ in $themes]) > 0)
    // Apply tags filter if provided
    && (!defined($tags) || count($tags) == 0 || count((tags[]._ref)[@ in $tags]) > 0)
  ]
  // Order by title only
  | order(title asc)
  {
    _id,
    _type,
    title,
    description,
    "slug": slug.current,
    tags[]->{
      _id,
      title
    },
    audiences[]->{
      _id,
      title
    },
    themes[]->{
      _id,
      title,
      description
    },
    solutions[]->{
      _id,
      title,
      description
    },
    resources[]->{
      _id,
      title,
      description,
      solution[]->{
        _id,
        title
      }
    }
  }
`);
