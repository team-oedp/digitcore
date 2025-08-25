import type * as React from "react";
import { cn } from "~/lib/utils";

export function PageWrapper({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"min-h-screen 3xl:max-w-6xl max-w-4xl px-5 py-5 2xl:max-w-5xl",
				className,
			)}
		>
			{children}
		</div>
	);
}
