# Cypress Testing Guidelines for DIGITCORE Toolkit

## Overview
This guide provides comprehensive guidelines for writing end-to-end tests using Cypress in the DIGITCORE Toolkit project, following Next.js official recommendations. This guide ensures consistent, reliable, and maintainable tests.

## Project Context
- **Framework**: Next.js 15 with React 19 (App Router)
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Zustand, TanStack Query, tRPC
- **Theme System**: next-themes (light/dark/system modes)
- **Base URL**: http://localhost:3000

## Installation & Setup

### Required Packages
```bash
npm install -D cypress start-server-and-test
```

**Note**: Cypress versions below 13.6.3 have TypeScript compatibility issues with Next.js. Ensure you're using Cypress 13.6.3+.

### Package.json Scripts
```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "e2e": "start-server-and-test dev http://localhost:3000 \"cypress run --e2e\"",
    "e2e:dev": "start-server-and-test dev http://localhost:3000 \"cypress open --e2e\"",
    "e2e:production": "start-server-and-test start http://localhost:3000 \"cypress run --e2e\""
  }
}
```

### Configuration Files

Create `cypress.config.ts` in project root:
```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    video: false, // Disable for faster local development
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  // Component testing is optional for Next.js App Router
  // Server Components cannot be component tested
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
  },
})
```

### Initial Setup
1. Run `npm run cypress:open` to initialize Cypress
2. Choose "E2E Testing" when prompted
3. Cypress will create the folder structure and config files

## File Structure
```
cypress/
├── e2e/
│   ├── navigation.cy.ts          # Main navigation tests
│   ├── theme-toggle.cy.ts        # Theme switching functionality
│   ├── carrier-bag.cy.ts         # Carrier bag functionality
│   └── pages/
│       ├── home.cy.ts            # Home page specific tests
│       ├── glossary.cy.ts        # Glossary page tests
│       ├── search.cy.ts          # Search functionality
│       ├── tags.cy.ts            # Tags page tests
│       ├── values.cy.ts          # Values page tests
│       └── onboarding.cy.ts      # Onboarding flow tests
├── support/
│   ├── commands.ts               # Custom Cypress commands
│   ├── e2e.ts                    # Support file for e2e tests
│   └── component.ts              # Support file for component tests (optional)
├── fixtures/
│   ├── patterns.json             # Mock pattern data
│   ├── glossary.json             # Mock glossary data
│   └── carrier-bag.json          # Mock carrier bag data
└── cypress.config.ts             # Cypress configuration
```

## Testing Patterns

### 1. Navigation Testing
```typescript
describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display all main navigation links', () => {
    cy.get('[data-testid="nav-carrier-bag"]').should('be.visible').and('contain', 'Carrier Bag')
    cy.get('[data-testid="nav-tags"]').should('be.visible').and('contain', 'Tags')
    cy.get('[data-testid="nav-glossary"]').should('be.visible').and('contain', 'Glossary')
    cy.get('[data-testid="nav-onboarding"]').should('be.visible').and('contain', 'Onboarding')
    cy.get('[data-testid="nav-values"]').should('be.visible').and('contain', 'Values')
    cy.get('[data-testid="nav-search"]').should('be.visible').and('contain', 'Search')
  })

  it('should navigate to each page correctly', () => {
    const pages = [
      { selector: '[data-testid="nav-carrier-bag"]', url: '/carrier-bag', heading: 'Carrier Bag' },
      { selector: '[data-testid="nav-glossary"]', url: '/glossary', heading: 'Glossary' },
      { selector: '[data-testid="nav-search"]', url: '/search', heading: 'Search' }
    ]

    pages.forEach(({ selector, url, heading }) => {
      cy.get(selector).click()
      cy.url().should('include', url)
      cy.get('h1').should('contain', heading)
      cy.get('[data-testid="nav-home"]').click() // Return to home
    })
  })
})
```

### 2. Theme Toggle Testing
```typescript
describe('Theme Toggle', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should switch to dark theme', () => {
    cy.get('[data-testid="theme-toggle"]').click()
    cy.get('[data-testid="theme-dark"]').click()
    cy.get('html').should('have.class', 'dark')
    
    // Verify persistence after page reload
    cy.reload()
    cy.get('html').should('have.class', 'dark')
  })

  it('should switch to light theme', () => {
    cy.get('[data-testid="theme-toggle"]').click()
    cy.get('[data-testid="theme-light"]').click()
    cy.get('html').should('not.have.class', 'dark')
  })

  it('should respect system theme', () => {
    cy.get('[data-testid="theme-toggle"]').click()
    cy.get('[data-testid="theme-system"]').click()
    // Theme should match system preference
  })
})
```

