"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { LanguageSelector } from "../theme/language-selector";
import { ModeToggle } from "../theme/mode-toggle";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { CommandMenu } from "./command-menu";

export function Header() {
	const pathname = usePathname();
	return (
		<header className="sticky top-2 z-50 rounded-md bg-primary-foreground">
			<nav className="flex w-full items-center justify-between gap-3.5 px-3.5 py-1.5">
				<div className="flex items-center gap-10">
					<Button
						variant="link"
						asChild
						className={cn(
							"flex h-auto items-center gap-3.5 px-3 py-2",
							pathname === "/" ? "text-foreground" : "text-muted-foreground",
						)}
					>
						<Link href="/" className="flex items-center gap-3.5">
							<span className="font-normal text-sm">Digitcore</span>
						</Link>
					</Button>

					<nav className="hidden md:flex">
						<ul className="flex items-center gap-3.5 text-sm">
							<li>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2",
										pathname === "/values"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href="/values">Values</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2",
										pathname === "/patterns"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href="/patterns">Patterns</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2",
										pathname === "/onboarding"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href="/onboarding">Onboarding</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2",
										pathname === "/search"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href="/search">Search</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2",
										pathname === "/tags"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href="/tags">Tags</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2",
										pathname === "/faq"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href="/faq">FAQ</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2",
										pathname === "/glossary"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href="/glossary">Glossary</Link>
								</Button>
							</li>
						</ul>
					</nav>
				</div>

				<div className="flex items-center gap-3.5">
					<LanguageSelector />
					<ModeToggle />
					<CommandMenu />
					<SidebarTrigger className="-ml-1" />
				</div>
			</nav>
		</header>
	);
}
