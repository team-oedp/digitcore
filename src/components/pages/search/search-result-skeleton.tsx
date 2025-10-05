"use client";

import { Skeleton } from "~/components/ui/skeleton";

// Skeleton component that accurately represents SearchResultItem loading states
export function SearchResultSkeleton({
	showPatternIcon = false,
	variant = "typical",
}: {
	showPatternIcon?: boolean;
	variant?: "minimal" | "typical" | "full";
}) {
	return (
		<div className="relative w-full border-neutral-400 border-t border-dashed pb-9">
			<div className="flex flex-col py-4">
				{/* Header with title - exact structure match */}
				<div className="mb-4">
					<div className="flex items-start gap-3">
						{/* Conditionally show pattern icon */}
						{showPatternIcon && <Skeleton className="h-6 w-6 flex-shrink-0" />}

						{/* Title with View badge - responsive widths */}
						<div className="flex min-w-0 flex-1 items-start gap-3">
							<Skeleton className="h-7 w-full max-w-md" />
							<Skeleton className="h-5 w-12 flex-shrink-0 rounded-full" />
						</div>
					</div>
				</div>

				{/* Description Skeleton - matches line-clamp-3 */}
				<div className="mb-4">
					<Skeleton className="mb-2 h-4 w-full" />
					<Skeleton className="mb-2 h-4 w-[85%]" />
					<Skeleton className="h-4 w-[70%]" />
				</div>

				{/* Badge Groups Container - matches BadgeGroupContainer */}
				<div className="flex flex-wrap gap-3">
					{/* Always show theme (most common) */}
					<div className="flex items-center gap-2">
						<Skeleton className="h-6 w-24 rounded-full" />
					</div>

					{/* Conditionally show audiences based on variant */}
					{(variant === "typical" || variant === "full") && (
						<div className="flex items-center gap-2">
							<Skeleton className="h-6 w-20 rounded-full" />
							{variant === "full" && (
								<Skeleton className="h-6 w-28 rounded-full" />
							)}
						</div>
					)}

					{/* Conditionally show tags */}
					{variant === "full" && (
						<div className="flex items-center gap-2">
							<Skeleton className="h-6 w-16 rounded-full" />
							<Skeleton className="h-6 w-22 rounded-full" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

// Component that renders multiple skeletons with realistic variation
export function SearchResultsSkeleton({ count = 5 }: { count?: number }) {
	// Create realistic skeleton patterns based on typical data
	const getSkeletonProps = (index: number) => {
		const patterns = [
			{ variant: "typical", showPatternIcon: false },
			{ variant: "full", showPatternIcon: true },
			{ variant: "minimal", showPatternIcon: false },
			{ variant: "typical", showPatternIcon: true },
			{ variant: "full", showPatternIcon: false },
		] as const;

		return patterns[index % patterns.length];
	};

	return (
		<div className="w-full">
			{Array.from({ length: count }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: Skeletons are visual only, index is safe
				<SearchResultSkeleton key={i} {...getSkeletonProps(i)} />
			))}
		</div>
	);
}
