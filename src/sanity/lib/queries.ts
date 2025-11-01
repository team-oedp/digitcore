import { defineQuery } from "next-sanity";

// Site settings (SEO + Social) singletons
export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]{
  title,
  description,
  url,
  seoTitle,
  seoDescription,
  "seoImage": seoImage.asset->url,
  keywords,
  openGraph{ siteName, twitterHandle },
}`);

export const PATTERNS_QUERY =
	defineQuery(`*[_type == "pattern" && defined(slug.current) && language == $language][]{
    _id,
    _type,
    title,
    language,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    "descriptionPlainText": pt::text(description),
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
	defineQuery(`*[_type == "pattern" && slug.current == $slug && language == $language][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    language,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    "descriptionPlainText": pt::text(description),
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
      description[]{
        ...,
        markDefs[]{
          ...,
          "page": page->slug.current,
          "pattern": pattern->slug.current,
          "glossary": glossary->{_id, title}
        }
      },
      audiences[]->{ _id, title }
    },
    resources[]->{
      _id,
      _type,
      _createdAt,
      _updatedAt,
      _rev,
      title,
      description[]{
        ...,
        markDefs[]{
          ...,
          "page": page->slug.current,
          "pattern": pattern->slug.current,
          "glossary": glossary->{_id, title}
        }
      },
      links,
      solutions[]->{...},
    },
  }`);

export const PATTERN_PAGES_SLUGS_QUERY =
	defineQuery(`*[_type == "pattern" && defined(slug.current) && language == $language]{
    "slug": slug.current
  }`);

// Separate queries to avoid nested reference issues
export const PATTERN_BASE_QUERY =
	defineQuery(`*[_type == "pattern" && slug.current == $slug && language == $language][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    description,
    language,
    "descriptionPlainText": pt::text(description),
    "slug": slug.current,
    "tagIds": tags[]._ref,
    "audienceIds": audiences[]._ref,
    "themeId": theme._ref,
    "solutionIds": solutions[]._ref,
    "resourceIds": resources[]._ref
  }`);

export const SOLUTIONS_BY_IDS_QUERY =
	defineQuery(`*[_type == "solution" && _id in $ids && language == $language]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    language,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    audiences[]->{
      _id,
      _type,
      title
    }
  }`);

export const RESOURCES_BY_IDS_QUERY =
	defineQuery(`*[_type == "resource" && _id in $ids && language == $language]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    language,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    links,
    "solutionIds": solutions[]._ref
  }`);

export const TAGS_BY_IDS_QUERY =
	defineQuery(`*[_type == "tag" && _id in $ids && language == $language]{
    _id,
    _type,
    title,
    language
  }`);

export const GLOSSARY_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'glossary' && language == $language][0]{
    _id,
    _type,
    title,
    language,
    "slug": slug.current,
    emptyStateMessage,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    "descriptionPlainText": pt::text(description),
  }`);

export const GLOSSARY_TERMS_QUERY = defineQuery(`
  *[_type == "glossary" && language == $language] | order(title asc) {
    _id,
    title,
    language,
    description
  }`);

export const AUDIENCES_BY_IDS_QUERY =
	defineQuery(`*[_type == "audience" && _id in $ids && language == $language]{
    _id,
    _type,
    title,
    language,
    description
  }`);

export const THEME_BY_ID_QUERY =
	defineQuery(`*[_type == "theme" && _id == $id && language == $language][0]{
    _id,
    _type,
    title,
    language
  }`);

export const SLUGS_BY_TYPE_QUERY =
	defineQuery(`*[_type == $type && defined(slug.current) && language == $language]{
    "slug": slug.current
  }`);

export const PAGES_SLUGS_QUERY =
	defineQuery(`*[_type == "page" && defined(slug.current) && language == $language]{
    "slug": slug.current
  }`);

export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == $slug && language == $language][0]{
    _id,
    _type,
    title,
    language,
    "slug": slug.current,
    emptyStateMessage,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    "descriptionPlainText": pt::text(description),
  }`);

