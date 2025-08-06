"use client";

// Skeleton component that mimics the SearchResultItem structure
export function SearchResultSkeleton() {
	return (
		<div className="relative w-full pb-9">
			{/* Dashed border at bottom */}
			<div className="absolute right-0 bottom-0 left-0 h-px border-zinc-300 border-t border-dashed" />

			<div className="py-[15px]">
				<div className="flex items-start justify-between gap-[150px]">
					{/* Left Content */}
					<div className="w-[600px] max-w-[600px] flex-shrink-0">
						{/* Title Skeleton */}
						<div className="mb-4 h-9 w-[500px] animate-pulse rounded bg-zinc-200" />

						{/* Theme Badge Skeleton */}
						<div className="mb-4 flex w-full items-center gap-2.5 overflow-hidden">
							<div className="h-6 w-32 animate-pulse rounded-lg bg-zinc-200" />
						</div>

						{/* Tags Skeleton */}
						<div className="mb-4 flex items-center gap-2">
							<div className="h-6 w-20 animate-pulse rounded-lg bg-green-100" />
							<div className="h-6 w-24 animate-pulse rounded-lg bg-green-100" />
						</div>

						{/* Audiences Skeleton */}
						<div className="flex items-center gap-2">
							<div className="h-6 w-28 animate-pulse rounded-lg bg-blue-100" />
						</div>
					</div>

					{/* Right Button Skeleton */}
					<div className="flex-shrink-0 pt-0.5">
						<div className="h-8 w-32 animate-pulse rounded-md bg-purple-100" />
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
