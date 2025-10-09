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
	{ href: "/onboarding?via=header", label: "Orientation", isIndented: false },
	{ label: "Explore", isIndented: false, isSection: true },
	{ href: "/search", label: "Search", isIndented: true },
	{ href: "/patterns", label: "Patterns", isIndented: true },
	{ href: "/tags", label: "Tags", isIndented: true },
	{ href: "/values", label: "Values", isIndented: true },
	{ href: "/themes", label: "Themes", isIndented: true },
	{ href: "/about", label: "About", isIndented: false },
];

const languages = [
	{ code: "EN", label: "English" },
	{ code: "ES", label: "Spanish" },
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
					className="group relative flex h-7 items-center rounded-md px-2 py-0.5 outline-none transition-colors duration-150 ease-linear md:hidden"
					aria-label="Open navigation menu"
				>
					<Menu className="h-[14px] w-[14px] text-muted-foreground transition-colors group-hover:text-foreground" />
				</button>
			</SheetTrigger>
			<SheetContent
				side="right"
				className="flex w-full flex-col p-0 sm:max-w-full"
			>
				<SheetHeader className="px-4 pt-6 pb-3">
					<SheetTitle className="px-1.5 font-medium text-base text-primary uppercase">
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
							<li key={item.href ?? `section-${item.label}`}>
								{item.href ? (
									<Button
										variant="ghost"
										asChild
										className={cn(
											"w-full justify-start font-normal text-base hover:bg-transparent",
											item.isIndented ? "pr-1.5 pl-8" : "px-1.5",
											pathname === item.href
												? "text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
										onClick={() => setOpen(false)}
									>
										<Link href={item.href}>{item.label}</Link>
									</Button>
								) : (
									<div
										className={cn(
											"px-1.5 font-normal text-base text-muted-foreground",
											item.isIndented ? "pr-1.5 pl-8" : "px-1.5",
										)}
									>
										{item.label}
									</div>
								)}
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
										className="min-w-[60px] flex-none border-0 bg-transparent text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-transparent data-[state=on]:text-foreground"
										aria-label={`Select ${lang.label}`}
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
									variant="ghost"
								>
									<ToggleGroupItem
										value="light"
										aria-label="Light mode"
										className="border-0 text-muted-foreground hover:text-foreground data-[state=on]:text-foreground"
									>
										<Sun className="mr-1 h-4 w-4" />
										Light
									</ToggleGroupItem>
									<ToggleGroupItem
										value="dark"
										aria-label="Dark mode"
										className="border-0 text-muted-foreground hover:text-foreground data-[state=on]:text-foreground"
									>
										<Moon className="mr-1 h-4 w-4" />
										Dark
									</ToggleGroupItem>
									<ToggleGroupItem
										value="system"
										aria-label="System mode"
										className="border-0 text-muted-foreground hover:text-foreground data-[state=on]:text-foreground"
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
