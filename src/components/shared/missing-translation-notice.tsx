import { i18n } from "~/i18n/config";
import { cn } from "~/lib/utils";

type MissingTranslationNoticeProps = {
	language: string;
	message?: string;
	description?: string;
	className?: string;
	containerClassName?: string;
	pillClassName?: string;
};

const LANGUAGE_NAMES: Record<string, string> = {
	en: "English",
	es: "Spanish",
	fr: "French",
	de: "German",
	it: "Italian",
	pt: "Portuguese",
	ru: "Russian",
	zh: "Chinese",
	ja: "Japanese",
	ko: "Korean",
	ar: "Arabic",
	hi: "Hindi",
	nl: "Dutch",
	sv: "Swedish",
	pl: "Polish",
	tr: "Turkish",
	vi: "Vietnamese",
	th: "Thai",
	id: "Indonesian",
	cs: "Czech",
	ro: "Romanian",
	hu: "Hungarian",
	fi: "Finnish",
	da: "Danish",
	nb: "Norwegian",
	uk: "Ukrainian",
	el: "Greek",
	he: "Hebrew",
	bn: "Bengali",
	ta: "Tamil",
	te: "Telugu",
	mr: "Marathi",
	ur: "Urdu",
	fa: "Persian",
	sw: "Swahili",
};

function getLanguageTitle(languageCode: string): string {
	const normalizedCode = languageCode.toLowerCase();

	const i18nLanguage = i18n.languages.find(
		(lang) => lang.id === normalizedCode,
	);
	if (i18nLanguage) {
		return i18nLanguage.title;
	}

	return LANGUAGE_NAMES[normalizedCode] ?? languageCode;
}

/**
 * Displays a floating pill-styled notice when localized content is unavailable.
 *
 */
export function MissingTranslationNotice({
	language,
	message = "There is no",
	description = "",
	className,
	containerClassName,
	pillClassName,
}: MissingTranslationNoticeProps) {
	return (
		<div className={cn("relative px-5 pt-0 pb-5", className)}>
			<div
				className={cn(
					"pointer-events-auto absolute top-8 inline-flex w-fit items-center gap-1 rounded-lg border-[1.5px] border-brand bg-container-background px-4 py-4 font-normal text-foreground text-sm shadow-sm",
					containerClassName,
					pillClassName,
				)}
			>
				<span>{message}</span>
				<span>{getLanguageTitle(language)}</span>
				<span>translation available for this page currently.</span>
			</div>
			{description && (
				<p className="absolute top-[calc(4rem+1rem+2.75rem)] max-w-prose text-muted-foreground text-sm">
					{description}
				</p>
			)}
		</div>
	);
}
