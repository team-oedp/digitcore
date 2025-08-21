"use server";

import { createClient } from "next-sanity";

import { sendSuggestionEmail } from "~/lib/email";
import { apiVersion, dataset, projectId } from "~/sanity/env";

export type SuggestionFormData = {
	patternName: string;
	patternSlug: string;
	newSolutions: string;
	newResources: string;
	additionalFeedback: string;
	nameAndAffiliation: string;
	email: string;
};

export async function submitSuggestion(form: SuggestionFormData) {
	const writeToken = process.env.SANITY_API_WRITE_TOKEN;
	const readToken = process.env.SANITY_API_READ_TOKEN;

	// Handle both undefined and string "undefined" for test environment
	const token =
		(writeToken && writeToken !== "undefined" ? writeToken : null) ??
		(readToken && readToken !== "undefined" ? readToken : null);

	if (!token) {
		throw new Error("Missing SANITY_API_WRITE_TOKEN environment variable");
	}

	const client = createClient({
		projectId,
		dataset,
		apiVersion,
		useCdn: false,
		token,
	});

	const doc = {
		_type: "suggestion",
		patternName: form.patternName,
		patternSlug: form.patternSlug,
		newSolutions: form.newSolutions,
		newResources: form.newResources,
		additionalFeedback: form.additionalFeedback,
		nameAndAffiliation: form.nameAndAffiliation,
		email: form.email,
		submittedAt: new Date().toISOString(),
	};

	await client.create(doc);

	// Fire-and-forget email; don't block response on email failure
	sendSuggestionEmail(form).catch((err) => {
		console.error("Failed to send suggestion email", err);
	});

	return { success: true } as const;
}
