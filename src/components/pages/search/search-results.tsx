"use client";

import type { SearchPattern } from "~/app/actions/search";
import { SearchResultItem } from "./search-result-item";

type SearchResultsProps = {
	patterns?: SearchPattern[];
};

export function SearchResults({ patterns = [] }: SearchResultsProps) {
	if (!patterns || patterns.length === 0) {
		return null; // Empty state is now handled by the search page
	}

	return (
		<div className="w-full">
			{patterns.map((pattern) => (
				<div key={pattern._id} className="relative">
					<SearchResultItem pattern={pattern} />
					{/* Optional: Show search score for debugging */}
					{process.env.NODE_ENV === "development" && pattern._score && (
						<div className="absolute top-2 right-2 rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-400">
							Score: {pattern._score.toFixed(2)}
						</div>
					)}
				</div>
			))}
		</div>
	);
}
