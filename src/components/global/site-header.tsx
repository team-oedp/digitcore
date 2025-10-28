"use client";

import {
	Backpack03Icon,
	MoveLeftIcon,
	MoveRightIcon,
} from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Button } from "~/components/ui/button";
import type { Language } from "~/i18n/config";
import { buildLocaleHref, parseLocalePath } from "~/lib/locale-path";
import { cn } from "~/lib/utils";
import type { HEADER_QUERYResult } from "~/sanity/sanity.types";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { useExploreMenuStore } from "~/stores/explore-menu";
import { Icon } from "../shared/icon";
import { FontToggle } from "../theme/font-toggle";
import { LanguageSelector } from "../theme/language-selector";
import { ModeToggle } from "../theme/mode-toggle";
import { CommandMenu } from "./command-menu";
import { MobileNavDialog } from "./mobile-nav-dialog";

type SiteHeaderProps = {
	headerData: HEADER_QUERYResult;
	language: Language;
};

export function SiteHeader({ headerData, language }: SiteHeaderProps) {
	const toggleOpen = useCarrierBagStore((state) => state.toggleOpen);
	const hasUnseenUpdates = useCarrierBagStore(
		(state) => state.hasUnseenUpdates,
	);
	const clearExpiredUpdates = useCarrierBagStore(
		(state) => state.clearExpiredUpdates,
	);

	const isExploreOpen = useExploreMenuStore((state) => state.isOpen);
	const setIsExploreOpen = useExploreMenuStore((state) => state.setOpen);

	// Filter navigation links based on page slug
	// "orientation" and "about" go in main menu, everything else in explore menu
	const headerLinks = (headerData?.internalLinks ?? []).flatMap((link) => {
		if (!link) return [];
		const label = link.label?.trim();
		const slug = link.page?.slug?.trim();

		if (!label || !slug || !link.page) {
			return [];
		}

		return [
			{
				...link,
				label,
				page: {
					...link.page,
					slug,
				},
			},
		];
	});
	const mainMenuLinks = headerLinks.filter(
		(link) => link.page.slug === "orientation" || link.page.slug === "about",
	);
	const exploreMenuLinks = headerLinks.filter(
		(link) => link.page.slug !== "orientation" && link.page.slug !== "about",
	);

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
	}, [isExploreOpen, setIsExploreOpen]);

	const pathname = usePathname();
	const { normalizedPath } = useMemo(
		() => parseLocalePath(pathname),
		[pathname],
	);
	const isOnCarrierBagRoute = normalizedPath === "/carrier-bag";

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
						href={buildLocaleHref(language, "/")}
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
							{mainMenuLinks.map((link) => {
								const slug = link.page?.slug;
								if (!slug) return null;
								const href = `/${slug}`;
								const isActive = normalizedPath === href;
								const localizedHref = buildLocaleHref(language, href);

								return (
									<motion.li
										key={link._key}
										layout
										transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
									>
										<Button
											variant="link"
											asChild
											className={cn(
												"h-auto px-3 py-2 text-link capitalize",
												isActive ? "text-foreground" : "text-muted-foreground",
											)}
										>
											<Link href={localizedHref}>{link.label}</Link>
										</Button>
									</motion.li>
								);
							})}
							{exploreMenuLinks.length > 0 && (
								<li className="relative" data-explore-menu>
									<div className="flex items-center gap-3.5">
										<Button
											variant="link"
											onClick={() => setIsExploreOpen(!isExploreOpen)}
											className="relative z-10 flex h-auto items-center gap-1.5 px-3 py-2 text-link text-muted-foreground capitalize"
										>
											Explore
											<Icon
												icon={isExploreOpen ? MoveLeftIcon : MoveRightIcon}
												size={12}
											/>
										</Button>
										<AnimatePresence mode="wait">
											{isExploreOpen && (
												<motion.div
													className="flex items-center gap-3.5"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													transition={{
														duration: 0.3,
														ease: [0.4, 0, 0.2, 1],
													}}
												>
													{exploreMenuLinks.map((link) => {
														const slug = link.page?.slug;
														if (!slug) return null;
														const href = `/${slug}`;
														const isActive = normalizedPath === href;

														return (
															<Button
																key={link._key}
																variant="link"
																asChild
																className={cn(
																	"h-auto whitespace-nowrap px-3 py-2 text-sm capitalize",
																	isActive
																		? "text-foreground"
																		: "text-muted-foreground",
																)}
															>
																<Link href={buildLocaleHref(language, href)}>
																	{link.label}
																</Link>
															</Button>
														);
													})}
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</li>
							)}
						</ul>
					</nav>
				</div>
				<LanguageSelector className="hidden md:block" />
				<FontToggle className="hidden md:block" />
				<ModeToggle className="hidden md:block" />
				<CommandMenu />
				<button
					type="button"
					className={cn(
						"group relative flex h-7 items-center rounded-md px-2 py-0.5 outline-none transition-colors duration-150 ease-linear",
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
				<MobileNavDialog headerData={headerData} language={language} />
			</nav>
		</header>
	);
}
