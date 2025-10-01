"use client";

import {
	ComputerIcon,
	Moon02Icon,
	Sun03Icon,
} from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icon } from "../shared/icon";

interface ModeToggleProps {
	className?: string;
}

export function ModeToggle({ className }: ModeToggleProps = {}) {
	const { setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch by only rendering after client mount
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div className={className}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						aria-label="Select theme"
						className="group relative flex h-7 items-center rounded-md px-2 py-0.5 text-muted-foreground outline-none transition-colors duration-150 ease-linear hover:text-foreground focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:focus-visible:ring-neutral-800"
					>
						{/* Render both icons and rely on CSS so SSR matches client */}
						<Icon
							icon={Sun03Icon}
							size={14}
							aria-hidden="true"
							className="dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0"
						/>
						<Icon
							icon={Moon02Icon}
							size={14}
							aria-hidden="true"
							className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						/>
						<span className="sr-only">Toggle theme</span>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-32" align="end">
					<DropdownMenuItem onClick={() => setTheme("light")}>
						<Icon
							icon={Sun03Icon}
							size={16}
							className="opacity-60"
							aria-hidden="true"
						/>
						<span>Light</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("dark")}>
						<Icon
							icon={Moon02Icon}
							size={16}
							className="opacity-60"
							aria-hidden="true"
						/>
						<span>Dark</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme("system")}>
						<Icon
							icon={ComputerIcon}
							size={16}
							className="opacity-60"
							aria-hidden="true"
						/>
						<span>System</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
