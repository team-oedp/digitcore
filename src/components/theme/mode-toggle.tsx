"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function ModeToggle() {
	const { setTheme, theme, resolvedTheme } = useTheme();

	return (
		<div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						aria-label="Select theme"
						className="group relative flex h-7 items-center rounded-md border border-border bg-background px-2 py-0.5 outline-none duration-150 ease-linear hover:bg-main-foreground/40 focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:border-border/50 dark:focus-visible:ring-neutral-800 dark:hover:border-white/10 dark:hover:bg-main-foreground/20"
					>
						<span className="flex items-center gap-0.5 text-primary text-sm">
							{resolvedTheme === "light" && (
								<SunIcon size={14} aria-hidden="true" />
							)}
							{resolvedTheme === "dark" && (
								<MoonIcon size={14} aria-hidden="true" />
							)}
							{resolvedTheme === "system" && (
								<MonitorIcon size={14} aria-hidden="true" />
							)}
						</span>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-32" align="end">
					<DropdownMenuItem onClick={() => setTheme("light")}>
						<SunIcon size={16} className="opacity-60" aria-hidden="true" />
						<span>Light</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("dark")}>
						<MoonIcon size={16} className="opacity-60" aria-hidden="true" />
						<span>Dark</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("system")}>
						<MonitorIcon size={16} className="opacity-60" aria-hidden="true" />
						<span>System</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
