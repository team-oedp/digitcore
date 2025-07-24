import { toast } from "sonner";

export interface ScrollToAnchorOptions {
	behavior?: ScrollBehavior;
	block?: ScrollLogicalPosition;
	inline?: ScrollLogicalPosition;
	fallbackMessage?: string;
}

export function scrollToAnchor(
	anchorId: string,
	options: ScrollToAnchorOptions = {},
): boolean {
	const {
		behavior = "smooth",
		block = "start",
		inline = "nearest",
		fallbackMessage = "Item not found on page",
	} = options;

	const element = document.getElementById(anchorId);

	if (!element) {
		toast.error(fallbackMessage);
		return false;
	}

	element.scrollIntoView({
		behavior,
		block,
		inline,
	});

	return true;
}

export function scrollToAnchorFromSearchParams(
	searchParams: URLSearchParams,
	paramName = "word",
	options: ScrollToAnchorOptions = {},
): boolean {
	const anchorId = searchParams.get(paramName);

	if (!anchorId) {
		return false;
	}

	return scrollToAnchor(anchorId, options);
}

export function useGlossaryScroll() {
	return {
		scrollToWord: (word: string) =>
			scrollToAnchor(word, {
				fallbackMessage: "Word is not in glossary",
			}),
		scrollToWordFromParams: (searchParams: URLSearchParams) =>
			scrollToAnchorFromSearchParams(searchParams, "word", {
				fallbackMessage: "Word is not in glossary",
			}),
	};
}
