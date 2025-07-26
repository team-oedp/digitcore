
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const metadata: Metadata = {
	title: "FAQ | DIGITCORE Toolkit",
	description: "Frequently asked questions about the DIGITCORE Toolkit.",
};

const FAQS = [
	{
		index: 1,
		question: "What is the DIGITCORE Toolkit?",
		answer:
			"The DIGITCORE Toolkit is a collection of design patterns, resources, and tools for building digital products with community agency and data sovereignty at their core.",
	},
	{
		index: 2,
		question: "Who can use this toolkit?",
		answer:
			"The toolkit is designed for designers, developers, researchers, and community organizations working on digital projects that prioritize community needs and ethical data practices.",
	},
	{
		index: 3,
		question: "How do I contribute to the toolkit?",
		answer:
			"We welcome contributions from the community. You can submit new patterns, suggest improvements, or help with documentation. Please check our contribution guidelines for more details.",
	},
	{
		index: 4,
		question: "Is the toolkit free to use?",
		answer:
			"Yes, the DIGITCORE Toolkit is open source and free to use. We believe in meaningful openness and equitable access to knowledge.",
	},
	{
		index: 5,
		question: "How often is the toolkit updated?",
		answer:
			"The toolkit is continuously evolving based on community feedback and new research. We regularly add new patterns and update existing content to reflect best practices.",
	},
] as const;

export default function FAQPage() {
	return (
		<section className="space-y-10">
			<header className="space-y-2">
				<h1 className="font-bold text-3xl">Frequently Asked Questions</h1>
				<p className="text-muted-foreground">
					Common questions about the DIGITCORE Toolkit and how to use it.
				</p>
			</header>

			<ul className="space-y-6">
				{FAQS.map((faq) => (
					<li key={faq.index}>
						<Card>
							<CardHeader>
								<CardTitle>{faq.question}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{faq.answer}</p>
							</CardContent>
						</Card>
					</li>
				))}
			</ul>
		</section>
	);
}
