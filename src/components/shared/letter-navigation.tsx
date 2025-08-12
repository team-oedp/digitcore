"use client";

import { useEffect, useState } from "react";

type LetterNavigationProps<T> = {
	itemsByLetter: Partial<Record<string, T[]>>;
	contentId?: string;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function LetterNavigation<T>({
	itemsByLetter,
	contentId = "content",
}: LetterNavigationProps<T>) {
	// Initialize with the first available letter
	const firstAvailableLetter = ALPHABET.find(
		(letter) => (itemsByLetter[letter]?.length ?? 0) > 0,
	);
	const [activeLetter, setActiveLetter] = useState<string | null>(
		firstAvailableLetter || null,
	);

	// Listen for letter changes from CurrentLetterIndicator
	useEffect(() => {
		const handleLetterChange = (event: CustomEvent) => {
			setActiveLetter(event.detail.letter);
		};

		window.addEventListener(
			"current-letter-changed" as any,
			handleLetterChange as EventListener,
		);

		return () => {
			window.removeEventListener(
				"current-letter-changed" as any,
				handleLetterChange as EventListener,
			);
		};
	}, []);
	return (
		<div className="fixed left-8 z-20 hidden lg:block">
			<div className="flex flex-col">
				{ALPHABET.map((letter) => {
					const hasItems = (itemsByLetter[letter]?.length ?? 0) > 0;
					const isActive = activeLetter === letter;
					
					const baseClasses =
						"block text-sm text-center leading-none py-1 transition-all duration-200";
					
					// Determine the appropriate classes based on state
					let stateClasses = "";
					if (!hasItems) {
						stateClasses = "text-neutral-300 pointer-events-none cursor-not-allowed";
					} else if (isActive) {
						// Active letter gets bold and darker color
						stateClasses = "text-neutral-900 font-semibold";
					} else {
						// Inactive but available letters
						stateClasses = "text-neutral-500 hover:text-neutral-700 font-normal";
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
										// Use scrollIntoView for reliable scrolling
										element.scrollIntoView({
											behavior: "smooth",
											block: "start",
											inline: "nearest",
										});

										// Update the URL with the hash
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
