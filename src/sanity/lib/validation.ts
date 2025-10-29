import type {
	SanityDocument,
	SlugValidationContext,
	ValidationContext,
} from "sanity";

/**
 * Creates a validation function that checks for duplicate field values across documents of the same type.
 * This prevents creating multiple documents with the same value for a specified field.
 *
 * @param fieldName - The name of the field to check for duplicates
 * @param documentType - The document type to check against (defaults to current document type)
 * @param errorMessage - Custom error message (optional)
 * @returns A validation function that can be used in Sanity schema
 *
 * @example
 * ```ts
 * defineField({
 *   name: "title",
 *   type: "string",
 *   validation: createUniqueFieldValidator("title", "resource", "A resource with this title already exists")
 * })
 * ```
 */
export function createUniqueFieldValidator(
	fieldName: string,
	documentType?: string,
	errorMessage?: string,
) {
	return async (value: string | undefined, context: ValidationContext) => {
		// Skip validation if no value is provided
		if (!value) return true;

		try {
			const { document, getClient } = context;
			const client = getClient({ apiVersion: "2025-07-23" });
			const currentDocumentType = documentType || document?._type;

			if (!currentDocumentType) {
				console.warn("Document type not available for duplicate validation");
				return true;
			}

			const trimmedValue = value.trim();
			const currentId = document?._id;

			if (!currentId) {
				// For new documents, check if any document with this field value exists
				const query = `*[_type == $documentType && ${fieldName} == $value][0]`;
				const existing = await client.fetch<SanityDocument>(query, {
					documentType: currentDocumentType,
					value: trimmedValue,
				});
				if (existing) {
					const defaultMessage = `A ${currentDocumentType} with this ${fieldName} already exists`;
					return errorMessage || defaultMessage;
				}
				return true;
			}

			// For existing documents, exclude both draft and published versions of the same document
			const baseId = currentId.replace(/^drafts\./, "");
			const draftId = `drafts.${baseId}`;

			const query = `*[_type == $documentType && ${fieldName} == $value && _id != $currentId && _id != $baseId && _id != $draftId][0]`;
			const params = {
				documentType: currentDocumentType,
				value: trimmedValue,
				currentId,
				baseId,
				draftId,
			};

			const existing = await client.fetch<SanityDocument>(query, params);
			if (existing) {
				const defaultMessage = `A ${currentDocumentType} with this ${fieldName} already exists`;
				return errorMessage || defaultMessage;
			}

			return true;
		} catch (error) {
			console.error("Error checking for duplicates:", error);
			// Don't block document creation if validation fails
			return true;
		}
	};
}

/**
 * Validates that a title is unique within the specified document type.
 * This is a convenience function for the most common use case.
 *
 * @param documentType - The document type to check against (optional, defaults to current document type)
 * @param errorMessage - Custom error message (optional)
 * @returns A validation function for title uniqueness
 *
 * @example
 * ```ts
 * defineField({
 *   name: "title",
 *   type: "string",
 *   validation: validateUniqueTitle("resource")
 * })
 * ```
 */
export function validateUniqueTitle(
	documentType?: string,
	errorMessage?: string,
) {
	return createUniqueFieldValidator("title", documentType, errorMessage);
}

/**
 * Validates that no other documents exist with the same slug and language.
 * Excludes the current document's published, draft, and all versioned variants.
 *
 * @param slug - The slug value to check for uniqueness
 * @param context - The validation context containing document and client information
 * @returns Promise resolving to true if the slug is unique, false otherwise
 */
export async function isUniqueOtherThanLanguage(
	slug: string,
	context: SlugValidationContext,
) {
	const { document, getClient } = context;
	if (!document?.language) {
		return true;
	}
	const client = getClient({ apiVersion: "2025-02-19" });
	const id = document._id.replace(/^drafts\./, "");
	const params = {
		id,
		language: document.language,
		slug,
	};
	const query = `!defined(*[
    !(sanity::versionOf($id)) &&
    slug.current == $slug &&
    language == $language
  ][0]._id)`;
	const result = await client.fetch(query, params);
	return result;
}
