/**
 * Maps pageId to display title
 */
export function getPageTitleFromPageId(pageId: string | null | undefined): string {
	if (!pageId) return "Page";

	const pageIdToTitle: Record<string, string> = {
		glossary: "Glossary",
		about: "About",
		tags: "Tags",
		values: "Values",
		themes: "Themes",
		faq: "FAQ",
		acknowledgements: "Acknowledgements",
		patterns: "Patterns",
		home: "Home",
	};

	return pageIdToTitle[pageId] ?? "Page";
}

