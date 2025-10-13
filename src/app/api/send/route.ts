import { NextResponse } from "next/server";
import { Resend } from "resend";

import { EmailTemplate } from "~/components/email-template";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
	throw new Error("Missing RESEND_API_KEY environment variable");
}

const resend = new Resend(apiKey);

export async function GET() {
	const sendOptions = {
		from: "Acme <onboarding@resend.dev>",
		to: [process.env.SUGGESTION_NOTIFICATION_EMAIL ?? "delivered@resend.dev"],
		subject: "Hello world",
		react: EmailTemplate({
			patternName: "Demo Pattern",
			patternSlug: "demo-pattern",
			newSolutions: "Solution A\nSolution B",
			newResources: "https://example.com",
			additionalFeedback: "No feedback",
			nameAndAffiliation: "Tester, Example Org",
			email: "tester@example.com",
		}),
	} as unknown as Parameters<typeof resend.emails.send>[0];

	const response = (await resend.emails.send(sendOptions)) as {
		data?: unknown;
		error?: unknown;
	};

	if (response.error) {
		return NextResponse.json(response.error, { status: 400 });
	}

	return NextResponse.json(response.data);
}
