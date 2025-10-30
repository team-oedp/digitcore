import type {
	PluginConfig,
	Language as SanityLanguage,
} from "@sanity/document-internationalization";

type StaticDocumentInternationalizationConfig = Omit<
	PluginConfig,
	"supportedLanguages"
> & {
	supportedLanguages: SanityLanguage[];
};

export const supportedLanguages: SanityLanguage[] = [
	{ id: "en", title: "English" },
	{ id: "es", title: "Spanish" },
];

export const defaultLanguageId: SanityLanguage["id"] = "en";
export const languageFieldName = "language";

export const documentInternationalizationConfig: StaticDocumentInternationalizationConfig =
	{
		supportedLanguages,
		languageField: languageFieldName,
		schemaTypes: [
			"pattern",
			"audience",
			"solution",
			"resource",
			"faq",
			"faqCategory",
			"tag",
			"theme",
			"glossary",
			"page",
			"onboarding",
			"header",
			"footer",
			"carrierBag",
			"siteSettings",
		],
	};
