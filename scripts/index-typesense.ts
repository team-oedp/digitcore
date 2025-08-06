import { createClient } from "next-sanity";
import Typesense from "typesense";

// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

// Initialize Sanity client
const sanityClient = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: "2023-10-01",
	useCdn: false,
	token: process.env.SANITY_API_READ_TOKEN, // Use the read token for better access
});

// Types for the data structures
type PortableTextBlock = {
	_type: string;
	children?: Array<{ _type: string; text?: string }>;
};

type PatternData = {
	_id: string;
	title?: string;
	description?: PortableTextBlock[];
	slug: string;
	tags?: Array<{ title?: string }>;
	audiences?: Array<{ title?: string }>;
	theme?: { title?: string };
	solutions?: Array<{
		_id: string;
		title?: string;
		description?: PortableTextBlock[];
	}>;
	resources?: Array<{
		_id: string;
		title?: string;
		description?: PortableTextBlock[];
	}>;
	publishedAt?: string;
};

type SolutionData = {
	_id: string;
	title?: string;
	description?: PortableTextBlock[];
};

type ResourceData = {
	_id: string;
	title?: string;
	description?: PortableTextBlock[];
};

// GROQ queries directly in this file
const PATTERNS_QUERY = `*[_type == "pattern" && defined(slug.current)][]{
  _id,
  _type,
  title,
  description,
  "slug": slug.current,
  tags[]-> {
    _id,
    title
  },
  audiences[]-> {
    _id,
    title
  },
  theme-> {
    _id,
    title
  },
  solutions[]-> {
    _id,
    title,
    description
  },
  resources[]-> {
    _id,
    title,
    description
  },
  publishedAt
}`;

// Initialize Typesense client
const client = new Typesense.Client({
	nodes: [
		{
			host: "localhost",
			port: 8108,
			protocol: "http",
		},
	],
	apiKey: "xyz",
	connectionTimeoutSeconds: 2,
});

async function fetchData() {
	console.log("Fetching data from Sanity...");
	const patterns = await sanityClient.fetch(PATTERNS_QUERY);
	return patterns;
}

function extractTextFromPortableText(
	blocks: PortableTextBlock[] | undefined | null,
): string {
	if (!blocks || !Array.isArray(blocks)) return "";
	return blocks
		.map((block) => {
			if (block._type === "block" && block.children) {
				return block.children
					.filter((child) => child._type === "span" && child.text)
					.map((child) => child.text)
					.join("");
			}
			return "";
		})
		.join("\n")
		.trim();
}

function transformPatternToTypesenseDocument(pattern: PatternData) {
	return {
		id: pattern._id,
		title: pattern.title || "",
		description: extractTextFromPortableText(pattern.description),
		type: "pattern",
		slug: pattern.slug,
		patternId: pattern._id, // Add patternId for consistency
		tags: (pattern.tags || [])
			.map((tag) => tag.title || "")
			.filter(Boolean)
			.join(", "),
		audiences: (pattern.audiences || [])
			.map((audience) => audience.title || "")
			.filter(Boolean)
			.join(", "),
		theme: pattern.theme ? pattern.theme.title : "",
		solutions: (pattern.solutions || [])
			.map((solution) => solution.title || "")
			.filter(Boolean)
			.join(", "),
		resources: (pattern.resources || [])
			.map((resource) => resource.title || "")
			.filter(Boolean)
			.join(", "),
		publishedAt: pattern.publishedAt || "",
	};
}

function transformSolutionToTypesenseDocument(
	solution: SolutionData,
	patternId: string,
) {
	return {
		id: solution._id,
		title: solution.title || "",
		description: extractTextFromPortableText(solution.description),
		type: "solution",
		patternId,
	};
}

function transformResourceToTypesenseDocument(
	resource: ResourceData,
	patternId: string,
) {
	return {
		id: resource._id,
		title: resource.title || "",
		description: extractTextFromPortableText(resource.description),
		type: "resource",
		patternId,
	};
}

async function ensureCollection() {
	const collectionName = "patterns";

	try {
		// Try to get existing collection
		await client.collections(collectionName).retrieve();
		console.log("✅ Collection exists");
	} catch (error) {
		// Collection doesn't exist, create it
		console.log("Creating collection...");
		await client.collections().create({
			name: collectionName,
			fields: [
				{ name: "id", type: "string" },
				{ name: "title", type: "string" },
				{ name: "description", type: "string", optional: true },
				{ name: "type", type: "string", facet: true },
				{ name: "slug", type: "string", optional: true },
				{ name: "patternId", type: "string", optional: true, facet: true },
				{ name: "tags", type: "string", optional: true },
				{ name: "audiences", type: "string", optional: true },
				{ name: "theme", type: "string", optional: true },
				{ name: "solutions", type: "string", optional: true },
				{ name: "resources", type: "string", optional: true },
				{ name: "publishedAt", type: "string", optional: true },
			],
		});
		console.log("✅ Created collection");
	}
}

async function indexData() {
	try {
		await ensureCollection();

		const patterns = await fetchData();
		console.log(`Found ${patterns.length} patterns`);

		const patternDocuments = patterns.map(transformPatternToTypesenseDocument);
		console.log(`Created ${patternDocuments.length} pattern documents`);

		const solutionDocuments = patterns.flatMap((pattern: PatternData) =>
			(pattern.solutions || []).map((solution: SolutionData) =>
				transformSolutionToTypesenseDocument(solution, pattern._id),
			),
		);
		console.log(`Created ${solutionDocuments.length} solution documents`);

		const resourceDocuments = patterns.flatMap((pattern: PatternData) =>
			(pattern.resources || []).map((resource: ResourceData) =>
				transformResourceToTypesenseDocument(resource, pattern._id),
			),
		);
		console.log(`Created ${resourceDocuments.length} resource documents`);

		const documents = [
			...patternDocuments,
			...solutionDocuments,
			...resourceDocuments,
		];
		console.log(`Total documents to index: ${documents.length}`);

		if (documents.length > 0) {
			const results = await client
				.collections("patterns")
				.documents()
				.import(documents, { action: "upsert" });
			console.log("✅ Data indexed successfully");
			console.log(`Indexed ${results.length} documents`);
		} else {
			console.log("No documents to index");
		}
	} catch (error) {
		console.error("❌ Error indexing data:", error);
	}
}

indexData();
