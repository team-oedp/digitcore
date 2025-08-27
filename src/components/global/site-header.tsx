"use client";

import { Backpack03Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { Icon } from "../shared/icon";
import { LanguageSelector } from "../theme/language-selector";
import { ModeToggle } from "../theme/mode-toggle";
import { CommandMenu } from "./command-menu";
import { MobileNavDialog } from "./mobile-nav-dialog";

export function SiteHeader() {
	const isModalMode = useCarrierBagStore((state) => state.isModalMode);
	const toggleModalMode = useCarrierBagStore((state) => state.toggleModalMode);
	const toggleOpen = useCarrierBagStore((state) => state.toggleOpen);
	const setOpen = useCarrierBagStore((state) => state.setOpen);
	const hasUnseenUpdates = useCarrierBagStore(
		(state) => state.hasUnseenUpdates,
	);
	const clearExpiredUpdates = useCarrierBagStore(
		(state) => state.clearExpiredUpdates,
	);

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

	// Check for expired updates every 30 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			clearExpiredUpdates();
		}, 30000); // 30 seconds

		return () => clearInterval(interval);
	}, [clearExpiredUpdates]);

	return (
		<header className="fixed inset-x-2 top-2 z-50 flex h-12 items-center rounded-md bg-primary-foreground">
			<nav className="flex w-full items-center justify-between gap-3.5 px-3 py-1.5">
				<div className="flex w-full items-center gap-10">
					<Button variant="link" asChild>
						<Link href="/" className="space-x-1.5">
							<Image
								src="/pattern-logo.svg"
								alt="Digitcore Logo"
								width={16}
								height={16}
								className="h-full w-full"
							/>
							<span className="text-primary text-sm uppercase">Digitcore</span>
						</Link>
					</Button>

					<nav className="hidden md:flex">
						<ul className="flex items-center gap-3.5 text-sm">
							<li>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2 capitalize",
										pathname === "/onboarding"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href="/onboarding">Start here</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2 capitalize",
										pathname === "/explore"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href="/explore">Explore</Link>
								</Button>
							</li>
							<li>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2 capitalize",
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
										"h-auto px-3 py-2 capitalize",
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
										"h-auto px-3 py-2 capitalize",
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
										"h-auto px-3 py-2 capitalize",
										pathname === "/about"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href="/about">About</Link>
								</Button>
							</li>
						</ul>
					</nav>
				</div>
				<LanguageSelector className="hidden md:block" />
				<ModeToggle className="hidden md:block" />
				<CommandMenu />
				<button
					type="button"
					className={cn(
						"group relative flex h-7 items-center rounded-md border border-border bg-background px-2 py-0.5 outline-none duration-150 ease-linear focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:border-border/50 dark:focus-visible:ring-neutral-800",
						"hidden md:flex", // Hide on mobile
						isOnCarrierBagRoute
							? "cursor-not-allowed opacity-50"
							: "hover:bg-main-foreground/40 dark:hover:border-white/10 dark:hover:bg-main-foreground/20",
						// Add glow effect when there are unseen updates
						hasUnseenUpdates &&
							!isOnCarrierBagRoute &&
							"animate-pulse shadow-lg shadow-yellow-500/25 ring-2 ring-yellow-500/50",
					)}
					onClick={isOnCarrierBagRoute ? undefined : toggleOpen}
					disabled={isOnCarrierBagRoute}
					title={
						isOnCarrierBagRoute
							? "Carrier Bag (currently viewing)"
							: hasUnseenUpdates
								? "Carrier Bag (new updates available)"
								: "Toggle Sidebar"
					}
					aria-label={
						isOnCarrierBagRoute
							? "Carrier Bag (currently viewing)"
							: hasUnseenUpdates
								? "Carrier Bag (new updates available)"
								: "Toggle Sidebar"
					}
				>
					<Icon
						icon={Backpack03Icon}
						size={14}
						className={cn(
							"flex items-center gap-0.5 text-sm",
							isOnCarrierBagRoute
								? "text-muted-foreground"
								: hasUnseenUpdates
									? "text-yellow-600 dark:text-yellow-400"
									: "text-primary",
						)}
					/>
				</button>
				<MobileNavDialog />
			</nav>
		</header>
	);
}
