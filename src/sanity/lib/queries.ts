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
      solution[]->{...},
    },
  }`);

export const PATTERN_QUERY =
	defineQuery(`*[_type == "pattern" && slug.current == $slug][0]{
    ...,
    title,
    description,
    "slug": slug.current,
    tags[]->{...},
    audiences[]->{...},
    themes[]->{...},
    solutions[]->{
      ...,
      audiences[]->{ _id, title }
    },
    resources[]->{
      ...,
      solution[]->{...},
    },
  }`);

export const PATTERN_PAGES_SLUGS_QUERY =
	defineQuery(`*[_type == "pattern" && defined(slug.current)]{
    "slug": slug.current
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
    themes[]->{
      _id,
      title,
      description
    },
    solutions[]->,
    resources[]->{
      ...,
      solution[]->{...},
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
      themes[]->{
        _id,
        title,
        description
      },
      solutions[]->,
      resources[]->{
        ...,
        solution[]->{...},
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
  // Apply search scoring with both exact and partial matching
  | score(
      // Exact matches get highest scores
      boost(title match $searchTerm, 10),
      boost(pt::text(description) match $searchTerm, 8),
      // Partial/prefix matches get lower scores
      boost(title match ($searchTerm + "*"), 6),
      boost(pt::text(description) match ($searchTerm + "*"), 4),
      // Basic scoring for any match
      title match ($searchTerm + "*"),
      pt::text(description) match ($searchTerm + "*")
    )
  // Filter out results with very low relevance scores
  [_score > 0]
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
