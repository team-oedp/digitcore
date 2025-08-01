"use client";

import type { SearchPattern } from "~/app/actions/search";
import { SearchResultItem } from "./search-result-item";

type PatternSearchResultData = {
	_id: string;
	_type: "pattern";
	title?: string | null;
	slug?: string | null;
	description?: Array<{
		children?: Array<{
			text?: string;
			_type: string;
			_key: string;
		}>;
		_type: string;
		_key: string;
	}> | null;
	themes?: Array<{
		_id: string;
		title?: string;
		description?: Array<unknown>;
	}> | null;
	tags?: Array<{
		_id: string;
		title?: string;
	}> | null;
	audiences?: Array<{
		_id: string;
		title: string | null;
	}> | null;
};

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
					<SearchResultItem pattern={pattern as PatternSearchResultData} />
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
