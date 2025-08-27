/* eslint-disable @typescript-eslint/no-explicit-any */
import { Resend } from "resend";
import { EmailTemplate } from "~/components/email-template";
import { env } from "~/env";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUGGESTION_NOTIFICATION_EMAIL = env.SUGGESTION_NOTIFICATION_EMAIL;
const DEFAULT_EMAIL_FROM =
	env.EMAIL_FROM ?? "Digital Toolkit <noreply@digitcore.local>";

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

	if (!SUGGESTION_NOTIFICATION_EMAIL) {
		console.warn(
			"[SuggestionEmail] SUGGESTION_NOTIFICATION_EMAIL env var not set – skipping email send",
		);
		return;
	}

	const {
		patternName,
		patternSlug,
		newSolutions,
		newResources,
		additionalFeedback,
		nameAndAffiliation,
		email,
	} = payload;

	// Build From header. If the user provided an email address (and didn't enter N/A),
	// send from that address so the recipient sees it directly. Resend will accept any
	// email as "from" but will only deliver if the domain is verified. The caller is
	// responsible for verifying the domain used by submitters.
	const fromAddress =
		email && email.toLowerCase() !== "n/a"
			? `${nameAndAffiliation || "Suggestion Submitter"} <${email}>`
			: DEFAULT_EMAIL_FROM;

	console.log(SUGGESTION_NOTIFICATION_EMAIL.split(",").map((e) => e.trim()));
  
	const options = {
		from: fromAddress,
		to: SUGGESTION_NOTIFICATION_EMAIL.split(",").map((e) => e.trim()),
		subject: `New suggestion for ${patternName}`,
		react: EmailTemplate({
			patternName,
			patternSlug,
			newSolutions,
			newResources,
			additionalFeedback,
			nameAndAffiliation,
			email,
		}),
	} as Record<string, unknown>;

	// If we're using the fallback sender, still set reply_to to the submitter so
	// maintainers can reach them.
	if (
		fromAddress === DEFAULT_EMAIL_FROM &&
		email &&
		email.toLowerCase() !== "n/a"
	) {
		options.reply_to = email;
	}

	const toList = Array.isArray(options.to)
		? options.to.join(", ")
		: String(options.to);
	console.log(
		`[SuggestionEmail] Sending suggestion notification to: ${toList}`,
	);

	try {
		const response = (await resend.emails.send(
			options as unknown as Parameters<typeof resend.emails.send>[0],
		)) as { data?: { id?: string }; error?: unknown };

		if (response?.data?.id) {
			console.log(
				`[SuggestionEmail] Email sent successfully. id=${response.data.id}`,
			);
		} else {
			console.warn("[SuggestionEmail] Email sent but no id returned", response);
		}
	} catch (err) {
		console.error("[SuggestionEmail] Failed to send suggestion email", err);
		throw err;
	}
}
