"use client";

import { Menu, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { cn } from "~/lib/utils";

const navItems = [
	{ href: "/onboarding?via=header", label: "Start here", isIndented: false },
	{ href: "/explore", label: "Explore", isIndented: false },
	{ href: "/patterns", label: "Patterns", isIndented: true },
	{ href: "/tags", label: "Tags", isIndented: true },
	{ href: "/values", label: "Values", isIndented: true },
	{ href: "/about", label: "About", isIndented: false },
];

const languages = [
	{ code: "EN", label: "English" },
	{ code: "ES", label: "Spanish" },
	{ code: "PT", label: "Português" },
	{ code: "FR", label: "Français" },
	{ code: "KR", label: "한국어" },
];

export function MobileNavDialog() {
	const [open, setOpen] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState("EN");
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();

	// Prevent hydration mismatch by only rendering theme toggle after client mount
	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					className="group relative flex h-7 items-center rounded-md border border-border bg-background px-2 py-0.5 outline-none duration-150 ease-linear hover:bg-main-foreground/40 focus-visible:ring-1 focus-visible:ring-neutral-300/80 md:hidden dark:border-border/50 dark:focus-visible:ring-neutral-800 dark:hover:border-white/10 dark:hover:bg-main-foreground/20"
					aria-label="Open navigation menu"
				>
					<Menu className="h-4 w-4 text-primary" />
				</button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="flex w-full flex-col p-0 sm:max-w-full"
			>
				<SheetHeader className="px-4 pt-6 pb-3">
					<SheetTitle className="px-1.5 font-medium text-primary text-sm uppercase">
						Menu
					</SheetTitle>
					<SheetDescription className="sr-only">
						Navigation menu for mobile devices. Access site pages, language
						settings, and theme options.
					</SheetDescription>
				</SheetHeader>

				<nav className="flex-1 overflow-y-auto px-4 py-6">
					<ul className="space-y-1">
						{navItems.map((item) => (
							<li key={item.href}>
								<Button
									variant="ghost"
									asChild
									className={cn(
										"w-full justify-start font-normal text-base",
										item.isIndented ? "pr-1.5 pl-8" : "px-1.5",
										pathname === item.href
											? "bg-accent text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
									onClick={() => setOpen(false)}
								>
									<Link href={item.href}>{item.label}</Link>
								</Button>
							</li>
						))}
					</ul>
				</nav>

				<div className="space-y-4 px-4 pt-4 pb-6">
					{/* Language Selection */}
					<div className="space-y-2">
						<div className="px-1.5 font-medium text-muted-foreground text-sm">
							Language
						</div>
						<div className="px-1.5">
							<ToggleGroup
								type="single"
								value={selectedLanguage}
								onValueChange={(value) => value && setSelectedLanguage(value)}
								className="flex-wrap justify-start gap-2"
							>
								{languages.map((lang) => (
									<ToggleGroupItem
										key={lang.code}
										value={lang.code}
										className="min-w-[60px] flex-none"
										aria-label={`Select ${lang.label}`}
										disabled={lang.code !== "EN"}
									>
										{lang.code}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						</div>
					</div>

					{/* Theme Selection */}
					{mounted && (
						<div className="space-y-2">
							<div className="px-1.5 font-medium text-muted-foreground text-sm">
								Mode
							</div>
							<div className="px-1.5">
								<ToggleGroup
									type="single"
									value={theme}
									onValueChange={(value) => value && setTheme(value)}
									className="gap-3"
								>
									<ToggleGroupItem
										value="light"
										aria-label="Light mode"
										className={cn(
											theme === "light"
												? "bg-accent text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										<Sun className="mr-1 h-4 w-4" />
										Light
									</ToggleGroupItem>
									<ToggleGroupItem
										value="dark"
										aria-label="Dark mode"
										className={cn(
											theme === "dark"
												? "bg-accent text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										<Moon className="mr-1 h-4 w-4" />
										Dark
									</ToggleGroupItem>
									<ToggleGroupItem
										value="system"
										aria-label="System mode"
										className={cn(
											theme === "system"
												? "bg-accent text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
									>
										<Monitor className="mr-1 h-4 w-4" />
										System
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
						</div>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
