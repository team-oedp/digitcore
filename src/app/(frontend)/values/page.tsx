import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export const metadata: Metadata = {
	title: "Values | DIGITCORE Toolkit",
	description: "Core principles guiding the toolkit and its community.",
};

const VALUES = [
	{
		name: "Community Agency",
		description:
			"Prioritizing the voices and leadership of frontline communities in every stage of the process.",
	},
	{
		name: "Data Sovereignty",
		description:
			"Ensuring communities maintain control over how their data is collected, stored, and used.",
	},
	{
		name: "Meaningful Openness",
		description:
			"Promoting transparency that encourages collaboration and equitable access to knowledge.",
	},
	{
		name: "Sustainable Collaboration",
		description:
			"Building long-term partnerships that distribute benefits and responsibilities fairly.",
	},
	{
		name: "Accountability",
		description:
			"Committing to responsible practices aligned with environmental and social justice movements.",
	},
] as const;

export default function ValuesPage() {
	return (
		<section className="space-y-10">
			<header className="space-y-2">
				<h1 className="font-bold text-3xl">Our Values</h1>
				<p className="text-muted-foreground">
					Principles that guide the DIGITCORE Toolkit’s development and use.
				</p>
			</header>

			<ul className="space-y-6">
				{VALUES.map((value) => (
					<li key={value.name}>
						<Card>
							<CardHeader>
								<CardTitle>{value.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p>{value.description}</p>
							</CardContent>
						</Card>
					</li>
				))}
			</ul>
		</section>
	);
}
