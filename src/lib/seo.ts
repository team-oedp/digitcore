import { buildAbsoluteUrl } from "~/lib/metadata";

export function buildHreflang(
	siteUrl: string,
	pathname: string,
	languages: string[],
): Record<string, string> {
	const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
	const entries = languages.map((lang) => {
		const loc = `/${lang}${normalizedPath === "/" ? "" : normalizedPath}`;
		return [lang, buildAbsoluteUrl(siteUrl, loc)] as const;
	});
	const map: Record<string, string> = Object.fromEntries(entries);
	map["x-default"] = buildAbsoluteUrl(siteUrl, "/");
	return map;
}
