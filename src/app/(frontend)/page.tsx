import Link from "next/link";
import { Button } from "~/components/ui/button";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "DIGITCORE Toolkit | Home",
	description:
		"Community-centered open infrastructure empowering equitable collaboration between researchers, developers, and frontline communities.",
};

export default function Home() {
	return (
		<section className="space-y-16">
			{/* Hero section */}
			<header className="space-y-6 text-center">
				<h1 className="mx-auto max-w-4xl font-extrabold text-4xl md:text-6xl">
					Welcome to the <span className="text-primary">DIGITCORE Toolkit</span>
				</h1>
				<p className="mx-auto max-w-2xl text-lg md:text-xl">
					Building community-centered, open infrastructure for environmental and
					social justice.
				</p>
				{/* Navigation pathways */}
				<div className="flex flex-wrap justify-center gap-4">
					<Button asChild>
						<Link href="/onboarding">Get Started</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/carrier-bag">View Carrier Bag</Link>
					</Button>
				</div>
			</header>

			{/* Overview section */}
			<section
				aria-labelledby="overview"
				className="mx-auto max-w-3xl space-y-4"
			>
				<h2 id="overview" className="font-semibold text-2xl">
					Our Mission
				</h2>
				<p>
					The DIGITCORE Toolkit facilitates equitable collaboration between
					researchers, developers, and frontline communities by providing
					reusable patterns, shared vocabulary, and practical guidance for
					community-driven technology projects.
				</p>
			</section>

			{/* Recent updates placeholder */}
			<section aria-labelledby="recent-updates" className="space-y-4">
				<h2 id="recent-updates" className="font-semibold text-2xl">
					Recent Updates
				</h2>
				<p className="text-muted-foreground">No updates yet — stay tuned!</p>
			</section>
		</section>
	);
}
