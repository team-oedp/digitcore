import type { Metadata } from "next";
import { Suspense } from "react";
import { fetchFilterOptions } from "~/app/actions/filter-options";
import { sanityFetch } from "~/sanity/lib/client";
import { ONBOARDING_QUERY, PATTERN_QUERY } from "~/sanity/lib/queries";
import type { Onboarding } from "~/sanity/sanity.types";
import { OrientationClient } from "./orientation-client";

export const metadata: Metadata = {
	title: "Onboarding | DIGITCORE Toolkit",
	description: "Onboarding to the DIGITCORE Toolkit.",
};

export default async function OnboardingPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const [onboarding, filters] = await Promise.all([
		sanityFetch({
			query: ONBOARDING_QUERY,
			revalidate: 60,
		}) as Promise<Onboarding | null>,
		fetchFilterOptions(),
	]);

	// Resolve pattern title if a pattern slug was provided
	const patternSlug = (params?.pattern as string | undefined) ?? undefined;
	let patternTitle: string | undefined;
	if (patternSlug) {
		try {
			const pattern = await sanityFetch({
				query: PATTERN_QUERY,
				params: { slug: patternSlug },
				revalidate: 60,
			});
			patternTitle = pattern?.title || undefined;
		} catch {}
	}

	const returnToPath = (params?.returnTo as string | undefined) ?? undefined;

	return (
		<Suspense fallback={null}>
			<OrientationClient
				onboarding={onboarding ?? undefined}
				patternTitle={patternTitle}
				returnToPath={returnToPath}
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
