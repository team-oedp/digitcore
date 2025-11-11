import type { Language } from "~/i18n/config";
import { buildAbsoluteUrl } from "~/lib/metadata";

export function buildHreflang(
	siteUrl: string,
	pathname: string,
	languages: string[],
	slugMap?: Record<Language, string>,
): Record<string, string> {
	const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
	const entries = languages.map((lang) => {
		// Use custom slug if provided, otherwise use the pathname
		const slug = slugMap?.[lang as Language] ?? normalizedPath;
		const loc = `/${lang}${slug === "/" ? "" : slug}`;
		return [lang, buildAbsoluteUrl(siteUrl, loc)] as const;
	});
	const map: Record<string, string> = Object.fromEntries(entries);
	map["x-default"] = buildAbsoluteUrl(siteUrl, "/");
	return map;
}
