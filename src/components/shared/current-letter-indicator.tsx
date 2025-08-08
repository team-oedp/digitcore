"use client";

import { useEffect, useRef, useState } from "react";

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
	const observerRef = useRef<IntersectionObserver | null>(null);
	const tagItemsMapRef = useRef<Map<Element, string>>(new Map());
	const intersectingItemsRef = useRef<Set<Element>>(new Set());
	const headerHeightRef = useRef<number>(0);
	const currentLetterRef = useRef<string>(currentLetter);

	// Keep ref in sync with state
	useEffect(() => {
		currentLetterRef.current = currentLetter;
	}, [currentLetter]);

	useEffect(() => {
		if (typeof window === "undefined" || typeof document === "undefined") {
			return;
		}

		// Clean up previous observer
		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		// Clear the maps
		tagItemsMapRef.current.clear();
		intersectingItemsRef.current.clear();

		// Use a fixed intersection line aligned with scroll-mt-40 (10rem = 160px)
		headerHeightRef.current = 240;

		const intersectionLine = headerHeightRef.current;

		// Collect letter group headings (the main letter headers like "A", "B", "C")
		const letterHeadings: Element[] = [];

		for (const letter of availableLetters) {
			const section = document.getElementById(`letter-${letter}`);
			if (!section) continue;

			// Find the letter heading within this section (typically an h2 with the letter)
			const letterHeading = section.querySelector("h2");
			if (letterHeading) {
				letterHeadings.push(letterHeading);
				tagItemsMapRef.current.set(letterHeading, letter);
			}
		}

		if (letterHeadings.length === 0) return;

		// Create intersection observer to track when letter headings pass beneath the page header
		// The rootMargin creates an observation line at the bottom of the page header
		observerRef.current = new IntersectionObserver(
			(entries) => {
				// Update intersecting items
				for (const entry of entries) {
					if (entry.isIntersecting) {
						intersectingItemsRef.current.add(entry.target);
					} else {
						intersectingItemsRef.current.delete(entry.target);
					}
				}

				// Determine the current active letter
				let activeElement: Element | null = null;

				if (intersectingItemsRef.current.size > 0) {
					// Find the topmost intersecting item
					let minTop = Number.POSITIVE_INFINITY;
					for (const item of intersectingItemsRef.current) {
						const rect = item.getBoundingClientRect();
						if (rect.top < minTop) {
							minTop = rect.top;
							activeElement = item;
						}
					}
				} else {
					// No items intersecting - find the closest item above the line
					// This ensures we stay on the current letter until it's fully scrolled past
					let closestAbove: Element | null = null;
					let maxAboveBottom = Number.NEGATIVE_INFINITY;

					for (const item of letterHeadings) {
						const rect = item.getBoundingClientRect();
						// Item is above the intersection line
						if (
							rect.bottom < intersectionLine &&
							rect.bottom > maxAboveBottom
						) {
							maxAboveBottom = rect.bottom;
							closestAbove = item;
						}
					}

					activeElement = closestAbove;
				}

				// Update the current letter based on the active element
				if (activeElement) {
					const letter = tagItemsMapRef.current.get(activeElement);
					if (letter && letter !== currentLetterRef.current) {
						setCurrentLetter(letter);
						currentLetterRef.current = letter;
						// Broadcast the letter change for other components
						window.dispatchEvent(
							new CustomEvent("current-letter-changed", {
								detail: { letter },
							}),
						);
					}
				}
			},
			{
				// Create a thin observation line at the bottom of the page header
				rootMargin: `-${intersectionLine}px 0px -${window.innerHeight - intersectionLine - 1}px 0px`,
				threshold: 0,
			},
		);

		// Start observing all letter headings
		for (const item of letterHeadings) {
			observerRef.current?.observe(item);
		}

		// Initial determination of active letter
		const determineInitialLetter = () => {
			let activeElement: Element | null = null;
			let maxAboveBottom = Number.NEGATIVE_INFINITY;

			// Find the letter heading that's closest to but above the intersection line
			for (const item of letterHeadings) {
				const rect = item.getBoundingClientRect();
				if (rect.bottom < intersectionLine && rect.bottom > maxAboveBottom) {
					maxAboveBottom = rect.bottom;
					activeElement = item;
				}
			}

			// If no element is above the line, find the first one below it
			if (!activeElement) {
				for (const item of letterHeadings) {
					const rect = item.getBoundingClientRect();
					if (rect.top >= intersectionLine) {
						activeElement = item;
						break;
					}
				}
			}

			if (activeElement) {
				const letter = tagItemsMapRef.current.get(activeElement);
				if (letter) {
					setCurrentLetter(letter);
				}
			}
		};

		// Run initial check after a brief delay to ensure DOM is ready
		requestAnimationFrame(determineInitialLetter);

		// Listen for window resize to recalculate header height
		const handleResize = () => {
			// Keep the intersection line consistent with scroll-mt-40
			headerHeightRef.current = 160;
		};

		window.addEventListener("resize", handleResize);

		return () => {
			if (observerRef.current) {
				observerRef.current.disconnect();
			}
			window.removeEventListener("resize", handleResize);
		};
	}, [availableLetters]);

	return (
		<div className="max-w-4xl">
			<div className="mb-8 font-light text-8xl text-neutral-300 leading-none">
				{currentLetter}
			</div>
		</div>
	);
}
