// From https://magicui.design/docs/components/progressive-blur

"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";

export type ProgressiveBlurProps = {
	className?: string;
	height?: string;
	position?: "top" | "bottom" | "both";
	blurLevels?: number[];
	children?: React.ReactNode;
	containerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
	hideAtBottom?: boolean;
	bottomThreshold?: number;
};

export function ProgressiveBlur({
	className,
	height = "30%",
	position = "bottom",
	blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64],
	containerRef,
	hideAtBottom = false,
	bottomThreshold = 50,
}: ProgressiveBlurProps) {
	const [_isAtBottom, setIsAtBottom] = useState(false);
	const [opacity, setOpacity] = useState(1);

	useEffect(() => {
		if (!hideAtBottom || !containerRef?.current) return;

		const container = containerRef.current;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = container;
			const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

			if (distanceFromBottom <= bottomThreshold) {
				setIsAtBottom(true);
				// Create a smooth fade out as we approach the bottom
				const fadeOpacity = Math.max(0, distanceFromBottom / bottomThreshold);
				setOpacity(fadeOpacity);
			} else {
				setIsAtBottom(false);
				setOpacity(1);
			}
		};

		container.addEventListener("scroll", handleScroll, { passive: true });

		// Check initial scroll position
		handleScroll();

		return () => {
			container.removeEventListener("scroll", handleScroll);
		};
	}, [hideAtBottom, containerRef, bottomThreshold]);

	// Create array with length equal to blurLevels.length - 2 (for before/after pseudo elements)
	const divElements = Array(blurLevels.length - 2).fill(null);

	// Don't render if hiding at bottom and completely faded out
	if (hideAtBottom && opacity === 0) {
		return null;
	}

	return (
		<div
			className={cn(
				"gradient-blur pointer-events-none absolute inset-x-0 z-10",
				className,
				position === "top"
					? "top-0"
					: position === "bottom"
						? "bottom-0"
						: "inset-y-0",
			)}
			style={{
				height: position === "both" ? "100%" : height,
				opacity: hideAtBottom ? opacity : 1,
				transition: hideAtBottom ? "opacity 0.2s ease-out" : undefined,
			}}
		>
			{/* First blur layer (pseudo element) */}
			<div
				className="absolute inset-0"
				style={{
					zIndex: 1,
					backdropFilter: `blur(${blurLevels[0]}px)`,
					WebkitBackdropFilter: `blur(${blurLevels[0]}px)`,
					maskImage:
						position === "bottom"
							? "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)"
							: position === "top"
								? "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)"
								: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)",
					WebkitMaskImage:
						position === "bottom"
							? "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)"
							: position === "top"
								? "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)"
								: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)",
				}}
			/>

			{/* Middle blur layers */}
			{divElements.map((_, index) => {
				const blurIndex = index + 1;
				const startPercent = blurIndex * 12.5;
				const midPercent = (blurIndex + 1) * 12.5;
				const endPercent = (blurIndex + 2) * 12.5;

				const maskGradient =
					position === "bottom"
						? `linear-gradient(to bottom, rgba(0,0,0,0) ${startPercent}%, rgba(0,0,0,1) ${midPercent}%, rgba(0,0,0,1) ${endPercent}%, rgba(0,0,0,0) ${endPercent + 12.5}%)`
						: position === "top"
							? `linear-gradient(to top, rgba(0,0,0,0) ${startPercent}%, rgba(0,0,0,1) ${midPercent}%, rgba(0,0,0,1) ${endPercent}%, rgba(0,0,0,0) ${endPercent + 12.5}%)`
							: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)";

				return (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: not critical
						key={`blur-${index}`}
						className="absolute inset-0"
						style={{
							zIndex: index + 2,
							backdropFilter: `blur(${blurLevels[blurIndex]}px)`,
							WebkitBackdropFilter: `blur(${blurLevels[blurIndex]}px)`,
							maskImage: maskGradient,
							WebkitMaskImage: maskGradient,
						}}
					/>
				);
			})}

			{/* Last blur layer (pseudo element) */}
			<div
				className="absolute inset-0"
				style={{
					zIndex: blurLevels.length,
					backdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
					WebkitBackdropFilter: `blur(${blurLevels[blurLevels.length - 1]}px)`,
					maskImage:
						position === "bottom"
							? "linear-gradient(to bottom, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)"
							: position === "top"
								? "linear-gradient(to top, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)"
								: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)",
					WebkitMaskImage:
						position === "bottom"
							? "linear-gradient(to bottom, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)"
							: position === "top"
								? "linear-gradient(to top, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)"
								: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)",
				}}
			/>
		</div>
	);
}
