/**
 * see https://www.sanity.io/docs/api-versioning for how versioning works
 */
export const apiVersion =
	process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-07-23";

const isProduction = process.env.NODE_ENV === "production";
const fallbackDataset = "production";
const fallbackProjectId = "q0v6uag1";

export const dataset = assertValue(
	process.env.NEXT_PUBLIC_SANITY_DATASET ??
		(isProduction ? undefined : fallbackDataset),
	"Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
	process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
		(isProduction ? undefined : fallbackProjectId),
	"Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

/**
 * Used to configure edit intent links, for Presentation Mode, as well as to configure where the Studio is mounted in the router.
 */
export const studioUrl =
	process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333";

function assertValue<T>(v: T | undefined, errorMessage: string): T {
	if (v === undefined) {
		throw new Error(errorMessage);
	}

	return v;
}
