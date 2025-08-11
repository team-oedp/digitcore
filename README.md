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