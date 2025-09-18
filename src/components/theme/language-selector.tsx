"use client";

import { Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

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
							"group relative flex h-7 items-center rounded-md px-2 py-0.5 outline-none transition-colors duration-150 ease-linear focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:focus-visible:ring-neutral-800",
						)}
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
