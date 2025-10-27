import { cookies, headers } from "next/headers";
import type { Language } from "~/stores/language";

export async function getLanguage(): Promise<Language> {
	// Priority 1: Check cookie (explicit user choice)
	const cookieStore = await cookies();
	const languageCookie = cookieStore.get("language");

	if (languageCookie?.value === "es" || languageCookie?.value === "en") {
		return languageCookie.value;
	}

	// Priority 2: Check Accept-Language header (browser preference)
	const headersList = await headers();
	const acceptLanguage = headersList.get("accept-language");

	if (acceptLanguage?.toLowerCase().includes("es")) {
		return "es";
	}

	// Priority 3: Default to English
	return "en";
}
