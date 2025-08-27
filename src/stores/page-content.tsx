"use client";

import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import {
	type PatternSearchItem,
	searchPatternContent,
} from "~/app/actions/pattern-search";
import type {
	Audience,
	Pattern,
	Resource,
	Solution,
	Tag,
} from "~/sanity/sanity.types";

export type SearchableContent = {
	patterns: Pattern[];
	solutions: Solution[];
	resources: Resource[];
	tags: Tag[];
	audiences: Audience[];
};

export type SearchResult = {
	type: "pattern" | "solution" | "resource" | "tag" | "audience";
	item: (Pattern | Solution | Resource | Tag | Audience | PatternSearchItem) & {
		_nestedId?: string;
	};
	matchedText?: string;
	_score?: number;
};

type PageContentState = {
	content: SearchableContent;
	patternSlug: string | null;
	searchQuery: string;
	searchResults: SearchResult[];
	isLoading: boolean;
	setContent: (content: SearchableContent) => void;
	setPatternSlug: (slug: string | null) => void;
	setSearchQuery: (query: string) => void;
	performSearch: (query: string) => void;
	clearSearch: () => void;
	setLoading: (loading: boolean) => void;
};

// Helper function to convert GROQ search results to SearchResult format
const convertPatternSearchToSearchResults = (groqResults: {
	patterns: PatternSearchItem[];
	solutions: PatternSearchItem[];
	resources: PatternSearchItem[];
	tags: PatternSearchItem[];
	audiences: PatternSearchItem[];
	nestedSolutions: PatternSearchItem[];
}): SearchResult[] => {
	const results: SearchResult[] = [];

	// Convert pattern matches - filter out null/undefined values
	const patterns = groqResults.patterns?.filter((item) => item?._id) ?? [];
	for (const item of patterns) {
		results.push({
			type: "pattern",
			item,
		});
	}

	// Convert solutions - filter out null/undefined values
	const solutions = groqResults.solutions?.filter((item) => item?._id) ?? [];
	for (const item of solutions) {
		results.push({
			type: "solution",
			item,
		});
	}

	// Convert resources - filter out null/undefined values
	const resources = groqResults.resources?.filter((item) => item?._id) ?? [];
	for (const item of resources) {
		results.push({
			type: "resource",
			item,
		});
	}

	// Convert tags - filter out null/undefined values
	const tags = groqResults.tags?.filter((item) => item?._id) ?? [];
	for (const item of tags) {
		results.push({
			type: "tag",
			item,
		});
	}

	// Convert audiences - filter out null/undefined values
	const audiences = groqResults.audiences?.filter((item) => item?._id) ?? [];
	for (const item of audiences) {
		results.push({
			type: "audience",
			item,
		});
	}

	// Convert nested solutions - filter out null/undefined values
	const nestedSolutions =
		groqResults.nestedSolutions?.filter((item) => item?._id) ?? [];
	for (const item of nestedSolutions) {
		results.push({
			type: "solution", // Treat nested solutions as regular solutions in UI
			item: {
				...item,
				title: `${item.title} (from resource)`, // Add context to distinguish
				_nestedId: `nested-${item._id}`, // Add a unique identifier for nested solutions
			},
		});
	}

	return results;
};

export const createPageContentStore = () =>
	createStore<PageContentState>()((set, get) => ({
		content: {
			patterns: [],
			solutions: [],
			resources: [],
			tags: [],
			audiences: [],
		},
		patternSlug: null,
		searchQuery: "",
		searchResults: [],
		isLoading: false,

		setContent: (content: SearchableContent) => {
			set({ content });
		},

		setPatternSlug: (slug: string | null) => {
			set({ patternSlug: slug });
		},

		setSearchQuery: (query: string) => {
			set({ searchQuery: query });
		},

		performSearch: async (query: string) => {
			const { patternSlug } = get();

			if (!patternSlug) {
				set({
					searchQuery: query,
					searchResults: [],
				});
				return;
			}

			if (!query.trim()) {
				set({
					searchQuery: "",
					searchResults: [],
				});
				return;
			}

			try {
				set({ isLoading: true });

				const searchResult = await searchPatternContent(patternSlug, query);

				if (searchResult.success && searchResult.data) {
					const results = convertPatternSearchToSearchResults(
						searchResult.data,
					);
					set({
						searchQuery: query,
						searchResults: results,
						isLoading: false,
					});
				} else {
					set({
						searchQuery: query,
						searchResults: [],
						isLoading: false,
					});
				}
			} catch (error) {
				console.error("Search error:", error);
				set({
					searchQuery: query,
					searchResults: [],
					isLoading: false,
				});
			}
		},

		clearSearch: () => {
			set({
				searchQuery: "",
				searchResults: [],
			});
		},

		setLoading: (loading: boolean) => {
			set({ isLoading: loading });
		},
	}));

const PageContentStoreContext = createContext<ReturnType<
	typeof createPageContentStore
> | null>(null);

export const PageContentStoreProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const storeRef = useRef<ReturnType<typeof createPageContentStore>>(
		createPageContentStore(),
	);
	if (!storeRef.current) {
		storeRef.current = createPageContentStore();
	}

	return (
		<PageContentStoreContext.Provider value={storeRef.current}>
			{children}
		</PageContentStoreContext.Provider>
	);
};

export const usePageContentStore = () => {
	const store = useContext(PageContentStoreContext);
	if (!store) {
		throw new Error(
			"usePageContentStore must be used within PageContentStoreProvider",
		);
	}
	return useStore(store);
};
