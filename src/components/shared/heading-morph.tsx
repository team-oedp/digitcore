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
	const { isScrolledPast, elementRef } = useScrollThreshold(75);

	return (
		<motion.header ref={elementRef} className="sticky top-5 z-40 w-fit">
			<motion.div className="relative">
				<motion.h1
					initial={false}
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
				<motion.div
					initial={false}
					animate={{
						opacity: isScrolledPast ? 1 : 0,
						backgroundColor: isScrolledPast
							? "var(--background)"
							: "var(--primary-foreground)",
						borderColor: isScrolledPast
							? "var(--brand)"
							: "var(--primary-foreground)",
					}}
					transition={{
						opacity: {
							duration: 0.3,
							ease: "easeInOut",
						},
						backgroundColor: {
							duration: 0.3,
							delay: 0.8,
							ease: "easeInOut",
						},
						borderColor: {
							duration: 0.2,
							delay: 1.1,
							ease: "easeInOut",
						},
					}}
					className="absolute top-0 rounded-md border border-solid bg-background px-1.5 py-0.5"
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
						DIGITCORE
					</motion.h1>
				</motion.div>
			</motion.div>
		</motion.header>
	);
}
