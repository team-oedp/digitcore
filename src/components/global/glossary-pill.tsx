"use client";

import Link from "next/link";
import { createGlossaryLink } from "~/lib/glossary-utils";
import type { GlossaryTerm } from "~/lib/glossary-utils";
import { cn } from "~/lib/utils";

interface GlossaryPillProps {
	term: GlossaryTerm;
	children: React.ReactNode;
	className?: string;
}

/**
 * Component that renders a glossary term as a styled pill
 * Clicking on the pill navigates to the glossary page with the term highlighted
 */
export function GlossaryPill({ term, children, className }: GlossaryPillProps) {
	return (
		<Link
			href={createGlossaryLink(term._id)}
			className={cn(
				"glossary-pill",
				"inline-flex items-center",
				"px-2.5 py-0.5",
				"rounded-full",
				"bg-neutral-300",
				"text-foreground",
				"no-underline hover:no-underline",
				"transition-all duration-200",
				"hover:bg-neutral-400",
				"hover:shadow-sm",
				"cursor-pointer",
				"text-sm",
				className,
			)}
			title={`View definition of "${term.title}"`}
		>
			{children}
		</Link>
	);
}
