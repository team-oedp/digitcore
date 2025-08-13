# Cypress E2E Testing Implementation Plan

## Overview

This document outlines a comprehensive strategy for implementing Cypress End-to-End (E2E) tests for the DIGITCORE Toolkit. The plan is designed to complement the existing Vitest unit tests (122 tests) without creating overlap, focusing on real user workflows and integration scenarios.

## Current Testing Landscape

### Existing Vitest Unit Tests ✅
- **Total**: 122 tests across 6 files, all passing
- **Coverage Areas**:
  - Search functionality (parameter processing, text utils) - 69 tests
  - Carrier bag state management - 28 tests  
  - Utility functions (scroll, mobile detection, utils) - 25 tests

### Cypress Setup Status
- ✅ Basic configuration exists (`cypress.config.ts`)
- ✅ Component testing configured
- ✅ NPM scripts ready (`e2e`, `e2e:dev`, `e2e:production`)
- ❌ No E2E tests implemented yet
- ✅ Integration with `start-server-and-test`

## Strategic Test Division

### Unit Tests (Vitest) - Continue Testing
- ✅ Pure functions & utilities
- ✅ State management logic (Zustand stores)
- ✅ Component props & hooks behavior
- ✅ Data transformations and validation
- ✅ Isolated component behavior

### E2E Tests (Cypress) - Should Test
- 🎪 **User workflows** spanning multiple pages
- 🌐 **Browser behavior** (localStorage, cookies, navigation)
- 🔗 **Integration points** (Sanity CMS, TypeSense search, email)
- 📱 **Responsive behavior** and layout switching
- 🗂️ **Cross-page state** persistence
- 🚪 **Middleware behavior** (onboarding redirects, route protection)

## Priority Test Flows

### 🥇 Priority 1: Core User Journeys

#### 1. Onboarding Flow
**File**: `cypress/e2e/onboarding/first-time-user.cy.ts`
```typescript
// Test scenarios:
- First visit → automatic redirect to onboarding
- Complete onboarding form → cookie/localStorage set
- Navigate to originally intended destination
- Subsequent visits bypass onboarding
- Onboarding middleware enforcement
```

#### 2. Pattern Search & Discovery
**File**: `cypress/e2e/search/pattern-search.cy.ts`
```typescript
// Test scenarios:
- Text search with TypeSense integration
- Multi-filter application (audiences, themes, tags)
- Search results rendering and pagination
- Navigate to pattern details from search results
- Search debouncing and performance
- Filter persistence across navigation
```

#### 3. Carrier Bag Management
**File**: `cypress/e2e/carrier-bag/bag-workflows.cy.ts`
```typescript
// Test scenarios:
- Add patterns from different pages (search, patterns list, detail)
- Edit notes and remove patterns
- Modal vs sidebar display modes
- Persistence across browser sessions
- Cross-page state consistency
- Carrier bag counts and indicators
```

### 🥈 Priority 2: Content & Navigation

#### 4. Pattern Detail Interactions  
**File**: `cypress/e2e/patterns/pattern-details.cy.ts`
```typescript
// Test scenarios:
- Navigate between pattern sections (solutions, resources)
- Submit solution suggestions via modal
- Form validation and error handling
- Pattern content loading from Sanity CMS
- Related patterns and connections
```

#### 5. Site Navigation
**File**: `cypress/e2e/navigation/main-flows.cy.ts`
```typescript
// Test scenarios:
- Navigate between major sections (Home, Patterns, Search, etc.)
- Glossary navigation with letter filtering
- Tag browsing and pattern filtering
- Mobile/desktop responsive navigation switching
- Breadcrumb navigation
```

### 🥉 Priority 3: Integrations

#### 6. CMS & External Integrations
**File**: `cypress/e2e/integrations/cms-search.cy.ts`
```typescript
// Test scenarios:
- Sanity CMS content loading and rendering
- TypeSense search integration and results
- Email form submissions (suggestion forms)
- PDF generation workflows and downloads
- Draft mode functionality for content editors
```

## Recommended File Structure

