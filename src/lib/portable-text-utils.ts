import type { PortableTextBlock } from "next-sanity";

type PortableTextSpan = {
	_key: string;
	_type: "span";
	text: string;
	marks?: string[];
};

function isPortableTextSpan(child: unknown): child is PortableTextSpan {
	return !!child && typeof child === "object" && "text" in child;
}

/**
 * Converts Portable Text blocks to plain text string
 *
 * @param blocks - Array of Portable Text blocks or null/undefined
 * @returns Plain text string with blocks separated by newlines
 *
 * @example
 * const plainText = ptToPlainText(portableTextBlocks)
 * // Returns: "First block text\nSecond block text"
 */
export function ptToPlainText(blocks?: PortableTextBlock[] | null): string {
	if (!Array.isArray(blocks)) return "";
	return blocks
		.map((block: PortableTextBlock) =>
			Array.isArray(block.children)
				? block.children
						.filter(isPortableTextSpan)
						.map((child) => (typeof child.text === "string" ? child.text : ""))
						.join("")
				: "",
		)
		.filter(Boolean)
		.join("\n");
}
