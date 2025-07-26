"use client";

import { Command } from "cmdk";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

interface CommandMenuProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
	const router = useRouter();
	const pathname = usePathname();
	const [search, setSearch] = useState("");

	const getCurrentPageLabel = () => {
		if (pathname === "/") return "Home";
		if (pathname === "/faq") return "FAQ";
		if (pathname === "/search") return "Search";
		if (pathname === "/tags") return "Tags";
		if (pathname === "/values") return "Values";
		if (pathname === "/glossary") return "Glossary";
		if (pathname === "/onboarding") return "Onboarding";
		if (pathname === "/carrier-bag") return "Carrier Bag";
		if (pathname.startsWith("/pattern/")) {
			const slug = pathname.split("/pattern/")[1];
			return slug?.replace(/-/g, " ");
		}
		return pathname.split("/").pop() || "Unknown";
	};

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				onOpenChange(!open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [open, onOpenChange]);

	const runCommand = (command: () => unknown) => {
		onOpenChange(false);
		command();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-[640px] p-0">
				<DialogTitle className="sr-only">Command Menu</DialogTitle>
				<Command className="rounded-lg border-0 shadow-2xl">
					<div className="border-border border-b px-4 py-3">
						<Command.Input
							placeholder="What do you need?"
							value={search}
							onValueChange={setSearch}
							className="h-auto border-0 bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground focus:ring-0"
						/>
					</div>
					<Command.List className="min-h-[200px] p-0">
						<Command.Empty className="flex h-[200px] flex-col items-center justify-center text-center">
							<div className="text-muted-foreground text-sm">
								No recent searches
							</div>
						</Command.Empty>
					</Command.List>
					<div className="border-border border-t px-4 py-3">
						<div className="flex items-center justify-between text-muted-foreground text-xs">
							<div className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground text-xs capitalize">
								{getCurrentPageLabel()}
							</div>
							<div className="flex items-center gap-4">
								<span>Navigation</span>
								<div className="flex items-center gap-1">
									<kbd className="inline-flex h-5 w-5 items-center justify-center rounded border bg-muted font-mono text-[10px]">
										↓
									</kbd>
									<kbd className="inline-flex h-5 w-5 items-center justify-center rounded border bg-muted font-mono text-[10px]">
										↑
									</kbd>
								</div>
								<span>Open result</span>
								<kbd className="inline-flex h-5 items-center justify-center rounded border bg-muted px-2 font-mono text-[10px]">
									↵
								</kbd>
							</div>
						</div>
					</div>
				</Command>
			</DialogContent>
		</Dialog>
	);
}
