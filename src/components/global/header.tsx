"use client";

import { Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";
import { CommandMenu } from "./command-menu";

export function Header() {
	const pathname = usePathname();
	const [commandOpen, setCommandOpen] = useState(false);
	return (
		<header className="sticky top-2 z-50 mx-2 my-2 rounded-md bg-primary-foreground">
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
							<Image
								src="/icon.png"
								alt="Digitcore Logo"
								width={16}
								height={16}
								className="h-6 w-6"
							/>
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
					<Button variant="link" size="icon" className="flex h-4 w-fit gap-1.5">
						<span className="font-normal text-sm">LANG</span>
						<HugeiconsIcon
							icon={Globe02Icon}
							size={16}
							color="currentColor"
							strokeWidth={1.5}
						/>
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-6 w-11"
						onClick={() => setCommandOpen(true)}
					>
						<span className="px-2 py-0.5 text-sm">⌘K</span>
					</Button>
					<SidebarTrigger className="-ml-1" />
				</div>
			</nav>
			<CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />
		</header>
	);
}
