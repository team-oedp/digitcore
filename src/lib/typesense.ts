import Typesense from "typesense";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

// NextJS example here: https://github.com/typesense/showcase-guitar-chords-search-next-js
// Environment variables for TypeSense configuration
const TYPESENSE_HOST = process.env.NEXT_PUBLIC_TYPESENSE_HOST || "localhost";
const TYPESENSE_PORT = Number.parseInt(
	process.env.NEXT_PUBLIC_TYPESENSE_PORT || "8108",
	10,
);
const TYPESENSE_PROTOCOL = process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "http";
const TYPESENSE_API_KEY = process.env.NEXT_PUBLIC_TYPESENSE_API_KEY || "xyz";

// Create TypeSense client
export const typesenseClient = new Typesense.Client({
	nodes: [
		{
			host: TYPESENSE_HOST,
			port: TYPESENSE_PORT,
			protocol: TYPESENSE_PROTOCOL,
		},
	],
	apiKey: TYPESENSE_API_KEY,
	connectionTimeoutSeconds: 2,
});

// Create InstantSearch adapter
export const typesenseInstantSearchAdapter = new TypesenseInstantSearchAdapter({
	server: {
		apiKey: TYPESENSE_API_KEY,
		nodes: [
			{
				host: TYPESENSE_HOST,
				port: TYPESENSE_PORT,
				protocol: TYPESENSE_PROTOCOL,
			},
		],
	},
	additionalSearchParameters: {
		query_by: "title,description",
	},
});

export const searchClient = typesenseInstantSearchAdapter.searchClient;

// Helper function to index content into TypeSense
export async function indexContent(
	collectionName: string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	documents: any[],
): Promise<void> {
	try {
		// Check if collection exists, if not create it
		try {
			await typesenseClient.collections(collectionName).retrieve();
		} catch (error) {
			// Collection doesn't exist, create it
			await typesenseClient.collections().create({
				name: collectionName,
				fields: [
					{ name: "id", type: "string" },
					{ name: "title", type: "string" },
					{ name: "description", type: "string", optional: true },
					{ name: "type", type: "string" },
					{ name: "slug", type: "string", optional: true },
					{ name: "patternId", type: "string", optional: true },
				],
			});
		}

		// Index documents
		await typesenseClient
			.collections(collectionName)
			.documents()
			.import(documents);
	} catch (error) {
		console.error("Error indexing content:", error);
		throw error;
	}
}

// Helper function to search content
export async function searchTypesense(
	collectionName: string,
	query: string,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Promise<any> {
	try {
		const searchParameters = {
			q: query,
			query_by: "title,description",
			per_page: 20,
		};

		const searchResults = await typesenseClient
			.collections(collectionName)
			.documents()
			.search(searchParameters);

		return searchResults;
	} catch (error) {
		console.error("Error searching TypeSense:", error);
		throw error;
	}
}
