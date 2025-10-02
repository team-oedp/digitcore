"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useOnboardingStore } from "~/stores/onboarding";

/**
 * Client-side component to handle onboarding redirects.
 * Checks the onboarding store state and redirects to /onboarding if needed.
 */
export function OnboardingRedirect() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const redirected = useRef(false);

	// Get the onboarding state including hydration status
	const hasHydrated = useOnboardingStore((s) => s.hasHydrated);
	const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);
	const hasCompletedOnboarding = useOnboardingStore(
		(s) => s.hasCompletedOnboarding,
	);
	const hasSkippedOnboarding = useOnboardingStore(
		(s) => s.hasSkippedOnboarding,
	);
	const shouldShowOnboarding = useOnboardingStore(
		(s) => s.shouldShowOnboarding,
	);
	const checkAndResetExpiredSkip = useOnboardingStore(
		(s) => s.checkAndResetExpiredSkip,
	);

	useEffect(() => {
		// Wait for hydration before checking
		if (!hasHydrated) return;

		// Prevent multiple redirects
		if (redirected.current) return;

		// Skip if we're already on the onboarding page
		if (pathname === "/onboarding") {
			return;
		}

		// Skip for API routes, static assets, and studio
		if (
			pathname?.startsWith("/api/") ||
			pathname?.startsWith("/_next/") ||
			pathname?.startsWith("/studio")
		) {
			return;
		}

		// Log current onboarding state for debugging
		if (process.env.NODE_ENV === "development") {
			console.log("OnboardingRedirect - State:", {
				hasSeenOnboarding,
				hasCompletedOnboarding,
				hasSkippedOnboarding,
				shouldShow: shouldShowOnboarding(),
				pathname,
			});
		}

		// Early exit if user has completed or currently has valid skip
		if (hasCompletedOnboarding || hasSkippedOnboarding) {
			return;
		}

		// Check and reset expired skip status if needed
		const skipExpired = checkAndResetExpiredSkip();

		// Check if we should redirect using the store logic
		const shouldRedirect = shouldShowOnboarding() || skipExpired;

		if (shouldRedirect) {
			redirected.current = true;

			// Build redirect URL with return path and pattern info
			const url = new URL("/onboarding", window.location.origin);

			// Preserve pattern slug if navigating to a pattern page
			if (pathname?.startsWith("/pattern/")) {
				const segments = pathname.split("/");
				const slug = segments[2];
				if (slug) {
					url.searchParams.set("pattern", slug);
				}
			}

			// For home page, don't add returnTo parameter to avoid %2F encoding
			// Only add returnTo for non-home pages
			if (pathname !== "/") {
				const fullPath =
					pathname +
					(searchParams?.toString() ? `?${searchParams.toString()}` : "");
				url.searchParams.set("returnTo", fullPath);
			}

			// Perform the redirect
			router.push(url.toString());
		}
	}, [
		hasHydrated,
		hasSeenOnboarding,
		hasCompletedOnboarding,
		hasSkippedOnboarding,
		pathname,
		searchParams,
		router,
		shouldShowOnboarding,
		checkAndResetExpiredSkip,
	]);

	return null;
}
