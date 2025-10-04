"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { type FontMode, useFontStore } from "~/stores/font";

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
						className="group relative flex h-7 items-center rounded-md px-2 py-0.5 text-muted-foreground outline-none transition-colors duration-150 ease-linear hover:text-foreground"
					>
						{/* Render both Aa text in different typefaces */}
						<span
							aria-hidden="true"
							className={`font-serif text-sm transition-all ${
								mode === "serif"
									? "rotate-0 scale-100 opacity-100"
									: "-rotate-90 scale-0 opacity-0"
							}`}
						>
							Aa
						</span>
						<span
							aria-hidden="true"
							className={`absolute font-sans text-sm transition-all ${
								mode === "sans-serif"
									? "rotate-0 scale-100 opacity-100"
									: "rotate-90 scale-0 opacity-0"
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
