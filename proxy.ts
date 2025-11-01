import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { type Language, i18n, supportedLanguageIds } from "~/i18n/config";

const supportedLanguages = Array.from(supportedLanguageIds.values());

function resolveLocale(candidate: string | undefined): Language {
	if (candidate && supportedLanguageIds.has(candidate as Language)) {
		return candidate as Language;
	}

	return i18n.base;
}

function getLocale(request: NextRequest): Language {
	// Negotiator expects plain object so we need to transform headers
	const negotiatorHeaders: Record<string, string> = {};
	request.headers.forEach((value, key) => {
		negotiatorHeaders[key] = value;
	});

	const languages =
		new Negotiator({ headers: negotiatorHeaders }).languages() ?? [];

	const matchedLocale = matchLocale(languages, supportedLanguages, i18n.base);
	return resolveLocale(matchedLocale);
}

export function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// Check if there is any supported locale in the pathname
	const pathnameIsMissingLocale = supportedLanguages.every(
		(locale) =>
			!pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
	);

	// Redirect if there is no locale
	if (pathnameIsMissingLocale) {
		const locale = getLocale(request);
		const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
		const destination =
			normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;

		// e.g. incoming request is /patterns
		// The new URL is now /en-US/patterns
		return NextResponse.redirect(new URL(destination, request.url));
	}

	return NextResponse.next();
}

export const config = {
	// Matcher ignoring `/_next/` and `/api/`
	matcher: ["/((?!api|_next|.*\\..*).*)"],
};
