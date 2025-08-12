import { createClient } from "next-sanity";
import { type NextRequest, NextResponse } from "next/server";
import Typesense from "typesense";
import { dataset, projectId } from "../../../../sanity/env";
import type { BlockContent } from "../../../../sanity/sanity.types";

// Types for GROQ query results (dereferenced data)
type DereferencedEntity = {
	_id: string;
	title?: string;
};

type DereferencedSolution = DereferencedEntity & {
	description?: BlockContent;
};

type DereferencedResource = DereferencedEntity & {
	description?: BlockContent;
	solution?: DereferencedSolution[];
};

type PatternQueryResult = {
	_id: string;
	_type: "pattern";
	title?: string;
	description?: BlockContent;
	slug: string;
	tags?: DereferencedEntity[];
	audiences?: DereferencedEntity[];
	theme?: DereferencedEntity | null;
	solutions?: DereferencedSolution[];
	resources?: DereferencedResource[];
};

type PortableTextBlock = {
	_type: "block";
	children?: Array<{
		_type: "span";
		text?: string;
	}>;
};

// Initialize Sanity client
const sanityClient = createClient({
	projectId,
	dataset,
	apiVersion: "2023-10-01",
	useCdn: false,
});

// Initialize Typesense client
const typesenseClient = new Typesense.Client({
	nodes: [
		{
			host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || "localhost",
			port: Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT) || 8108,
			protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "http",
		},
	],
	apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY || "xyz",
	connectionTimeoutSeconds: 2,
});

// GROQ query to fetch all patterns with related data
const PATTERNS_QUERY = `*[_type == "pattern" && defined(slug.current)][] {
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
    description,
    solution[]-> {
      _id,
      title,
      description
    }
  }
}`;

function extractTextFromPortableText(blocks?: BlockContent): string {
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

function transformPatternToDocument(pattern: PatternQueryResult) {
	return {
		id: pattern._id,
		title: pattern.title || "",
		description: extractTextFromPortableText(pattern.description),
		type: "pattern",
		slug: pattern.slug,
		patternId: pattern._id,
		tags: (pattern.tags || [])
			.map((tag) => tag.title || "")
			.filter(Boolean)
			.join(", "),
		audiences: (pattern.audiences || [])
			.map((audience) => audience.title || "")
			.filter(Boolean)
			.join(", "),
		themes: [pattern.theme?.title].filter(Boolean).join(", "),
	};
}

function transformSolutionToDocument(
	solution: DereferencedSolution,
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

function transformResourceToDocument(
	resource: DereferencedResource,
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

async function reindexTypesense() {
	try {
		console.log("Fetching data from Sanity...");
		const patterns: PatternQueryResult[] =
			await sanityClient.fetch(PATTERNS_QUERY);

		// Transform all documents
		const patternDocuments = patterns.map(transformPatternToDocument);

		const solutionDocuments = patterns.flatMap((pattern) =>
			(pattern.solutions || []).map((solution) =>
				transformSolutionToDocument(solution, pattern._id),
			),
		);

		const resourceDocuments = patterns.flatMap((pattern) =>
			(pattern.resources || []).map((resource) =>
				transformResourceToDocument(resource, pattern._id),
			),
		);

		const allDocuments = [
			...patternDocuments,
			...solutionDocuments,
			...resourceDocuments,
		];

		if (allDocuments.length > 0) {
			// Clear existing data and reindex
			try {
				await typesenseClient.collections("patterns").delete();
			} catch (error) {
				// Collection might not exist, that's fine
			}

			// Create collection
			await typesenseClient.collections().create({
				name: "patterns",
				fields: [
					{ name: "id", type: "string" },
					{ name: "title", type: "string" },
					{ name: "description", type: "string", optional: true },
					{ name: "type", type: "string", facet: true },
					{ name: "slug", type: "string", optional: true },
					{ name: "patternId", type: "string", optional: true, facet: true },
					{ name: "tags", type: "string", optional: true },
					{ name: "audiences", type: "string", optional: true },
					{ name: "themes", type: "string", optional: true },
				],
			});

			// Import documents
			await typesenseClient
				.collections("patterns")
				.documents()
				.import(allDocuments);

			console.log(`Successfully reindexed ${allDocuments.length} documents`);
			return { success: true, count: allDocuments.length };
		}

		return { success: true, count: 0 };
	} catch (error) {
		console.error("Error reindexing Typesense:", error);
		throw error;
	}
}

// Webhook secret for security (set this in your environment variables)
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
	try {
		// Verify webhook secret if configured
		if (WEBHOOK_SECRET) {
			const signature = request.headers.get("x-sanity-signature");
			if (!signature || signature !== WEBHOOK_SECRET) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}
		}

		// Parse the webhook payload
		const payload = await request.json();
		console.log("Received webhook payload:", payload);

		// Reindex Typesense
		const result = await reindexTypesense();

		return NextResponse.json({
			success: true,
			message: `Reindexed ${result.count} documents`,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Webhook error:", error);
		return NextResponse.json(
			{
				error: "Failed to reindex",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}

// Also support GET for manual triggering
export async function GET() {
	try {
		const result = await reindexTypesense();

		return NextResponse.json({
			success: true,
			message: `Manually reindexed ${result.count} documents`,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Manual reindex error:", error);
		return NextResponse.json(
			{
				error: "Failed to reindex",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
