import { FILTER_OPTIONS_QUERY } from "~/sanity/lib/filter-options";
import { sanityFetch } from "~/sanity/lib/live";
import { SearchInterface } from "./search-interface";

export async function SearchInterfaceWrapper() {
	// Fetch filter options from Sanity
	const { data: filterOptions } = await sanityFetch({
		query: FILTER_OPTIONS_QUERY,
	});

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
