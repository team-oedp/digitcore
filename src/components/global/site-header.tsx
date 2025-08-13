"use client";

import { SidebarRightIcon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useSidebar } from "~/components/ui/sidebar";
import { useHydration } from "~/hooks/use-hydration";
import { cn } from "~/lib/utils";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { Icon } from "../shared/icon";
import { LanguageSelector } from "../theme/language-selector";
import { ModeToggle } from "../theme/mode-toggle";
import { CommandMenu } from "./command-menu";

export function SiteHeader() {
	const { toggleSidebar } = useSidebar();
	const isModalMode = useCarrierBagStore((state) => state.isModalMode);
	const toggleModalMode = useCarrierBagStore((state) => state.toggleModalMode);
	const toggleOpen = useCarrierBagStore((state) => state.toggleOpen);
	const setOpen = useCarrierBagStore((state) => state.setOpen);
	const hydrated = useHydration();

	// TODO: implement toggle of carrier bag sidebar into a modal
	const handleModalModeToggle = () => {
		toggleModalMode();
		// When switching to modal mode, ensure the modal is open
		if (!isModalMode) {
			setOpen(true);
		}
	};

	const pathname = usePathname();
	const isOnCarrierBagRoute = pathname === "/carrier-bag";

	return (
		<header className="fixed inset-x-2 top-2 z-50 flex h-12 items-center rounded-md bg-primary-foreground">
			<nav className="flex w-full items-center justify-between gap-3.5 px-3.5 py-1.5">
				<div className="flex w-full items-center gap-10">
					<Button variant="link" asChild>
						<Link href="/" className="space-x-3.5">
							<Image
								src="/pattern-logo.svg"
								alt="Digitcore Logo"
								width={16}
								height={16}
								className="h-full w-full"
							/>
							<span className="text-base text-primary uppercase">
								Digitcore
							</span>
						</Link>
					</Button>

					<nav className="hidden md:flex">
						<ul className="flex items-center gap-3.5 text-base">
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
									<Link href="/onboarding?via=header">Onboarding</Link>
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
				<Separator orientation="vertical" className="ml-2 h-4" />
				{hydrated && <LanguageSelector />}
				{hydrated && <ModeToggle />}
				{hydrated && <CommandMenu />}
				{hydrated && (
					<button
						type="button"
						className={cn(
							"group relative flex h-7 items-center rounded-md border border-border bg-background px-2 py-0.5 outline-none duration-150 ease-linear focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:border-border/50 dark:focus-visible:ring-neutral-800",
							isOnCarrierBagRoute
								? "cursor-not-allowed opacity-50"
								: "hover:bg-main-foreground/40 dark:hover:border-white/10 dark:hover:bg-main-foreground/20",
						)}
						onClick={
							isOnCarrierBagRoute
								? undefined
								: isModalMode
									? toggleOpen
									: toggleSidebar
						}
						disabled={isOnCarrierBagRoute}
						title={
							isOnCarrierBagRoute
								? "Carrier Bag (currently viewing)"
								: "Toggle Sidebar"
						}
						aria-label={
							isOnCarrierBagRoute
								? "Carrier Bag (currently viewing)"
								: "Toggle Sidebar"
						}
					>
						<Icon
							icon={SidebarRightIcon}
							size={14}
							className={cn(
								"flex items-center gap-0.5 text-sm",
								isOnCarrierBagRoute ? "text-muted-foreground" : "text-primary",
							)}
						/>
					</button>
				)}
			</nav>
		</header>
	);
}
