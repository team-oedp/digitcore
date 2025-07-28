import type { Link } from "~/sanity/sanity.types";

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
 * linkResolver({ linkType: 'pattern', pattern: 'hero-section' }) // '/patterns/hero-section'
 * ```
 */
export function linkResolver(link: Link | undefined) {
	if (!link) return null;

	// If linkType is not set but href is, lets set linkType to "href".  This comes into play when pasting links into the portable text editor because a link type is not assumed.
	if (!link.linkType && link.href) {
		link.linkType = "href";
	}

	switch (link.linkType) {
		case "href":
			return link.href || null;
		case "page":
			if (link?.page && typeof link.page === "string") {
				return `/${link.page}`;
			}
			return null;
		case "pattern":
			if (link?.pattern && typeof link.pattern === "string") {
				return `/patterns/${link.pattern}`;
			}
			return null;
		default:
			return null;
	}
}
