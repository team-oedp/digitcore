import type { Link } from "../sanity.types";

/**
 * Resolves a Link object to its corresponding URL path or external href.
 *
 * @param link - The Link object to resolve, can be undefined
 * @returns The resolved URL string, or null if the link cannot be resolved
 *
 * @example
 * ```ts
 * // External URL
 * linkResolver({ linkType: 'href', href: 'https://example.com' }) // 'https://example.com'
 *
 * // Internal page
 * linkResolver({ linkType: 'page', page: 'about' }) // '/about'
 *
 * // Pattern page
 * linkResolver({ linkType: 'pattern', pattern: 'hero-section' }) // '/pattern/hero-section'
 * ```
 */
export function linkResolver(link: Link | undefined) {
	if (!link) return null;

	// If linkType is not set but href is, lets set linkType to "href".  This comes into play when pasting links into the portable text editor because a link type is not assumed.
	if (!link.linkType && link.href) {
		link.linkType = "href";
	}

	// support projections where page/pattern are slug strings
	const pageSlug: string | undefined =
		typeof (link as unknown as { page?: unknown })?.page === "string"
			? ((link as unknown as { page?: string }).page as string)
			: undefined;
	const patternSlug: string | undefined =
		typeof (link as unknown as { pattern?: unknown })?.pattern === "string"
			? ((link as unknown as { pattern?: string }).pattern as string)
			: undefined;
	switch (link.linkType) {
		case "href":
			return link.href || null;
		case "page":
			if (pageSlug) {
				// Home page uses root route
				if (pageSlug === "/") return "/";
				// All other pages use /page/[slug] route structure
				return `/page/${pageSlug}`;
			}
			return null;
		case "pattern":
			if (patternSlug) return `/pattern/${patternSlug}`;
			return null;
		case "orientation":
			return "/orientation";
		default:
			return null;
	}
}
