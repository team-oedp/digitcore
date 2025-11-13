import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import { fetchFilterOptions } from "~/app/actions/filter-options";
import { parseLocalePath } from "~/lib/locale-path";
import { sanityFetch } from "~/sanity/lib/client";
import {
	ONBOARDING_QUERY,
	PAGE_BY_SLUG_QUERY,
	PATTERN_QUERY,
} from "~/sanity/lib/queries";
import type { Onboarding } from "~/sanity/sanity.types";
import type { LanguageSearchPageProps } from "~/types/page-props";
import { OrientationClient } from "./orientation-client";

export const metadata: Metadata = {
	title: "Onboarding | DIGITCORE Toolkit",
	description: "Onboarding to the DIGITCORE Toolkit.",
};

export default async function Page(props: LanguageSearchPageProps) {
	const [{ language }, searchParams] = await Promise.all([
		props.params,
		props.searchParams,
	]);

	const [onboarding, filters] = await Promise.all([
		sanityFetch({
			query: ONBOARDING_QUERY,
			params: { language },
			revalidate: 60,
		}) as Promise<Onboarding | null>,
		fetchFilterOptions(language),
	]);

	// Resolve pattern title if a pattern slug was provided
	const patternSlug =
		(searchParams?.pattern as string | undefined) ?? undefined;
	let patternTitle: string | undefined;
	if (patternSlug) {
		try {
			const pattern = await sanityFetch({
				query: PATTERN_QUERY,
				params: { slug: patternSlug, language },
				revalidate: 60,
			});
			patternTitle = pattern?.title || undefined;
		} catch {}
	}

	let returnToPath =
		(searchParams?.returnTo as string | undefined) ?? undefined;

	// Fallback: if no returnTo parameter, try to get it from referer header
	if (!returnToPath) {
		const headersList = await headers();
		const referer = headersList.get("referer");
		if (referer) {
			try {
				const refererUrl = new URL(referer);
				// Only use referer if it's from the same origin (for security)
				// In development, allow localhost and 127.0.0.1
				const isLocalhost =
					refererUrl.hostname === "localhost" ||
					refererUrl.hostname === "127.0.0.1";
				const isSameOrigin =
					process.env.NEXT_PUBLIC_SITE_URL &&
					refererUrl.origin === process.env.NEXT_PUBLIC_SITE_URL;

				if (isLocalhost || isSameOrigin) {
					returnToPath = refererUrl.pathname + refererUrl.search;

					if (process.env.NODE_ENV === "development") {
						console.log("Using referer as returnToPath:", returnToPath);
					}
				}
			} catch {
				// Invalid referer URL, ignore
			}
		}
	}

	// Filter out orientation from returnToPath - never allow it as a return path
	if (returnToPath) {
		const { normalizedPath } = parseLocalePath(returnToPath);
		if (normalizedPath === "/orientation" || normalizedPath.startsWith("/orientation/")) {
			returnToPath = undefined;
		}
	}

	// Resolve page title if returnToPath points to a page route
	let pageTitle: string | undefined;
	if (returnToPath) {
		try {
			// Decode the URL-encoded path (handles %2F -> /)
			const decodedPath = decodeURIComponent(returnToPath);
			const { normalizedPath } = parseLocalePath(decodedPath);
			// Check if it's a page route (not home, not pattern routes, not carrier-bag)
			const isPageRoute =
				normalizedPath !== "/" &&
				!normalizedPath.startsWith("/pattern/") &&
				normalizedPath !== "/carrier-bag";

			if (isPageRoute) {
				const pageSlug = normalizedPath.slice(1); // Remove leading slash
				const page = await sanityFetch({
					query: PAGE_BY_SLUG_QUERY,
					params: { slug: pageSlug, language },
					revalidate: 60,
				});
				pageTitle = page?.title || undefined;

				if (process.env.NODE_ENV === "development") {
					console.log("Orientation page fetch:", {
						returnToPath,
						decodedPath,
						normalizedPath,
						pageSlug,
						language,
						pageTitle,
						pageExists: !!page,
					});
				}
			}
		} catch (error) {
			if (process.env.NODE_ENV === "development") {
				console.error("Error fetching page title:", error);
			}
		}
	}

	return (
		<Suspense fallback={null}>
			<OrientationClient
				onboarding={onboarding ?? undefined}
				patternTitle={patternTitle}
				returnToPath={returnToPath}
				pageTitle={pageTitle}
				audienceOptions={
					filters.success && filters.data ? filters.data.audiences : []
				}
				themeOptions={
					filters.success && filters.data ? filters.data.themes : []
				}
			/>
		</Suspense>
	);
}
