"use client";

import { useCallback, useEffect, useState } from "react";

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

	// Find which letter section is currently in view
	const updateCurrentLetter = useCallback(() => {
		if (!availableLetters.length) return;

		// Get the sticky container that contains the page header
		// Look for the sticky container (it has classes sticky top-0)
		const stickyContainers = document.querySelectorAll('.sticky.top-0');
		if (!stickyContainers.length) return;
		
		// Use the first sticky container (should be the page header container)
		const stickyHeader = stickyContainers[0] as HTMLElement;
		
		// Calculate the bottom of the sticky header (this is our threshold)
		const headerRect = stickyHeader.getBoundingClientRect();
		const headerBottom = headerRect.bottom;

		// Sort available letters to ensure we check them in order
		const sortedLetters = [...availableLetters].sort();

		let activeLetter = sortedLetters[0] || "A";
		let lastVisibleLetter = null;

		// Check each letter section to find which one is currently visible
		for (let i = 0; i < sortedLetters.length; i++) {
			const letter = sortedLetters[i];
			const section = document.getElementById(`letter-${letter}`);
			if (!section) continue;

			const rect = section.getBoundingClientRect();
			const nextLetter = sortedLetters[i + 1];
			const nextSection = nextLetter ? document.getElementById(`letter-${nextLetter}`) : null;
			const nextRect = nextSection ? nextSection.getBoundingClientRect() : null;
			
			// Check if the section's top is at or above the header threshold
			if (rect.top <= headerBottom) {
				// If there's a next section and it's also above the threshold,
				// continue to check the next one
				if (nextRect && nextRect.top <= headerBottom) {
					lastVisibleLetter = letter;
					continue;
				}
				// This is the current active section
				activeLetter = letter;
				break;
			} else {
				// This section hasn't reached the header yet
				// Use the last visible section if available
				if (lastVisibleLetter) {
					activeLetter = lastVisibleLetter;
				}
				break;
			}
		}
		
		// Handle case when scrolled to the very bottom
		if (!activeLetter && lastVisibleLetter) {
			activeLetter = lastVisibleLetter;
		}

		// Update the current letter if it changed
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

	// Debounced scroll handler using requestAnimationFrame
	const handleScroll = useCallback(() => {
		requestAnimationFrame(updateCurrentLetter);
	}, [updateCurrentLetter]);

	useEffect(() => {
		if (typeof window === "undefined" || typeof document === "undefined") {
			return;
		}

		// Small delay to ensure DOM is fully rendered
		const initialTimeout = setTimeout(() => {
			updateCurrentLetter();
		}, 100);

		// Add scroll listener
		window.addEventListener("scroll", handleScroll, { passive: true });

		// Also update on resize as the header height might change
		window.addEventListener("resize", handleScroll, { passive: true });

		return () => {
			clearTimeout(initialTimeout);
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", handleScroll);
		};
	}, [availableLetters, handleScroll, updateCurrentLetter]);

	// Listen for hash changes (when clicking on letter navigation)
	useEffect(() => {
		const handleHashChange = () => {
			// Small delay to allow scroll animation to start
			setTimeout(updateCurrentLetter, 100);
		};

		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, [updateCurrentLetter]);

	return (
		<div className="max-w-4xl">
			<div className="mb-8 font-light text-8xl text-neutral-300 leading-none">
				{currentLetter}
			</div>
		</div>
	);
}
