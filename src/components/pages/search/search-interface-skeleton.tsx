export function SearchInterfaceSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{/* Search Input Skeleton */}
			<div className="relative w-full">
				<div className="flex w-full items-center justify-start px-0 py-3">
					<div className="relative flex flex-1 items-center justify-start gap-2 p-0">
						<div className="h-8 w-full animate-pulse rounded bg-neutral-200" />
					</div>
				</div>
			</div>
			{/* Filter Tools Skeleton */}
			<div className="flex w-full max-w-4xl gap-3 p-0.5">
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-base text-primary">Audiences</div>
					<div className="h-[34px] w-full animate-pulse rounded-lg bg-neutral-200" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-base text-primary">Themes</div>
					<div className="h-[34px] w-full animate-pulse rounded-lg bg-neutral-200" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-base text-primary">Tags</div>
					<div className="h-[34px] w-full animate-pulse rounded-lg bg-neutral-200" />
				</div>
			</div>
		</div>
	);
}
