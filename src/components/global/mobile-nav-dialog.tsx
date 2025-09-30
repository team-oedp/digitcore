"use client";

import { Menu, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
	{ href: null, label: "Explore", isIndented: false, isHeading: true },
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
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<button
					type="button"
					className="group relative flex items-center outline-none md:hidden"
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
						{navItems.map((item, index) => (
							<li key={item.href || `heading-${index}`}>
								{item.isHeading ? (
									<div className="px-1.5 font-normal text-base text-muted-foreground">
										{item.label}
									</div>
								) : (
									<Button
										variant="ghost"
										asChild
										className={cn(
											"w-full justify-start font-normal text-base hover:bg-transparent",
											item.isIndented ? "pr-1.5 pl-8" : "px-1.5",
											pathname === item.href
												? "bg-accent text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
										onClick={() => setOpen(false)}
									>
										<Link href={item.href || "#"}>{item.label}</Link>
									</Button>
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
								variant="ghost"
							>
								{languages.map((lang) => (
									<ToggleGroupItem
										key={lang.code}
										value={lang.code}
										className="min-w-[60px] flex-none border-0"
										aria-label={`Select ${lang.label}`}
										disabled={lang.code === "ES"}
									>
										{lang.code}
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						</div>
					</div>

					{/* Theme Selection */}
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
				</div>
			</SheetContent>
		</Sheet>
	);
}