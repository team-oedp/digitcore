"use client";

import { Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { cn } from "~/lib/utils";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

// Restrict available languages to English and a disabled Spanish option
const languages = [
	{ code: "EN", label: "English", disabled: false },
	{ code: "ES", label: "Spanish", disabled: true },
];

interface LanguageSelectorProps {
	className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps = {}) {
	const [selectedLanguage, setSelectedLanguage] = React.useState(languages[0]);

	return (
		<div className={className}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						className={cn(
							"group relative flex h-7 items-center rounded-md border border-border bg-background px-2 py-0.5 outline-none duration-150 ease-linear hover:bg-main-foreground/40 focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:border-border/50 dark:focus-visible:ring-neutral-800 dark:hover:border-white/10 dark:hover:bg-main-foreground/20",
						)}
					>
						<span
							className={cn("flex items-center gap-0.5 text-primary text-sm")}
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
					{languages.map((language) => (
						<DropdownMenuItem
							key={language.code}
							disabled={language.disabled}
							onClick={() => {
								if (!language.disabled) setSelectedLanguage(language);
							}}
							className="flex items-center gap-3"
						>
							<span
								className={cn(
									"min-w-[24px] font-medium text-xs",
									selectedLanguage?.code === language.code
										? "text-foreground"
										: "text-muted-foreground",
								)}
							>
								{language.code}
							</span>
							<span
								className={cn(
									"text-sm",
									selectedLanguage?.code === language.code
										? "font-medium text-foreground"
										: "text-muted-foreground",
								)}
							>
								{language.label}
							</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
