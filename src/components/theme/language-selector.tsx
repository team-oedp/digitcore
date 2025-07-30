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

const languages = [
	{ code: "ES", name: "Spanish" },
	{ code: "EN", name: "English" },
	{ code: "PT", name: "Português" },
	{ code: "FR", name: "Français" },
	{ code: "KR", name: "한국어" },
];

export function LanguageSelector() {
	const [selectedLanguage, setSelectedLanguage] = React.useState(languages[0]);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className={cn(
						"group relative flex items-center rounded-md border border-border px-2 py-0.5 dark:border-border/50",
						"bg-background outline-none duration-150 ease-linear hover:bg-main-foreground/40 focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:focus-visible:ring-neutral-800 dark:hover:border-white/10 dark:hover:bg-main-foreground/20",
					)}
				>
					<span
						className={cn("text-primary text-sm", "flex items-center gap-0.5")}
					>
						<span className="font-normal text-sm">LANG</span>
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
			<DropdownMenuContent align="end" className="w-48 rounded-lg border p-3">
				<div className="mb-3">
					<h4 className="font-medium text-foreground text-sm">
						Language selection
					</h4>
				</div>
				<div className="space-y-1">
					{languages.map((language) => (
						<DropdownMenuItem
							key={language.code}
							onClick={() => setSelectedLanguage(language)}
							className={cn(
								"flex cursor-pointer items-start gap-3 rounded-none border-0 px-0 py-2 hover:bg-transparent focus:bg-transparent",
								"data-[highlighted]:bg-transparent",
							)}
						>
							<span
								className={cn(
									"mt-0.5 min-w-[24px] font-medium text-xs",
									selectedLanguage?.code === language.code
										? "text-foreground"
										: "text-muted-foreground",
								)}
							>
								{language.code}
							</span>
							<span
								className={cn(
									"text-sm leading-5",
									selectedLanguage?.code === language.code
										? "font-medium text-foreground"
										: "text-muted-foreground",
								)}
							>
								{language.name}
							</span>
						</DropdownMenuItem>
					))}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
