# Security & Dependency Hardening — Setup Guide

This document covers everything that must be configured outside the codebase to activate
the security tooling in `.github/`.

---

## Prerequisites — Fix Existing Vulnerabilities

Before enabling CI auditing, clear what can be auto-fixed locally.
The current state has 20 high + 1 critical in root and 9 high in `src/sanity`.

```bash
# From project root
npm audit fix

# Sanity Studio workspace
cd src/sanity && npm audit fix && cd ../..
```

After running, check what remains:

```bash
npm audit --audit-level=high
cd src/sanity && npm audit --audit-level=high
```

Once the backlog is clear, tighten the CI threshold in `.github/workflows/security.yml`.
Find both occurrences of this line and change `critical` to `high`:

```yaml
# Before
run: npm audit --audit-level=critical

# After
run: npm audit --audit-level=high
```

---

## Step 1 — GitHub: Enable Security Features

These settings live in your GitHub repository, not in the codebase.

1. Go to your repository on GitHub
2. Click **Settings** → **Security** (left sidebar) → **Code security and analysis**
3. Enable the following:
   - **Dependency graph** — required for Dependabot to function
   - **Dependabot alerts** — notifies on known CVEs in your dependencies
   - **Secret scanning** — catches accidentally committed secrets (complements Trivy)

> Dependabot will automatically pick up `.github/dependabot.yml` once the Dependency graph
> is enabled. No further configuration needed for GitHub Actions updates.

---

## Step 2 — GitHub: Add Repository Labels

The workflows and Renovate tag PRs with labels. Create these in your repo so they apply
correctly.

Go to **Issues** → **Labels** → **New label** and create:

| Label | Suggested colour |
|---|---|
| `dependencies` | `#0075ca` |
| `github-actions` | `#e4e669` |
| `security` | `#d73a4a` |
| `sanity` | `#f9d0c4` |
| `radix-ui` | `#c2e0c6` |
| `trpc` | `#bfd4f2` |
| `tanstack` | `#bfd4f2` |
| `testing` | `#fef2c0` |
| `tailwind` | `#0075ca` |
| `tooling` | `#e4e669` |
| `next` | `#000000` |
| `react` | `#61dafb` |
| `icons` | `#cccccc` |
| `vercel` | `#000000` |
| `types` | `#cccccc` |

> Labels are optional for the tools to function — PRs will still open without them.
> They are useful for filtering and triaging dependency PRs.

---

## Step 3 — Install Renovate Bot on GitHub

Renovate is a GitHub App. It must be installed on your organisation or repository.

1. Go to **[github.com/apps/renovate](https://github.com/apps/renovate)**
2. Click **Install**
3. Choose your organisation or personal account
4. Under **Repository access**, select **Only select repositories** and choose this repo
5. Click **Install**

Once installed, Renovate will open an **onboarding PR** within a few minutes.
This PR shows a preview of what Renovate would do — review it carefully before merging.
The `renovate.json` in this repo is already configured, so the onboarding PR should
reflect the correct grouping rules.

> After merging the onboarding PR, Renovate runs on its weekly Monday schedule.
> The first run may open up to 10 grouped PRs (set by `prConcurrentLimit`).

### Renovate Dashboard

Once active, Renovate creates a **Dependency Dashboard** issue in your repo — a live
overview of all pending updates, blocked PRs, and vulnerability alerts. This is your
primary visibility tool for dependency health.

---

## Step 4 — Verify CI is Working

Push the `feature/security-dependency-hardening` branch and open a PR against `staging`
or `main`.

In the **Checks** tab of the PR, verify all three jobs pass:

| Job | What it checks |
|---|---|
| `npm audit` | Known CVEs in root + `src/sanity` dependencies |
| `Trivy scan` | Broader CVE scan (OSV/NVD) + secret detection |
| `TypeScript` | Type regressions from dependency updates |

If `npm audit` fails, run `npm audit fix` locally and push the updated lockfile.

---

## Step 5 — Vercel: No Required Changes

The security workflow runs entirely on GitHub Actions and does not interact with Vercel.

However, two Vercel settings are worth reviewing while you're here:

### 5a — Ensure `npm ci` is used in Vercel builds (not `npm install`)

In your Vercel project dashboard:

1. Go to **Settings** → **General** → **Build & Development Settings**
2. Confirm the **Install Command** is blank (Vercel defaults to `npm ci` when a
   `package-lock.json` is present) or explicitly set to `npm ci`

This ensures Vercel respects your lockfile exactly, the same way CI does.

### 5b — Review Environment Variables for Secret Exposure

Trivy's secret scanner will flag hardcoded secrets in source files.
Ensure all secrets are stored as Vercel environment variables, not in committed files.

1. Go to **Settings** → **Environment Variables**
2. Confirm all sensitive values (API keys, tokens, database URLs) are stored here
3. Nothing sensitive should appear in `.env`, `.env.local`, or source files

---

## Ongoing Maintenance

### Weekly (automated)
- Renovate opens grouped dependency PRs on Monday mornings
- Security workflow runs its weekly audit cron on Monday at 09:00 UTC

### As needed
- Review and merge Renovate PRs — patch updates are generally safe
- Sanity, tRPC, tRPC updates require a manual review pass
- `next`, `react`, `react-dom` updates always require manual testing before merging

### Tightening the audit threshold
Once `npm audit fix` has cleared the existing backlog, update `.github/workflows/security.yml`:

```yaml
# Change both occurrences from:
run: npm audit --audit-level=critical
# To:
run: npm audit --audit-level=high
```

### If Trivy fails on a false positive
Trivy can occasionally flag a vulnerability in a transitive dependency that has no
available fix. To suppress a specific CVE temporarily:

1. Create `.trivyignore` at the project root
2. Add the CVE ID on its own line, with a comment explaining why:

```
# CVE-2023-XXXXX: false positive in transitive dep, no fix available upstream
CVE-2023-XXXXX
```

---

## Summary Checklist

- [ ] Run `npm audit fix` locally (root + `src/sanity`)
- [ ] Enable Dependency graph in GitHub repo settings
- [ ] Enable Dependabot alerts in GitHub repo settings
- [ ] Enable Secret scanning in GitHub repo settings
- [ ] Create GitHub labels (optional but recommended)
- [ ] Install Renovate Bot via github.com/apps/renovate
- [ ] Merge Renovate onboarding PR
- [ ] Open a PR with this branch and verify all 3 CI jobs pass
- [ ] Once audit backlog is clear, tighten `--audit-level` to `high` in `security.yml`
- [ ] Confirm Vercel install command uses `npm ci`
- [ ] Review Vercel environment variables for any exposed secrets
