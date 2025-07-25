import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";

export function Header() {
	return (
		<header className="sticky top-0 z-50 border-b bg-background/60 backdrop-blur supports-backdrop-blur:bg-background/80">
			<nav className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
				<Button variant="link" asChild className="p-0 font-semibold text-lg">
					<Link href="/">DIGITCORE Toolkit</Link>
				</Button>
				<div className="flex items-center gap-2">
					<ul className="flex flex-wrap gap-2 text-sm">
						<li>
							<Button variant="link" asChild>
								<Link href="/carrier-bag">Carrier Bag</Link>
							</Button>
						</li>
						<li>
							<Button variant="link" asChild>
								<Link href="/tags">Tags</Link>
							</Button>
						</li>
						<li>
							<Button variant="link" asChild>
								<Link href="/glossary">Glossary</Link>
							</Button>
						</li>
						<li>
							<Button variant="link" asChild>
								<Link href="/onboarding">Onboarding</Link>
							</Button>
						</li>
						<li>
							<Button variant="link" asChild>
								<Link href="/values">Values</Link>
							</Button>
						</li>
						<li>
							<Button variant="link" asChild>
								<Link href="/search">Search</Link>
							</Button>
						</li>
					</ul>
					<ModeToggle />
				</div>
			</nav>
		</header>
	);
}
