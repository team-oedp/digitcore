import type { Language } from "~/i18n/config";
import { sanityFetch } from "~/sanity/lib/client";
import type { FilterOption } from "~/sanity/lib/get-filter-options";
import { getFilterOptions } from "~/sanity/lib/get-filter-options";
import { SEARCH_QUERY } from "~/sanity/lib/queries";
import { SearchInterface } from "./search-interface";

type SearchInterfaceServerProps = {
	language: Language;
};

export async function SearchInterfaceServer({
	language,
}: SearchInterfaceServerProps) {
	const { audiences, themes, tags } = await getFilterOptions(language);
	const searchData = await sanityFetch({
		query: SEARCH_QUERY,
		params: { language },
		revalidate: 60,
	});

	return (
		<SearchInterface
			audienceOptions={audiences as FilterOption[]}
			themeOptions={themes as FilterOption[]}
			tagOptions={tags as FilterOption[]}
			searchData={searchData}
			language={language}
		/>
	);
}
