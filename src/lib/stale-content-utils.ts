import { cn } from "./utils";

// Utility for stale content styling with better contrast
export const getStaleItemClasses = (isStale = false) => {
	return cn(
		"carrier-bag-item-container flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors [&:hover_.item-actions]:opacity-100",
		isStale
			? "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/40"
			: "bg-item-background hover:bg-[var(--item-background-hover)]",
	);
};

// Screen reader friendly stale status text
export const getStaleStatusText = (isStale = false) => {
	return isStale ? "Content has been updated in the system" : "";
};

// Accessible color classes for stale indicators
export const staleIndicatorClasses = {
	button:
		"h-6 w-6 p-0 hover:bg-amber-200 dark:hover:bg-amber-700 focus-visible:ring-amber-500",
	icon: "text-amber-700 dark:text-amber-300",
	border: "border-amber-400 dark:border-amber-500",
	background: "bg-amber-50 dark:bg-amber-950/30",
} as const;
