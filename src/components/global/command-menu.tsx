import { usePathname, useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";

import { useTheme } from "next-themes";
import { useTypesenseSearch } from "~/hooks/use-typesense-search";

import {
	ArrowDownIcon,
	ArrowUpIcon,
	CommandIcon,
	CornerDownLeftIcon,
} from "lucide-react";

import { cn } from "~/lib/utils";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/ui/command";

type CommandMenuItemProps = {
	shortcut?: string;
	icon: React.ReactNode;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onAction: () => void;
	children?: React.ReactNode;
	className?: string;
	searchValue?: string;
} & React.ComponentProps<typeof CommandItem>;

function CommandMenuItem({
	children,
	icon,
	shortcut,
	className,
	setIsOpen,
	onAction,
	searchValue,
	...props
}: CommandMenuItemProps) {
	const itemRef = useRef<HTMLDivElement | null>(null);

	function setItemRef(node: HTMLDivElement | null) {
		itemRef.current = node;
	}

	useEffect(() => {
		if (!shortcut) return;

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === shortcut && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setIsOpen(false);
				onAction();
			}
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [setIsOpen, onAction, shortcut]);

	return (
		<CommandItem
			{...props}
			ref={setItemRef}
			className={cn("cursor-pointer", className)}
		>
			<div className="flex items-center gap-2">
				<div className="opacity-70">{icon}</div>
				{children}
			</div>
			{shortcut && (
				<div className="ml-auto flex gap-1">
					<div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-200 font-semibold text-neutral-400 text-xs uppercase dark:bg-[#141414]">
						<CommandIcon size={12} />
					</div>
					<div className="flex h-6 w-6 items-center justify-center rounded-md bg-neutral-200 font-semibold text-neutral-400 text-xs uppercase dark:bg-[#141414]">
						{shortcut}
					</div>
				</div>
			)}
		</CommandItem>
	);
}

export function CommandMenu() {
	const [isOpen, setIsOpen] = useState(false);

	const router = useRouter();
	const pathname = usePathname();

	const { resolvedTheme: theme } = useTheme();
	const patternSlug = pathname.startsWith("/pattern/")
		? pathname.split("/").pop()
		: undefined;

	const {
		query,
		setQuery,
		results: searchResults,
		isLoading,
		error,
		clearSearch,
	} = useTypesenseSearch({
		collectionName: "patterns",
		patternSlug,
	});

	const getCurrentPageTitle = () => {
		if (pathname === "/") return "Home";
		if (pathname === "/faq") return "FAQ";
		if (pathname === "/search") return "Search";
		if (pathname === "/tags") return "Tags";
		if (pathname === "/values") return "Values";
		if (pathname === "/glossary") return "Glossary";
		if (pathname === "/onboarding") return "Onboarding";
		if (pathname === "/carrier-bag") return "Carrier Bag";
		if (pathname.startsWith("/pattern/")) return "Pattern";
		return pathname.split("/").pop()?.replace(/-/g, " ") || "Unknown";
	};

	const currentPage = getCurrentPageTitle();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setIsOpen((prev) => !prev);
			}
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [setIsOpen]);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className={cn(
					"group relative flex h-7 items-center rounded-md border border-border bg-background px-2 py-0.5 outline-none duration-150 ease-linear hover:bg-main-foreground/40 focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:border-border/50 dark:focus-visible:ring-neutral-800 dark:hover:border-white/10 dark:hover:bg-main-foreground/20",
				)}
			>
				<CommandMenuIcon />
			</button>
			<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
				<div className="flex items-center gap-1.5 pt-3 pl-4">
					<div className="flex h-6 w-fit items-center justify-center rounded-md bg-neutral-200 px-2 dark:bg-neutral-900">
						<span className="font-[460] text-[13px] text-foreground capitalize">
							{currentPage}
						</span>
					</div>
				</div>
				<CommandInput
					placeholder="What are you searching for?"
					onValueChange={setQuery}
				/>
				<CommandList className="min-h-[200px]">
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="text-muted-foreground text-sm">Searching...</div>
						</div>
					) : (
						<>
							<CommandEmpty>No results found.</CommandEmpty>
							{searchResults.length > 0 && (
								<div className="space-y-1.5 pt-1 pb-1.5">
									{/* Group results by type */}
									{["pattern", "solution", "resource", "tag", "audience"].map(
										(type) => {
											const resultsOfType = searchResults.filter(
												(result) => result.type === type,
											);
											if (resultsOfType.length === 0) return null;

											return (
												<CommandGroup
													key={type}
													heading={
														type === "pattern"
															? "Patterns"
															: type === "solution"
																? "Solutions"
																: type === "resource"
																	? "Resources"
																	: type === "tag"
																		? "Tags"
																		: "Audiences"
													}
												>
													{resultsOfType.map((result) => {
														return (
															<CommandMenuItem
																key={`${result.type}-${result.id}`}
																icon={<div style={{ width: 22, height: 22 }} />}
																setIsOpen={setIsOpen}
																onSelect={() => {
																	// Navigate based on type
																	if (
																		result.type === "pattern" &&
																		result.slug
																	) {
																		router.push(`/pattern/${result.slug}`);
																	} else if (
																		result.type === "solution" ||
																		result.type === "resource"
																	) {
																		// For solutions and resources, scroll to their section on the current page
																		const sectionId =
																			result.type === "solution"
																				? "solutions"
																				: "resources";
																		const element =
																			document.getElementById(sectionId);
																		if (element) {
																			element.scrollIntoView({
																				behavior: "smooth",
																				block: "start",
																			});
																		}
																	} else if (result.type === "pattern") {
																		// If searching within the current pattern, scroll to top
																		window.scrollTo({
																			top: 0,
																			behavior: "smooth",
																		});
																	}
																	// Add navigation logic for other types as needed
																	setIsOpen(false);
																}}
																onAction={() => {
																	if (
																		result.type === "pattern" &&
																		result.slug
																	) {
																		router.push(`/pattern/${result.slug}`);
																	} else if (
																		result.type === "solution" ||
																		result.type === "resource"
																	) {
																		// For solutions and resources, scroll to their section on the current page
																		const sectionId =
																			result.type === "solution"
																				? "solutions"
																				: "resources";
																		const element =
																			document.getElementById(sectionId);
																		if (element) {
																			element.scrollIntoView({
																				behavior: "smooth",
																				block: "start",
																			});
																		}
																	} else if (result.type === "pattern") {
																		// If searching within the current pattern, scroll to top
																		window.scrollTo({
																			top: 0,
																			behavior: "smooth",
																		});
																	}
																}}
															>
																{result.title || "Untitled"}
															</CommandMenuItem>
														);
													})}
												</CommandGroup>
											);
										},
									)}
								</div>
							)}
						</>
					)}
				</CommandList>
				<div className="flex items-center justify-between border-border border-t bg-background p-4">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1.5">
								<div className="rounded-md bg-neutral-200 p-1 text-neutral-500 dark:bg-[#141414]">
									<ArrowUpIcon size={16} />
								</div>
								<div className="rounded-md bg-neutral-200 p-1 text-neutral-500 dark:bg-[#141414]">
									<ArrowDownIcon size={16} />
								</div>
							</div>
							<span className="text-sm">Navigate</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="rounded-md bg-neutral-200 p-1 text-neutral-500 dark:bg-[#141414]">
								<CornerDownLeftIcon size={16} />
							</div>
							<span className="text-sm">Select</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-sm">Close</span>
						<div className="rounded-md bg-neutral-200 p-1 text-xs dark:bg-[#141414]">
							<span className="font-medium text-neutral-500">ESC</span>
						</div>
					</div>
				</div>
			</CommandDialog>
		</>
	);
}

function CommandMenuIcon() {
	return (
		<span className={cn("flex items-center gap-0.5 text-primary text-sm")}>
			<CommandIcon size={14} /> K
		</span>
	);
}