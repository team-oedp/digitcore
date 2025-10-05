import { Skeleton } from "~/components/ui/skeleton";

export function SearchInterfaceSkeleton() {
	return (
		<div className="flex flex-col gap-4">
			{/* Search Input Skeleton - matches exact Input structure */}
			<div className="relative w-full">
				<div className="flex w-full items-center justify-start px-0 py-3">
					<div className="relative flex flex-1 items-center justify-start gap-2 p-0">
						{/* Matches Input className: h-8, border-b, rounded-none */}
						<Skeleton className="h-8 w-full rounded-none border-neutral-300 border-b" />
					</div>
				</div>
			</div>

			{/* Enhance Toggle Skeleton - matches EnhanceToggle component */}
			<div className="flex items-center gap-2">
				<Skeleton className="h-4 w-4 rounded-sm" />
				<Skeleton className="h-4 w-40" />
			</div>

			{/* Filter Tools Skeleton - exact multiselect structure */}
			<div className="flex w-full max-w-4xl gap-3 p-0.5">
				{/* Audience Multiselect */}
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-primary text-xs">Audiences</div>
					<Skeleton className="h-[34px] w-full rounded-lg border border-input" />
				</div>

				{/* Theme Multiselect */}
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-primary text-xs">Themes</div>
					<Skeleton className="h-[34px] w-full rounded-lg border border-input" />
				</div>

				{/* Tags Multiselect */}
				<div className="min-w-0 flex-1">
					<div className="mb-1 text-primary text-xs">Tags</div>
					<Skeleton className="h-[34px] w-full rounded-lg border border-input" />
				</div>
			</div>
		</div>
	);
}
