"use client";

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "~/components/ui/button";
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
					<Button size="icon" variant="outline" aria-label="Select theme">
						{resolvedTheme === "light" && (
							<SunIcon size={16} aria-hidden="true" />
						)}
						{resolvedTheme === "dark" && (
							<MoonIcon size={16} aria-hidden="true" />
						)}
						{resolvedTheme === "system" && (
							<MonitorIcon size={16} aria-hidden="true" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-32">
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
