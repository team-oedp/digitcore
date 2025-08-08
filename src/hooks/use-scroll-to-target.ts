"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type UseScrollToTargetOptions = {
	highlight?: boolean;
	groupSelector?: string;
	debounceMs?: number;
};

export function useScrollToTarget({
	highlight = false,
	groupSelector = "[data-letter]",
	debounceMs = 120,
}: UseScrollToTargetOptions = {}): string | null {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const isScrollingRef = useRef(false);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const [activeLetter, setActiveLetter] = useState<string | null>(
		searchParams.get("letter"),
	);

	// Scroll to section when ?letter= changes
	useEffect(() => {
		const scrollToElement = (el: HTMLElement | null) => {
			if (!el) return;
			isScrollingRef.current = true;
			el.scrollIntoView({ behavior: "smooth", block: "start" });
			if (highlight) {
				el.classList.add("highlight");
				setTimeout(() => el.classList.remove("highlight"), 2000);
			}
			setTimeout(() => {
				isScrollingRef.current = false;
			}, 800);
		};

		const findFirstByLetter = (letter: string) => {
			const groups = document.querySelectorAll<HTMLElement>(groupSelector);
			return Array.from(groups).find(
				(group) => group.dataset.letter?.toLowerCase() === letter.toLowerCase(),
			);
		};

		const letter = searchParams.get("letter");
		setActiveLetter(letter);

		if (letter && letter.length === 1 && /[a-zA-Z]/.test(letter)) {
			const match = findFirstByLetter(letter);
			scrollToElement(match || null);
		} else if (!letter) {
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}, [searchParams, highlight, groupSelector]);

	// Update ?letter= and activeLetter when scrolling manually (debounced)
	useEffect(() => {
		const groups = document.querySelectorAll<HTMLElement>(groupSelector);
		if (!groups.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (isScrollingRef.current) return;

				const visible = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

				const firstVisible = visible[0];
				if (firstVisible) {
					const currentLetter = firstVisible.target.getAttribute("data-letter");

					if (currentLetter) {
						if (debounceTimerRef.current) {
							clearTimeout(debounceTimerRef.current);
						}

						debounceTimerRef.current = setTimeout(() => {
							setActiveLetter(currentLetter);
							const params = new URLSearchParams(searchParams.toString());
							params.set("letter", currentLetter);
							router.replace(`${pathname}?${params.toString()}`, {
								scroll: false,
							});
						}, debounceMs);
					}
				}
			},
			{ rootMargin: "0px 0px -80% 0px", threshold: 0 },
		);

		for (const group of groups) {
			observer.observe(group);
		}

		return () => {
			observer.disconnect();
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [groupSelector, pathname, router, searchParams, debounceMs]);

	return activeLetter;
}
