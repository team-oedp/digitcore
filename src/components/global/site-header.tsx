"use client";

import { Backpack03Icon } from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

	const [isExploreOpen, setIsExploreOpen] = useState(false);

	// Close explore menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (target && !target.closest("[data-explore-menu]")) {
				setIsExploreOpen(false);
			}
		};

		if (isExploreOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isExploreOpen]);

	// TODO: implement toggle of carrier bag sidebar into a modal
	const _handleModalModeToggle = () => {
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
		<header className="fixed inset-x-2 top-2 z-50 flex h-12 items-center rounded-md bg-container-background">
			<nav className="flex w-full items-center justify-between gap-3.5 px-5 py-1.5">
				<div className="flex w-full items-center gap-6">
					<Link
						href="/"
						aria-label="Digitcore Home"
						className="flex h-6 w-6 flex-shrink-0 items-center justify-center"
					>
						<Image
							src="/pattern-logo.svg"
							alt="Digitcore Logo"
							width={24}
							height={24}
							className="h-6 w-6"
						/>
					</Link>

					<nav className="hidden md:flex">
						<ul className="flex items-center gap-3.5 text-sm">
							<motion.li
								layout
								transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
							>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2 text-link capitalize",
										pathname === "/onboarding"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href="/onboarding?via=header">Orientation</Link>
								</Button>
							</motion.li>
							<li>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2 text-link capitalize",
										pathname === "/about"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href="/about">About</Link>
								</Button>
							</li>
							<li className="relative" data-explore-menu>
								<div className="flex items-center">
									<Button
										variant="link"
										onClick={() => setIsExploreOpen(!isExploreOpen)}
										className="relative z-10 flex h-auto items-center gap-1 px-3 py-2 text-link text-muted-foreground capitalize"
									>
										Explore
									</Button>
									<AnimatePresence mode="wait">
										{isExploreOpen && (
											<motion.div
												className="flex items-center gap-1"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{
													duration: 0.3,
													ease: [0.4, 0, 0.2, 1],
												}}
											>
												<motion.div
													initial={{ opacity: 0, filter: "blur(4px)" }}
													animate={{ opacity: 1, filter: "blur(0px)" }}
													exit={{ opacity: 0, filter: "blur(4px)" }}
													transition={{
														duration: 0.3,
														ease: [0.4, 0, 0.2, 1],
														delay: 0.03,
													}}
												>
													<Button
														variant="link"
														asChild
														className={cn(
															"h-auto whitespace-nowrap px-3 py-2 text-sm capitalize",
															pathname === "/explore"
																? "text-foreground"
																: "text-muted-foreground",
														)}
													>
														<Link href="/explore">Search</Link>
													</Button>
												</motion.div>
												<motion.div
													initial={{ opacity: 0, filter: "blur(4px)" }}
													animate={{ opacity: 1, filter: "blur(0px)" }}
													exit={{ opacity: 0, filter: "blur(4px)" }}
													transition={{
														duration: 0.3,
														ease: [0.4, 0, 0.2, 1],
														delay: 0.06,
													}}
												>
													<Button
														variant="link"
														asChild
														className={cn(
															"h-auto whitespace-nowrap px-3 py-2 text-sm capitalize",
															pathname === "/patterns"
																? "text-foreground"
																: "text-muted-foreground",
														)}
													>
														<Link href="/patterns">Patterns</Link>
													</Button>
												</motion.div>
												<motion.div
													initial={{ opacity: 0, filter: "blur(4px)" }}
													animate={{ opacity: 1, filter: "blur(0px)" }}
													exit={{ opacity: 0, filter: "blur(4px)" }}
													transition={{
														duration: 0.3,
														ease: [0.4, 0, 0.2, 1],
														delay: 0.09,
													}}
												>
													<Button
														variant="link"
														asChild
														className={cn(
															"h-auto whitespace-nowrap px-3 py-2 text-sm capitalize",
															pathname === "/tags"
																? "text-foreground"
																: "text-muted-foreground",
														)}
													>
														<Link href="/tags">Tags</Link>
													</Button>
												</motion.div>
												<motion.div
													initial={{ opacity: 0, filter: "blur(4px)" }}
													animate={{ opacity: 1, filter: "blur(0px)" }}
													exit={{ opacity: 0, filter: "blur(4px)" }}
													transition={{
														duration: 0.3,
														ease: [0.4, 0, 0.2, 1],
														delay: 0.12,
													}}
												>
													<Button
														variant="link"
														asChild
														className={cn(
															"h-auto whitespace-nowrap px-3 py-2 text-sm capitalize",
															pathname === "/values"
																? "text-foreground"
																: "text-muted-foreground",
														)}
													>
														<Link href="/values">Values</Link>
													</Button>
												</motion.div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
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
						"group relative flex h-7 items-center rounded-md px-2 py-0.5 outline-none transition-colors duration-150 ease-linear focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:focus-visible:ring-neutral-800",
						"hidden md:flex", // Hide on mobile
						isOnCarrierBagRoute ? "cursor-not-allowed opacity-50" : "",
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
							"flex items-center gap-0.5 text-sm transition-colors",
							isOnCarrierBagRoute
								? "text-foreground"
								: hasUnseenUpdates
									? "text-yellow-600 dark:text-yellow-400"
									: "text-muted-foreground group-hover:text-foreground",
						)}
					/>
				</button>
				<MobileNavDialog />
			</nav>
		</header>
	);
}
