"use client";

import { motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

function useScrollThreshold(threshold: number) {
	const [isScrolledPast, setIsScrolledPast] = useState(false);
	const elementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		// Find the scrollable parent container
		let scrollContainer = element.parentElement;
		while (
			scrollContainer &&
			!scrollContainer.classList.contains("overflow-y-auto")
		) {
			scrollContainer = scrollContainer.parentElement;
		}

		if (!scrollContainer) {
			// Fallback to window scroll if no scrollable container found
			const onWindowScroll = () => {
				const current = window.scrollY;
				// Use hysteresis to prevent flickering
				if (!isScrolledPast && current > threshold) {
					setIsScrolledPast(true);
				} else if (isScrolledPast && current < threshold - 20) {
					setIsScrolledPast(false);
				}
			};

			window.addEventListener("scroll", onWindowScroll);
			return () => window.removeEventListener("scroll", onWindowScroll);
		}

		// Use the scrollable container
		const onContainerScroll = () => {
			const current = scrollContainer.scrollTop;
			// Use hysteresis to prevent flickering
			if (!isScrolledPast && current > threshold) {
				setIsScrolledPast(true);
			} else if (isScrolledPast && current < threshold - 20) {
				setIsScrolledPast(false);
			}
		};

		scrollContainer.addEventListener("scroll", onContainerScroll);

		return () => {
			scrollContainer.removeEventListener("scroll", onContainerScroll);
		};
	}, [threshold, isScrolledPast]);

	return { isScrolledPast, elementRef };
}

export function PageHeading({ title }: { title: string }) {
	// set distance in pixels to trigger animation
	const { isScrolledPast, elementRef } = useScrollThreshold(45);

	const headingId = useId();
	return (
		<motion.header
			ref={elementRef}
			id={headingId}
			initial={false}
			animate={{
				backgroundColor: isScrolledPast
					? "var(--background)"
					: "var(--primary-foreground)",
				borderColor: isScrolledPast
					? "var(--color-green-brand)"
					: "var(--primary-foreground)",
			}}
			transition={{
				backgroundColor: {
					duration: 0.3,
					delay: 0.8,
					ease: "easeInOut",
				},
				borderColor: {
					duration: 0,
					delay: 0.9,
				},
			}}
			className="sticky top-5 z-40 w-fit rounded-md border border-solid px-1.5 py-0.5"
		>
			<motion.h1
				initial={false}
				animate={{
					fontSize: isScrolledPast ? "18px" : undefined,
				}}
				transition={{
					fontSize: {
						duration: 0.4,
						delay: 0.5,
						ease: "easeInOut",
					},
				}}
				className="text-page-heading"
			>
				{title}
			</motion.h1>
		</motion.header>
	);
}
