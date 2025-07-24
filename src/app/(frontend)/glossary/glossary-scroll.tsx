"use client";

import { useEffect } from "react";
import { useGlossaryScroll } from "~/lib/scroll";

interface GlossaryScrollProps {
	searchParams: { [key: string]: string | string[] | undefined };
}

export function GlossaryScroll({ searchParams }: GlossaryScrollProps) {
	const { scrollToWord } = useGlossaryScroll();

	useEffect(() => {
		const word = searchParams.word;
		if (typeof word === "string") {
			const timer = setTimeout(() => {
				scrollToWord(word);
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [searchParams.word, scrollToWord]);

	return null;
}
