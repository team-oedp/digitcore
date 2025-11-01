"use client";

import { useCallback, useEffect } from "react";

export function GlossaryScroll() {
	// Function to expand an accordion item
	const expandAccordionItem = useCallback((elementId: string) => {
		const accordionItem = document.getElementById(elementId);
		if (accordionItem) {
			// Find the accordion trigger button within this item
			const trigger = accordionItem.querySelector(
				'button[data-state="closed"]',
			);
			if (trigger instanceof HTMLElement) {
				trigger.click();
			}
		}
	}, []);

	// Handle initial scroll on mount
	useEffect(() => {
		if (typeof window === "undefined") return;

		const scrollToHash = () => {
			if (window.location.hash) {
				const hash = window.location.hash.slice(1); // Remove the #
				const element = document.getElementById(hash);
				if (element) {
					// scrollIntoView with CSS scroll-margin-top
					element.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});

					// Expand the accordion item after scrolling
					setTimeout(() => expandAccordionItem(hash), 500);
				}
			}
		};

		// Try scrolling immediately
		scrollToHash();

		// Try again after a short delay in case DOM isn't ready
		const timer = setTimeout(scrollToHash, 100);

		return () => clearTimeout(timer);
	}, [expandAccordionItem]);

	// Handle hash changes for navigation while already on the page
	useEffect(() => {
		const handleHashChange = () => {
			if (window.location.hash) {
				const hash = window.location.hash.slice(1);
				const element = document.getElementById(hash);
				if (element) {
					// Use native scrollIntoView (relies on CSS scroll-margin-top)
					element.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
					// Expand the accordion item after scrolling
					setTimeout(() => expandAccordionItem(hash), 500);
				}
			}
		};

		window.addEventListener("hashchange", handleHashChange);
		return () => window.removeEventListener("hashchange", handleHashChange);
	}, [expandAccordionItem]);

	return null;
}
