"use client";

type SearchResultsHeaderProps = {
	resultCount?: number;
	searchQuery?: string;
};

export function SearchResultsHeader({
	resultCount = 0,
	searchQuery = "",
}: SearchResultsHeaderProps) {
	return (
		<div className="w-full pb-6">
			<div className="flex flex-col gap-2">
				<h2 className="font-normal text-[#707070] text-sm uppercase tracking-[-0.44px]">
					Results
				</h2>
				<p className="font-normal text-[#707070] text-sm">
					{searchQuery
						? resultCount > 0
							? `Showing ${resultCount} result${resultCount !== 1 ? "s" : ""} for "${searchQuery}"`
							: `No results found for "${searchQuery}"`
						: `Showing ${resultCount} result${resultCount !== 1 ? "s" : ""}`}
				</p>
			</div>
		</div>
	);
}
