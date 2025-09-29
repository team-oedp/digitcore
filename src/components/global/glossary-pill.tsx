"use client";

import { BookOpen02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import type { GlossaryTerm } from "~/lib/glossary-utils";
import { createGlossaryLink } from "~/lib/glossary-utils";
import { cn } from "~/lib/utils";
import { Icon } from "../shared/icon";

type GlossaryPillProps = {
	term: GlossaryTerm;
	children: React.ReactNode;
	className?: string;
	shouldStyle?: boolean;
};

/**
 * Component that renders a glossary term as a styled pill or plain text
 * Only first occurrences get styled with icon and link
 */
export function GlossaryPill({
	term,
	children,
	className,
	shouldStyle = true,
}: GlossaryPillProps) {
	// If this is not the first occurrence, render as plain text
	if (!shouldStyle) {
		return <>{children}</>;
	}

	// First occurrence gets icon and link
	return (
		<Link
			href={createGlossaryLink(term.title)}
			className={cn(
				"pill-tight items-center gap-1 rounded-md border border-neutral-300 bg-primary/5 px-2.5 pt-0.5 pb-1 text-primary no-underline transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
				className,
			)}
			title={`View definition of "${term.title}"`}
		>
			{children}
			<Icon icon={BookOpen02Icon} className="h-4 w-4" />
		</Link>
	);
}
