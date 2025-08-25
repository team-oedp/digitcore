# PDF Export System

## Current Implementation

The PDF export system uses a hybrid approach:
- **Web UI (including preview modal)**: Uses UntitledSans to maintain brand typography
- **PDF Export**: Uses Helvetica as fallback for reliable glyph rendering

### PDF Layout Optimizations

**Fixed Issues:**
- ✅ **Text Overlapping**: Improved line heights (1.6 for body, 1.3 for titles)
- ✅ **Title Wrapping**: Reduced font sizes for better fit (28px instead of 32px)
- ✅ **Spacing Issues**: Optimized margins and padding for PDF layout
- ✅ **Text Flow**: Better alignment and flex properties for text wrapping

**Specific Improvements:**
- **Page Layout**: Increased base line height to 1.6 for readability
- **Titles**: Reduced font size to 28px with line height 1.3 for proper wrapping
- **Solutions**: Reduced gap from 32px to 20px, adjusted number width to 30px
- **Tags**: Improved line heights and spacing for better visual hierarchy
- **TOC**: Changed alignment to flex-start for multi-line title support

## Font Fallback Strategy

Currently, the PDF export uses Helvetica instead of UntitledSans due to font glyph rendering issues in react-pdf.

### Why Helvetica?
- Built into PDF viewers
- Excellent glyph coverage
- No font loading issues
- Reliable cross-platform rendering

## Future: UntitledSans in PDF Exports

### Exploration Approaches

1. **Font Format Conversion**
   - Convert WOFF2 to TTF/OTF for better react-pdf compatibility
   - Use font conversion tools like `fonttools` or online converters
   - Test with different font formats

2. **Font Subsetting**
   - Create subset of UntitledSans with only needed glyphs
   - Reduce file size and improve loading
   - Tools: `pyftsubset`, `fonttools`

3. **Base64 Font Embedding**
   ```js
   Font.register({
     family: 'UntitledSans',
     src: 'data:font/truetype;base64,AABAAA...'
   });
   ```

4. **@react-pdf/fontkit Integration**
   - Explore advanced font handling
   - Custom font loading strategies

5. **CDN Hosting**
   - Host fonts on reliable CDN
   - Ensure CORS headers are set correctly
   - Test with absolute URLs

### Testing Checklist

When exploring UntitledSans integration:
- [ ] Test font loading in different browsers
- [ ] Verify glyph rendering for special characters
- [ ] Test PDF generation performance
- [ ] Ensure cross-platform compatibility
- [ ] Validate font licensing for PDF embedding

### Files to Update

If UntitledSans works in PDF:
1. `src/lib/style-adapters.ts` - Remove Helvetica fallback
2. `src/components/pdf/pdf-components.tsx` - Update font registration
3. `src/lib/pattern-styles.ts` - Ensure consistent font family

## Architecture

```
Web UI (UntitledSans)
├── Pattern Pages
├── Carrier Bag
└── PDF Preview Modal

PDF Export (Helvetica - temporary)
├── Cover Page
├── Table of Contents  
└── Pattern Pages
    ├── Header & Description
    ├── Connections (tags, audiences, themes)
    ├── Solutions (with roman numerals)
    ├── Resources
    └── Personal Notes
```