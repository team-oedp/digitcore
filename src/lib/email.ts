import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUGGESTION_NOTIFICATION_EMAIL = process.env.SUGGESTION_NOTIFICATION_EMAIL;
const EMAIL_FROM =
	process.env.EMAIL_FROM ?? "Digital Toolkit <noreply@digitcore.local>";

if (!RESEND_API_KEY) {
	console.warn("Missing RESEND_API_KEY – suggestion emails will not be sent");
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export type SuggestionEmailPayload = {
	patternName: string;
	patternSlug: string;
	newSolutions: string;
	newResources: string;
	additionalFeedback: string;
	nameAndAffiliation: string;
	email: string;
};

export async function sendSuggestionEmail(payload: SuggestionEmailPayload) {
	if (!resend) return;

	const {
		patternName,
		patternSlug,
		newSolutions,
		newResources,
		additionalFeedback,
		nameAndAffiliation,
		email,
	} = payload;

	await resend.emails.send({
		from: EMAIL_FROM,
		to: [SUGGESTION_NOTIFICATION_EMAIL ?? "maintainers@digitcore.local"],
		subject: `New suggestion for ${patternName}`,
		html: `
		  <h2>New suggestion submitted</h2>
		  <p><strong>Pattern:</strong> ${patternName} (${patternSlug})</p>
		  <p><strong>New Solutions</strong><br/>${formatMultiline(newSolutions)}</p>
		  <p><strong>New Resources</strong><br/>${formatMultiline(newResources)}</p>
		  ${additionalFeedback ? `<p><strong>Additional Feedback</strong><br/>${formatMultiline(additionalFeedback)}</p>` : ""}
		  <p><strong>Name & Affiliation:</strong> ${nameAndAffiliation}</p>
		  <p><strong>Email:</strong> ${email}</p>
		  <hr/>
		  <p>This email was generated automatically by the Digital Toolkit website.</p>
		`,
	});
}

function formatMultiline(text: string) {
	return text.replace(/\n/g, "<br/>");
}
