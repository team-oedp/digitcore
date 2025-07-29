"use client";

import { useEffect, useState } from "react";

interface CurrentLetterIndicatorProps {
	availableLetters: string[];
	contentId?: string;
}

export function CurrentLetterIndicator({ 
	availableLetters, 
	contentId = 'content' 
}: CurrentLetterIndicatorProps) {
	const [currentLetter, setCurrentLetter] = useState(availableLetters[0] || "A");

	useEffect(() => {
		const handleScroll = () => {
			const container = document.getElementById(contentId);
			if (!container) return;

			// Get all letter sections
			const letterSections = availableLetters
				.map((letter) => {
					const element = document.getElementById(`letter-${letter}`);
					if (!element) return null;
					return {
						letter,
						element,
						top: element.offsetTop,
					};
				})
				.filter((section): section is { letter: string; element: HTMLElement; top: number } => 
					section !== null
				);

			if (letterSections.length === 0) return;

			// Get current scroll position with some offset for better UX
			const scrollTop = container.scrollTop + 100;

			// Find the current section based on scroll position
			let currentSection = letterSections[0];
			for (const section of letterSections) {
				if (scrollTop >= section.top) {
					currentSection = section;
				} else {
					break;
				}
			}

			setCurrentLetter(currentSection?.letter || availableLetters[0] || "A");
		};

		// Set initial letter
		handleScroll();

		// Add scroll listener to the container
		const container = document.getElementById(contentId);
		if (container) {
			container.addEventListener("scroll", handleScroll, { passive: true });
		}

		return () => {
			if (container) {
				container.removeEventListener("scroll", handleScroll);
			}
		};
	}, [availableLetters, contentId]);

	return (
		<div className="max-w-4xl">
			<div className="text-8xl font-light text-neutral-300 leading-none mb-8">
				{currentLetter}
			</div>
		</div>
	);
}