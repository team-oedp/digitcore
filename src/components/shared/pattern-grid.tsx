"use client";

import type { MotionValue } from "motion/react";
import {
	motion,
	useMotionValueEvent,
	useScroll,
	useSpring,
} from "motion/react";
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

type Props = {
	className?: string;
	cellSize?: number; // px for icon width/height
	gapPx?: number; // gap between grid cells in px
	rows?: number;
	cols?: number;
	gate?: MotionValue<number> | null; // optional morph gate
};

function seeded(n: number) {
	// simple stable pseudo-random from index
	const x = Math.sin((n + 1) * 12.9898) * 43758.5453;
	return x - Math.floor(x);
}

export default function PatternGrid({
	className,
	cellSize = 140,
	gapPx = 12,
	rows,
	cols,
	gate,
}: Props) {
	const rootRef = useRef<HTMLDivElement | null>(null);
	const [containerEl, setContainerEl] = useState<HTMLElement | null>(null);

	// detect nearest scrollable ancestor for local scroll progress
	useEffect(() => {
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
		setContainerEl(findScrollableAncestor(rootRef.current));
	}, []);

	const containerRef = useMemo(
		() =>
			containerEl
				? ({ current: containerEl } as React.RefObject<HTMLElement>)
				: undefined,
		[containerEl],
	);

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
		stiffness: 140,
		damping: 26,
		mass: 0.45,
	});

	// Numeric progress values to avoid creating hooks inside the grid map
	const [p, setP] = useState(0);
	useMotionValueEvent(smooth, "change", (v) => setP(v ?? 0));
	const [gp, setGp] = useState(0);
	useEffect(() => {
		if (!gate) {
			setGp(1);
			return;
		}
		// initialize and subscribe to gate changes
		setGp(gate.get?.() ?? 0);
		const unsub = gate.on?.("change", (v: number) => setGp(v ?? 0));
		return () => {
			if (typeof unsub === "function") unsub();
		};
	}, [gate]);

	// Track global window scroll to drive post-morph fade-out reliably
	const { scrollY } = useScroll();
	const smoothWindowY = useSpring(scrollY, {
		stiffness: 140,
		damping: 26,
		mass: 0.45,
	});
	const [winY, setWinY] = useState(0);
	useMotionValueEvent(smoothWindowY, "change", (v) => setWinY(v ?? 0));

	// Capture window scroll position when morph (gate) completes to start fade-out
	const gateWindowYRef = useRef<number>(0);
	const prevGpRef = useRef<number>(0);
	useEffect(() => {
		if (prevGpRef.current < 0.98 && gp >= 0.98) {
			gateWindowYRef.current = winY;
		}
		prevGpRef.current = gp;
	}, [gp, winY]);

	// compute grid size from container size (supports 200vw x 100vh)
	const [cw, setCw] = useState(0);
	const [ch, setCh] = useState(0);
	useEffect(() => {
		const node = rootRef.current;
		if (!node) return;
		const measure = () => {
			setCw(node.clientWidth || 0);
			setCh(node.clientHeight || 0);
		};
		measure();
		const ro = new ResizeObserver(measure);
		ro.observe(node);
		return () => ro.disconnect();
	}, []);

	const cell = cellSize;
	const r = rows ?? Math.max(1, Math.ceil(ch / (cell + gapPx)));
	const c = cols ?? Math.max(1, Math.ceil(cw / (cell + gapPx)));

	const indices = useMemo(
		() => Array.from({ length: r * c }, (_, i) => i),
		[r, c],
	);

	return (
		<div
			ref={rootRef}
			aria-hidden="true"
			className={cn("pointer-events-none relative", className)}
			style={{ width: "100%", height: "100%" }}
		>
			<div className="absolute inset-0" style={{ paddingTop: `${gapPx}px` }}>
				<div
					className="grid h-full w-full"
					style={{
						gridTemplateRows: `repeat(${r}, ${cell}px)`,
						gridTemplateColumns: `repeat(${c}, ${cell}px)`,
						gap: `${gapPx}px`,
						justifyContent: "center",
						alignContent: "center",
					}}
				>
					{indices.map((i) => {
						const Icon = ICONS[i % ICONS.length] as React.ComponentType<
							React.ComponentPropsWithoutRef<"svg">
						>;
						// staggered fade: much slower response to scroll with varied end opacities
						const jitter = seeded(i);
						const start = 0.1 + jitter * 0.4; // ~0.1..0.5 (much slower start)
						const end = Math.min(0.95, start + 0.8 + seeded(i + 7) * 0.3); // extended fade-in window
						// varied final opacity levels for visual diversity - some darker
						const finalOpacity = 0.08 + seeded(i + 13) * 0.25; // ~0.08..0.33 (wider range, some darker)
						// compute opacity numerically (no hooks inside map)
						// Important: do NOT hard-gate here; it makes all tiles pop at once.
						let baseOpacity = 0;
						if (p <= start) baseOpacity = 0;
						else if (p >= end) baseOpacity = finalOpacity;
						else {
							const t = (p - start) / (end - start);
							baseOpacity = 0.04 + (finalOpacity - 0.04) * t;
						}
						// Faster, per-cell gate: stronger jitter so cells fade individually
						const gateDelay = 0.02 + jitter * 0.4; // 0.02..0.42
						const gateWindow = 0.2; // quicker ramp per tile
						const gateFactor = gate
							? Math.min(1, Math.max(0, (gp - gateDelay) / gateWindow))
							: 1;
						// Only fade-in (no fade-out); keep opacity based on base+gate
						const opacity = baseOpacity * gateFactor;
						// slight rotation variance for liveliness
						const dir = seeded(i + 3) > 0.5 ? 1 : -1;
						const rotAmp = 4 + Math.floor(seeded(i + 11) * 6); // 4..9
						const rot = -dir * rotAmp * (1 - p) + dir * rotAmp * p;

						return (
							<div key={`pg-${i}`} className="flex items-center justify-center">
								<motion.div style={{ opacity, rotate: rot }}>
									<Icon
										width={cell}
										height={cell}
										className="max-h-full max-w-full fill-icon/10 text-icon/25 dark:fill-icon/6 dark:text-icon/18"
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
