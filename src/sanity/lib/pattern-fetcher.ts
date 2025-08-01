import type { SanityClient } from "next-sanity";
import type {
	AUDIENCES_BY_IDS_QUERYResult,
	PATTERN_BASE_QUERYResult,
	RESOURCES_BY_IDS_QUERYResult,
	SOLUTIONS_BY_IDS_QUERYResult,
	TAGS_BY_IDS_QUERYResult,
	THEME_BY_ID_QUERYResult,
} from "~/sanity/sanity.types";
import {
	AUDIENCES_BY_IDS_QUERY,
	PATTERN_BASE_QUERY,
	RESOURCES_BY_IDS_QUERY,
	SOLUTIONS_BY_IDS_QUERY,
	TAGS_BY_IDS_QUERY,
	THEME_BY_ID_QUERY,
} from "./queries";

export type EnrichedPattern = NonNullable<PATTERN_BASE_QUERYResult> & {
	tags: TAGS_BY_IDS_QUERYResult;
	audiences: AUDIENCES_BY_IDS_QUERYResult;
	theme: THEME_BY_ID_QUERYResult;
	solutions: SOLUTIONS_BY_IDS_QUERYResult;
	resources: (RESOURCES_BY_IDS_QUERYResult[number] & {
		solutions: SOLUTIONS_BY_IDS_QUERYResult;
	})[];
};

/**
 * Fetch a pattern with all related data using separate queries
 * This approach avoids nested reference issues and provides better type safety
 */
export async function fetchPatternWithRelations(
	client: SanityClient,
	slug: string,
): Promise<EnrichedPattern | null> {
	// 1. Fetch the base pattern with reference IDs
	const basePattern = await client.fetch(PATTERN_BASE_QUERY, { slug });

	if (!basePattern) {
		return null;
	}

	// 2. Extract all reference IDs
	const tagIds = basePattern.tagIds?.filter(Boolean) || [];
	const audienceIds = basePattern.audienceIds?.filter(Boolean) || [];
	const themeId = basePattern.themeId;
	const solutionIds = basePattern.solutionIds?.filter(Boolean) || [];
	const resourceIds = basePattern.resourceIds?.filter(Boolean) || [];

	// 3. Fetch all related data in parallel
	const [tags, audiences, theme, solutions, resources] = await Promise.all([
		tagIds.length > 0 ? client.fetch(TAGS_BY_IDS_QUERY, { ids: tagIds }) : [],
		audienceIds.length > 0
			? client.fetch(AUDIENCES_BY_IDS_QUERY, { ids: audienceIds })
			: [],
		themeId ? client.fetch(THEME_BY_ID_QUERY, { id: themeId }) : null,
		solutionIds.length > 0
			? client.fetch(SOLUTIONS_BY_IDS_QUERY, { ids: solutionIds })
			: [],
		resourceIds.length > 0
			? client.fetch(RESOURCES_BY_IDS_QUERY, { ids: resourceIds })
			: [],
	]);

	// 4. For each resource, fetch its related solutions
	const enrichedResources = await Promise.all(
		resources.map(async (resource) => {
			const resourceSolutionIds = resource.solutionIds?.filter(Boolean) || [];
			const resourceSolutions =
				resourceSolutionIds.length > 0
					? await client.fetch(SOLUTIONS_BY_IDS_QUERY, {
							ids: resourceSolutionIds,
						})
					: [];

			return {
				...resource,
				solutions: resourceSolutions,
			};
		}),
	);

	// 5. Combine everything
	return {
		...basePattern,
		tags,
		audiences,
		theme,
		solutions,
		resources: enrichedResources,
	};
}

/**
 * Alternative: Fetch pattern data in batches for better performance
 */
export async function fetchPatternWithRelationsBatched(
	client: SanityClient,
	slug: string,
): Promise<EnrichedPattern | null> {
	// 1. Fetch base pattern
	const basePattern = await client.fetch(PATTERN_BASE_QUERY, { slug });

	if (!basePattern) {
		return null;
	}

	// 2. Batch fetch main relations
	const mainIds = [
		...(basePattern.tagIds || []),
		...(basePattern.audienceIds || []),
		...(basePattern.themeId ? [basePattern.themeId] : []),
		...(basePattern.solutionIds || []),
		...(basePattern.resourceIds || []),
	].filter(Boolean);

	// Single query to get all referenced documents
	const allReferencedDocs = await client.fetch(
		`*[_id in $ids]{
			_id,
			_type,
			_createdAt,
			_updatedAt,
			_rev,
			title,
			description,
			// Resource-specific fields
			_type == "resource" => {
				links,
				"solutionIds": solutions[]._ref
			},
			// Solution-specific fields  
			_type == "solution" => {
				audiences[]->{_id, _type, title}
			}
		}`,
		{ ids: mainIds },
	);

	// 3. Separate by type
	type DocumentWithType = {
		_type: string;
		_id: string;
		[key: string]: unknown;
	};

	const tagDocs = allReferencedDocs.filter(
		(doc: DocumentWithType) => doc._type === "tag",
	);
	const audienceDocs = allReferencedDocs.filter(
		(doc: DocumentWithType) => doc._type === "audience",
	);
	const themeDoc = allReferencedDocs.find(
		(doc: DocumentWithType) => doc._type === "theme",
	);
	const solutionDocs = allReferencedDocs.filter(
		(doc: DocumentWithType) => doc._type === "solution",
	);
	const resourceDocs = allReferencedDocs.filter(
		(doc: DocumentWithType) => doc._type === "resource",
	);

	// 4. Get solutions for resources
	const allResourceSolutionIds = resourceDocs
		.flatMap(
			(resource: DocumentWithType & { solutionIds?: string[] }) =>
				resource.solutionIds || [],
		)
		.filter(Boolean);

	const resourceSolutions =
		allResourceSolutionIds.length > 0
			? await client.fetch(SOLUTIONS_BY_IDS_QUERY, {
					ids: allResourceSolutionIds,
				})
			: [];

	// 5. Create lookup map for resource solutions
	const solutionMap = new Map(resourceSolutions.map((sol) => [sol._id, sol]));

	// 6. Enrich resources with their solutions
	const enrichedResources = resourceDocs.map(
		(resource: DocumentWithType & { solutionIds?: string[] }) => ({
			...resource,
			solutions: (resource.solutionIds || [])
				.map((id: string) => solutionMap.get(id))
				.filter(Boolean),
		}),
	);

	return {
		...basePattern,
		tags: tagDocs,
		audiences: audienceDocs,
		theme: themeDoc,
		solutions: solutionDocs,
		resources: enrichedResources,
	};
}
