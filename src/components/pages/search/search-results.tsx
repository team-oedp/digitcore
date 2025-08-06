"use client";

import type { SearchPattern } from "~/app/actions/search";
import { SearchResultItem } from "./search-result-item";

type SearchResultsProps = {
	patterns?: SearchPattern[];
	searchTerm?: string;
};

export function SearchResults({ patterns = [], searchTerm = "" }: SearchResultsProps) {
	if (!patterns || patterns.length === 0) {
		return null; // Empty state is now handled by the search page
	}

	return (
		<div className="w-full">
			{patterns.map((pattern) => (
				<SearchResultItem 
					key={pattern._id} 
					pattern={pattern} 
					searchTerm={searchTerm}
				/>
			))}
		</div>
	);
}