```
cypress/
├── e2e/
│   ├── onboarding/
│   │   ├── first-time-user.cy.ts
│   │   ├── return-user.cy.ts
│   │   └── onboarding-bypass.cy.ts
│   ├── search/
│   │   ├── pattern-search.cy.ts
│   │   ├── filters-and-pagination.cy.ts
│   │   ├── search-performance.cy.ts
│   │   └── search-results-navigation.cy.ts
│   ├── carrier-bag/
│   │   ├── bag-management.cy.ts
│   │   ├── cross-page-persistence.cy.ts
│   │   ├── modal-vs-sidebar.cy.ts
│   │   └── bag-state-consistency.cy.ts
│   ├── patterns/
│   │   ├── pattern-browsing.cy.ts
│   │   ├── pattern-details.cy.ts
│   │   ├── pattern-connections.cy.ts
│   │   └── suggestion-forms.cy.ts
│   ├── navigation/
│   │   ├── main-navigation.cy.ts
│   │   ├── glossary-navigation.cy.ts
│   │   ├── responsive-behavior.cy.ts
│   │   └── mobile-layout.cy.ts
│   ├── content/
│   │   ├── home-page.cy.ts
│   │   ├── faq-page.cy.ts
│   │   ├── values-page.cy.ts
│   │   └── tags-page.cy.ts
│   └── integrations/
│       ├── cms-integration.cy.ts
│       ├── email-forms.cy.ts
│       ├── pdf-generation.cy.ts
│       └── typesense-search.cy.ts
├── fixtures/
│   ├── patterns.json
│   ├── themes.json
│   ├── audiences.json
│   ├── tags.json
│   ├── search-results.json
│   ├── onboarding-data.json
│   └── carrier-bag-items.json
└── support/
    ├── commands.ts
    ├── helpers/
    │   ├── carrier-bag-helpers.ts
    │   ├── search-helpers.ts
    │   ├── onboarding-helpers.ts
    │   ├── navigation-helpers.ts
    │   └── form-helpers.ts
    ├── api-mocks/
    │   ├── sanity-mocks.ts
    │   ├── typesense-mocks.ts
    │   └── email-mocks.ts
    └── selectors/
        ├── carrier-bag-selectors.ts
        ├── search-selectors.ts
        └── navigation-selectors.ts
```

## Custom Cypress Commands

### High-Level Workflow Commands
```typescript
// Onboarding commands
cy.completeOnboarding(preferences?: { audiences?: string[], themes?: string[] })
cy.bypassOnboarding()
cy.verifyOnboardingComplete()

// Search commands  
cy.searchPatterns(query: string, filters?: SearchFilters)
cy.applySearchFilters(audiences?: string[], themes?: string[], tags?: string[])
cy.verifySearchResults(expectedCount?: number)
cy.clearSearchFilters()

// Carrier bag commands
cy.addToCarrierBag(patternSlug: string, notes?: string)
cy.openCarrierBag(mode?: 'modal' | 'sidebar')
cy.verifyCarrierBagContains(patterns: string[])
cy.clearCarrierBag()
cy.editCarrierBagNotes(patternId: string, notes: string)

// Navigation commands
cy.navigateToPattern(slug: string)
cy.navigateToSection(section: 'home' | 'patterns' | 'search' | 'glossary' | 'faq' | 'values' | 'tags')
cy.navigateToLetter(letter: string) // For glossary
cy.verifyMobileLayout()
cy.verifyDesktopLayout()

// Form commands
cy.submitSuggestion(patternSlug: string, data: SuggestionData)
cy.verifyFormValidation(formType: string, field: string)
```

### State Verification Commands
```typescript
// State verification
cy.verifyCarrierBagPersistence()
cy.verifySearchStatePersistence()
cy.verifyOnboardingState()
cy.verifyLocalStorageState(key: string, expectedValue: any)

// Content verification
cy.verifyPatternContent(slug: string)
cy.verifySearchResults(query: string, expectedPatterns: string[])
cy.verifyThemeGrouping()
```

### API Mocking Commands
```typescript
// API mocking
cy.mockSanityAPI(scenarios?: MockScenario[])
cy.mockTypeSenseSearch(results?: SearchResult[])
cy.mockEmailService()
cy.mockPDFGeneration()

// Network intercepts
cy.interceptSearchRequests()
cy.interceptPatternRequests()
cy.interceptSuggestionSubmission()
```

## Test Data Strategy

### Fixture Data
- **patterns.json**: Sample pattern data for consistent testing
- **themes.json**: Theme data with proper groupings
- **audiences.json**: Audience data for filtering tests
- **tags.json**: Tag data for search and filtering
- **search-results.json**: Predictable search result sets
- **onboarding-data.json**: Test user preferences and form data

