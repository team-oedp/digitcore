"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useOrientationStore } from "~/stores/orientation";

/**
 * Client-side component to handle orientation redirects.
 * Checks the orientation store state and redirects to /orientation if needed.
 */
export function OrientationRedirect() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const redirected = useRef(false);

	// Get the orientation state including hydration status
	const hasHydrated = useOrientationStore((s) => s.hasHydrated);
	const hasSeenOrientation = useOrientationStore((s) => s.hasSeenOrientation);
	const hasCompletedOrientation = useOrientationStore(
		(s) => s.hasCompletedOrientation,
	);
	const hasSkippedOrientation = useOrientationStore(
		(s) => s.hasSkippedOrientation,
	);
	const shouldShowOrientation = useOrientationStore(
		(s) => s.shouldShowOrientation,
	);
	const checkAndResetExpiredSkip = useOrientationStore(
		(s) => s.checkAndResetExpiredSkip,
	);

	useEffect(() => {
		// Wait for hydration before checking
		if (!hasHydrated) return;

		// Prevent multiple redirects
		if (redirected.current) return;

		// Skip if we're already on the orientation page
		if (pathname === "/orientation") {
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

		// Log current orientation state for debugging
		if (process.env.NODE_ENV === "development") {
			console.log("OrientationRedirect - State:", {
				hasSeenOrientation,
				hasCompletedOrientation,
				hasSkippedOrientation,
				shouldShow: shouldShowOrientation(),
				pathname,
			});
		}

		// Early exit if user has completed or currently has valid skip
		if (hasCompletedOrientation || hasSkippedOrientation) {
			return;
		}

		// Check and reset expired skip status if needed
		const skipExpired = checkAndResetExpiredSkip();

		// Check if we should redirect using the store logic
		const shouldRedirect = shouldShowOrientation() || skipExpired;

		if (shouldRedirect) {
			redirected.current = true;

			// Build redirect URL with return path and pattern info
			const url = new URL("/orientation", window.location.origin);

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
		hasSeenOrientation,
		hasCompletedOrientation,
		hasSkippedOrientation,
		pathname,
		searchParams,
		router,
		shouldShowOrientation,
		checkAndResetExpiredSkip,
	]);

	return null;
}
