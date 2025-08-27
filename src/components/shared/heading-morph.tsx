"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

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
				setIsScrolledPast(current > threshold);
			};

			window.addEventListener("scroll", onWindowScroll);
			return () => window.removeEventListener("scroll", onWindowScroll);
		}

		// Use the scrollable container
		const onContainerScroll = () => {
			const current = scrollContainer.scrollTop;
			setIsScrolledPast(current > threshold);
		};

		scrollContainer.addEventListener("scroll", onContainerScroll);

		return () => {
			scrollContainer.removeEventListener("scroll", onContainerScroll);
		};
	}, [threshold]);

	return { isScrolledPast, elementRef };
}

export function HeadingMorph() {
	const { isScrolledPast, elementRef } = useScrollThreshold(150);

	return (
		<motion.div ref={elementRef} className="sticky top-5 z-40">
			<motion.div className="relative">
				<motion.h1
					animate={{
						opacity: isScrolledPast ? 0 : 1,
					}}
					transition={{
						duration: 0.3,
						ease: "easeInOut",
					}}
					className="text-page-heading"
				>
					Welcome to the Digital Toolkit for Collaborative Environmental
					Research, or
				</motion.h1>
				<motion.h1
					animate={{
						opacity: isScrolledPast ? 1 : 0,
					}}
					transition={{
						duration: 0.3,
						ease: "easeInOut",
					}}
					className="absolute top-0 text-page-heading"
				>
					DIGITCORE
				</motion.h1>
			</motion.div>
		</motion.div>
	);
}
