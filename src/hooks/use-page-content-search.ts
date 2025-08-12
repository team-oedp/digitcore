import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export type PageContentSearchResult = {
	id: string;
	title: string;
	type: "solution" | "resource" | "heading" | "content";
	context?: string;
	element?: HTMLElement;
	sectionId?: string;
};

export type UsePageContentSearchOptions = {
	debounceDelay?: number;
	enabled?: boolean;
};

export function usePageContentSearch({
	debounceDelay = 300,
	enabled = true,
}: UsePageContentSearchOptions = {}) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<PageContentSearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [pageContent, setPageContent] = useState<PageContentSearchResult[]>([]);

	const [debouncedQuery] = useDebounce(query, debounceDelay);

	// Index page content on mount and when enabled changes
	const indexPageContent = useCallback(() => {
		if (!enabled) {
			setPageContent([]);
			return;
		}

		const content: PageContentSearchResult[] = [];

		// Index solution titles and their content
		const solutionElements = document.querySelectorAll(
			'[data-section="solutions"] h3, [data-section="solutions"] h4',
		);
		solutionElements.forEach((element, index) => {
			const title = element.textContent?.trim();
			if (title) {
				content.push({
					id: `solution-${index}`,
					title,
					type: "solution",
					element: element as HTMLElement,
					sectionId: "solutions",
				});
			}
		});

		// Index resource titles and their content
		const resourceElements = document.querySelectorAll(
			'[data-section="resources"] h3, [data-section="resources"] h4',
		);
		resourceElements.forEach((element, index) => {
			const title = element.textContent?.trim();
			if (title) {
				content.push({
					id: `resource-${index}`,
					title,
					type: "resource",
					element: element as HTMLElement,
					sectionId: "resources",
				});
			}
		});

		// Index main headings (h1, h2, h3)
		const headingElements = document.querySelectorAll("h1, h2, h3");
		headingElements.forEach((element, index) => {
			const title = element.textContent?.trim();
			if (
				title &&
				!element.closest('[data-section="solutions"]') &&
				!element.closest('[data-section="resources"]')
			) {
				content.push({
					id: `heading-${index}`,
					title,
					type: "heading",
					element: element as HTMLElement,
				});
			}
		});

		// Index paragraphs with substantial content
		const paragraphElements = document.querySelectorAll("p");
		paragraphElements.forEach((element, index) => {
			const text = element.textContent?.trim();
			if (text && text.length > 50) {
				// Only index substantial paragraphs
				content.push({
					id: `content-${index}`,
					title: text.substring(0, 100) + (text.length > 100 ? "..." : ""),
					type: "content",
					context: text.substring(0, 200),
					element: element as HTMLElement,
				});
			}
		});

		setPageContent(content);
	}, [enabled]);

	// Re-index when page content changes
	useEffect(() => {
		indexPageContent();

		// Set up observer for dynamic content changes
		const observer = new MutationObserver(() => {
			// Debounce the re-indexing to avoid excessive calls
			setTimeout(indexPageContent, 500);
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});

		return () => observer.disconnect();
	}, [indexPageContent]);

	// Search through indexed content
	const search = useCallback(
		(searchQuery: string) => {
			if (!searchQuery.trim()) {
				setResults([]);
				return;
			}

			setIsLoading(true);

			// Simple text matching - could be enhanced with fuzzy search
			const searchTerms = searchQuery.toLowerCase().split(" ");
			const matchedResults: PageContentSearchResult[] = [];

			for (const item of pageContent) {
				const titleLower = item.title.toLowerCase();
				const contextLower = item.context?.toLowerCase() || "";

				// Score based on term matches
				let score = 0;
				let matchedTerms = 0;

				for (const term of searchTerms) {
					if (titleLower.includes(term)) {
						score += 10; // Higher weight for title matches
						matchedTerms++;
					} else if (contextLower.includes(term)) {
						score += 5; // Lower weight for context matches
						matchedTerms++;
					}
				}

				// Only include results that match at least one term
				if (matchedTerms > 0) {
					matchedResults.push({
						...item,
						// Could add score to result type if needed for sorting
					});
				}
			}

			// Sort by type priority: solutions -> resources -> headings -> content
			const typePriority = {
				solution: 1,
				resource: 2,
				heading: 3,
				content: 4,
			};

			matchedResults.sort((a, b) => {
				return typePriority[a.type] - typePriority[b.type];
			});

			setResults(matchedResults.slice(0, 10)); // Limit results
			setIsLoading(false);
		},
		[pageContent],
	);

	// Perform search when debounced query changes
	useEffect(() => {
		if (enabled) {
			search(debouncedQuery);
		} else {
			setResults([]);
		}
	}, [debouncedQuery, search, enabled]);

	const scrollToResult = useCallback((result: PageContentSearchResult) => {
		if (result.element) {
			result.element.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});

			// Add temporary highlight
			result.element.style.backgroundColor = "rgba(59, 130, 246, 0.1)";
			result.element.style.transition = "background-color 0.3s ease";

			setTimeout(() => {
				result.element?.style.setProperty("background-color", "");
			}, 2000);
		} else if (result.sectionId) {
			// Fallback to section scrolling
			const section = document.getElementById(result.sectionId);
			if (section) {
				section.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}
		}
	}, []);

	const clearSearch = useCallback(() => {
		setQuery("");
		setResults([]);
	}, []);

	return {
		query,
		setQuery,
		results,
		isLoading,
		scrollToResult,
		clearSearch,
		hasContent: pageContent.length > 0,
	};
}
