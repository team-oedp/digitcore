import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function NotFound() {
	return (
		<section className="flex flex-col items-center space-y-6 py-20 text-center">
			<h1 className="font-extrabold text-5xl">404</h1>
			<p className="max-w-md text-lg">
				We couldn’t find the page you were looking for. It might have been moved
				or removed.
			</p>
			<div className="space-y-2">
				<p>Here are some helpful links:</p>
				<ul className="flex flex-wrap justify-center gap-2">
					<li>
						<Button variant="link" asChild>
							<Link href="/">Home</Link>
						</Button>
					</li>
					<li>
						<Button variant="link" asChild>
							<Link href="/tags">Browse Tags</Link>
						</Button>
					</li>
					<li>
						<Button variant="link" asChild>
							<Link href="/search">Search</Link>
						</Button>
					</li>
				</ul>
			</div>
			<p className="text-muted-foreground text-sm">
				If you believe this is an error, please contact us at
				<Button variant="link" asChild className="p-0">
					<Link href="mailto:support@digitcore.example">
						support@digitcore.example
					</Link>
				</Button>
				.
			</p>
		</section>
	);
}
