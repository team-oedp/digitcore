"use client";

import { Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type Language, i18n } from "~/i18n/config";
import { buildLocaleHref, parseLocalePath } from "~/lib/locale-path";
import { cn } from "~/lib/utils";

type LanguageSelectorProps = {
	className?: string;
};

type LanguageOption = {
	code: Language;
	label: string;
};

const LANGUAGE_OPTIONS: LanguageOption[] = i18n.languages.map((language) => ({
	code: language.id,
	label: language.title,
}));

export function LanguageSelector({ className }: LanguageSelectorProps = {}) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { language: currentLanguage, normalizedPath } = useMemo(
		() => parseLocalePath(pathname),
		[pathname],
	);

	const searchSuffix = useMemo(() => {
		const query = searchParams?.toString() ?? "";
		return query ? `?${query}` : "";
	}, [searchParams]);

	return (
		<div className={className}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className={cn(
							"group relative flex h-7 items-center rounded-md px-2 py-0.5 outline-none transition-colors duration-150 ease-linear",
						)}
						suppressHydrationWarning
					>
						<span
							className={cn(
								"flex items-center gap-0.5 text-muted-foreground text-sm transition-colors group-hover:text-foreground",
							)}
						>
							<span className="hidden font-normal text-sm">LANG</span>
							<HugeiconsIcon
								icon={Globe02Icon}
								size={14}
								color="currentColor"
								strokeWidth={1.5}
							/>
						</span>
						<span className="sr-only">Select language</span>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="min-w-32">
					{LANGUAGE_OPTIONS.map((languageOption) => {
						const isActive = languageOption.code === currentLanguage;
						const href = buildLocaleHref(
							languageOption.code,
							`${normalizedPath}${searchSuffix}`,
						);

						return (
							<DropdownMenuItem
								key={languageOption.code}
								asChild
								className="p-0"
							>
								<Link
									href={href}
									className={cn(
										"flex w-full items-center gap-3 px-3 py-2 text-sm outline-none transition-colors",
										isActive
											? "font-medium text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
									aria-label={`Switch to ${languageOption.label}`}
									prefetch={true}
								>
									<span
										className={cn(
											"min-w-[24px] font-medium text-xs",
											isActive ? "text-foreground" : "text-muted-foreground",
										)}
									>
										{languageOption.code.toUpperCase()}
									</span>
									<span
										className={cn(
											"text-sm",
											isActive
												? "font-medium text-foreground"
												: "text-muted-foreground",
										)}
									>
										{languageOption.label}
									</span>
									<span className="sr-only">{languageOption.label}</span>
								</Link>
							</DropdownMenuItem>
						);
					})}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
