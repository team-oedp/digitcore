const languages = [
	{ id: "en", title: "English", isDefault: true },
	{ id: "es", title: "Spanish", isDefault: false },
] as const;

const baseLanguage =
	languages.find((language) => language.isDefault)?.id ?? languages[0].id;

export const i18n = {
	languages,
	base: baseLanguage,
} as const;

export type LanguageDefinition = (typeof i18n)["languages"][number];
export type Language = LanguageDefinition["id"];

export const supportedLanguageIds = new Set<Language>(
	i18n.languages.map((language) => language.id),
);
