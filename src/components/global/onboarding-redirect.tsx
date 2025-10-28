"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { parseLocalePath } from "~/lib/locale-path";
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
		const { language, normalizedPath } = parseLocalePath(pathname);
		// Wait for hydration before checking
		if (!hasHydrated) return;

		// Prevent multiple redirects
		if (redirected.current) return;

		// Skip if we're already on the orientation page
		if (normalizedPath === "/orientation") {
			return;
		}

		// Skip for API routes, static assets, and studio
		if (
			normalizedPath?.startsWith("/api/") ||
			normalizedPath?.startsWith("/_next/") ||
			normalizedPath?.startsWith("/studio")
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
				normalizedPath,
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
			const url = new URL(`/${language}/orientation`, window.location.origin);

			// Preserve pattern slug if navigating to a pattern page
			if (normalizedPath?.startsWith("/pattern/")) {
				const segments = normalizedPath.split("/");
				const slug = segments[2];
				if (slug) {
					url.searchParams.set("pattern", slug);
				}
			}

			// For home page, don't add returnTo parameter to avoid %2F encoding
			// Only add returnTo for non-home pages
			if (normalizedPath !== "/") {
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
