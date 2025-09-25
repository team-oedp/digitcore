"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useFontStore, type FontMode } from "~/stores/font";

interface FontToggleProps {
	className?: string;
}

export function FontToggle({ className }: FontToggleProps = {}) {
	const mode = useFontStore((state) => state.mode);
	const setMode = useFontStore((state) => state.setMode);

	const handleModeChange = (newMode: FontMode) => {
		setMode(newMode);
	};

	return (
		<div className={className}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<button
						type="button"
						aria-label="Select font style"
						className="group relative flex h-7 items-center rounded-md px-2 py-0.5 text-muted-foreground outline-none transition-colors duration-150 ease-linear hover:text-foreground focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:focus-visible:ring-neutral-800"
					>
						{/* Render both Aa text in different typefaces */}
						<span
							aria-hidden="true"
							className={`text-sm font-serif transition-all ${
								mode === "serif" ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
							}`}
						>
							Aa
						</span>
						<span
							aria-hidden="true"
							className={`absolute text-sm font-sans transition-all ${
								mode === "sans-serif" ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
							}`}
						>
							Aa
						</span>
						<span className="sr-only">Toggle font style</span>
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-32" align="end">
					<DropdownMenuItem onClick={() => handleModeChange("serif")}>
						<span className="font-serif">Serif</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => handleModeChange("sans-serif")}>
						<span className="font-sans">Sans-serif</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}