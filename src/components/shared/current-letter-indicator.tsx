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

		// Find the sticky header to calculate its height
		// Look for the sticky element that contains the page header
		const stickyHeader = document.querySelector(".sticky.top-0.z-10");
		if (stickyHeader) {
			const rect = stickyHeader.getBoundingClientRect();
			headerHeightRef.current = rect.height;
		} else {
			// Fallback to a reasonable default if header not found
			headerHeightRef.current = 120;
		}

		const intersectionLine = headerHeightRef.current;

		// Collect all tag items (h3 elements) with their associated letters
		const allTagItems: Element[] = [];

		for (const letter of availableLetters) {
			const section = document.getElementById(`letter-${letter}`);
			if (!section) continue;

			// Get all h3 elements (tag names) within this section
			const tagHeaders = section.querySelectorAll("h3");
			for (const header of tagHeaders) {
				allTagItems.push(header);
				tagItemsMapRef.current.set(header, letter);
			}

			// Also observe the section header (h2) if no tags exist
			if (tagHeaders.length === 0) {
				const sectionHeader = section.querySelector("h2");
				if (sectionHeader) {
					allTagItems.push(sectionHeader);
					tagItemsMapRef.current.set(sectionHeader, letter);
				}
			}
		}

		if (allTagItems.length === 0) return;

		// Create intersection observer
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
					let closestAbove: Element | null = null;
					let closestDistance = Number.NEGATIVE_INFINITY;

					for (const item of allTagItems) {
						const rect = item.getBoundingClientRect();
						// Item is above the intersection line
						if (
							rect.bottom < intersectionLine &&
							rect.bottom > closestDistance
						) {
							closestDistance = rect.bottom;
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

		// Start observing all tag items
		for (const item of allTagItems) {
			observerRef.current?.observe(item);
		}

		// Initial determination of active letter
		const determineInitialLetter = () => {
			let activeElement: Element | null = null;
			let minDistance = Number.POSITIVE_INFINITY;

			// Find the element closest to the intersection line
			for (const item of allTagItems) {
				const rect = item.getBoundingClientRect();
				const distance = Math.abs(rect.top - intersectionLine);

				if (distance < minDistance) {
					minDistance = distance;
					activeElement = item;
				}
			}

			// If no element is near the line, find the first one below it or last one above
			if (!activeElement || minDistance > 200) {
				for (const item of allTagItems) {
					const rect = item.getBoundingClientRect();
					if (rect.top >= intersectionLine) {
						activeElement = item;
						break;
					}
					activeElement = item; // Keep updating to get the last one if all are above
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
			const stickyHeader = document.querySelector(".sticky.top-0.z-10");
			if (stickyHeader) {
				const rect = stickyHeader.getBoundingClientRect();
				if (rect.height !== headerHeightRef.current) {
					// Header height changed, need to recreate observer
					headerHeightRef.current = rect.height;
					// Trigger re-creation of the observer by updating dependencies
					// This will cause the effect to re-run
				}
			}
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
