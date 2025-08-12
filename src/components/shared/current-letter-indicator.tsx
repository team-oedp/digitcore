"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
		if (!header) return;
		const update = () => {
			const rect = header.getBoundingClientRect();
			// distance from top of viewport to the bottom of the header
			setHeaderOffset(rect.top + rect.height);
		};
		update();
		window.addEventListener("resize", update);
		window.addEventListener("scroll", update, { passive: true });
		return () => {
			window.removeEventListener("resize", update);
			window.removeEventListener("scroll", update as EventListener);
		};
	}, [setHeaderOffset]);

	// Build refs for each section we care about and observe them from below the header
	const headerOffset = useSectionInViewStore((s) => s.headerOffset);
	const setActiveLetter = useSectionInViewStore((s) => s.setActiveLetter);

	// Stable sorted letters to track
	const letters = useMemo(() => {
		return [...new Set(availableLetters)].sort();
	}, [availableLetters]);

	// We create a sentinel element positioned at the header's bottom (using CSS sticky container on page)
	const sentinelRef = useRef<HTMLDivElement | null>(null);

	// On scroll, determine which letter section top is just above the sentinel line
	useEffect(() => {
		// Attach listeners regardless of content mount timing; we query sections each time
		const getActive = () => {
			let current: string | null = letters[0] ?? null;
			for (const letter of letters) {
				const section = document.getElementById(`letter-${letter}`);
				if (!section) continue;
				const rect = section.getBoundingClientRect();
				// Section becomes active when its top crosses above the sentinel line
				if (rect.top - headerOffset <= 1) {
					current = letter;
				} else {
					break;
				}
			}
			setActiveLetter(current);
			// Fire a custom event for components that listen without Zustand
			window.dispatchEvent(
				new CustomEvent("current-letter-changed", {
					detail: { letter: current },
				}),
			);
		};
		// Measure after layout to avoid race with content mount
		const raf = requestAnimationFrame(() => {
			getActive();
			setTimeout(getActive, 0);
		});
		const opts: AddEventListenerOptions = { passive: true };
		window.addEventListener("scroll", getActive, opts);
		window.addEventListener("resize", getActive);
		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("scroll", getActive as EventListener);
			window.removeEventListener("resize", getActive as EventListener);
		};
	}, [headerOffset, letters, setActiveLetter]);

	const activeLetter = useSectionInViewStore((s) => s.activeLetter);
	// Use the sorted first letter as a stable fallback
	const [fallback, setFallback] = useState(letters[0] || "A");
	useEffect(() => {
		if (letters[0]) setFallback(letters[0]);
	}, [letters]);

	return (
		<div className="max-w-4xl">
			{/* Sentinel positioned at the header bottom to align our measurement */}
			<div ref={sentinelRef} style={{ height: 1, marginTop: 0 }} />
			<div className="mb-8 font-light text-8xl text-neutral-300 leading-none">
				{activeLetter ?? fallback}
			</div>
		</div>
	);
}
