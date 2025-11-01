import { type Language, i18n, supportedLanguageIds } from "~/i18n/config";

export type ParsedLocalePath = {
	language: Language;
	normalizedPath: string;
	segments: string[];
};

export function parseLocalePath(
	pathname: string | null | undefined,
): ParsedLocalePath {
	const segments = pathname?.split("/").filter(Boolean) ?? [];
	const [maybeLanguage, ...rest] = segments;
	const isKnownLanguage =
		typeof maybeLanguage === "string" &&
		supportedLanguageIds.has(maybeLanguage as Language);

	const language = (isKnownLanguage ? maybeLanguage : i18n.base) as Language;
	const pathSegments = isKnownLanguage ? rest : segments;

	const normalizedPath =
		pathSegments.length > 0 ? `/${pathSegments.join("/")}` : "/";

	return {
		language,
		normalizedPath,
		segments: pathSegments,
	};
}

export function buildLocaleHref(language: Language, target: string) {
	const url = new URL(target || "/", "https://example.com");
	const segments = url.pathname.split("/").filter(Boolean);

	if (segments[0] && supportedLanguageIds.has(segments[0] as Language)) {
		segments[0] = language;
	} else {
		segments.unshift(language);
	}

	url.pathname = segments.length ? `/${segments.join("/")}` : `/${language}`;
	return `${url.pathname}${url.search}${url.hash}`;
}
