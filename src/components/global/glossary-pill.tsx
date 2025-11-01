"use client";

import { BookOpen02Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { GlossaryTerm } from "~/lib/glossary-utils";
import { createGlossaryLink } from "~/lib/glossary-utils";
import { buildLocaleHref, parseLocalePath } from "~/lib/locale-path";
import { cn } from "~/lib/utils";
import { Icon } from "../shared/icon";

type GlossaryPillProps = {
	term: GlossaryTerm;
	children: React.ReactNode;
	className?: string;
	shouldStyle?: boolean;
};

export const inlineAnnotationClassName =
	"inline-flex items-center gap-1 rounded-md border border-foreground bg-transparent px-2.5 pt-0.5 pb-1 align-middle text-sm leading-none text-inherit no-underline transition-colors hover:text-brand hover:border-brand";

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
	const pathname = usePathname();
	const { language } = useMemo(() => parseLocalePath(pathname), [pathname]);

	// If this is not the first occurrence, render as plain text
	if (!shouldStyle) {
		return <>{children}</>;
	}

	// First occurrence gets icon and link
	const glossaryHref = buildLocaleHref(
		language,
		createGlossaryLink(term.title),
	);

	return (
		<Link
			href={glossaryHref}
			className={cn(inlineAnnotationClassName, className)}
			title={`View definition of "${term.title}"`}
		>
			{children}
			<Icon icon={BookOpen02Icon} className="h-3 w-3" />
		</Link>
	);
}
