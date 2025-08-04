"use client";

import { usePatternContent } from "~/hooks/use-pattern-content";
import type { PATTERN_QUERYResult } from "~/sanity/sanity.types";

type PatternContentProviderProps = {
	pattern: PATTERN_QUERYResult;
	children: React.ReactNode;
};

export function PatternContentProvider({
	pattern,
	children,
}: PatternContentProviderProps) {
	usePatternContent(pattern);

	return <>{children}</>;
}
