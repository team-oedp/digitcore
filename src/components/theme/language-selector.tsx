"use client";

import { Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import type { Language } from "~/stores/language";
import { useLanguageStore } from "~/stores/language";

const languages: Array<{ code: Language; label: string }> = [
	{ code: "en", label: "English" },
	{ code: "es", label: "Spanish" },
];

type LanguageSelectorProps = {
	className?: string;
};

export function LanguageSelector({ className }: LanguageSelectorProps = {}) {
	const router = useRouter();
	const language = useLanguageStore((state) => state.language);
	const setLanguage = useLanguageStore((state) => state.setLanguage);

	const handleLanguageChange = (lang: Language) => {
		setLanguage(lang);
		document.cookie = `language=${lang}; path=/; max-age=31536000`;
		router.refresh();
	};

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
					{languages.map((lang) => (
						<DropdownMenuItem
							key={lang.code}
							onClick={() => handleLanguageChange(lang.code)}
							className="flex items-center gap-3"
						>
							<span
								className={cn(
									"min-w-[24px] font-medium text-xs",
									language === lang.code
										? "text-foreground"
										: "text-muted-foreground",
								)}
							>
								{lang.code.toUpperCase()}
							</span>
							<span
								className={cn(
									"text-sm",
									language === lang.code
										? "font-medium text-foreground"
										: "text-muted-foreground",
								)}
							>
								{lang.label}
							</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
