import { toast } from "sonner";

export type ScrollToAnchorOptions = {
	behavior?: ScrollBehavior;
	block?: ScrollLogicalPosition;
	inline?: ScrollLogicalPosition;
	fallbackMessage?: string;
	onError?: (message: string) => void;
};

export function scrollToAnchor(
	anchorId: string,
	options: ScrollToAnchorOptions = {},
): boolean {
	const {
		behavior = "smooth",
		block = "start",
		inline = "nearest",
		fallbackMessage = "Item not found on page",
		onError,
	} = options;

	// SSR safety check
	if (typeof window === "undefined" || typeof document === "undefined") {
		return false;
	}

	// Input validation
	if (!anchorId || typeof anchorId !== "string" || anchorId.trim() === "") {
		const errorMessage = "Invalid anchor ID provided";
		if (onError) {
			onError(errorMessage);
		} else {
			toast.error(errorMessage);
		}
		return false;
	}

	const cleanAnchorId = anchorId.trim();
	const element = document.getElementById(cleanAnchorId);

	if (!element) {
		if (onError) {
			onError(fallbackMessage);
		} else {
			toast.error(fallbackMessage);
		}
		return false;
	}

	try {
		element.scrollIntoView({
			behavior,
			block,
			inline,
		});
		return true;
	} catch (error) {
		const errorMessage = "Failed to scroll to element";
		if (onError) {
			onError(errorMessage);
		} else {
			toast.error(errorMessage);
		}
		return false;
	}
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
