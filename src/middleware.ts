import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to handle onboarding redirects at the edge.
 * Runs before any page rendering, preventing flash of content.
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

	// Check if user has completed onboarding
	const onboardingCookie = request.cookies.get("onboarding_completed");
	const hasCompletedOnboarding =
		onboardingCookie?.value === "1" || onboardingCookie?.value === "true";

	// If onboarding not completed, redirect to onboarding page
	if (!hasCompletedOnboarding) {
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

	// Continue to requested page if onboarding is complete
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
