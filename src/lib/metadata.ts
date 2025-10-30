import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";

export function buildAbsoluteUrl(baseUrl: string, path: string): string {
	try {
		const base = new URL(baseUrl);
		return new URL(path, base).toString();
	} catch {
		return path;
	}
}

export function buildOgImage(urlOrPath: string | undefined, baseUrl?: string) {
	if (!urlOrPath) return undefined;
	const url = baseUrl ? buildAbsoluteUrl(baseUrl, urlOrPath) : urlOrPath;
	return [
		{ url, width: 1200, height: 630 } satisfies NonNullable<
			Metadata["openGraph"]
		>["images"] extends infer T
			? T extends Array<infer U>
				? U
				: never
			: never,
	];
}

export function buildTitle(defaultTitle: string) {
	return { default: defaultTitle, template: "%s | DIGITCORE" } as const;
}

export function buildDescriptionFromPortableText(
	blocks?: PortableTextBlock[] | null,
	maxLength = 200,
): string | undefined {
	if (!Array.isArray(blocks)) return undefined;
	try {
		// lightweight inline conversion to avoid a hard dependency cycle
		const text = blocks
			.map((block) =>
				Array.isArray((block as { children?: unknown[] }).children)
					? ((block as { children: Array<{ text?: string }> }).children || [])
							.map((c) => (typeof c.text === "string" ? c.text : ""))
							.join("")
					: "",
			)
			.filter(Boolean)
			.join(" ");
		const cleaned = text.replace(/\s+/g, " ").trim();
		if (!cleaned) return undefined;
		return cleaned.length > maxLength
			? `${cleaned.slice(0, maxLength - 1).trimEnd()}…`
			: cleaned;
	} catch {
		return undefined;
	}
}
