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
	searchTerm?: string;
};

export function SearchResults({
	patterns = [],
	searchTerm = "",
}: SearchResultsProps) {
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
