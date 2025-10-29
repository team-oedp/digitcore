import type { Language } from "~/i18n/config";
import type { FilterOption } from "~/sanity/lib/get-filter-options";
import { getFilterOptions } from "~/sanity/lib/get-filter-options";
import { SearchInterface } from "./search-interface";

type SearchInterfaceServerProps = {
	language: Language;
};

export async function SearchInterfaceServer({
	language,
}: SearchInterfaceServerProps) {
	const { audiences, themes, tags } = await getFilterOptions(language);

	return (
		<SearchInterface
			audienceOptions={audiences as FilterOption[]}
			themeOptions={themes as FilterOption[]}
			tagOptions={tags as FilterOption[]}
		/>
	);
}
