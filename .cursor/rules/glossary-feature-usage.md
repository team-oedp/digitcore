# Glossary Feature Usage Guide

## Overview
The glossary feature automatically detects and styles glossary terms that appear inline within text content throughout the website. Terms are styled as clickable pills with a subtle neutral-300 background color, making them easily distinguishable while maintaining readability.

## How to Use

### 1. Basic Usage in a Component

To enable glossary detection in your content, pass the glossary terms to the `CustomPortableText` component:

```tsx
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { client } from "~/sanity/lib/client";
import { GLOSSARY_TERMS_QUERY } from "~/sanity/lib/queries";

export default async function MyPage() {
  // Fetch glossary terms
  const glossaryTerms = await client.fetch(GLOSSARY_TERMS_QUERY);
  
  // Fetch your content
  const content = await fetchYourContent();
  
  return (
    <div>
      <CustomPortableText 
        value={content.description}
        glossaryTerms={glossaryTerms}
        className="text-body"
      />
    </div>
  );
}
```

### 2. Without Glossary Detection

If you don't want glossary detection in a specific instance, simply omit the `glossaryTerms` prop:

```tsx
<CustomPortableText 
  value={content.description}
  className="text-body"
/>
```

### 3. Styling

The glossary pills have the following default styling:
- Background: `neutral-300` (a light gray shade from our color palette)
- Text color: Inherits from content
- Border radius: Full (rounded pill shape)
- Padding: 2.5 units horizontal, 0.5 units vertical
- Hover effect: Darker background (`neutral-400`) with subtle shadow
- No underline in any state

### 4. Behavior

- **Click behavior**: Clicking a glossary term navigates to the glossary page and scrolls to that specific term
- **Hover state**: Shows a slightly darker background to indicate interactivity
- **Tooltip**: Displays "View definition of [term]" on hover
- **Case sensitivity**: Detection is case-insensitive but preserves original text casing

### 5. Advanced: Custom Styling

If you need to override the default styling, you can add custom CSS:

```css
.glossary-pill {
  /* Your custom styles */
  background-color: var(--color-neutral-200) !important;
  font-weight: 600;
}
```

Or pass a className to the GlossaryPill component if you're using it directly:

```tsx
<GlossaryPill term={term} className="custom-pill-class">
  {termText}
</GlossaryPill>
```

## Features

1. **Automatic Detection**: Scans text content for glossary terms automatically
2. **Smart Matching**: 
   - Matches whole words only (won't match "APIs" when looking for "API")
   - Case-insensitive matching while preserving original case
   - Prioritizes longer terms (matches "Digital Infrastructure" over just "Infrastructure")
3. **No Overlap**: Prevents multiple terms from overlapping in the same text position
4. **Performance**: Efficient regex-based detection with caching potential

## Files Created

- `/src/lib/glossary-utils.ts` - Core utility functions for glossary detection
- `/src/lib/glossary-utils.test.ts` - Comprehensive test suite
- `/src/components/global/glossary-pill.tsx` - Pill component for styling glossary terms
- `/src/components/global/custom-portable-text.tsx` - Enhanced with glossary support
- `/src/styles/globals.css` - Added `.glossary-pill` utility class

## Testing

Run the tests with:
```bash
npm test -- src/lib/glossary-utils.test.ts
```

## Notes

- The feature integrates seamlessly with the existing Portable Text rendering
- Works with all text block types (paragraphs, headings, lists, etc.)
- Respects existing links and doesn't interfere with other text formatting
- The neutral-300 color provides good contrast in both light and dark modes
