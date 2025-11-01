"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "~/lib/utils";

const Icon01 = dynamic(() => import("~/components/icons/shapes/icon-01"));
const Icon02 = dynamic(() => import("~/components/icons/shapes/icon-02"));
const Icon03 = dynamic(() => import("~/components/icons/shapes/icon-03"));
const Icon04 = dynamic(() => import("~/components/icons/shapes/icon-04"));
const Icon05 = dynamic(() => import("~/components/icons/shapes/icon-05"));
const Icon06 = dynamic(() => import("~/components/icons/shapes/icon-06"));
const Icon07 = dynamic(() => import("~/components/icons/shapes/icon-07"));
const Icon08 = dynamic(() => import("~/components/icons/shapes/icon-08"));
const Icon09 = dynamic(() => import("~/components/icons/shapes/icon-09"));
const Icon10 = dynamic(() => import("~/components/icons/shapes/icon-10"));
const Icon11 = dynamic(() => import("~/components/icons/shapes/icon-11"));
const Icon12 = dynamic(() => import("~/components/icons/shapes/icon-12"));
const Icon13 = dynamic(() => import("~/components/icons/shapes/icon-13"));
const Icon14 = dynamic(() => import("~/components/icons/shapes/icon-14"));
const Icon15 = dynamic(() => import("~/components/icons/shapes/icon-15"));
const Icon16 = dynamic(() => import("~/components/icons/shapes/icon-16"));
const Icon17 = dynamic(() => import("~/components/icons/shapes/icon-17"));
const Icon18 = dynamic(() => import("~/components/icons/shapes/icon-18"));
const Icon19 = dynamic(() => import("~/components/icons/shapes/icon-19"));
const Icon20 = dynamic(() => import("~/components/icons/shapes/icon-20"));
const Icon21 = dynamic(() => import("~/components/icons/shapes/icon-21"));
const Icon22 = dynamic(() => import("~/components/icons/shapes/icon-22"));
const Icon23 = dynamic(() => import("~/components/icons/shapes/icon-23"));
const Icon24 = dynamic(() => import("~/components/icons/shapes/icon-24"));

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

type PatternCombinationProps = {
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
		const idx = Math.floor(Math.random() * total);
		if (!indices.includes(idx)) indices.push(idx);
	}
	return indices;
}

export function PatternCombination({
	patterns,
	randomPatterns,
	size = "md",
	className,
	scrollActive = true,
	scrollParentSelector,
	hydrateClientOnlyWhenRandom = true,
}: PatternCombinationProps) {
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
				.map((n) => (typeof n === "number" ? Math.floor(n) - 1 : -1))
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
											className={cn(
												"max-h-full max-w-full",
												"fill-icon/15 text-icon/40 dark:fill-icon/8 dark:text-icon/20",
											)}
											width={px}
											height={px}
											strokeWidth={1}
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

export default PatternCombination;
