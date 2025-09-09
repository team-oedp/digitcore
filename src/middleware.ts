import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to handle onboarding redirects at the edge.
 * Runs before any page rendering, preventing flash of content.
 *
 * Logic:
 * - First-time visitors (no cookies) → Redirect to onboarding
 * - Users who completed onboarding → Never redirect
 * - Users who skipped onboarding → May redirect on return visits
 */
export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// Skip onboarding page itself and API routes
	if (pathname === "/onboarding" || pathname.startsWith("/api/")) {
		return NextResponse.next();
	}

	// Only redirect GET requests (not POST, PUT, DELETE, etc)
	if (request.method !== "GET") {
		return NextResponse.next();
	}

	// Check cookies for onboarding status
	const completedCookie = request.cookies.get("onboarding_completed");
	const skippedCookie = request.cookies.get("onboarding_skipped");

	const hasCompletedOnboarding =
		completedCookie?.value === "1" || completedCookie?.value === "true";
	const hasSkippedOnboarding =
		skippedCookie?.value === "1" || skippedCookie?.value === "true";

	// If user completed onboarding, never redirect them
	if (hasCompletedOnboarding) {
		return NextResponse.next();
	}

	// If user has neither completed nor skipped (first-time visitor), redirect to onboarding
	// OR if user skipped but enough time has passed (cookie expired), redirect again
	if (!hasCompletedOnboarding && !hasSkippedOnboarding) {
		const url = request.nextUrl.clone();
		url.pathname = "/onboarding";

		// Preserve pattern slug if navigating to a pattern page
		if (pathname.startsWith("/pattern/")) {
			const segments = pathname.split("/");
			const slug = segments[2];
			if (slug) {
				url.searchParams.set("pattern", slug);
			}
		}

		// Preserve the original destination with query params
		const fullPath = pathname + (request.nextUrl.search || "");
		url.searchParams.set("returnTo", fullPath);

		return NextResponse.redirect(url);
	}

	// User has skipped onboarding - let them browse
	return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - api routes (/api/*)
		 * - static files (_next/static/*)
		 * - image optimization (_next/image/*)
		 * - favicon.ico
		 * - public files (robots.txt, sitemap.xml, etc)
		 * - Sanity Studio (/studio/*)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|studio).*)",
	],
};
