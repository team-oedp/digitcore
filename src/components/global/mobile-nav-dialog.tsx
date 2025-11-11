"use client";

import { Menu, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
import { type Language, i18n } from "~/i18n/config";
import { buildLocaleHref, parseLocalePath } from "~/lib/locale-path";
import { cn } from "~/lib/utils";
import { linkResolver } from "~/sanity/lib/utils";
import type { HEADER_QUERYResult } from "~/sanity/sanity.types";

const LANGUAGE_OPTIONS = i18n.languages.map((language) => ({
	code: language.id,
	label: language.title,
}));

type MobileNavDialogProps = {
	headerData: HEADER_QUERYResult;
	language: Language;
};

export function MobileNavDialog({
	headerData,
	language,
}: MobileNavDialogProps) {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { normalizedPath, language: routeLanguage } = useMemo(
		() => parseLocalePath(pathname),
		[pathname],
	);
	const currentLanguage = routeLanguage ?? language;
	const queryString = useMemo(
		() => searchParams?.toString() ?? "",
		[searchParams],
	);
	const { theme, setTheme } = useTheme();

	// Prevent hydration mismatch by only rendering theme toggle after client mount
	useEffect(() => {
		setMounted(true);
	}, []);

	// Filter navigation links based on page slug
	// "orientation" and "about" go in main menu, everything else in explore menu
	const headerLinks = (headerData?.internalLinks ?? []).flatMap((link) => {
		if (!link) return [];
		const label = link.label?.trim();
		const slug = link.page?.slug?.trim();

		if (!link.page || !label || !slug) {
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
						{mainMenuLinks.map((link) => {
							const slug = link.page?.slug;
							if (!slug) return null;

							const href = `/${slug}`;
							const isActive = normalizedPath === href;

							return (
								<li key={link._key}>
									<Button
										variant="ghost"
										asChild
										className={cn(
											"w-full justify-start px-1.5 font-normal text-base hover:bg-transparent",
											isActive
												? "text-foreground"
												: "text-muted-foreground hover:text-foreground",
										)}
										onClick={() => setOpen(false)}
									>
										<Link href={buildLocaleHref(currentLanguage, href)}>
											{link.label}
										</Link>
									</Button>
								</li>
							);
						})}
						{exploreMenuLinks.length > 0 && (
							<>
								<li>
									<div className="px-1.5 font-normal text-base text-muted-foreground">
										Explore
									</div>
								</li>
								{exploreMenuLinks.map((link) => {
									const slug = link.page?.slug;
									if (!slug) return null;

									// Use linkResolver to get the correct href (handles /page/[slug] structure)
									const resolvedHref = linkResolver(link);
									if (!resolvedHref) return null;
									const isActive = normalizedPath === resolvedHref;

									return (
										<li key={link._key}>
											<Button
												variant="ghost"
												asChild
												className={cn(
													"w-full justify-start pr-1.5 pl-8 font-normal text-base hover:bg-transparent",
													isActive
														? "text-foreground"
														: "text-muted-foreground hover:text-foreground",
												)}
												onClick={() => setOpen(false)}
											>
												<Link href={buildLocaleHref(currentLanguage, resolvedHref)}>
													{link.label}
												</Link>
											</Button>
										</li>
									);
								})}
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
								value={currentLanguage}
								onValueChange={() => {}}
								className="flex-wrap justify-start gap-2"
							>
								{LANGUAGE_OPTIONS.map((lang) => {
									const href =
										queryString.length > 0
											? `${normalizedPath}?${queryString}`
											: normalizedPath;
									return (
										<ToggleGroupItem
											key={lang.code}
											value={lang.code}
											asChild
											className="min-w-[60px] flex-none border-0 bg-transparent px-0 text-muted-foreground hover:bg-transparent hover:text-foreground data-[state=on]:bg-transparent data-[state=on]:text-foreground"
											aria-label={`Switch to ${lang.label}`}
										>
											<Link
												href={buildLocaleHref(lang.code, href)}
												onClick={() => setOpen(false)}
												className="flex w-full items-center justify-center gap-2 px-2 py-1.5 text-xs"
											>
												{lang.code.toUpperCase()}
											</Link>
										</ToggleGroupItem>
									);
								})}
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
