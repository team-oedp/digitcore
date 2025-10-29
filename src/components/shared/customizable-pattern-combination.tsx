"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "~/lib/utils";

// Import the original shape icons but we'll override their colors
import Icon01 from "~/components/icons/shapes/icon-01";
import Icon02 from "~/components/icons/shapes/icon-02";
import Icon03 from "~/components/icons/shapes/icon-03";
import Icon04 from "~/components/icons/shapes/icon-04";
import Icon05 from "~/components/icons/shapes/icon-05";
import Icon06 from "~/components/icons/shapes/icon-06";
import Icon07 from "~/components/icons/shapes/icon-07";
import Icon08 from "~/components/icons/shapes/icon-08";
import Icon09 from "~/components/icons/shapes/icon-09";
import Icon10 from "~/components/icons/shapes/icon-10";
import Icon11 from "~/components/icons/shapes/icon-11";
import Icon12 from "~/components/icons/shapes/icon-12";
import Icon13 from "~/components/icons/shapes/icon-13";
import Icon14 from "~/components/icons/shapes/icon-14";
import Icon15 from "~/components/icons/shapes/icon-15";
import Icon16 from "~/components/icons/shapes/icon-16";
import Icon17 from "~/components/icons/shapes/icon-17";
import Icon18 from "~/components/icons/shapes/icon-18";
import Icon19 from "~/components/icons/shapes/icon-19";
import Icon20 from "~/components/icons/shapes/icon-20";
import Icon21 from "~/components/icons/shapes/icon-21";
import Icon22 from "~/components/icons/shapes/icon-22";
import Icon23 from "~/components/icons/shapes/icon-23";
import Icon24 from "~/components/icons/shapes/icon-24";

const ICONS = [
	Icon01,
	Icon02,
	Icon03,
	Icon04,
	Icon05,
	Icon06,
	Icon07,
	Icon08,
	Icon09,
	Icon10,
	Icon11,
	Icon12,
	Icon13,
	Icon14,
	Icon15,
	Icon16,
	Icon17,
	Icon18,
	Icon19,
	Icon20,
	Icon21,
	Icon22,
	Icon23,
	Icon24,
];

type CombinationSize = "sm" | "md" | "lg" | "xl" | number;

type CustomizablePatternCombinationProps = {
	patterns?: number[];
	randomPatterns?: number;
	size?: CombinationSize;
	className?: string;
	/** Enable scroll-driven rotation */
	scrollActive?: boolean;
	/** CSS selector for a scrollable parent to listen to; defaults to window */
	scrollParentSelector?: string;
	/** When using randomPatterns, avoid SSR hydration by deferring icon selection to client */
	hydrateClientOnlyWhenRandom?: boolean;
	/** Custom fill color for the icons */
	fillColor?: string;
	/** Custom stroke color for the icons */
	strokeColor?: string;
	/** Custom fill opacity for the icons */
	fillOpacity?: number;
	/** Custom stroke opacity for the icons */
	strokeOpacity?: number;
};

function getSizeClasses(size: CombinationSize) {
	if (typeof size === "number") return { container: "", px: size } as const;
	switch (size) {
		case "sm":
			return { container: "h-32", px: 128 } as const;
		case "md":
			return { container: "h-48", px: 192 } as const;
		case "lg":
			return { container: "h-64", px: 256 } as const;
		case "xl":
			return { container: "h-80", px: 320 } as const;
		default:
			return { container: "h-48", px: 192 } as const;
	}
}

function pickUniqueIndices(total: number, count: number) {
	const max = Math.min(count, total);
	const indices: number[] = [];
	while (indices.length < max) {
		const idx = Math.floor(Math.random() * total); // 0-based for array indices
		if (!indices.includes(idx)) indices.push(idx);
	}
	return indices;
}

