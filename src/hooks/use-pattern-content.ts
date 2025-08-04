"use client";

import { useEffect } from "react";
import type { PATTERN_QUERYResult } from "~/sanity/sanity.types";
import { usePageContentStore } from "~/stores/page-content";

export function usePatternContent(pattern: PATTERN_QUERYResult) {
	const { setContent, setPatternSlug } = usePageContentStore();

	useEffect(() => {
		console.log("usePatternContent - Pattern data received:", pattern);
		if (!pattern) {
			console.log("No pattern data, clearing content");
			// Clear content if no pattern
			setContent({
				patterns: [],
				solutions: [],
				resources: [],
				tags: [],
				audiences: [],
			});
			setPatternSlug(null);
			return;
		}

		// Extract and prepare the searchable content from the pattern
		// Convert the pattern query result to the types expected by the store
		const searchableContent = {
			patterns: [
				{
					_id: pattern._id,
					_type: pattern._type,
					_createdAt: pattern._createdAt,
					_updatedAt: pattern._updatedAt,
					_rev: pattern._rev,
					title: pattern.title ?? undefined,
					slug: pattern.slug
						? { current: pattern.slug, _type: "slug" as const }
						: undefined,
					description: pattern.description ?? undefined,
				},
			],
			solutions: pattern.solutions || [],
			resources: pattern.resources || [],
			tags: pattern.tags || [],
			audiences: pattern.audiences || [],
		};

		console.log("Setting searchable content in store:", searchableContent);
		console.log("Content breakdown:", {
			patterns: searchableContent.patterns.length,
			solutions: searchableContent.solutions?.length || 0,
			resources: searchableContent.resources?.length || 0,
			tags: searchableContent.tags?.length || 0,
			audiences: searchableContent.audiences?.length || 0,
		});

		// Set the pattern slug for GROQ searches
		const patternSlug = typeof pattern.slug === "string" ? pattern.slug : null;
		console.log("Setting pattern slug:", patternSlug);

		setContent(searchableContent);
		setPatternSlug(patternSlug);
	}, [pattern, setContent, setPatternSlug]);
}
