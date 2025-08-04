import { useCallback, useEffect, useState } from "react";
import Typesense from "typesense";
import { useDebounce } from "use-debounce";

// Create Typesense client
const typesenseClient = new Typesense.Client({
	nodes: [
		{
			host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || "localhost",
			port: Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT) || 8108,
			protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "http",
		},
	],
	apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY || "xyz",
	connectionTimeoutSeconds: 2,
});

export type TypesenseSearchResult = {
	id: string;
	title: string;
	description?: string;
	type: "pattern" | "solution" | "resource";
	slug?: string;
	patternId?: string;
	tags?: string;
	audiences?: string;
	theme?: string;
	solutions?: string;
	resources?: string;
	publishedAt?: string;
	_score?: number;
};

export type UseTypesenseSearchOptions = {
	collectionName: string;
	patternSlug?: string;
	debounceDelay?: number;
};

export function useTypesenseSearch({
	collectionName,
	patternSlug,
	debounceDelay = 300,
}: UseTypesenseSearchOptions) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<TypesenseSearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [debouncedQuery] = useDebounce(query, debounceDelay);

	const search = useCallback(
		async (searchQuery: string) => {
			if (!searchQuery.trim()) {
				setResults([]);
				setError(null);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				// Build search parameters with pattern filtering if needed
				const searchParameters: {
					q: string;
					query_by: string;
					per_page: number;
					filter_by?: string;
				} = {
					q: searchQuery,
					query_by:
						"title,description,tags,audiences,theme,solutions,resources",
					per_page: 20,
				};

				if (patternSlug) {
					// First, find the pattern ID from the slug
					const patternLookup = await typesenseClient
						.collections(collectionName)
						.documents()
						.search({
							q: "*",
							query_by: "slug",
							filter_by: `slug:=${patternSlug} && type:=pattern`,
							per_page: 1,
						});

					if (patternLookup.hits && patternLookup.hits.length > 0) {
						const document = patternLookup.hits[0]?.document as {
							patternId?: string;
						};
						const patternId = document?.patternId;
						if (patternId) {
							console.log("Found pattern ID for slug:", {
								patternSlug,
								patternId,
							});
							searchParameters.filter_by = `patternId:=${patternId}`;
						}
					} else {
						console.warn("No pattern found for slug:", patternSlug);
					}
				}

				const searchResults = await typesenseClient
					.collections(collectionName)
					.documents()
					.search(searchParameters);

				// Transform the results to our format
				console.log("Typesense Raw Results:", {
					found: searchResults.found,
					hits: searchResults.hits?.length || 0,
					firstHit: searchResults.hits?.[0],
					searchParameters,
				});

				const transformedResults: TypesenseSearchResult[] =
					searchResults.hits?.map((hit) => {
						const doc = hit.document as Record<string, unknown>;
						return {
							id: doc.id as string,
							title: doc.title as string,
							description: doc.description as string | undefined,
							type: doc.type as "pattern" | "solution" | "resource",
							slug: doc.slug as string | undefined,
							patternId: doc.patternId as string | undefined,
							_score: hit.text_match,
						};
					}) || [];

				console.log("Transformed Results:", transformedResults);
				setResults(transformedResults);
			} catch (err) {
				console.error("TypeSense search error:", err);
				setError(err instanceof Error ? err.message : "Search failed");
				setResults([]);
			} finally {
				setIsLoading(false);
			}
		},
		[collectionName, patternSlug],
	);

	// Perform search when debounced query changes
	useEffect(() => {
		if (debouncedQuery) {
			search(debouncedQuery);
		} else {
			setResults([]);
		}
	}, [debouncedQuery, search]);

	const clearSearch = useCallback(() => {
		setQuery("");
		setResults([]);
		setError(null);
	}, []);

	return {
		query,
		setQuery,
		results,
		isLoading,
		error,
		clearSearch,
	};
}
