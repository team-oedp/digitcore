"use client";

// Skeleton component that mimics the SearchResultItem structure
export function SearchResultSkeleton() {
	return (
		<div className="relative max-h-[280px] min-h-[160px] w-full overflow-hidden border-dashed-brand-t pb-0 lg:min-h-[220px]">
			<div className="flex flex-col py-4">
				{/* Header with title and button */}
				<div className="mb-4">
					<div className="inline-flex w-full items-start justify-between gap-3 md:gap-6">
						<div className="inline-flex min-w-0 flex-1 items-start justify-start gap-3">
							{/* Title Skeleton */}
							<div className="h-7 w-full max-w-[280px] animate-pulse rounded bg-zinc-200 md:h-8 md:max-w-[400px]" />
						</div>
						{/* Button Skeleton */}
						<div className="h-7 w-24 flex-shrink-0 animate-pulse rounded-md bg-green-100 md:h-8 md:w-32" />
					</div>
				</div>

				{/* Content area */}
				<div className="w-full space-y-4">
					{/* Description Skeleton */}
					<div className="mb-4 space-y-2">
						<div className="h-4 w-full animate-pulse rounded bg-zinc-200 md:h-5" />
						<div className="h-4 w-11/12 animate-pulse rounded bg-zinc-200 md:h-5" />
						<div className="h-4 w-4/5 animate-pulse rounded bg-zinc-200 md:h-5" />
					</div>

					{/* Badge Groups */}
					<div className="flex flex-wrap gap-3">
						{/* Theme Badge Skeleton */}
						<div className="flex items-center gap-2">
							<div className="h-6 w-20 animate-pulse rounded-lg bg-zinc-200 md:w-24" />
						</div>

						{/* Audience Badges Skeleton */}
						<div className="flex items-center gap-2">
							<div className="h-6 w-24 animate-pulse rounded-lg bg-blue-100 md:w-28" />
						</div>

						{/* Tag Badges Skeleton */}
						<div className="flex items-center gap-2">
							<div className="h-6 w-16 animate-pulse rounded-lg bg-green-100 md:w-20" />
							<div className="h-6 w-20 animate-pulse rounded-lg bg-green-100 md:w-24" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// Component that renders multiple skeletons
export function SearchResultsSkeleton({ count = 5 }: { count?: number }) {
	return (
		<div className="w-full">
			{Array.from({ length: count }, (_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: Skeletons are visual only, index is safe
				<SearchResultSkeleton key={i} />
			))}
		</div>
	);
}