### 3. Form and Input Testing
```typescript
describe('Search Functionality', () => {
  beforeEach(() => {
    cy.visit('/search')
  })

  it('should perform search and display results', () => {
    cy.get('[data-testid="search-input"]')
      .type('pattern')
      .should('have.value', 'pattern')
    
    cy.get('[data-testid="search-submit"]').click()
    
    cy.get('[data-testid="search-results"]').should('be.visible')
    cy.get('[data-testid="search-result-item"]').should('have.length.greaterThan', 0)
  })

  it('should handle empty search gracefully', () => {
    cy.get('[data-testid="search-submit"]').click()
    cy.get('[data-testid="search-error"]').should('contain', 'Please enter a search term')
  })
})
```

### 4. Local Storage Testing (Carrier Bag)
```typescript
describe('Carrier Bag Functionality', () => {
  beforeEach(() => {
    cy.visit('/carrier-bag')
    // Clear local storage before each test
    cy.clearLocalStorage()
  })

  it('should add pattern to carrier bag', () => {
    cy.visit('/pattern/example-pattern')
    cy.get('[data-testid="add-to-carrier-bag"]').click()
    
    cy.visit('/carrier-bag')
    cy.get('[data-testid="carrier-bag-item"]').should('have.length', 1)
    
    // Verify persistence
    cy.reload()
    cy.get('[data-testid="carrier-bag-item"]').should('have.length', 1)
  })

  it('should remove pattern from carrier bag', () => {
    // Add pattern first
    cy.window().then((win) => {
      win.localStorage.setItem('carrier-bag', JSON.stringify([{ id: '1', title: 'Test Pattern' }]))
    })
    
    cy.reload()
    cy.get('[data-testid="carrier-bag-item"]').should('have.length', 1)
    cy.get('[data-testid="remove-from-carrier-bag"]').first().click()
    cy.get('[data-testid="carrier-bag-item"]').should('have.length', 0)
  })
})
```

### 5. Responsive Design Testing
```typescript
describe('Responsive Design', () => {
  const viewports = [
    { device: 'mobile', width: 375, height: 667 },
    { device: 'tablet', width: 768, height: 1024 },
    { device: 'desktop', width: 1280, height: 720 }
  ]

  viewports.forEach(({ device, width, height }) => {
    it(`should display correctly on ${device}`, () => {
      cy.viewport(width, height)
      cy.visit('/')
      
      cy.get('[data-testid="header"]').should('be.visible')
      cy.get('[data-testid="main-content"]').should('be.visible')
      
      if (device === 'mobile') {
        // Test mobile-specific behavior
        cy.get('[data-testid="mobile-menu-toggle"]').should('be.visible')
      } else {
        // Test desktop navigation
        cy.get('[data-testid="desktop-nav"]').should('be.visible')
      }
    })
  })
})
```

## Custom Commands

### Support Commands (cypress/support/commands.ts)
```typescript
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login with test user credentials
       */
      login(): Chainable<void>
      
      /**
       * Set theme preference
       */
      setTheme(theme: 'light' | 'dark' | 'system'): Chainable<void>
      
      /**
       * Add pattern to carrier bag
       */
      addToCarrierBag(pattern: { id: string; title: string }): Chainable<void>
      
      /**
       * Navigate to page and verify URL
       */
      navigateAndVerify(path: string, expectedHeading: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('setTheme', (theme: 'light' | 'dark' | 'system') => {
  cy.get('[data-testid="theme-toggle"]').click()
  cy.get(`[data-testid="theme-${theme}"]`).click()
})

Cypress.Commands.add('addToCarrierBag', (pattern) => {
  cy.window().then((win) => {
    const existing = JSON.parse(win.localStorage.getItem('carrier-bag') || '[]')
    existing.push(pattern)
    win.localStorage.setItem('carrier-bag', JSON.stringify(existing))
  })
})

Cypress.Commands.add('navigateAndVerify', (path: string, expectedHeading: string) => {
  cy.visit(path)
  cy.url().should('include', path)
  cy.get('h1').should('contain', expectedHeading)
})
```

## Data Test IDs

### Required Data Test IDs to Add to Components

Add these `data-testid` attributes to your components:

#### Navigation (layout.tsx)
```tsx
// Header navigation
<nav data-testid="header">
  <Link href="/" data-testid="nav-home">DIGITCORE Toolkit</Link>
  <Link href="/carrier-bag" data-testid="nav-carrier-bag">Carrier Bag</Link>
  <Link href="/tags" data-testid="nav-tags">Tags</Link>
  <Link href="/glossary" data-testid="nav-glossary">Glossary</Link>
  <Link href="/onboarding" data-testid="nav-onboarding">Onboarding</Link>
  <Link href="/values" data-testid="nav-values">Values</Link>
  <Link href="/search" data-testid="nav-search">Search</Link>
</nav>

// Theme toggle
<DropdownMenuTrigger data-testid="theme-toggle">
<DropdownMenuItem data-testid="theme-light">Light</DropdownMenuItem>
<DropdownMenuItem data-testid="theme-dark">Dark</DropdownMenuItem>
<DropdownMenuItem data-testid="theme-system">System</DropdownMenuItem>

// Main content
<main data-testid="main-content">{children}</main>
```

