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
    tags[]->{...},
	    audiences[]->{...},
	    theme->{...},
    solutions[]->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      description,
      audiences[]->{ _id, title }
    },
    resources[]->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      description,
      links,
      solutions[]->{...},
    },
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

export const GLOSSARY_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'glossary'][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    description,
  }`);

export const GLOSSARY_TERMS_QUERY = defineQuery(`
  *[_type == "glossary"] | order(title asc) {
    _id,
    title,
    description
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

// Enhanced search query with comprehensive content type support
export const PATTERN_SEARCH_QUERY = defineQuery(`
  *[_type == "pattern" && defined(slug.current)
    // Apply audience filter if provided
    && (!defined($audiences) || count($audiences) == 0 || count((audiences[]._ref)[@ in $audiences]) > 0)
    // Apply theme filter if provided  
    && (!defined($themes) || count($themes) == 0 || theme._ref in $themes)
    // Apply tags filter if provided
    && (!defined($tags) || count($tags) == 0 || count((tags[]._ref)[@ in $tags]) > 0)
  ]
  // Enhanced search scoring across relevant fields
  | score(
      // Primary content scoring (highest priority)
      boost(title match $searchTerm, 15),
      boost(pt::text(description) match $searchTerm, 12),
      
      // Partial/prefix matches (lower scores)
      boost(title match ($searchTerm + "*"), 8),
      boost(pt::text(description) match ($searchTerm + "*"), 6),
      
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
    theme->{
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

// Direct solution search query
export const SOLUTION_SEARCH_QUERY = defineQuery(`
  *[_type == "solution"]
  | score(
      // Exact matches get highest scores
      boost(title match $searchTerm, 12),
      boost(pt::text(description) match $searchTerm, 10),
      
      // Partial matches
      boost(title match ($searchTerm + "*"), 8),
      boost(pt::text(description) match ($searchTerm + "*"), 6),
      
      // Basic scoring
      title match ($searchTerm + "*"),
      pt::text(description) match ($searchTerm + "*")
    )
  [_score > 0]
  | order(_score desc, title asc)
  {
    _id,
    _type,
    _score,
    title,
    description,
    audiences[]->{
      _id,
      title
    },
    // Find parent patterns for navigation
    "patterns": *[_type == "pattern" && references(^._id) && defined(slug.current)]{
      _id,
      title,
      "slug": slug.current
    }[0...3]
  }
`);

// Direct resource search query
export const RESOURCE_SEARCH_QUERY = defineQuery(`
  *[_type == "resource"]
  | score(
      // Exact matches get highest scores
      boost(title match $searchTerm, 12),
      boost(pt::text(description) match $searchTerm, 10),
      
      // Partial matches
      boost(title match ($searchTerm + "*"), 8),
      boost(pt::text(description) match ($searchTerm + "*"), 6),
      
      // Basic scoring
      title match ($searchTerm + "*"),
      pt::text(description) match ($searchTerm + "*")
    )
  [_score > 0]
  | order(_score desc, title asc)
  {
    _id,
    _type,
    _score,
    title,
    description,
    links,
    solutions[]->{
      _id,
      title
    },
    // Find parent patterns for navigation
    "patterns": *[_type == "pattern" && references(^._id) && defined(slug.current)]{
      _id,
      title,
      "slug": slug.current
    }[0...3]
  }
`);

// Tag search query
export const TAG_SEARCH_QUERY = defineQuery(`
  *[_type == "tag" && title match ($searchTerm + "*")]
  | score(
      boost(title match $searchTerm, 15),
      boost(title match ($searchTerm + "*"), 10),
      title match ($searchTerm + "*")
    )
  [_score > 0]
  | order(_score desc, title asc)
  {
    _id,
    _type,
    _score,
    title,
    // Find patterns that use this tag
    "patterns": *[_type == "pattern" && references(^._id) && defined(slug.current)]{
      _id,
      title,
      "slug": slug.current
    }[0...5]
  }
`);

// Simple pattern search query for command modal (no filters)
export const PATTERN_SIMPLE_SEARCH_QUERY = defineQuery(`
  *[_type == "pattern" && defined(slug.current)]
  | score(
      // Primary content scoring (highest priority)
      boost(title match $searchTerm, 15),
      boost(pt::text(description) match $searchTerm, 12),
      
      // Partial/prefix matches (lower scores)
      boost(title match ($searchTerm + "*"), 8),
      boost(pt::text(description) match ($searchTerm + "*"), 6),
      
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
    theme->{
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
    && (!defined($themes) || count($themes) == 0 || theme._ref in $themes)
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
    theme->{
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

export const ONBOARDING_QUERY = defineQuery(`
  *[_type == 'onboarding'][0]{
    _id,
    _type,
    title,
    description,
  }
`);

export const TAGS_WITH_PATTERNS_QUERY = defineQuery(`
  *[_type == "tag"] | order(title asc) {
    _id,
    title,
    "patterns": *[_type == "pattern" && references(^._id) && defined(slug.current)] | order(title asc) {
      _id,
      title,
      "slug": slug.current
    }
  }[count(patterns) > 0]
`);

export const TAGS_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'tags'][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    description,
    content[]
  }
`);

export const CARRIER_BAG_QUERY = defineQuery(`
  *[_type == 'carrierBag'][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    information,
  }
`);

// Fetch patterns by an array of slugs with references needed for carrier bag
export const PATTERNS_BY_SLUGS_QUERY = defineQuery(`
  *[_type == "pattern" && defined(slug.current) && slug.current in $slugs]{
    ...,
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
    solutions[]->{
      _id,
      _type,
      title,
      description,
      audiences[]->{ _id, title }
    },
    resources[]->{
      _id,
      _type,
      title,
      description,
      links,
      solutions[]->{ _id, title }
    }
  }
`);

export const VALUES_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'values'][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    description,
    content[]
  }
`);

export const PATTERNS_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'patterns'][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    description,
    content[]
  }
`);

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'about'][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    description,
    content[]
  }
`);

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == '/'][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    description,
    content[]
  }
`);

export const FAQ_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'frequently-asked-questions'][0]{
    _id,
    _type,
    title,
    "slug": slug.current,
    description,
    content[]
  }
`);

export const FAQS_QUERY = defineQuery(`
  *[_type == "faq"] | order(_createdAt asc) {
    _id,
    title,
    description
  }
`);

export const ICONS_QUERY = defineQuery(`
  *[_type == "icon"] | order(title asc) {
    _id,
    _type,
    title,
    svg
  }
`);