### Environment Configuration
- **Test Environment**: Isolated test database and search index
- **Environment Variables**: Test-specific configuration
- **External Services**: Mock email and PDF generation services
- **Base URL**: Configurable for different deployment environments

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
**Priority**: Essential setup and core flow
1. ✅ Set up Cypress E2E configuration and scripts
2. ✅ Create custom commands and helper functions
3. ✅ Implement test data fixtures and API mocking
4. ✅ Create onboarding flow tests (highest business impact)
5. ✅ Set up CI/CD integration basics

**Deliverables**:
- Working Cypress E2E setup
- Onboarding flow fully tested
- Foundation for remaining tests

### Phase 2: Core User Flows (Week 2)  
**Priority**: Main user journeys
1. ✅ Pattern search and filtering tests
2. ✅ Carrier bag management workflow tests
3. ✅ Basic navigation and responsive behavior tests
4. ✅ Pattern browsing and detail view tests

**Deliverables**:
- Core user workflows tested
- Cross-page state persistence verified
- Responsive behavior validated

### Phase 3: Advanced Features (Week 3)
**Priority**: Integrations and edge cases
1. ✅ Pattern suggestion flow tests
2. ✅ CMS integration tests (Sanity content loading)
3. ✅ TypeSense search integration tests
4. ✅ Email form submission tests
5. ✅ PDF generation workflow tests

**Deliverables**:
- Integration points fully tested
- Form workflows validated
- External service integrations verified

### Phase 4: Polish & Production (Week 4)
**Priority**: Reliability and maintenance
1. ✅ Test optimization and reliability improvements
2. ✅ Comprehensive error handling and edge case tests
3. ✅ Performance testing and optimization
4. ✅ CI/CD pipeline integration and reporting
5. ✅ Documentation and maintenance guidelines

**Deliverables**:
- Production-ready test suite
- CI/CD integration complete
- Comprehensive documentation

## Key Testing Focus Areas

### What Makes These E2E Tests Unique

1. **Real Browser Environment**
   - localStorage and cookie management
   - Responsive layout switching
   - Real network requests and timing
   - JavaScript execution and rendering

2. **Multi-Page Workflows**
   - State persistence across navigation
   - Cross-page component interaction
   - URL routing and deep linking
   - Browser back/forward behavior

3. **External Integration Points**
   - Sanity CMS content loading and rendering
   - TypeSense search API integration
   - Email service integration (mocked)
   - PDF generation service integration

4. **User Interaction Patterns**
   - Search → filter → browse → add to bag workflows
   - Modal vs sidebar interaction modes
   - Form validation and submission flows
   - Responsive touch and click interactions

5. **Middleware and Route Behavior**
   - Onboarding enforcement and redirection
   - Protected route access
   - Error page handling
   - 404 and fallback page behavior

### Avoiding Unit Test Overlap

**Focus on workflows, not functions**:
- ✅ Test complete user journeys spanning multiple pages
- ❌ Don't test individual utility functions or components in isolation

**Test integration points, not isolated logic**:
- ✅ Verify Sanity CMS data loads and renders correctly
- ❌ Don't test data transformation functions (already covered in unit tests)

**Verify browser behavior, not pure logic**:
- ✅ Test localStorage persistence across browser sessions
- ❌ Don't test state management logic (already covered in unit tests)

**Validate cross-component interaction**:
- ✅ Test carrier bag state updates across different pages
- ❌ Don't test individual component prop handling

## Performance and Reliability Considerations

### Test Reliability
- Use explicit waits and assertions
- Implement retry logic for flaky network requests
- Use data attributes for stable element selection
- Mock external services to reduce dependencies

### Test Performance
- Parallel test execution where possible
- Efficient test data setup and teardown
- Strategic use of API mocking vs real requests
- Optimized browser startup and page loading

### Maintenance Guidelines
- Regular test review and updates
- Clear naming conventions and documentation
- Modular helper functions and commands
- Environment-specific configuration management

## Success Metrics

### Coverage Goals
- 100% coverage of critical user workflows
- All major integration points tested
- Cross-browser compatibility verified
- Mobile and desktop responsive behavior validated

