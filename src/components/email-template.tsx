export type EmailTemplateProps = {
	patternName: string;
	patternSlug: string;
	newSolutions: string;
	newResources: string;
	additionalFeedback: string;
	nameAndAffiliation: string;
	email: string;
};

export function EmailTemplate({
	patternName,
	patternSlug,
	newSolutions,
	newResources,
	additionalFeedback,
	nameAndAffiliation,
	email,
}: EmailTemplateProps) {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: 1.6 }}>
			<h2>New suggestion submitted</h2>
			<p>
				<strong>Pattern:</strong> {patternName} ({patternSlug})
			</p>
			{newSolutions && (
				<p>
					<strong>New Solutions</strong>
					<br />
					{newSolutions.split("\n").map((line) => (
						<span key={line.slice(0, 20)}>
							{line}
							<br />
						</span>
					))}
				</p>
			)}
			{newResources && (
				<p>
					<strong>New Resources</strong>
					<br />
					{newResources.split("\n").map((line) => (
						<span key={line.slice(0, 20)}>
							{line}
							<br />
						</span>
					))}
				</p>
			)}
			{additionalFeedback && (
				<p>
					<strong>Additional Feedback</strong>
					<br />
					{additionalFeedback.split("\n").map((line) => (
						<span key={line.slice(0, 20)}>
							{line}
							<br />
						</span>
					))}
				</p>
			)}
			<p>
				<strong>Name &amp; Affiliation:</strong> {nameAndAffiliation || "—"}
			</p>
			<p>
				<strong>Email:</strong> {email}
			</p>
			<hr />
			<p style={{ fontSize: 12 }}>
				This email was generated automatically by the Digital Toolkit website.
			</p>
		</div>
	);
}
