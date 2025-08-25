/**
 * Utility functions for generating navigation URLs from pattern page badges
 */

/**
 * Generate URL for tag badge navigation
 * Tags navigate to the /tags page with an anchor to scroll to the specific tag
 */
export function getTagNavigationUrl(tagTitle: string): string {
	// Get the first letter for the anchor navigation
	const firstLetter = tagTitle.charAt(0).toUpperCase();

	// Create the anchor that matches the tag name
	// Using the tag title as anchor for more precise scrolling
	const tagAnchor = encodeURIComponent(
		tagTitle.toLowerCase().replace(/\s+/g, "-"),
	);

	// Return URL with letter section and specific tag anchor
	return `/tags#letter-${firstLetter}`;
}

/**
 * Generate URL for audience badge navigation
 * Audiences navigate to the /explore page with the audience filter pre-selected
 */
export function getAudienceNavigationUrl(audienceId: string): string {
	// Create URL with audience filter parameter
	const params = new URLSearchParams({
		audiences: audienceId,
	});

	return `/explore?${params.toString()}`;
}

/**
 * Generate URL for theme badge navigation
 * Themes navigate to the /explore page with the theme filter pre-selected
 */
export function getThemeNavigationUrl(themeId: string): string {
	// Create URL with theme filter parameter
	const params = new URLSearchParams({
		themes: themeId,
	});

	return `/explore?${params.toString()}`;
}

/**
 * Helper to determine badge type and generate appropriate URL
 */
export type BadgeType = "tag" | "audience" | "theme";

export function getBadgeNavigationUrl(
	type: BadgeType,
	id: string,
	title?: string,
): string {
	switch (type) {
		case "tag":
			// Tags need the title for generating the anchor
			// Handle empty string as a valid (though unusual) case
			if (title === undefined || title === null) {
				console.warn("Tag title required for navigation");
				return "/tags";
			}
			return getTagNavigationUrl(title);
		case "audience":
			return getAudienceNavigationUrl(id);
		case "theme":
			return getThemeNavigationUrl(id);
		default:
			console.warn(`Unknown badge type: ${type}`);
			return "/";
	}
}
