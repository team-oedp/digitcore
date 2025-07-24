import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

export const metadata: Metadata = {
	title: "Tags | DIGITCORE Toolkit",
	description: "Browse all patterns grouped by tag.",
};

const TAGS = [
	"Communications",
	"Data Collection",
	"Data Processing",
	"Data Sharing",
	"Data Validation",
	"Design",
	"Development",
	"Documentation",
	"Fundraising",
	"Iteration",
	"Maintenance",
	"Process",
	"Relationship Building",
	"Risk Management",
	"Strategy",
	"Training",
	"Workflow",
] as const;

export default function TagsPage() {
	return (
		<section className="space-y-10">
			<header className="space-y-2">
				<h1 className="font-bold text-3xl">Tags Directory</h1>
				<p className="text-muted-foreground">
					Explore patterns grouped by thematic tags.
				</p>
			</header>

			<ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				{TAGS.map((tag) => (
					<li key={tag}>
						<Card>
							<CardHeader>
								<CardTitle>{tag}</CardTitle>
								<CardDescription>0 associated patterns</CardDescription>
							</CardHeader>
							<CardContent>
								<Button variant="link" asChild>
									<Link href={`/search?tag=${encodeURIComponent(tag)}`}>
										View patterns
									</Link>
								</Button>
							</CardContent>
						</Card>
					</li>
				))}
			</ul>
		</section>
	);
}
