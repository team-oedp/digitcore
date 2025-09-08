"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function PageHeading({ title }: { title: string }) {
	const elementRef = useRef<HTMLDivElement>(null);
	const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(
		null,
	);

	// Find the scrollable container on mount
	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		// Find the scrollable parent container
		let container = element.parentElement;
		while (container && !container.classList.contains("overflow-y-auto")) {
			container = container.parentElement;
		}

		setScrollContainer(container);
	}, []);

	// Use scroll hook with the appropriate container
	const { scrollY } = useScroll({
		container: scrollContainer ? { current: scrollContainer } : undefined,
	});

	// Define the scroll range for the animation (0 to 120px from top)
	const scrollRange = [0, 120];

	// Transform values based on scroll position
	// Large heading opacity: 1 -> 0 (gentler fade out)
	const largeHeadingOpacity = useTransform(
		scrollY,
		[0, 50], // Fades out completely by 50px
		[1, 0],
	);

	// Pill opacity: fades in AFTER large heading has faded out
	const pillOpacity = useTransform(
		scrollY,
		[50, 100], // Starts fading in at 50px (after heading is gone), fully visible by 100px
		[0, 1],
	);

	// Background opacity for the pill (appears as pill fades in)
	const backgroundOpacity = useTransform(
		scrollY,
		[60, 100], // Delayed to appear with pill
		[0, 1],
	);

	// Border opacity for the pill (appears last)
	const borderOpacity = useTransform(
		scrollY,
		[80, 120], // Appears in the final phase
		[0, 1],
	);

	return (
		<motion.header ref={elementRef} className="sticky top-5 z-40 w-fit">
			<div className="relative">
				{/* Large heading - fades out as you scroll */}
				<motion.h1
					style={{ opacity: largeHeadingOpacity }}
					className="text-page-heading"
				>
					{title}
				</motion.h1>

				{/* Small pill container - fades in */}
				<motion.div
					style={{
						opacity: pillOpacity,
					}}
					className="absolute top-0 left-0 overflow-hidden rounded-md"
				>
					{/* Background layer */}
					<motion.div
						style={{ opacity: backgroundOpacity }}
						className="absolute inset-0 bg-background"
					/>

					{/* Border layer */}
					<motion.div
						style={{ opacity: borderOpacity }}
						className="absolute inset-0 rounded-md border border-[var(--brand)]"
					/>

					{/* Text content - already at small size, no scaling needed */}
					<div className="relative px-1.5 py-0.5">
						<h1 className="whitespace-nowrap text-[var(--brand)] text-lg">
							{title}
						</h1>
					</div>
				</motion.div>
			</div>
		</motion.header>
	);
}
