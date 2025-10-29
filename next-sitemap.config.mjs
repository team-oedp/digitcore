// next-sitemap configuration (ESM)
// Docs: https://next-sitemap.com/docs

import { createClient } from "next-sanity";

const siteUrl = process.env.SITE_URL || "https://digitcore.org";

// Minimal Sanity client to fetch dynamic slugs
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-07-23";

const sanityClient = projectId
	? createClient({ projectId, dataset, apiVersion, useCdn: true })
	: null;

async function fetchPatternSlugs() {
	if (!sanityClient) return [];
	const query = `*[_type == "pattern" && defined(slug.current)][]{
    "slug": slug.current
  }`;
	try {
		const rows = await sanityClient.fetch(query);
		return Array.isArray(rows) ? rows.map((r) => r.slug).filter(Boolean) : [];
	} catch {
		return [];
	}
}

async function fetchPageLanguages(slug) {
  if (!sanityClient) return [];
  const where = slug === "/" ? "slug.current == '/'" : `slug.current == '${slug}'`;
  const query = `array::unique(*[_type == "page" && ${where} && defined(language)].language)`;
  try {
    const langs = await sanityClient.fetch(query);
    return Array.isArray(langs) ? langs.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export default {
	siteUrl,
	generateRobotsTxt: true,
	sitemapBaseFileName: "sitemap",
	outDir: "public",
	// Auto-discovers static App Router routes; add dynamic ones here
	additionalPaths: async (config) => {
    const results = [];
    // Static pages
    const staticPages = ["/", "about", "values", "glossary"];
    for (const slug of staticPages) {
      const path = slug === "/" ? "/" : `/${slug}`;
      const languages = await fetchPageLanguages(slug === "/" ? "/" : slug);
      for (const lang of languages) {
        results.push({ loc: `/${lang}${path === "/" ? "" : path}` });
      }
    }

    // Patterns per language
    const slugs = await fetchPatternSlugs();
    for (const slug of slugs) {
      // If patterns are language-scoped, fetch their languages; otherwise, emit for known languages
      const langs = await sanityClient.fetch(
        `array::unique(*[_type == "pattern" && slug.current == $slug && defined(language)].language)`,
        { slug },
      ).catch(() => []);
      for (const lang of Array.isArray(langs) ? langs : []) {
        results.push({ loc: `/${lang}/pattern/${slug}` });
      }
    }
    return results;
	},
	robotsTxtOptions: {
		policies: [{ userAgent: "*", allow: "/" }],
		additionalSitemaps: [`${siteUrl.replace(/\/$/, "")}/sitemap.xml`],
	},
};
