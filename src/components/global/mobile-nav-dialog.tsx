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
import type { HEADER_QUERYResult } from "~/sanity/sanity.types";

const languages = [
	{ code: "EN", label: "English" },
	{ code: "ES", label: "Spanish" },
];

type MobileNavDialogProps = {
	headerData: HEADER_QUERYResult;
};

export function MobileNavDialog({ headerData }: MobileNavDialogProps) {
	const [open, setOpen] = useState(false);
	const [selectedLanguage, setSelectedLanguage] = useState("EN");
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();

	// Prevent hydration mismatch by only rendering theme toggle after client mount
	useEffect(() => {
		setMounted(true);
	}, []);

	// Filter navigation links based on page slug
	// "orientation" and "about" go in main menu, everything else in explore menu
	const mainMenuLinks =
		headerData?.internalLinks?.filter(
			(link) =>
				link.page?.slug === "orientation" || link.page?.slug === "about",
		) ?? [];
	const exploreMenuLinks =
		headerData?.internalLinks?.filter(
			(link) =>
				link.page?.slug !== "orientation" && link.page?.slug !== "about",
		) ?? [];

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
						{mainMenuLinks.map((link) => (
							<li key={link._key}>
								<Button
									variant="ghost"
									asChild
									className={cn(
										"w-full justify-start px-1.5 font-normal text-base hover:bg-transparent",
										pathname === `/${link.page?.slug}`
											? "text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
									onClick={() => setOpen(false)}
								>
									<Link href={`/${link.page?.slug}`}>{link.label}</Link>
								</Button>
							</li>
						))}
						{exploreMenuLinks.length > 0 && (
							<>
								<li>
									<div className="px-1.5 font-normal text-base text-muted-foreground">
										Explore
									</div>
								</li>
								{exploreMenuLinks.map((link) => (
									<li key={link._key}>
										<Button
											variant="ghost"
											asChild
											className={cn(
												"w-full justify-start pr-1.5 pl-8 font-normal text-base hover:bg-transparent",
												pathname === `/${link.page?.slug}`
													? "text-foreground"
													: "text-muted-foreground hover:text-foreground",
											)}
											onClick={() => setOpen(false)}
										>
											<Link href={`/${link.page?.slug}`}>{link.label}</Link>
										</Button>
									</li>
								))}
							</>
						)}
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
