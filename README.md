# Digitcore

This project consists of a Next.js frontend application and a separate Sanity Studio for content management.

## Development Setup

### Prerequisites

- Node.js 20+ 
- npm

### Installation

1. Install dependencies for the main application:
```bash
npm install
```

2. Install dependencies for the Sanity Studio:
```bash
npm run studio:install
```

3. Set up environment variables:

For the main application, ensure you have the following environment variables:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-07-23
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3333
```

For the Sanity Studio, create a `.env.local` file in the `studio/` directory:
```
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_VERSION=2025-07-23
```

### Running the Applications

#### Development Mode

To run both applications simultaneously:
```bash
npm run dev:all
```

To run them separately:

1. **Next.js application** (runs on http://localhost:3000):
```bash
npm run dev
```

2. **Sanity Studio** (runs on http://localhost:3333):
```bash
npm run studio:dev
```

#### Studio Management

- Build the studio: `npm run studio:build`
- Deploy the studio: `npm run studio:deploy`

### Project Structure

```
digitcore/
├── src/                    # Next.js application source
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── sanity/           # Sanity configuration for frontend
│   └── ...
├── studio/               # Standalone Sanity Studio
│   ├── sanity/          # Studio-specific schemas and config
│   ├── sanity.config.ts # Studio configuration
│   └── package.json     # Studio dependencies
└── package.json         # Main project dependencies
```

### Studio vs Frontend Sanity Configuration

The project now has two separate Sanity configurations:

1. **Frontend (`src/sanity/`)**: Used by the Next.js app for fetching content
2. **Studio (`studio/sanity/`)**: Used by the standalone Sanity Studio for content editing

Both configurations share the same schemas but use different environment variable prefixes:
- Frontend: `NEXT_PUBLIC_SANITY_*`
- Studio: `SANITY_*`

## Code Quality

```bash
npm run typecheck       # TypeScript type checking
npm run check           # Biome lint + format check
npm run check:write     # Biome with auto-fix
npm run precheck        # Full quality gate (typecheck + format + build)
```

## Security & Dependency Management

This project uses a layered approach to dependency security:

| Tool | Role |
|---|---|
| **Dependabot** | Auto-PRs for GitHub Actions updates |
| **Renovate Bot** | Auto-PRs for npm updates, grouped by ecosystem |
| **npm audit** | CVE scanning in CI on every push/PR + weekly cron |
| **Trivy** | Broader CVE scanning (OSV + NVD) + secret detection in CI |
| **TypeScript** | Type regression checks when deps update |

### CI Workflows

The `security` workflow (`.github/workflows/security.yml`) runs on:
- Every push and PR to `main` and `staging`
- Every Monday at 09:00 UTC (scheduled audit)
- Manually via GitHub Actions → Run workflow

### Renovate Bot

Renovate groups related packages into single PRs:
- **Radix UI** — all `@radix-ui/*` packages together
- **Sanity** — `sanity`, `@sanity/*`, `next-sanity` together
- **tRPC** — all `@trpc/*` together
- **TanStack** — all `@tanstack/*` together
- **Testing** — Vitest, Cypress, Testing Library together
- **Tailwind** — Tailwind, PostCSS, plugins together
- `@types/*` patches/minors are auto-merged
- `next`, `react`, `react-dom`, and `sanity` are never auto-merged

### Running Audits Locally

```bash
# Root dependencies
npm audit

# Sanity Studio dependencies
cd src/sanity && npm audit

# Auto-fix safe vulnerabilities
npm audit fix
cd src/sanity && npm audit fix
```

> See `instructions/security-setup.md` for full setup instructions including GitHub and Vercel configuration steps.