export function CustomizablePatternCombination({
	patterns,
	randomPatterns,
	size = "md",
	className,
	scrollActive = true,
	scrollParentSelector,
	hydrateClientOnlyWhenRandom = true,
	fillColor = "#A35C89",
	strokeColor = "#A35C89",
	fillOpacity = 0.5,
	strokeOpacity = 0.5,
}: CustomizablePatternCombinationProps) {
	const { container, px } = getSizeClasses(size);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const [isMounted, setIsMounted] = useState(false);
	const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const selectedIndices = useMemo(() => {
		// If server-rendering and using randomness, optionally render none to avoid hydration mismatch
		if (
			!isMounted &&
			hydrateClientOnlyWhenRandom &&
			!patterns &&
			randomPatterns
		) {
			return [] as number[];
		}

		if (Array.isArray(patterns) && patterns.length > 0) {
			const mapped = patterns
				.map((n) => (typeof n === "number" ? Math.floor(n) - 1 : -1)) // Convert to 0-based
				.filter((idx) => idx >= 0 && idx < ICONS.length);
			return Array.from(new Set(mapped));
		}

		if (typeof randomPatterns === "number" && randomPatterns > 0) {
			return pickUniqueIndices(ICONS.length, randomPatterns);
		}

		return pickUniqueIndices(ICONS.length, 3);
	}, [isMounted, hydrateClientOnlyWhenRandom, patterns, randomPatterns]);

	// Layer rotations using motion values for smooth, jitter-free transforms
	const layers = [
		{ base: -12, amp: 12, z: 10 },
		{ base: 6, amp: 12, z: 20 },
		{ base: 0, amp: 16, z: 30 },
		{ base: 12, amp: 12, z: 40 },
		{ base: -6, amp: 14, z: 50 },
	] as const;

	useEffect(() => {
		if (!scrollActive) return;
		function findScrollableAncestor(
			start: HTMLElement | null,
		): HTMLElement | null {
			let node: HTMLElement | null = start?.parentElement || null;
			while (node) {
				const style = window.getComputedStyle(node);
				const overflowY = style.overflowY;
				const canScroll =
					(overflowY === "auto" || overflowY === "scroll") &&
					node.scrollHeight > node.clientHeight;
				if (canScroll) return node;
				node = node.parentElement;
			}
			return null;
		}
		if (scrollParentSelector) {
			const el = document.querySelector(
				scrollParentSelector,
			) as HTMLElement | null;
			setContainerEl(el);
			return;
		}
		const auto = findScrollableAncestor(rootRef.current);
		setContainerEl(auto);
	}, [scrollActive, scrollParentSelector]);

	// Motion scroll source bound to either a scrollable ancestor or window
	const containerRef = useMemo(() => {
		return containerEl
			? ({ current: containerEl } as React.RefObject<HTMLElement>)
			: undefined;
	}, [containerEl]);
	const { scrollYProgress } = useScroll(
		containerRef
			? {
					container: containerRef,
					target: rootRef,
					offset: ["start end", "end start"],
				}
			: { target: rootRef, offset: ["start end", "end start"] },
	);

	// Smooth the progress to reduce jitter, then derive rotations
	const smoothProgress = useSpring(scrollYProgress, {
		stiffness: 120,
		damping: 28,
		mass: 0.4,
	});
	const rotateMvs = layers.map((l, i) => {
		const dir = i % 2 === 0 ? 1 : -1; // alternate directions
		return useTransform(
			smoothProgress,
			[0, 1],
			[l.base - dir * l.amp, l.base + dir * l.amp],
		);
	});

	const side = Math.ceil(px * 1.6);

	return (
		<div
			ref={rootRef}
			suppressHydrationWarning
			aria-hidden="true"
			className={cn(
				"relative w-full select-none overflow-visible",
				container,
				className,
			)}
			style={{ width: side, height: side }}
		>
			<div className="relative h-full w-full">
				<div className="absolute inset-0 flex items-center justify-start">
					<div className="relative" style={{ width: side, height: side }}>
						{selectedIndices.map((iconIndex, i) => {
							const Icon = ICONS[iconIndex] as React.ComponentType<
								React.ComponentPropsWithoutRef<"svg">
							>;
							type LayerIndex = 0 | 1 | 2 | 3 | 4;
							const idx = (i % layers.length) as LayerIndex;
							const layer = layers[idx];
							return (
								<div
									key={iconIndex}
									className="absolute inset-0 flex items-center justify-center"
									style={{ zIndex: layer.z }}
								>
									<motion.div
										style={{
											rotate: scrollActive ? rotateMvs[idx] : undefined,
											willChange: "transform",
										}}
										className="flex transform-gpu"
									>
										<Icon
											className="max-h-full max-w-full"
											width={px}
											height={px}
											strokeWidth={1}
											style={
												{
													"--icon-fill-color": fillColor,
													"--icon-stroke-color": strokeColor,
													"--icon-fill-opacity": fillOpacity.toString(),
													"--icon-stroke-opacity": strokeOpacity.toString(),
												} as React.CSSProperties
											}
										/>
									</motion.div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

export default CustomizablePatternCombination;
