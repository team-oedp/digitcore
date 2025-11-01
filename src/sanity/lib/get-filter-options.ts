import { unstable_cache as cache } from "next/cache";
import { draftMode } from "next/headers";
import type { Language } from "~/i18n/config";
import { client } from "~/sanity/lib/client";
import { FILTER_OPTIONS_QUERY } from "~/sanity/lib/queries";
import { token } from "~/sanity/lib/token";

export type FilterOption = { value: string; label: string };
export type FilterOptions = {
	audiences: FilterOption[];
	themes: FilterOption[];
	tags: FilterOption[];
};

async function fetchFilterOptionsFromSanityInternal(
	isDraft: boolean,
	language: Language,
): Promise<FilterOptions> {
	const response = await client.fetch(
		FILTER_OPTIONS_QUERY,
		{ language },
		isDraft
			? { perspective: "previewDrafts", useCdn: false, stega: true, token }
			: { perspective: "published", useCdn: true },
	);

	const normalize = (xs: Array<{ value: string; label: string | null }>) =>
		xs
			.filter((x) => x.label != null)
			.map((x) => ({ value: x.value, label: x.label as string }));

	return {
		audiences: normalize(response?.audiences ?? []),
		themes: normalize(response?.themes ?? []),
		tags: normalize(response?.tags ?? []),
	};
}

// Cached getter for published mode (shared across RSCs)
const getFilterOptionsCached = cache(
	async (language: Language) =>
		fetchFilterOptionsFromSanityInternal(false, language),
	["filter-options"],
	{ revalidate: 60, tags: ["filter-options"] },
);

export async function getFilterOptions(
	language: Language,
): Promise<FilterOptions> {
	const isDraft = (await draftMode()).isEnabled;
	if (isDraft) return fetchFilterOptionsFromSanityInternal(true, language);
	return getFilterOptionsCached(language);
}
