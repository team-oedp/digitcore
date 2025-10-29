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

export default {
	siteUrl,
	generateRobotsTxt: true,
	sitemapBaseFileName: "sitemap",
	outDir: "public",
	// Auto-discovers static App Router routes; add dynamic ones here
	additionalPaths: async (config) => {
		const slugs = await fetchPatternSlugs();
		return slugs.map((slug) => ({ loc: `/pattern/${slug}` }));
	},
	robotsTxtOptions: {
		policies: [{ userAgent: "*", allow: "/" }],
		additionalSitemaps: [`${siteUrl.replace(/\/$/, "")}/sitemap.xml`],
	},
};
