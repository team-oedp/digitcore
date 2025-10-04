import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

type BadgeGroupProps = {
	children: ReactNode;
	className?: string;
};

/**
 * BadgeGroup provides consistent spacing for badge collections
 * Used across pattern connections, search results, and other badge displays
 */
export function BadgeGroup({ children, className }: BadgeGroupProps) {
	return (
		<div
			className={cn("flex flex-wrap items-center gap-1.5 md:gap-2", className)}
		>
			{children}
		</div>
	);
}

type BadgeGroupContainerProps = {
	children: ReactNode;
	className?: string;
};

/**
 * BadgeGroupContainer wraps multiple BadgeGroup components
 * Provides consistent vertical spacing between badge groups
 */
export function BadgeGroupContainer({
	children,
	className,
}: BadgeGroupContainerProps) {
	return (
		<div className={cn("flex flex-col gap-1.5 md:gap-2", className)}>
			{children}
		</div>
	);
}
