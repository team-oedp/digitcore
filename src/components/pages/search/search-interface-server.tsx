import type { FilterOption } from "~/sanity/lib/get-filter-options";
import { getFilterOptions } from "~/sanity/lib/get-filter-options";
import { SearchInterface } from "./search-interface";

export async function SearchInterfaceServer() {
	const { audiences, themes, tags } = await getFilterOptions();

	return (
		<SearchInterface
			audienceOptions={audiences as FilterOption[]}
			themeOptions={themes as FilterOption[]}
			tagOptions={tags as FilterOption[]}
		/>
	);
}