### Quality Metrics
- Test reliability: >95% pass rate in CI
- Test execution time: <10 minutes for full suite
- Clear test failure reporting and debugging
- Comprehensive error scenario coverage

## Getting Started

### Prerequisites
- Node.js environment with project dependencies installed
- Cypress installed and configured
- Test environment with sample data
- Local development server running

### Running Tests
```bash
# Run E2E tests in headless mode
npm run e2e

# Run E2E tests in interactive mode
npm run e2e:dev

# Run E2E tests against production build
npm run e2e:production

# Run specific test file
npx cypress run --spec "cypress/e2e/search/pattern-search.cy.ts"

# Open Cypress Test Runner
npx cypress open
```

### Environment Setup
1. Ensure `.env.local` has test-specific configurations
2. Start local development server: `npm run dev`
3. Verify test database and search index are accessible
4. Run initial test: `npm run e2e:dev`

---

## Notes for Future Development

### Integration with Existing Tests
- This Cypress implementation is designed to complement, not replace, the existing 122 Vitest unit tests
- Unit tests continue to provide excellent coverage for pure functions, component logic, and state management
- E2E tests focus on user workflows and integration scenarios that cannot be effectively tested in isolation

### Maintenance and Updates
- Update test fixtures when data schemas change
- Review and update API mocks when external services change
- Add new test scenarios when new features are implemented
- Regularly review test performance and reliability metrics

### Future Enhancements
- Visual regression testing integration
- Accessibility testing automation
- Performance monitoring integration
- Cross-browser testing expansion

## Additional Best Practices and Enhancements

### Environment & Tooling

- **Multi-browser CI**: run the suite in Chrome, Firefox and Edge via a matrix build.
- **Automatic retries**: set `retries: { runMode: 2, openMode: 0 }` in `cypress.config.ts` to self-heal flaky steps in CI while still surfacing local failures.
- **Code coverage**: integrate `@cypress/code-coverage` to see which runtime branches each user flow exercises.
- **Type-safe selectors**: export a frozen `SEL` map of all `data-cy` selectors so refactors are compile-time safe.
- **Path aliases in tests**: mirror the project’s `~/` alias in `cypress/tsconfig.json` for ergonomic imports.

### Reliability & Data Determinism

- **Deterministic DB seeding**: create a `cy.task("db:reset", fixtureName)` that reloads Sanity + TypeSense fixtures before each spec.
- **Global network isolation**: intercept `/**` and throw on unexpected requests to guarantee mocks are comprehensive.
- **Visual flake guard**: favour explicit assertions (`should("be.visible")`) over arbitrary `cy.wait()` calls.
- **Tag-driven subsets**: use test tags such as `@smoke`, `@a11y`, `@desktopOnly` and run subsets with `--env grepTags`.

### Accessibility & Visual QA

- **Automated a11y**: add `cypress-axe`; run `cy.injectAxe(); cy.checkA11y();` in smoke specs.
- **Visual regression**: integrate `cypress-image-snapshot` or Percy for screenshot diffs.

### Performance & Observability

- **Performance budgets**: assert key metrics (e.g. LCP < 2.5 s) or API response durations inside tests.
- **Recording dashboards**: if Cypress Cloud is enabled, use commit metadata for flaky-test analytics.

### Authentication & Middleware Edge Cases

- **Draft-mode preview**: mock `/api/draft-mode/enable`, assert cookie + preview bar visibility.
- **Role-based access**: create `cy.loginAs("admin")` once RBAC endpoints ship.
- **Error-path assertions**: force network errors and verify the global error boundary.

### Helper Utilities (examples)

```ts
// cypress/support/commands.ts
Cypress.Commands.add("loginAs", role => {
  cy.setLocalStorage("userRole", role);
});

Cypress.Commands.add("viewAs", device => {
  const sizes = { mobile: [375, 667], desktop: [1280, 720] };
  cy.viewport(...sizes[device]);
});
```

### Road-map Additions

- **Week 0**: define flake-rate SLO & naming conventions.
- **Week 5**: create an exploratory smoke pack tagged `@smoke`; run on every push, full suite nightly.

---

*This document serves as a comprehensive guide for implementing and maintaining Cypress E2E tests for the DIGITCORE Toolkit. Follow this plan to ensure comprehensive test coverage while maintaining the excellent existing unit test suite.*