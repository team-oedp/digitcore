import {
	defaultLanguageId,
	documentInternationalizationConfig,
} from "~/sanity/document-internationalization-config";

const languages = [
	...documentInternationalizationConfig.supportedLanguages,
] as const;

export const i18n = {
	languages,
	base: defaultLanguageId,
} as const;

export type LanguageDefinition = (typeof i18n)["languages"][number];
export type Language = LanguageDefinition["id"];

export const supportedLanguageIds = new Set<Language>(
	i18n.languages.map((language) => language.id),
);
