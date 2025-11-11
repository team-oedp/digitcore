"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { buildLocaleHref, parseLocalePath } from "~/lib/locale-path";
import { cn } from "~/lib/utils";

export function ErrorHeader() {
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

	const pathname = usePathname();
	const { language, normalizedPath } = useMemo(
		() => parseLocalePath(pathname),
		[pathname],
	);

	return (
		<header className="fixed inset-x-2 top-2 z-50 flex h-12 items-center rounded-md bg-container-background">
			<nav className="flex w-full items-center justify-between gap-3.5 px-5 py-1.5">
				<div className="flex w-full items-center gap-6">
					<Link
						href={buildLocaleHref(language, "/")}
						aria-label="Digitcore Home"
						className="flex h-6 w-6 shrink-0 items-center justify-center"
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
										normalizedPath === "/onboarding"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link
										href={buildLocaleHref(language, "/onboarding?via=header")}
									>
										Orientation
									</Link>
								</Button>
							</motion.li>
							<li>
								<Button
									variant="link"
									asChild
									className={cn(
										"h-auto px-3 py-2 text-link capitalize",
										normalizedPath === "/about" || normalizedPath === "/page/about"
											? "text-foreground"
											: "text-muted-foreground",
									)}
								>
									<Link href={buildLocaleHref(language, "/about")}>About</Link>
								</Button>
							</li>
							<li className="relative" data-explore-menu>
								<div className="flex items-center gap-3.5">
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
												className="flex items-center gap-3.5"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												transition={{
													duration: 0.3,
													ease: [0.4, 0, 0.2, 1],
												}}
											>
												<Button
													variant="link"
													asChild
													className={cn(
														"h-auto whitespace-nowrap px-3 py-2 text-sm capitalize",
														normalizedPath === "/search"
															? "text-foreground"
															: "text-muted-foreground",
													)}
												>
													<Link href={buildLocaleHref(language, "/search")}>
														Search
													</Link>
												</Button>
												<Button
													variant="link"
													asChild
													className={cn(
														"h-auto whitespace-nowrap px-3 py-2 text-sm capitalize",
														normalizedPath === "/patterns" || normalizedPath === "/page/patterns"
															? "text-foreground"
															: "text-muted-foreground",
													)}
												>
													<Link href={buildLocaleHref(language, "/patterns")}>
														Patterns
													</Link>
												</Button>
												<Button
													variant="link"
													asChild
													className={cn(
														"h-auto whitespace-nowrap px-3 py-2 text-sm capitalize",
														normalizedPath === "/tags" || normalizedPath === "/page/tags"
															? "text-foreground"
															: "text-muted-foreground",
													)}
												>
													<Link href={buildLocaleHref(language, "/tags")}>
														Tags
													</Link>
												</Button>
												<Button
													variant="link"
													asChild
													className={cn(
														"h-auto whitespace-nowrap px-3 py-2 text-sm capitalize",
														normalizedPath === "/values" || normalizedPath === "/page/values"
															? "text-foreground"
															: "text-muted-foreground",
													)}
												>
													<Link href={buildLocaleHref(language, "/values")}>
														Values
													</Link>
												</Button>
												<Button
													variant="link"
													asChild
													className={cn(
														"h-auto whitespace-nowrap px-3 py-2 text-sm capitalize",
														normalizedPath === "/themes" || normalizedPath === "/page/themes"
															? "text-foreground"
															: "text-muted-foreground",
													)}
												>
													<Link href={buildLocaleHref(language, "/themes")}>
														Themes
													</Link>
												</Button>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</li>
						</ul>
					</nav>
				</div>
			</nav>
		</header>
	);
}
