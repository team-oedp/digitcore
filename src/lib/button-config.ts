/**
 * Centralized configuration for content type buttons
 * Provides consistent styling, text, and behavior across the application
 */

export const CONTENT_BUTTON_CONFIG = {
	pattern: {
		text: "Visit Pattern",
		variant: "pattern" as const,
		href: (slug: string) => `/pattern/${slug}`,
		iconColor: "text-green-800",
	},
	solution: {
		text: "Visit Solution",
		variant: "solution" as const,
		href: (patternSlug: string, solutionSlug: string) =>
			`/pattern/${patternSlug}/#solution-${solutionSlug}`,
		iconColor: "text-purple-800",
	},
	resource: {
		text: "Visit Resource",
		variant: "resource" as const,
		href: (patternSlug: string, resourceSlug: string) =>
			`/pattern/${patternSlug}/#resource-${resourceSlug}`,
		iconColor: "text-fuchsia-800",
	},
} as const;

export type ContentType = keyof typeof CONTENT_BUTTON_CONFIG;
export type ButtonVariant =
	(typeof CONTENT_BUTTON_CONFIG)[ContentType]["variant"];
