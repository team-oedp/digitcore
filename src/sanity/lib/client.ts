import { type QueryParams, createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
	projectId,
	dataset,
	apiVersion, // https://www.sanity.io/docs/api-versioning
	useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
});

export async function sanityFetch<const QueryString extends string>({
	query,
	params = {},
	revalidate = 60, // default revalidation time in seconds
	tags = [],
}: {
	query: QueryString;
	params?: QueryParams;
	revalidate?: number | false;
	tags?: string[];
}) {
	return client.fetch(query, params, {
		next: {
			revalidate: tags.length ? false : revalidate, // for simple, time-based revalidation
			tags, // for tag-based revalidation
		},
	});
}

export async function getLanguageForQueries(): Promise<"en" | "es"> {
	try {
		const { cookies } = await import("next/headers");
		const cookieStore = await cookies();
		const languageCookie = cookieStore.get("language");
		
		if (languageCookie?.value === "es" || languageCookie?.value === "en") {
			return languageCookie.value;
		}
	} catch {
		// If cookies() is not available (e.g., in some contexts), fallback to "en"
	}
	
	return "en";
}
