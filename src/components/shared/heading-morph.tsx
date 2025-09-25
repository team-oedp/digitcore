"use client";

import {
	motion,
	useMotionValueEvent,
	useScroll,
	useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

type ResponsiveNumber =
	| number
	| [number, number?, number?, number?, number?]
	| { base?: number; sm?: number; md?: number; lg?: number; xl?: number };

type HeadingMorphProps = {
	text?: string;
	transitionText?: string;
	morphDistancePx?: ResponsiveNumber;
	containerClass?: string;
	randomizeSelection?: boolean;
	fadeNonTarget?: boolean;
	fadeSelectedInPlace?: boolean;
	uppercasePrefix?: boolean;
	distanceToDisappear?: ResponsiveNumber;
	breakpoints?: { sm?: number; md?: number; lg?: number; xl?: number };
};

export function HeadingMorph({
	text,
	transitionText,
	morphDistancePx,
	containerClass,
	randomizeSelection,
	fadeNonTarget,
	fadeSelectedInPlace,
	uppercasePrefix,
	distanceToDisappear,
	breakpoints,
}: HeadingMorphProps) {
	const elementRef = useRef<HTMLDivElement>(null);
	const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(
		null,
	);

	// Source sentence and target word for reordering
	const sourceText = text ?? "";
	const targetWord = transitionText ?? "";

	// Track morph progress as discrete steps (0..targetWord.length)
	const [stepCount, setStepCount] = useState<number>(0);

	// Find the scrollable container on mount
	useEffect(() => {
		const element = elementRef.current;
		if (!element) return;

		// Find the scrollable parent container
		let container = element.parentElement;
		while (
			container &&
			!container.classList.contains(containerClass ?? "overflow-y-auto")
		) {
			container = container.parentElement;
		}

		setScrollContainer(container);
	}, [containerClass]);

	// Use scroll hook with the appropriate container
	const { scrollY } = useScroll({
		container: scrollContainer ? { current: scrollContainer } : undefined,
	});

	// Resolve responsive numbers for distances
	const [viewportWidth, setViewportWidth] = useState<number>(0);
	useEffect(() => {
		function update() {
			setViewportWidth(window.innerWidth);
		}
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	function resolveResponsiveNumber(
		value: ResponsiveNumber | undefined,
		fallback: number,
	): number {
		if (typeof value === "number") return value;
		if (Array.isArray(value)) {
			const [base, sm, md, lg, xl] = value;
			const bp = {
				sm: breakpoints?.sm ?? 640,
				md: breakpoints?.md ?? 768,
				lg: breakpoints?.lg ?? 1024,
				xl: breakpoints?.xl ?? 1280,
			};
			if (viewportWidth >= bp.xl && xl !== undefined) return xl;
			if (viewportWidth >= bp.lg && lg !== undefined) return lg;
			if (viewportWidth >= bp.md && md !== undefined) return md;
			if (viewportWidth >= bp.sm && sm !== undefined) return sm;
			return base ?? fallback;
		}
		const v = (value ?? {}) as {
			base?: number;
			sm?: number;
			md?: number;
			lg?: number;
			xl?: number;
		};
		const bp = {
			sm: breakpoints?.sm ?? 640,
			md: breakpoints?.md ?? 768,
			lg: breakpoints?.lg ?? 1024,
			xl: breakpoints?.xl ?? 1280,
		};
		if (viewportWidth >= bp.xl && v.xl !== undefined) return v.xl;
		if (viewportWidth >= bp.lg && v.lg !== undefined) return v.lg;
		if (viewportWidth >= bp.md && v.md !== undefined) return v.md;
		if (viewportWidth >= bp.sm && v.sm !== undefined) return v.sm;
		return v.base ?? fallback;
	}

	const effectiveMorphDistance = resolveResponsiveNumber(morphDistancePx, 200);
	const effectiveDisappearDistance = (() => {
		if (typeof distanceToDisappear === "number") return distanceToDisappear;
		if (distanceToDisappear === undefined) return undefined;
		return resolveResponsiveNumber(distanceToDisappear, Number.NaN);
	})();

	// Drive the reordering progress from scroll (parameterized distance)
	const reorderProgress = useTransform(
		scrollY,
		[0, effectiveMorphDistance],
		[0, 1],
	);

	// Make non-target letters go semi transparent quickly, then fully fade at completion
	const nonTargetMinOpacity = 0.35;
	const nonTargetFadeFraction = 0.3;

	// Per-character randomized fade-out at completion for non-target letters
	function clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	}

	function lerp(start: number, end: number, t: number): number {
		return start + (end - start) * t;
	}

	const perCharRandomRank = useMemo(() => {
		const ranks: number[] = [];
		for (let i = 0; i < sourceText.length; i++) {
			const seed = i * 13 + sourceText.length;
			const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
			const r = x - Math.floor(x);
			ranks.push(r);
		}
		return ranks;
	}, [sourceText]);

	const [charOpacity, setCharOpacity] = useState<number[]>(() =>
		Array.from({ length: sourceText.length }, () => 1),
	);

	// Keep charOpacity array in sync if sourceText length changes
	useEffect(() => {
		setCharOpacity((prev) => {
			if (prev.length === sourceText.length) return prev;
			return Array.from({ length: sourceText.length }, (_, i) => prev[i] ?? 1);
		});
	}, [sourceText.length]);

	// Extend fade over additional scroll beyond morph completion
	const tailExtraPx = Math.max(
		60,
		Math.floor((effectiveMorphDistance ?? 200) * 0.3),
	);
	const tailProgress = useTransform(
		scrollY,
		[effectiveMorphDistance, effectiveMorphDistance + tailExtraPx],
		[0, 1],
	);

	const [currentProgress, setCurrentProgress] = useState(0);
	const [currentTail, setCurrentTail] = useState(0);

	function recomputeCharOpacities(progress: number, tail: number) {
		const p = clamp(progress, 0, 1);
		const t = clamp(tail, 0, 1);
		const endPhaseStart = 0.9; // begin randomized fade cascade late in morph
		const endPhaseSpan = 0.1; // original distribution window
		const morphEndPhase =
			p <= endPhaseStart ? 0 : (p - endPhaseStart) / (1 - endPhaseStart);
		// Blend morph end-phase with tail progress to extend total fade distance
		const endPhaseCombined = clamp(morphEndPhase * 0.4 + t * 0.6, 0, 1);
		setCharOpacity((prev) => {
			const next: number[] =
				prev.length === sourceText.length
					? [...prev]
					: Array.from({ length: sourceText.length }, () => 1);
			for (let i = 0; i < sourceText.length; i++) {
				// Early fade to semi-transparent
				if (p <= nonTargetFadeFraction) {
					next[i] = lerp(1, nonTargetMinOpacity, p / nonTargetFadeFraction);
					continue;
				}
				// Hold semi-transparent until end-phase begins
				if (endPhaseCombined <= 0) {
					next[i] = nonTargetMinOpacity;
					continue;
				}
				// Randomized end fade per character using combined phase
				const rank = perCharRandomRank[i] ?? 0;
				if (endPhaseCombined <= rank) {
					next[i] = nonTargetMinOpacity;
				} else {
					const tRaw = clamp((endPhaseCombined - rank) / (1 - rank), 0, 1);
					const tEase = tRaw ** 1.5;
					next[i] = lerp(nonTargetMinOpacity, 0, tEase);
				}
			}
			return next;
		});
	}

	useMotionValueEvent(reorderProgress, "change", (latest) => {
		const p = clamp(latest ?? 0, 0, 1);
		setCurrentProgress(p);
		recomputeCharOpacities(p, currentTail);
	});

	useMotionValueEvent(tailProgress, "change", (latest) => {
		const t = clamp(latest ?? 0, 0, 1);
		setCurrentTail(t);
		recomputeCharOpacities(currentProgress, t);
	});

	// Use deterministic indices for SSR/first render, randomize after mount if requested
	const [targetIndices, setTargetIndices] = useState<number[]>(() => {
		const source = sourceText;
		const target = targetWord;
		const indices: number[] = [];
		const used: boolean[] = Array.from({ length: source.length }, () => false);
		const sourceLower = source.toLowerCase();
		const targetLower = target.toLowerCase();
		for (let t = 0; t < targetLower.length; t++) {
			const ch = targetLower[t];
			let found = -1;
			for (let i = 0; i < sourceLower.length; i++) {
				if (!used[i] && sourceLower[i] === ch) {
					found = i;
					break;
				}
			}
			if (found !== -1) used[found] = true;
			indices.push(found);
		}
		return indices;
	});

	// Recompute deterministic indices when inputs change
	useEffect(() => {
		const source = sourceText;
		const target = targetWord;
		const indices: number[] = [];
		const used: boolean[] = Array.from({ length: source.length }, () => false);
		const sourceLower = source.toLowerCase();
		const targetLower = target.toLowerCase();
		for (let t = 0; t < targetLower.length; t++) {
			const ch = targetLower[t];
			let found = -1;
			for (let i = 0; i < sourceLower.length; i++) {
				if (!used[i] && sourceLower[i] === ch) {
					found = i;
					break;
				}
			}
			if (found !== -1) used[found] = true;
			indices.push(found);
		}
		setTargetIndices(indices);
	}, [sourceText, targetWord]);

	// After mount, optionally randomize mapping to avoid hydration mismatch
	useEffect(() => {
		if (!randomizeSelection) return;
		const source = sourceText;
		const target = targetWord;
		// Use a microtask to ensure this runs post-hydration paint
		Promise.resolve().then(() => {
			const indices: number[] = [];
			const used: boolean[] = Array.from(
				{ length: source.length },
				() => false,
			);
			const sourceLower = source.toLowerCase();
			const targetLower = target.toLowerCase();
			for (let t = 0; t < targetLower.length; t++) {
				const ch = targetLower[t];
				const candidates: number[] = [];
				for (let i = 0; i < sourceLower.length; i++) {
					if (!used[i] && sourceLower[i] === ch) candidates.push(i);
				}
				if (candidates.length === 0) {
					indices.push(-1);
					continue;
				}
				const randomIndex = Math.floor(Math.random() * candidates.length);
				const chosenIndex = candidates[randomIndex] ?? -1;
				if (chosenIndex !== -1) used[chosenIndex] = true;
				indices.push(chosenIndex);
			}
			setTargetIndices(indices);
		});
	}, [randomizeSelection, sourceText, targetWord]);

	const allTargetIndices = useMemo(() => {
		const set = new Set<number>();
		for (const idx of targetIndices) if (idx !== -1) set.add(idx);
		return set;
	}, [targetIndices]);

	// Stable list of source characters with unique ids for rendering keys
	const sourceChars = useMemo(
		() =>
			sourceText.split("").map((ch, pos) => ({ id: `${ch}-${pos}`, ch, pos })),
		[sourceText],
	);

	// Update step count from scroll progress
	useMotionValueEvent(reorderProgress, "change", (latest) => {
		const progress = Math.max(0, Math.min(1, latest ?? 0));
		setStepCount(Math.floor(progress * targetWord.length));
	});

	// Optional disappearance logic (fade then unmount)
	const hasDisappear =
		typeof effectiveDisappearDistance === "number" &&
		!Number.isNaN(effectiveDisappearDistance);
	const fadeStart = hasDisappear
		? Math.max(0, (effectiveDisappearDistance as number) - 60)
		: 0;
	const fadeEnd = hasDisappear
		? Math.max(fadeStart + 1, effectiveDisappearDistance as number)
		: 1;
	const fadeRange = (hasDisappear ? [1, 0] : [1, 1]) as [number, number];
	const largeHeadingOpacity = useTransform(
		scrollY,
		[fadeStart, fadeEnd],
		fadeRange,
	);

	const [isHidden, setIsHidden] = useState<boolean>(false);
	const hiddenRef = useRef<boolean>(false);
	// Hysteresis to avoid flicker around the threshold (in pixels)
	const DISAPPEAR_EPS = 2;
	useMotionValueEvent(scrollY, "change", (v) => {
		if (!hasDisappear) {
			if (hiddenRef.current) {
				hiddenRef.current = false;
				setIsHidden(false);
			}
			return;
		}
		const threshold = effectiveDisappearDistance as number;
		// If currently visible, only hide once we're past threshold + eps
		if (!hiddenRef.current && v >= threshold + DISAPPEAR_EPS) {
			hiddenRef.current = true;
			setIsHidden(true);
			return;
		}
		// If currently hidden, only show once we're below threshold - eps
		if (hiddenRef.current && v <= threshold - DISAPPEAR_EPS) {
			hiddenRef.current = false;
			setIsHidden(false);
		}
	});

	// Pill opacity: fades in AFTER large heading has faded out
	const pillOpacity = useTransform(
		scrollY,
		[230, 300], // Starts fading in after longer pause post-morph
		[0, 1],
	);

	// Background opacity for the pill (appears as pill fades in)
	const backgroundOpacity = useTransform(
		scrollY,
		[240, 300], // Delayed to appear with pill
		[0, 1],
	);

	// Border opacity for the pill (appears last)
	const borderOpacity = useTransform(
		scrollY,
		[260, 320], // Appears in the final phase
		[0, 1],
	);

	if (isHidden) return null;

	return (
		<motion.header
			ref={elementRef}
			className="sticky top-5 z-40 w-fit"
			style={{ opacity: largeHeadingOpacity }}
			initial={false}
		>
			<div className="relative">
				{/* Large heading */}
				<motion.h1 className="text-page-heading" initial={false}>
					{(() => {
						// Build prefix characters from selected indices
						const prefixChars: string[] = [];
						const usedSet = new Set<number>();
						for (let i = 0; i < stepCount; i++) {
							const idx = targetIndices[i] ?? -1;
							if (idx !== -1) {
								usedSet.add(idx);
								prefixChars.push(sourceText.charAt(idx));
							}
						}
						return (
							<>
								{uppercasePrefix ? (
									<span className="uppercase">{prefixChars.join("")}</span>
								) : (
									<span>{prefixChars.join("")}</span>
								)}
								{/* Removed trailing full stop after target word completion */}
								{(() => {
									// Ensure a single space between constructed word and the first rendered remainder character
									if (prefixChars.length === 0) return null;
									for (const { ch, pos } of sourceChars) {
										const isTargetLetter = allTargetIndices.has(pos);
										const isSelected = usedSet.has(pos);
										// Skip characters that won't render (selected target letters)
										if (isTargetLetter && isSelected) continue;
										// This is the first character that will render; add a space if it's not already a space
										return ch === " " ? null : (
											<span key="__prefix_space__"> </span>
										);
									}
									return null;
								})()}
								{/* Render remainder per-character: non-target letters fade; target letters stay until selected */}
								<span>
									{sourceChars.map(({ id, ch, pos }) => {
										const isTargetLetter = allTargetIndices.has(pos);
										const isSelected = usedSet.has(pos);
										if (!isTargetLetter) {
											return (
												<motion.span
													key={id}
													style={{
														opacity: fadeNonTarget
															? (charOpacity[pos] ?? 1)
															: 1,
													}}
													initial={false}
												>
													{ch}
												</motion.span>
											);
										}
										// Target letters: when selected, remove original position
										if (isSelected) return null;
										return <span key={id}>{ch}</span>;
									})}
								</span>
							</>
						);
					})()}
				</motion.h1>
			</div>
		</motion.header>
	);
}
