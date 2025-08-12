import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
	const url = req.nextUrl;
	const pathname = url.pathname;

	// Allow onboarding itself and static assets
	if (
		pathname.startsWith("/onboarding") ||
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.startsWith("/favicon") ||
		pathname.startsWith("/oedp-icon") ||
		pathname.startsWith("/sitemap") ||
		pathname.startsWith("/robots")
	) {
		return NextResponse.next();
	}

	const hasCompleted = req.cookies.get("onboarding_completed")?.value;
	if (!hasCompleted) {
		// Preserve destination
		const onboardingUrl = req.nextUrl.clone();
		onboardingUrl.pathname = "/onboarding";
		// pass through pattern slug separately so onboarding can show pattern title
		if (pathname.startsWith("/pattern/")) {
			const parts = pathname.split("/");
			const slug = parts[2];
			if (slug) onboardingUrl.searchParams.set("pattern", slug);
		}
		// Always include returnTo
		onboardingUrl.searchParams.set("returnTo", url.pathname + url.search);
		return NextResponse.redirect(onboardingUrl);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next|.*..*).*)"],
};
