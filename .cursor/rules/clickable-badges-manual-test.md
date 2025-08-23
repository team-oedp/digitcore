# Manual Testing Guide: Clickable Badges Feature

This guide helps verify that the clickable badges feature on pattern pages works correctly.

## Prerequisites
1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000 (or the port shown in terminal)
3. Ensure you have patterns with tags, audiences, and themes in your Sanity dataset

## Test Scenarios

### 1. Theme Badge Navigation
**Steps:**
1. Navigate to any pattern page (e.g., `/pattern/[pattern-slug]`)
2. Look for the orange theme badge below the pattern title
3. Hover over the theme badge
   - **Expected:** Cursor changes to pointer, badge color slightly darkens
4. Click on the theme badge
   - **Expected:** Navigate to `/explore?themes={theme-id}`
   - **Expected:** The explore page loads with the theme filter pre-selected

### 2. Audience Badge Navigation  
**Steps:**
1. Navigate to any pattern page with audience badges
2. Look for the blue audience badges below the pattern title
3. Hover over any audience badge
   - **Expected:** Cursor changes to pointer, badge color slightly darkens
4. Click on an audience badge
   - **Expected:** Navigate to `/explore?audiences={audience-id}`
   - **Expected:** The explore page loads with the audience filter pre-selected

### 3. Tag Badge Navigation
**Steps:**
1. Navigate to any pattern page with tag badges
2. Look for the purple/violet tag badges below the pattern title
3. Hover over any tag badge
   - **Expected:** Cursor changes to pointer, badge color slightly darkens
4. Click on a tag badge
   - **Expected:** Navigate to `/tags#letter-{first-letter}`
   - **Expected:** The tags page loads and scrolls to the correct alphabetical section

### 4. Multiple Filter Combinations
**Steps:**
1. From a pattern page, click on an audience badge to go to explore
2. Verify the audience filter is applied
3. Navigate back to a pattern page
4. Click on a theme badge
5. Verify only the theme filter is applied (not both)
   - **Expected:** Each badge click should reset filters and apply only its specific filter

### 5. Accessibility Testing
**Steps:**
1. Navigate to a pattern page using only keyboard (Tab key)
2. Tab through the page elements
   - **Expected:** Each badge should be focusable
   - **Expected:** Focus indicator should be visible on badges
3. Press Enter on a focused badge
   - **Expected:** Navigation should work same as clicking

### 6. Edge Cases
**Steps:**
1. Test patterns with no badges
   - **Expected:** No badges section appears, page renders normally
2. Test patterns with only one type of badge
   - **Expected:** Only that badge type appears and is clickable
3. Test patterns with many badges
   - **Expected:** All badges wrap properly and remain clickable

## Visual Verification Checklist
- [ ] Badges have cursor pointer on hover
- [ ] Theme badges have orange color and darken on hover
- [ ] Audience badges have blue color and darken on hover
- [ ] Tag badges have violet color and darken on hover
- [ ] Transition animations are smooth (200ms)
- [ ] No layout shift when hovering badges
- [ ] Badges maintain their original visual design

## Browser Compatibility
Test in the following browsers:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Performance Check
- [ ] Navigation is instant (no delay when clicking)
- [ ] Page transitions are smooth
- [ ] Filters apply immediately on the explore page
- [ ] Tags page scrolls to correct position without jank

## Bug Report Template
If you find any issues, report them with:
1. Browser and version
2. Pattern page URL
3. Badge type clicked (theme/audience/tag)
4. Expected behavior
5. Actual behavior
6. Screenshot if applicable

## Success Criteria
✅ All badge types navigate to correct destinations
✅ Filters are properly applied on explore page
✅ Tags page scrolls to correct alphabetical section
✅ Hover states work correctly
✅ Keyboard navigation works
✅ No console errors
✅ No TypeScript errors
✅ All automated tests pass
