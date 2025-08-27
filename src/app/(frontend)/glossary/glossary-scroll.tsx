"use client";

import { useEffect } from "react";
import { toGlossaryAnchorId } from "~/lib/glossary-utils";
import { useGlossaryScroll } from "~/lib/scroll";

type GlossaryScrollProps = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export function GlossaryScroll({ searchParams }: GlossaryScrollProps) {
	const { scrollToWord } = useGlossaryScroll();

	useEffect(() => {
		const word = searchParams.word;
		if (typeof word === "string") {
			const timer = setTimeout(() => {
				// Try the provided word first (works for legacy links using doc IDs)
				const ok = scrollToWord(word);
				if (!ok) {
					// Fallback: slugify titles that may have been passed raw in some links
					scrollToWord(toGlossaryAnchorId(word));
				}
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [searchParams.word, scrollToWord]);

	return null;
}