export const SEARCH_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'search' && language == $language][0]{
    _id,
    _type,
    title,
    language,
    "slug": slug.current,
    emptyStateMessage,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    "descriptionPlainText": pt::text(description),
  }`);

export const PATTERNS_WITH_THEMES_QUERY = defineQuery(`
  *[_type == "pattern" && defined(slug.current) && language == $language][]{
    _id,
    _type,
    title,
    language,
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
      solutions[]->{
        _id,
        title
      }
    },
  }`);

export const PATTERNS_GROUPED_BY_THEME_QUERY = defineQuery(`
  *[_type == "theme" && defined(_id) && language == $language] | order(title asc) {
    _id,
    title,
    language,
    description,
    "patterns": *[_type == "pattern" && defined(slug.current) && references(^._id) && language == $language] {
      _id,
      _type,
      title,
      language,
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
  *[_type == "pattern" && defined(slug.current) && language == $language
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
    language,
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
      solutions[]->{
        _id,
        title
      }
    }
  }
`);

// Enhanced search query WITH preferences boosting
export const PATTERN_SEARCH_WITH_PREFERENCES_QUERY = defineQuery(`
  *[_type == "pattern" && defined(slug.current) && language == $language
    // Apply audience filter if provided
    && (!defined($audiences) || count($audiences) == 0 || count((audiences[]._ref)[@ in $audiences]) > 0)
    // Apply theme filter if provided  
    && (!defined($themes) || count($themes) == 0 || theme._ref in $themes)
    // Apply tags filter if provided
    && (!defined($tags) || count($tags) == 0 || count((tags[]._ref)[@ in $tags]) > 0)
  ]
  // Enhanced search scoring across relevant fields WITH preference boosting
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
  | order(
      count((audiences[]._ref)[@ in $prefAudiences]) desc,
      (theme._ref in $prefThemes) desc,
      _score desc,
      title asc
    )
  {
    _id,
    _type,
    _score,
    title,
    language,
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
      solutions[]->{
        _id,
        title
      }
    }
  }
`);

// Suggestions query: return items that match either audiences or theme
// Rank items that match both first, then by audience match count, then theme match, then title
export const PATTERN_SUGGESTIONS_WITH_PREFERENCES_QUERY = defineQuery(`
  *[
    _type == "pattern" &&
    defined(slug.current) &&
    language == $language &&
    (
      (defined($prefAudiences) && count($prefAudiences) > 0 && count((audiences[]._ref)[@ in $prefAudiences]) > 0) ||
      (defined($prefThemes) && count($prefThemes) > 0 && theme._ref in $prefThemes)
    )
  ]
  | order(
      (
        (defined($prefAudiences) && count($prefAudiences) > 0 && count((audiences[]._ref)[@ in $prefAudiences]) > 0) &&
        (defined($prefThemes) && count($prefThemes) > 0 && theme._ref in $prefThemes)
      ) desc,
      count((audiences[]._ref)[@ in $prefAudiences]) desc,
      (theme._ref in $prefThemes) desc,
      title asc
    )[0...$limit]{
    _id,
    _type,
    title,
    language,
    "slug": slug.current,
    description,
    tags[]->{ _id, title },
    audiences[]->{ _id, title },
    theme->{ _id, title, description }
  }
`);

// Direct solution search query
export const SOLUTION_SEARCH_QUERY = defineQuery(`
  *[_type == "solution" && language == $language]
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
    language,
    description,
    audiences[]->{
      _id,
      title
    },
    // Find parent patterns for navigation
    "patterns": *[_type == "pattern" && references(^._id) && defined(slug.current) && language == $language]{
      _id,
      title,
      "slug": slug.current
    }[0...3]
  }
`);

// Direct resource search query
export const RESOURCE_SEARCH_QUERY = defineQuery(`
  *[_type == "resource" && language == $language]
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
    language,
    description,
    links,
    solutions[]->{
      _id,
      title
    },
    // Find parent patterns for navigation
    "patterns": *[_type == "pattern" && references(^._id) && defined(slug.current) && language == $language]{
      _id,
      title,
      "slug": slug.current
    }[0...3]
  }
`);

// Tag search query
export const TAG_SEARCH_QUERY = defineQuery(`
  *[_type == "tag" && title match ($searchTerm + "*") && language == $language]
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
    language,
    // Find patterns that use this tag
    "patterns": *[_type == "pattern" && references(^._id) && defined(slug.current) && language == $language]{
      _id,
      title,
      "slug": slug.current
    }[0...5]
  }
`);

// Simple pattern search query for command modal (no filters)
export const PATTERN_SIMPLE_SEARCH_QUERY = defineQuery(`
  *[_type == "pattern" && defined(slug.current) && language == $language]
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
    language,
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
      solutions[]->{
        _id,
        title
      }
    }
  }
`);

// Simple query without scoring for when there's no search term
export const PATTERN_FILTER_QUERY = defineQuery(`
  *[_type == "pattern" && defined(slug.current) && language == $language
    // Apply audience filter if provided
    && (!defined($audiences) || count($audiences) == 0 || count((audiences[]._ref)[@ in $audiences]) > 0)
    // Apply theme filter if provided
    && (!defined($themes) || count($themes) == 0 || theme._ref in $themes)
    // Apply tags filter if provided
    && (!defined($tags) || count($tags) == 0 || count((tags[]._ref)[@ in $tags]) > 0)
  ]
  // Order by title (no scoring needed in filter-only mode)
  | order(title asc)
  {
    _id,
    _type,
    title,
    language,
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
      solutions[]->{
        _id,
        title
      }
    }
  }
