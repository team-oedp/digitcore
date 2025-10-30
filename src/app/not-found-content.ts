import type { Language } from "~/i18n/config";

type NotFoundCopy = {
	paragraphs: [string, string];
	ctaLabel: string;
};

const translations: Partial<Record<Language, NotFoundCopy>> = {
	es: {
		paragraphs: [
			"Lamentablemente, la página que buscabas no se encuentra o puede que no exista. Es posible que se haya movido, se haya eliminado o que la traducción que has seleccionado aún no esté disponible.",
			"Vuelve al kit de herramientas DIGITCORE utilizando el botón Atrás de tu navegador o haz clic en el enlace siguiente para ir a la página de inicio.",
		],
		ctaLabel: "Ir a la página de inicio de DIGITCORE",
	},
};

const defaultContent: NotFoundCopy = {
	paragraphs: [
		"Unfortunately, the page you were looking for cannot be found or may not exist. It might have moved, been deleted, or the translation you selected is not available yet.",
		"Return to the DIGITCORE toolkit using your browser's back button or click the link below to go to the homepage.",
	],
	ctaLabel: "Go to DIGITCORE homepage",
};

export function getNotFoundContent(language: Language): NotFoundCopy {
	return translations[language] ?? defaultContent;
}
