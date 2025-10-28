export type RouteSlug = string | string[] | undefined;

export const normalizeSlug = (slug: RouteSlug): string => {
	if (Array.isArray(slug)) {
		return slug.filter(Boolean)[0] ?? "";
	}

	return slug ?? "";
};