#### Pages
```tsx
// Home page (page.tsx)
<section data-testid="hero-section">
  <Button data-testid="get-started-btn">Get Started</Button>
  <Button data-testid="view-carrier-bag-btn">View Carrier Bag</Button>
</section>

// Carrier bag
<div data-testid="carrier-bag-items">
  <div data-testid="carrier-bag-item">
    <button data-testid="remove-from-carrier-bag">Remove</button>
  </div>
</div>

// Search page
<input data-testid="search-input" />
<button data-testid="search-submit">Search</button>
<div data-testid="search-results">
  <div data-testid="search-result-item">...</div>
</div>
<div data-testid="search-error">...</div>
```

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names that explain the expected behavior
- Keep tests focused on a single piece of functionality
- Use beforeEach hooks to set up common test preconditions

### 2. Selectors
- **Prefer data-testid attributes** over CSS classes or element types
- Use semantic selectors when data-testid is not available
- Avoid fragile selectors that depend on implementation details

### 3. Assertions
- Use specific assertions (`.should('contain', 'text')` vs `.should('exist')`)
- Test both positive and negative cases
- Verify state changes and persistence where applicable

### 4. Performance
- Use `cy.intercept()` to mock API calls and avoid external dependencies
- Keep tests isolated and independent
- Use fixtures for consistent test data

### 5. Debugging
- Use `cy.debug()` and `cy.pause()` for debugging failing tests
- Take screenshots on failures automatically (configured in cypress.config.ts)
- Use descriptive error messages in custom commands

## Environment-Specific Testing

### Development
```typescript
// cypress.config.ts
if (Cypress.env('NODE_ENV') === 'development') {
  config.baseUrl = 'http://localhost:3000'
  config.video = false
  config.screenshotOnRunFailure = true
}
```

### CI/CD
```typescript
// For GitHub Actions or similar
if (Cypress.env('CI')) {
  config.video = true
  config.screenshotOnRunFailure = true
  config.reporter = 'junit'
  config.reporterOptions = {
    mochaFile: 'cypress/results/results-[hash].xml'
  }
}
```

## Common Patterns for DIGITCORE

### Testing tRPC Integration
```typescript
it('should load data from tRPC', () => {
  cy.intercept('POST', '/api/trpc/post.getAll', { fixture: 'posts.json' }).as('getPosts')
  
  cy.visit('/patterns')
  cy.wait('@getPosts')
  
  cy.get('[data-testid="pattern-list"]').should('be.visible')
  cy.get('[data-testid="pattern-item"]').should('have.length.greaterThan', 0)
})
```

### Testing Zustand Store
```typescript
it('should update carrier bag store', () => {
  cy.visit('/carrier-bag')
  
  cy.window().its('store').invoke('getState').should('have.property', 'items')
  
  // Add item via UI
  cy.get('[data-testid="add-pattern-btn"]').click()
  
  cy.window().its('store').invoke('getState')
    .its('items').should('have.length', 1)
})
```

### Testing Theme Persistence
```typescript
it('should persist theme across sessions', () => {
  cy.setTheme('dark')
  cy.get('html').should('have.class', 'dark')
  
  // Simulate page refresh
  cy.reload()
  cy.get('html').should('have.class', 'dark')
  
  // Simulate new session
  cy.clearAllSessionStorage()
  cy.visit('/')
  cy.get('html').should('have.class', 'dark') // Should persist via localStorage
})
```

## Running Tests

### Development Workflow
1. **Development Mode**: `npm run e2e:dev` - Starts dev server and opens Cypress
2. **Headless Testing**: `npm run e2e` - Runs tests in headless mode against dev server
3. **Production Testing**: 
   ```bash
   npm run build && npm run e2e:production
   ```

### Best Practices for Next.js Testing
- **Test against production builds** when possible for accurate results
- Use `start-server-and-test` to ensure server is ready before running tests
- For CI/CD, always test against production builds: `npm run build && npm run start`
- **Component testing limitations**: Server Components cannot be component tested - focus on E2E tests
- **Keep components pure**: Minimize Next.js integrations within components for better testability
- **Use cy.intercept()** to mock external dependencies and API calls
- **Test isolation**: Each test should be independent and not rely on previous test state

## Troubleshooting

### Common Issues
1. **Element not found**: Check data-testid attributes are added to components
2. **Timing issues**: Use `cy.wait()` for API calls or `cy.should()` for element states
3. **State persistence**: Verify localStorage/sessionStorage is being used correctly
4. **Theme switching**: Ensure theme provider is properly configured
5. **TypeScript errors**: Ensure Cypress version is 13.6.3+ for Next.js compatibility
6. **Server Components**: Remember that Server Components can't be component tested - use E2E instead

### Debugging Commands
```typescript
cy.debug()           // Pause execution and open DevTools
cy.pause()           // Pause execution
cy.screenshot()      // Take screenshot
cy.get('element').debug()  // Debug specific element
```

This guide should be updated as new patterns emerge and the application evolves.