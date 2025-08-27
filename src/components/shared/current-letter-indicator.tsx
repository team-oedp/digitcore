"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useSectionInViewStore } from "~/stores/section-in-view";

type CurrentLetterIndicatorProps = {
	availableLetters: string[];
	contentId?: string;
};

export function CurrentLetterIndicator({
	availableLetters,
	contentId = "content",
}: CurrentLetterIndicatorProps) {
	// Register available letters globally so other components can use them
	const setAvailableLetters = useSectionInViewStore(
		(s) => s.setAvailableLetters,
	);
	useEffect(() => {
		setAvailableLetters(availableLetters);
	}, [availableLetters, setAvailableLetters]);

	// Compute and set the header offset based on the PageHeader element
	const setHeaderOffset = useSectionInViewStore((s) => s.setHeaderOffset);
	useEffect(() => {
		const header = document.getElementById("page-header");
		if (!header) {
			setHeaderOffset(0);
			return;
		}
		const update = () => {
			// Use the header's actual height as a stable offset
			const rect = header.getBoundingClientRect();
			setHeaderOffset(rect.height);
		};
		update();
		window.addEventListener("resize", update);
		return () => {
			window.removeEventListener("resize", update);
		};
	}, [setHeaderOffset]);

	// Build refs for each section we care about and observe them from below the header
	const setActiveLetter = useSectionInViewStore((s) => s.setActiveLetter);
	const _headerOffset = useSectionInViewStore((s) => s.headerOffset);

	// Stable sorted letters to track
	const letters = useMemo(() => {
		return [...new Set(availableLetters)].sort();
	}, [availableLetters]);

	// We create a sentinel element positioned at the header's bottom (using CSS sticky container on page)
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	// Use IntersectionObserver to detect when sections are at the top
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				// Find which sections are currently visible
				const visibleSections: { letter: string; top: number }[] = [];

				for (const entry of entries) {
					const letter = entry.target.id.replace("letter-", "");
					const top = entry.boundingClientRect.top;

					if (entry.isIntersecting) {
						visibleSections.push({ letter, top });
					}
				}

				if (visibleSections.length > 0) {
					// Sort by position and pick the topmost
					visibleSections.sort((a, b) => a.top - b.top);
					const topSection = visibleSections[0];

					if (topSection) {
						const currentActive = useSectionInViewStore.getState().activeLetter;
						if (topSection.letter !== currentActive) {
							setActiveLetter(topSection.letter);
						}
					}
				}
			},
			{
				root: null, // Use viewport
				rootMargin: "0px 0px -70% 0px", // Trigger when section is in top 30% of viewport
				threshold: 0.1,
			},
		);

		// Observe all sections
		for (const letter of letters) {
			const element = document.getElementById(`letter-${letter}`);
			if (element) {
				observer.observe(element);
			} else {
				console.warn(`❌ Element not found: letter-${letter}`);
			}
		}

		return () => {
			observer.disconnect();
		};
	}, [letters, setActiveLetter]);

	// Handle URL hash on initial load and browser navigation
	useEffect(() => {
		const handleHashChange = () => {
			const hash = window.location.hash.replace("#", "");
			if (hash.startsWith("letter-")) {
				const letter = hash.replace("letter-", "");
				if (letters.includes(letter)) {
					setActiveLetter(letter);
				}
			}
		};

		// Handle initial hash
		handleHashChange();

		// Listen for hash changes (back/forward navigation)
		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, [letters, setActiveLetter]);

	const activeLetter = useSectionInViewStore((s) => s.activeLetter);

	// Ensure we never display an outdated letter that is not part of the
	// currently available set (e.g. when navigating between pages).
	const isActiveValid = activeLetter ? letters.includes(activeLetter) : false;

	// If the current active letter is invalid, immediately clear it so that
	// downstream consumers (LetterNavigation) are consistent. We place this in a
	// layout-effect so the state is updated before the browser paints.
	useLayoutEffect(() => {
		if (!isActiveValid && activeLetter !== null) {
			setActiveLetter(null);
		}
		// We intentionally depend only on isActiveValid / activeLetter to avoid
		// resetting when not necessary.
	}, [isActiveValid, activeLetter, setActiveLetter]);

	// Fallback is strictly the first available letter (if any) –
	// we never default to "A" because some data sets start with a different
	// character (e.g. "B").
	const [fallback, setFallback] = useState<string | undefined>(letters[0]);
	useEffect(() => {
		// Keep the fallback in sync whenever the available letters change
		if (letters[0]) {
			setFallback(letters[0]);
		}
	}, [letters]);

	return (
		<div className="max-w-4xl">
			{/* Sentinel positioned at the header bottom to align our measurement */}
			<div ref={sentinelRef} style={{ height: 1, marginTop: 0 }} />
			<div className="mb-8 w-32 font-light text-8xl text-neutral-300 leading-none transition-opacity duration-200">
				{isActiveValid ? activeLetter : (fallback ?? "")}
			</div>
		</div>
	);
}
