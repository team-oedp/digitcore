import { draftMode } from "next/headers";
import { client } from "~/sanity/lib/client";
import { FILTER_OPTIONS_QUERY } from "~/sanity/lib/filter-options";
import { token } from "~/sanity/lib/token";
import { SearchInterface } from "./search-interface";

export async function SearchInterfaceWrapper() {
	const isDraftMode = (await draftMode()).isEnabled;

	// Fetch filter options from Sanity
	const filterOptions = await client.fetch(
		FILTER_OPTIONS_QUERY,
		{},
		isDraftMode
			? {
					perspective: "previewDrafts",
					useCdn: false,
					stega: true,
					token,
				}
			: {
					perspective: "published",
					useCdn: true,
				},
	);

	// Provide default options if fetch fails and filter out null labels
	const audiences = (filterOptions?.audiences || []).filter(
		(item): item is typeof item & { label: string } => item.label !== null,
	);
	const themes = (filterOptions?.themes || []).filter(
		(item): item is typeof item & { label: string } => item.label !== null,
	);
	const tags = (filterOptions?.tags || []).filter(
		(item): item is typeof item & { label: string } => item.label !== null,
	);

	return (
		<SearchInterface
			audienceOptions={audiences}
			themeOptions={themes}
			tagOptions={tags}
		/>
	);
}
