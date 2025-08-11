"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CurrentLetterIndicatorProps = {
	availableLetters: string[];
	contentId?: string;
};

export function CurrentLetterIndicator({
	availableLetters,
	contentId = "content",
}: CurrentLetterIndicatorProps) {
	const [currentLetter, setCurrentLetter] = useState(
		availableLetters[0] || "A",
	);
	const sectionsRef = useRef<Map<string, HTMLElement>>(new Map());
	const rafIdRef = useRef<number | undefined>(undefined);

	// Find which letter section is currently in view
	const updateCurrentLetter = useCallback(() => {
		if (sectionsRef.current.size === 0) return;

		// The offset from top where we consider a section "active"
		// This should match the scroll-mt-40 class (10rem = 160px)
		const offset = 160;
		const scrollTop = window.scrollY;

		// Sort available letters to ensure we check them in order
		const sortedLetters = [...availableLetters].sort((a, b) =>
			a.localeCompare(b),
		);

		let activeLetter = sortedLetters[0] || "A";

		// Find the letter section that's currently at or above the offset line
		for (let i = sortedLetters.length - 1; i >= 0; i--) {
			const letter = sortedLetters[i];
			if (!letter) continue;

			const section = sectionsRef.current.get(letter);

			if (section) {
				const rect = section.getBoundingClientRect();
				const sectionTop = scrollTop + rect.top;

				// If this section's top is at or above the scroll position + offset,
				// this is our active section
				if (sectionTop <= scrollTop + offset) {
					activeLetter = letter;
					break;
				}
			}
		}

		if (activeLetter !== currentLetter) {
			setCurrentLetter(activeLetter);
			// Broadcast the letter change for other components
			window.dispatchEvent(
				new CustomEvent("current-letter-changed", {
					detail: { letter: activeLetter },
				}),
			);
		}
	}, [availableLetters, currentLetter]);

	// Throttled scroll handler
	const handleScroll = useCallback(() => {
		if (rafIdRef.current) {
			cancelAnimationFrame(rafIdRef.current);
		}
		rafIdRef.current = requestAnimationFrame(updateCurrentLetter);
	}, [updateCurrentLetter]);

	useEffect(() => {
		if (typeof window === "undefined" || typeof document === "undefined") {
			return;
		}

		// Clear the sections map
		sectionsRef.current.clear();

		// Collect all letter sections
		const sortedLetters = [...availableLetters].sort((a, b) =>
			a.localeCompare(b),
		);
		for (const letter of sortedLetters) {
			const section = document.getElementById(`letter-${letter}`);
			if (section) {
				sectionsRef.current.set(letter, section);
			}
		}

		// Initial check
		updateCurrentLetter();

		// Add scroll listener
		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (rafIdRef.current) {
				cancelAnimationFrame(rafIdRef.current);
			}
		};
	}, [availableLetters, handleScroll, updateCurrentLetter]);

	return (
		<div className="max-w-4xl">
			<div className="mb-8 font-light text-8xl text-neutral-300 leading-none">
				{currentLetter}
			</div>
		</div>
	);
}
