import type { Metadata } from "next";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { GlossaryScroll } from "./glossary-scroll";

export const metadata: Metadata = {
	title: "Glossary | DIGITCORE Toolkit",
	description:
		"Searchable reference for key terms and concepts used in the toolkit.",
};

interface GlossaryPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function GlossaryPage({
	searchParams,
}: GlossaryPageProps) {
	const resolvedSearchParams = await searchParams;
	return (
		<section className="space-y-10">
			<GlossaryScroll searchParams={resolvedSearchParams} />
			<header className="space-y-2">
				<h1 className="font-bold text-3xl">Glossary</h1>
				<p className="text-muted-foreground">
					Definitions of technical terms, community engagement concepts, and
					environmental justice vocabulary.
				</p>
				{/* Search input */}
				<div className="max-w-md">
					<Input type="search" placeholder="Search terms…" />
				</div>
			</header>

			{/* Alphabetical term list placeholder */}
			<Card aria-live="polite">
				<CardContent>
					<p className="text-muted-foreground">
						No terms available. Glossary content coming soon.
					</p>
				</CardContent>
			</Card>
		</section>
	);
}
