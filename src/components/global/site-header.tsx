"use client";

import { Link, PanelRightOpen, SidebarIcon } from "lucide-react";

import { usePathname } from "next/navigation";
import { SearchForm } from "~/components/global/search-form";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useSidebar } from "~/components/ui/sidebar";
import { useHydration } from "~/hooks/use-hydration";
import { cn } from "~/lib/utils";
import { useCarrierBagStore } from "~/stores/carrier-bag";
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

	const handleModalModeToggle = () => {
		toggleModalMode();
		// When switching to modal mode, ensure the modal is open
		if (!isModalMode) {
			setOpen(true);
		}
	};

	const pathname = usePathname();
	return (
		<header className="fixed inset-x-2 top-2 z-50 flex items-center rounded-md border border-black bg-primary-foreground">
			<nav className="flex w-full items-center justify-between gap-3.5 px-3.5 py-1.5">
				<div className="flex w-full items-center gap-10">
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
				<SearchForm className="w-full sm:ml-auto sm:w-auto" />
				<Separator orientation="vertical" className="ml-2 h-4" />
				<LanguageSelector />
				<ModeToggle />
				<CommandMenu />
				{hydrated && (
					<Button
						className="h-8 w-8"
						variant={isModalMode ? "default" : "ghost"}
						size="icon"
						onClick={handleModalModeToggle}
						title={isModalMode ? "Switch to Sidebar" : "Switch to Modal"}
					>
						<PanelRightOpen />
					</Button>
				)}
				{hydrated && (
					<Button
						className="h-8 w-8"
						variant="ghost"
						size="icon"
						onClick={isModalMode ? toggleOpen : toggleSidebar}
						title="Toggle Sidebar"
					>
						<SidebarIcon />
					</Button>
				)}
			</nav>
		</header>
	);
}
