import { getCliClient } from "sanity/cli";

/**
 * WARNING: DANGEROUS SCRIPT - READ CAREFULLY
 *
 * This script uses createOrReplace() which will DELETE ALL EXISTING CONTENT
 * in the singleton documents and replace them with empty documents.
 *
 * ONLY RUN THIS SCRIPT IF:
 * 1. You are setting up internationalization for the FIRST TIME
 * 2. You have NO existing content in these singletons
 * 3. You have taken a backup of your dataset
 *
 * BEFORE RUNNING:
 * 1. BACKUP YOUR DATASET: `npx sanity@latest dataset export`
 * 2. Uncomment ONLY the singletons you want to create
 * 3. Make sure those singletons do NOT have existing content
 * 4. Run: npx sanity@latest exec ./scripts/createSingletons.ts --with-user-token
 *
 * If singletons already exist with content, this will DESTROY that content.
 * You have been warned.
 */

type Singleton = {
	id: string;
	_type: string;
	title: string;
};

// Uncomment ONLY the singletons you want to create
// If a singleton already has content, DO NOT uncomment it or you will lose that content
const SINGLETONS: Singleton[] = [
	// WARNING: Uncommenting existing singletons will DELETE their content
	// {
	// 	id: "carrierBag",
	// 	_type: "carrierBag",
	// 	title: "Carrier Bag",
	// },
	// {
	// 	id: "onboarding",
	// 	_type: "onboarding",
	// 	title: "Orientation",
	// },
	// { id: "search", _type: "search", title: "Search" },
	// { id: "header", _type: "header", title: "Header" },
	// { id: "footer", _type: "footer", title: "Footer" },
	// {
	// 	id: "siteSettings",
	// 	_type: "siteSettings",
	// 	title: "Site Settings",
	// },
];

const LANGUAGES = [
	{ id: "en", title: "English" },
	{ id: "es", title: "Spanish" },
];

// This will use the client configured in ./sanity.cli.ts
const client = getCliClient();

async function createSingletons() {
	// Safety check
	if (SINGLETONS.length === 0) {
		console.log(
			"\n[ERROR] No singletons are uncommented in the SINGLETONS array.",
		);
		console.log(
			"If you want to create singletons, uncomment them in the script.",
		);
		console.log(
			"[WARNING] Remember: This will use create() to add new singleton documents.\n",
		);
		return;
	}

	// Show what will be affected
	console.log("\n[WARNING] About to create the following singleton documents:");
	for (const singleton of SINGLETONS) {
		console.log(`   - ${singleton.title} (${singleton._type})`);
		for (const lang of LANGUAGES) {
			console.log(`     └─ ${singleton.id}-${lang.id}`);
		}
	}

	// Check if any of these documents already exist
	const docIds = SINGLETONS.flatMap((s) =>
		LANGUAGES.map((l) => `${s.id}-${l.id}`),
	);
	const existingDocs = await client.fetch(
		`*[_id in $ids]{_id, _type, "hasContent": count(*[_id == ^._id][0]{*}[0...100]) > 3}`,
		{ ids: docIds },
	);

	if (existingDocs.length > 0) {
		console.log(
			"\n[ERROR] The following documents ALREADY EXIST in your dataset:",
		);
		for (const doc of existingDocs) {
			const contentWarning = doc.hasContent ? " [HAS CONTENT]" : "";
			console.log(`   - ${doc._id} (${doc._type})${contentWarning}`);
		}
		console.log(
			"\nCannot create documents that already exist. Use Sanity Studio to manage them.",
		);
		console.log("\nAborting to prevent conflicts.\n");
		return;
	}

	console.log("\n[OK] No existing documents found. Safe to proceed.");
	console.log(
		"\nCreating documents with minimal structure (only _id, _type, language, title)...\n",
	);

	const documents = SINGLETONS.flatMap((singleton) => {
		const translations = LANGUAGES.map((language) => ({
			_id: `${singleton.id}-${language.id}`,
			_type: singleton._type,
			language: language.id,
			title: singleton.title,
		}));

		const metadata = {
			_id: `${singleton.id}-translation-metadata`,
			_type: "translation.metadata",
			translations: translations.map((translation) => ({
				_key: translation.language,
				value: {
					_type: "reference",
					_ref: translation._id,
				},
			})),
			schemaTypes: Array.from(
				new Set(translations.map((translation) => translation._type)),
			),
		};

		return [metadata, ...translations];
	});

	const transaction = client.transaction();

	// Use create() instead of createOrReplace() for safety
	for (const doc of documents) {
		// @ts-expect-error - doc is a union of the two possible types
		transaction.create(doc);
	}

	await transaction
		.commit()
		.then((res) => {
			console.log("\n[SUCCESS] Created singleton documents:");
			console.log(res);
			console.log(
				"\nNext step: Fill in content for these documents in Sanity Studio\n",
			);
		})
		.catch((err) => {
			console.error("\n[ERROR] Failed to create singletons:", err);
			console.log(
				"\nIf documents already exist, this is expected. Use the Studio UI to manage them.\n",
			);
		});
}

createSingletons();
