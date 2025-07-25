import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Toggle } from "~/components/ui/toggle";

export const metadata: Metadata = {
	title: "Search | DIGITCORE Toolkit",
	description: "Search patterns, tags, glossary terms, and resources.",
};

export default function SearchPage() {
	return (
		<section className="space-y-6">
			<h1 className="font-bold text-3xl">Search</h1>

			<div className="grid gap-8 md:grid-cols-[250px_1fr]">
				{/* Filter sidebar */}
				<aside>
					<Card className="space-y-4">
						<CardHeader>
							<CardTitle>Filters</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-2 text-sm">
							{["Patterns", "Tags", "Glossary Terms", "Resources"].map(
								(label) => (
									<Toggle key={label} variant="outline" aria-label={label}>
										{label}
									</Toggle>
								),
							)}
						</CardContent>
					</Card>
				</aside>

				{/* Search input and results */}
				<div className="space-y-4">
					<Input type="search" placeholder="Search the toolkit…" />

					{/* Results placeholder */}
					<Card aria-live="polite">
						<CardContent>
							<p className="text-muted-foreground">
								Enter a query to see results.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
