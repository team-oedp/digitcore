import type { Language } from "~/i18n/config";

export type LanguageParamsPromise = Promise<{ language: Language }>;

export type LanguagePageProps = {
	params: LanguageParamsPromise;
};

export type LanguageSearchPageProps<
	TSearchParams extends Record<string, unknown> = Record<
		string,
		string | string[] | undefined
	>,
> = {
	params: LanguageParamsPromise;
	searchParams: Promise<TSearchParams>;
};