`);

export const ONBOARDING_QUERY = defineQuery(`
  *[_type == 'onboarding' && language == $language][0]{
    _id,
    _type,
    title,
    language,
    description,
    skipLabel,
    backLabel,
    footerText,
    breadcrumbs,
    slide1{
      title,
      body,
      primaryCtaLabel,
      secondaryCtaText
    },
    slide2{
      title,
      body
    },
    slide3{
      title,
      body
    }
  }
`);

export const TAGS_WITH_PATTERNS_QUERY = defineQuery(`
  *[_type == "tag" && language == $language] | order(title asc) {
    _id,
    title,
    language,
    "patterns": *[_type == "pattern" && references(^._id) && defined(slug.current) && language == $language] | order(title asc) {
      _id,
      title,
      "slug": slug.current
    }
  }[count(patterns) > 0]
`);

export const TAGS_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'tags' && language == $language][0]{
    _id,
    _type,
    title,
    language,
    "slug": slug.current,
    emptyStateMessage,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current
      }
    },
    "descriptionPlainText": pt::text(description),
    content[]{
      _key,
      _type,
      heading,
      body[]{
        ...,
        markDefs[]{
          ...,
          "page": page->slug.current,
          "pattern": pattern->slug.current
        }
      },
      // For contentList type
      title,
      items[]{
        _key,
        title,
        description
      }
    }
  }
`);

export const CARRIER_BAG_QUERY = defineQuery(`
  *[_type == 'carrierBag' && language == $language][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    language,
    information,
    emptyStateMessage,
  }
`);

// Fetch patterns by an array of slugs with references needed for carrier bag
export const PATTERNS_BY_SLUGS_QUERY = defineQuery(`
  *[_type == "pattern" && defined(slug.current) && slug.current in $slugs && language == $language]{
    ...,
    _id,
    _type,
    title,
    language,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
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
  *[_type == 'page' && slug.current == 'values' && language == $language][0]{
    _id,
    _type,
    title,
    language,
    "slug": slug.current,
    emptyStateMessage,
    description[]{
      ...,
      markDefs[]{
          ...,
          "page": page->slug.current,
          "pattern": pattern->slug.current,
          "glossary": glossary->{_id, title}
        }
    },
    "descriptionPlainText": pt::text(description),
    content[]{
      _key,
      _type,
      heading,
      body[]{
        ...,
        markDefs[]{
          ...,
          "page": page->slug.current,
          "pattern": pattern->slug.current,
          "glossary": glossary->{_id, title}
        }
      },
      // For record type
      name,
      description[]{
        ...,
        markDefs[]{
          ...,
          "page": page->slug.current,
          "pattern": pattern->slug.current,
          "glossary": glossary->{_id, title}
        }
      },
      // For contentList type
      title,
      items[]{
        _key,
        title,
        description
      }
    }
  }
`);

export const PATTERNS_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'patterns' && language == $language][0]{
    _id,
    _type,
    title,
    language,
    "slug": slug.current,
    emptyStateMessage,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    "descriptionPlainText": pt::text(description),
    emptyStateMessage,
    content[]{
      _key,
      _type,
      heading,
      body[]{
        ...,
        markDefs[]{
          ...,
          "page": page->slug.current,
          "pattern": pattern->slug.current,
          "glossary": glossary->{_id, title}
        }
      },
      // For contentList type
      title,
      items[]{
        _key,
        title,
        description
      }
    }
  }
`);

export const ABOUT_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'about' && language == $language][0]{
    _id,
    _type,
    title,
    language,
    "slug": slug.current,
    emptyStateMessage,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    "descriptionPlainText": pt::text(description),
    content[]{
      _key,
      _type,
      heading,
      body[]{
        ...,
        markDefs[]{
          ...,
          "page": page->slug.current,
          "pattern": pattern->slug.current,
          "glossary": glossary->{_id, title}
        }
      },
      // For contentList type
      title,
      items[]{
        _key,
        title,
        description,
      }
    }
  }
`);

export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == '/' && language == $language][0]{
    _id,
    _type,
    title,
    heroHeading,
    language,
    "slug": slug.current,
    emptyStateMessage,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    "descriptionPlainText": pt::text(description),
    // Full content blocks, including contentList sections
    content[]{
      _key,
      _type,
      heading,
      body[]{
        ...,
        markDefs[]{
          ...,
          "page": page->slug.current,
          "pattern": pattern->slug.current,
          "glossary": glossary->{_id, title}
        }
      },
      // For contentList type
      title,
      items[]{
        _key,
        title,
        description
      }
    },
    // Convenience projections for specific content lists by title
    "audiences": content[_type == 'contentList' && title == 'Audiences'][0].items[]{
      _key,
      title,
      description
    },
    "values": content[_type == 'contentList' && title == 'Values'][0].items[]{
      _key,
      title,
      description
    }
  }
