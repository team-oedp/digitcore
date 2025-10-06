"use client";

import type { MotionValue } from "motion/react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "~/lib/utils";

// Dynamically load all pattern icons (same set as PatternCombination)
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

type Props = {
	patterns?: number[];
	randomPatterns?: number;
	size?: CombinationSize;
	className?: string;
	scrollActive?: boolean;
	scrollParentSelector?: string;
	hydrateClientOnlyWhenRandom?: boolean;
	gate?: MotionValue<number>;
};

function getSize(size: CombinationSize) {
	if (typeof size === "number") return { px: size } as const;
	switch (size) {
		case "sm":
			return { px: 128 } as const;
		case "md":
			return { px: 192 } as const;
		case "lg":
			return { px: 256 } as const;
		case "xl":
			return { px: 320 } as const;
		default:
			return { px: 192 } as const;
	}
}

function pickUnique(total: number, count: number) {
	const max = Math.min(count, total);
	const out: number[] = [];
	while (out.length < max) {
		const idx = Math.floor(Math.random() * total);
		if (!out.includes(idx)) out.push(idx);
	}
	return out;
}

export default function PatternFadeRotate({
	patterns,
	randomPatterns,
	size = "md",
	className,
	scrollActive = true,
	scrollParentSelector,
	hydrateClientOnlyWhenRandom = true,
	gate,
}: Props) {
	const { px } = getSize(size);
	const side = Math.ceil(px * 1.6);
	const rootRef = useRef<HTMLDivElement | null>(null);
	const [isMounted, setIsMounted] = useState(false);
	const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);

	useEffect(() => setIsMounted(true), []);

	const selected = useMemo(() => {
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
				.filter((i) => i >= 0 && i < ICONS.length);
			return Array.from(new Set(mapped));
		}
		if (typeof randomPatterns === "number" && randomPatterns > 0) {
			return pickUnique(ICONS.length, randomPatterns);
		}
		return pickUnique(ICONS.length, 3);
	}, [isMounted, hydrateClientOnlyWhenRandom, patterns, randomPatterns]);

	// Keep hook counts stable across renders by basing per-item hooks on a fixed count
	const desiredCount = useMemo(() => {
		if (Array.isArray(patterns) && patterns.length > 0) return patterns.length;
		if (typeof randomPatterns === "number" && randomPatterns > 0)
			return randomPatterns;
		return 3;
	}, [patterns, randomPatterns]);

	const itemIndices = useMemo(
		() => Array.from({ length: desiredCount }, (_, i) => i),
		[desiredCount],
	);

	useEffect(() => {
		if (!scrollActive) return;
		function findScrollableAncestor(
			start: HTMLElement | null,
		): HTMLElement | null {
			let node: HTMLElement | null = start?.parentElement || null;
			while (node) {
				const style = window.getComputedStyle(node);
				const canScroll =
					(style.overflowY === "auto" || style.overflowY === "scroll") &&
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
		setContainerEl(findScrollableAncestor(rootRef.current));
	}, [scrollActive, scrollParentSelector]);

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

	const smooth = useSpring(scrollYProgress, {
		stiffness: 180,
		damping: 24,
		mass: 0.35,
	});

	// Per-item transforms are built in render based on itemIndices to keep hooks order stable.

	return (
		<div
			ref={rootRef}
			aria-hidden="true"
			className={cn("relative w-full select-none overflow-visible", className)}
			style={{ width: side, height: side }}
		>
			<div className="absolute inset-0 flex items-end justify-end">
				<div className="relative" style={{ width: side, height: side }}>
					{itemIndices.map((i) => {
						const iconIndex = selected[i] ?? i % ICONS.length;
						const Icon = ICONS[iconIndex] as React.ComponentType<
							React.ComponentPropsWithoutRef<"svg">
						>;
						const dir = i % 2 === 0 ? 1 : -1;
						const base = i === 0 ? -10 : i === 1 ? 8 : 6;
						const amp = 12;
						const rotateMv = useTransform(
							smooth,
							[0, 0.5, 1],
							[base - dir * amp, base, base + dir * amp],
						);
						// appear towards the last portion of the morph distance, and reverse on scroll-up
						// ensure fades begin after most of the text morph completes; reverse naturally on scroll-up
						const fadeStart = 0.7 + i * 0.08;
						const fadeEnd = 0.95 + i * 0.08;
						const opacityMv = useTransform(
							smooth,
							[0, fadeStart, fadeEnd],
							[0, 0.9, 1],
						);
						// Smooth, gradual gate tied to morph progress so patterns do not pop in
						const gateBasis = gate
							? useSpring(gate, { stiffness: 120, damping: 24, mass: 0.5 })
							: undefined;
						const gateMv = gateBasis
							? useTransform(gateBasis, [0.9, 0.98, 1], [0, 0.6, 1])
							: undefined;
						const finalOpacity = gateMv
							? useTransform(
									[opacityMv, gateMv],
									([o, g]) => Number(o) * Number(g),
								)
							: opacityMv;
						const finalRotate = gateMv
							? useTransform(
									[rotateMv, gateMv],
									([r, g]) => Number(r) * Number(g),
								)
							: rotateMv;
						return (
							<div
								key={`icon-${iconIndex}-${i}-${px}`}
								className="absolute inset-0 flex items-center justify-center"
								style={{ zIndex: 10 + i * 10 }}
							>
								<motion.div
									style={{
										rotate: scrollActive ? finalRotate : undefined,
										opacity: scrollActive ? finalOpacity : 1,
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
	);
}
