"use client";

import { useMemo } from "react";
import { useActiveLetter } from "~/hooks/use-section-in-view";
import { useSectionInViewStore } from "~/stores/section-in-view";

type LetterNavigationProps<T> = {
	itemsByLetter: Partial<Record<string, T[]>>;
	contentId?: string;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function LetterNavigation<T>({
	itemsByLetter,
	contentId = "content",
}: LetterNavigationProps<T>) {
	// Read active letter from shared store
	const activeLetter = useActiveLetter();
	const setActiveLetter = useSectionInViewStore((s) => s.setActiveLetter);

	// Determine initial fallback if no active letter yet
	const firstAvailableLetter = useMemo(
		() =>
			ALPHABET.find((letter) => (itemsByLetter[letter]?.length ?? 0) > 0) ||
			null,
		[itemsByLetter],
	);
	// Ignore activeLetter if it doesn’t belong to this data set (possible after
	// route transitions that share the same global store).
	const effectiveActive =
		activeLetter && (itemsByLetter[activeLetter]?.length ?? 0) > 0
			? activeLetter
			: (firstAvailableLetter ?? undefined);

	return (
		<div className="z-20 hidden lg:block">
			<div className="flex flex-col">
				{ALPHABET.map((letter) => {
					const hasItems = (itemsByLetter[letter]?.length ?? 0) > 0;
					const isActive = effectiveActive === letter;

					const baseClasses =
						"block text-sm text-center leading-none py-1 transition-all duration-200";

					// Determine the appropriate classes based on state
					let stateClasses = "";
					if (!hasItems) {
						stateClasses =
							"text-neutral-300 pointer-events-none cursor-not-allowed";
					} else if (isActive) {
						// Active letter gets bold and darker color
						stateClasses = "text-neutral-900 font-semibold";
					} else {
						// Inactive but available letters
						stateClasses =
							"text-neutral-500 hover:text-neutral-700 font-normal";
					}

					return (
						<a
							key={letter}
							href={hasItems ? `#letter-${letter}` : undefined}
							className={`${baseClasses} ${stateClasses}`}
							aria-disabled={!hasItems}
							aria-current={isActive ? "true" : undefined}
							onClick={(e) => {
								if (hasItems) {
									e.preventDefault();
									const element = document.getElementById(`letter-${letter}`);
									if (element) {
										// Use scrollIntoView first, then add small offset for higher positioning
										element.scrollIntoView({
											behavior: "smooth",
											block: "start",
											inline: "nearest",
										});

										// Add small offset after scroll completes to position higher
										setTimeout(() => {
											window.scrollBy(0, -30);
										}, 100);

										// Delay setting active letter to avoid race with IntersectionObserver
										setTimeout(() => {
											setActiveLetter(letter);
										}, 500);

										// Update URL hash for deep-linking.
										const url = new URL(window.location.href);
										url.hash = `letter-${letter}`;
										window.history.pushState({}, "", url.toString());
									}
								}
							}}
						>
							{letter}
						</a>
					);
				})}
			</div>
		</div>
	);
}