`);

export const FAQ_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'faq' && language == $language][0]{
    _id,
    _type,
    title,
    language,
    "slug": slug.current,
    emptyStateMessage,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    "descriptionPlainText": pt::text(description),
    content[]{
      _key,
      _type,
      heading,
      body[]{
        ...,
        markDefs[]{
          ...,
          "page": page->slug.current,
          "pattern": pattern->slug.current,
          "glossary": glossary->{_id, title}
        }
      },
      // For contentList type
      title,
      items[]{
        _key,
        title,
        description
      }
    }
  }
`);

export const FAQS_QUERY = defineQuery(`
  *[_type == "faq" && language == $language]|order(orderRank) {
    _id,
    title,
    language,
    category->{
      _id,
      title,
      description[]{
        ...,
      }
    },
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    }
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

export const ACKNOWLEDGEMENTS_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'acknowledgements' && language == $language][0]{
    _id,
    _type,
    title,
    language,
    "slug": slug.current,
    emptyStateMessage,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    "descriptionPlainText": pt::text(description),
    content[]{
      _key,
      _type,
      heading,
      body[]{
        ...,
        markDefs[]{
          ...,
          "page": page->slug.current,
          "pattern": pattern->slug.current,
          "glossary": glossary->{_id, title}
        }
      },
      title,
      items[]{
        _key,
        title,
        description
      },
      name,
      description
    }
  }
`);

export const THEMES_PAGE_QUERY = defineQuery(`
  *[_type == 'page' && slug.current == 'themes' && language == $language][0]{
    _id,
    _type,
    title,
    language,
    "slug": slug.current,
    emptyStateMessage,
    description[]{
      ...,
      markDefs[]{
        ...,
        "page": page->slug.current,
        "pattern": pattern->slug.current,
        "glossary": glossary->{_id, title}
      }
    },
    "descriptionPlainText": pt::text(description),
    content[]{
      _key,
      _type,
      heading,
      body[]{
        ...,
        markDefs[]{
          ...,
          "page": page->slug.current,
          "pattern": pattern->slug.current,
          "glossary": glossary->{_id, title}
        }
      },
      // For contentList type
      title,
      items[]{
        _key,
        title,
        description
      }
    }
  }
`);

export const FOOTER_QUERY = defineQuery(`
  *[_type == 'footer' && language == $language][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    language,
    externalLinks[]{
      _key,
      label,
      url
    },
    internalLinks[]{
      _key,
      label,
      page->{
        _id,
        _type,
        title,
        "slug": slug.current
      }
    },
    licenseLink
  }
`);

export const HEADER_QUERY = defineQuery(`
  *[_type == 'header' && language == $language][0]{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    title,
    language,
    internalLinks[]{
      _key,
      label,
      page->{
        _id,
        _type,
        title,
        "slug": slug.current
      }
    },
  }
`);

// Query to check if patterns in carrier bag are stale
export const PATTERNS_STALENESS_CHECK_QUERY = defineQuery(`
  *[_type == "pattern" && _id in $patternIds && language == $language]{
    _id,
    _updatedAt
  }
`);

// Type for staleness check query result
export type PatternStalenessResult = {
	_id: string;
	_updatedAt: string;
}[];

// Filter option queries
export const AUDIENCES_QUERY = defineQuery(`
  *[_type == "audience" && language == $language] | order(title asc) {
    _id,
    title,
    "value": _id,
    "label": title
  }
`);

export const THEMES_QUERY = defineQuery(`
  *[_type == "theme" && language == $language] | order(title asc) {
    _id,
    title,
    "value": _id,
    "label": title
  }
`);

export const TAGS_QUERY = defineQuery(`
  *[_type == "tag" && language == $language && count(*[_type == "pattern" && references(^._id) && language == $language]) > 0] | order(title asc) {
    _id,
    title,
    "value": _id,
    "label": title
  }
`);

export const FILTER_OPTIONS_QUERY = defineQuery(`
  {
    "audiences": *[_type == "audience" && language == $language] | order(title asc) {
      _id,
      title,
      "value": _id,
      "label": title
    },
    "themes": *[_type == "theme" && language == $language] | order(title asc) {
      _id,
      title,
      "value": _id,
      "label": title
    },
    "tags": *[_type == "tag" && language == $language && count(*[_type == "pattern" && references(^._id) && language == $language]) > 0] | order(title asc) {
      _id,
      title,
      "value": _id,
      "label": title
    }
  }
`);
