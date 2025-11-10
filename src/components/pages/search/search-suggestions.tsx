"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getPatternSuggestionsWithPreferences } from "~/app/actions/search";
import type { Language } from "~/i18n/config";
import { useOrientationStore } from "~/stores/orientation";
import type { SearchPattern } from "~/types/search";
import { SearchResultItem } from "./search-result-item";
import { SearchResultsSkeleton } from "./search-result-skeleton";

export function SearchSuggestions({ limit = 5 }: { limit?: number }) {
	const params = useParams<{ language: string }>();
	const language = (params?.language as Language) || ("en" as Language);
	const hasCompletedOrientation = useOrientationStore(
		(s) => s.hasCompletedOrientation,
	);
	const selectedAudienceIds = useOrientationStore((s) => s.selectedAudienceIds);
	const selectedThemeIds = useOrientationStore((s) => s.selectedThemeIds);

	const isEligible = useMemo(() => {
		if (!hasCompletedOrientation) return false;
		const hasPrefs =
			(selectedAudienceIds?.length ?? 0) > 0 ||
			(selectedThemeIds?.length ?? 0) > 0;
		return hasPrefs;
	}, [hasCompletedOrientation, selectedAudienceIds, selectedThemeIds]);

	const [isLoading, setIsLoading] = useState(false);
	const [patterns, setPatterns] = useState<SearchPattern[] | null>(null);

	useEffect(() => {
		let mounted = true;
		async function fetchSuggestions() {
			if (!isEligible) {
				setPatterns(null);
				return;
			}
			setIsLoading(true);
			try {
				const results = await getPatternSuggestionsWithPreferences(
					language,
					{
						selectedAudienceIds: selectedAudienceIds ?? [],
						selectedThemeIds: selectedThemeIds ?? [],
					},
					limit,
				);
				if (!mounted) return;
				setPatterns(Array.isArray(results) ? results.slice(0, limit) : []);
			} catch {
				if (!mounted) return;
				setPatterns([]);
			} finally {
				if (mounted) setIsLoading(false);
			}
		}
		fetchSuggestions();
		return () => {
			mounted = false;
		};
	}, [isEligible, language, limit, selectedAudienceIds, selectedThemeIds]);

	if (!isEligible) return null;

	const isSpanish = language === "es";
	const suggestionsHeading = isSpanish
		? "Sugerencias para ti"
		: "Suggestions for you";

	return (
		<div className="w-full">
			<h3 className="mb-3 font-normal text-base text-muted-foreground">
				{suggestionsHeading}
			</h3>
			{isLoading ? (
				<SearchResultsSkeleton count={limit} />
			) : !patterns || patterns.length === 0 ? null : (
				<div className="w-full">
					{patterns.map((pattern) => (
						<SearchResultItem key={pattern._id} pattern={pattern} />
					))}
				</div>
			)}
		</div>
	);
}
