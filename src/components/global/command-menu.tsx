import { Search02Icon } from "@hugeicons/core-free-icons";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	AsteriskIcon,
	CommandIcon,
	CornerDownLeftIcon,
	FileTextIcon,
	FolderIcon,
	HashIcon,
	LightbulbIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import type {
	SearchPattern,
	SearchResource,
	SearchSolution,
	SearchTag,
} from "~/app/actions/search";
import { searchContentForCommandModal } from "~/app/actions/search";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/ui/command";
import { usePageContentSearch } from "~/hooks/use-page-content-search";
import {
	type PortableTextBlock,
	extractTextFromPortableText,
	getMatchExplanation,
	highlightMatches,
	truncateWithContext,
} from "~/lib/search-utils";
import { cn } from "~/lib/utils";
import { Icon } from "../shared/icon";

type CommandMenuItemProps = {
	shortcut?: string;
	icon: React.ReactNode;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onAction: () => void;
	children?: React.ReactNode;
	className?: string;
	searchValue?: string;
} & React.ComponentProps<typeof CommandItem>;

function _CommandMenuItem({
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
	const _patternSlug = pathname.startsWith("/pattern/")
		? pathname.split("/").pop()
		: undefined;

	// Comprehensive search using enhanced server-side search action
	const [query, setQuery] = useState("");
	const [searchResults, setSearchResults] = useState<{
		patterns: SearchPattern[];
		solutions: SearchSolution[];
		resources: SearchResource[];
		tags: SearchTag[];
	}>({ patterns: [], solutions: [], resources: [], tags: [] });
	const [globalLoading, setGlobalLoading] = useState(false);
	const [_error, setError] = useState<string | null>(null);
	const [debouncedQuery] = useDebounce(query, 300);

	// Enhanced search effect using comprehensive search
	useEffect(() => {
		const performSearch = async () => {
			if (!debouncedQuery.trim()) {
				setSearchResults({
					patterns: [],
					solutions: [],
					resources: [],
					tags: [],
				});
				setError(null);
				return;
			}

			// Only search if modal is open
			if (!isOpen) {
				return;
			}

			setGlobalLoading(true);
			setError(null);
			try {
				// Use direct search function for command modal
				const result = await searchContentForCommandModal(
					debouncedQuery.trim(),
				);

				if (result.success && result.data) {
					setSearchResults(result.data);
				} else {
					setError(result.error || "Search failed");
					setSearchResults({
						patterns: [],
						solutions: [],
						resources: [],
						tags: [],
					});
				}
			} catch (_err) {
				setError("Search failed");
				setSearchResults({
					patterns: [],
					solutions: [],
					resources: [],
					tags: [],
				});
			} finally {
				setGlobalLoading(false);
			}
		};
		performSearch();
	}, [debouncedQuery, isOpen]);

	// Page content search (only enabled on pattern pages)
	const {
		results: pageResults,
		isLoading: pageLoading,
		scrollToResult,
		clearSearch: clearPageSearch,
		hasContent,
		setQuery: setPageQuery,
	} = usePageContentSearch({ enabled: true });

	// Sync queries between both search hooks
	const handleQueryChange = (newQuery: string) => {
		setQuery(newQuery);
		setPageQuery(newQuery);
	};

	const isLoading = globalLoading || pageLoading;
	const _hasResults =
		searchResults.patterns.length > 0 ||
		searchResults.solutions.length > 0 ||
		searchResults.resources.length > 0 ||
		searchResults.tags.length > 0 ||
		pageResults.length > 0;

	// Reset search state when modal opens/closes
	useEffect(() => {
		if (!isOpen) {
			// Clear search when modal closes - call functions directly to avoid dependency issues
			setQuery("");
			setSearchResults({
				patterns: [],
				solutions: [],
				resources: [],
				tags: [],
			});
			setError(null);
			clearPageSearch();
		}
	}, [isOpen, clearPageSearch]);

	const _clearSearch = useCallback(() => {
		setQuery("");
		setSearchResults({ patterns: [], solutions: [], resources: [], tags: [] });
		setError(null);
		clearPageSearch();
	}, [clearPageSearch]);

	const getCurrentPageTitle = () => {
		if (pathname === "/") return "Home";
		if (pathname === "/faq") return "FAQ";
		if (pathname === "/explore") return "Explore";
		if (pathname === "/patterns") return "Patterns";
		if (pathname === "/tags") return "Tags";
		if (pathname === "/values") return "Values";
		if (pathname === "/glossary") return "Glossary";
		if (pathname === "/onboarding") return "Onboarding";
		if (pathname === "/carrier-bag") return "Carrier Bag";
		if (pathname.startsWith("/pattern/")) return "Pattern";
		return pathname.split("/").pop()?.replace(/-/g, " ") || "Unknown";
	};

	const currentPage = getCurrentPageTitle();

	// Helper function to get compact search context for command modal
	const getCompactMatchContext = (
		title: string | null,
		description: Array<unknown> | null | undefined,
		searchTerm: string,
	): {
		snippet: string;
		matchLocations: string[];
		hasMatch: boolean;
	} => {
		if (!searchTerm.trim() || !title) {
			return { snippet: "", matchLocations: [], hasMatch: false };
		}

		const matchExplanation = getMatchExplanation(
			title,
			(description ?? "") as PortableTextBlock[] | string,
			searchTerm,
		);

		if (!matchExplanation.titleMatch && !matchExplanation.descriptionMatch) {
			return { snippet: "", matchLocations: [], hasMatch: false };
		}

		// If title matches, we don't need context since title is already visible
		if (matchExplanation.titleMatch) {
			return {
				snippet: "",
				matchLocations: matchExplanation.matchLocations,
				hasMatch: true,
			};
		}

		// If only description matches, show context around the match
		if (matchExplanation.descriptionMatch) {
			const plainDescription = extractTextFromPortableText(
				(description ?? "") as PortableTextBlock[] | string,
			);
			const contextResult = truncateWithContext(
				plainDescription,
				searchTerm,
				60,
			);

			return {
				snippet: highlightMatches(contextResult.text, searchTerm),
				matchLocations: matchExplanation.matchLocations,
				hasMatch: contextResult.hasMatch,
			};
		}

		return { snippet: "", matchLocations: [], hasMatch: false };
	};

	// Helper for solutions context
	const getSolutionContext = (solution: SearchSolution, searchTerm: string) => {
		return getCompactMatchContext(
			solution.title,
			solution.description,
			searchTerm,
		);
	};

	// Helper for resources context
	const getResourceContext = (resource: SearchResource, searchTerm: string) => {
		return getCompactMatchContext(
			resource.title,
			resource.description,
			searchTerm,
		);
	};

	// Helper for tags context (simpler since tags only have titles)
	const getTagContext = (tag: SearchTag, searchTerm: string) => {
		if (!searchTerm.trim() || !tag.title) return { hasMatch: false };
		const titleMatch = tag.title
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		return { hasMatch: titleMatch };
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: false positive
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
			<CommandDialog
				open={isOpen}
				onOpenChange={setIsOpen}
				className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 max-w-2xl transition-all duration-200 ease-out data-[state=closed]:animate-out data-[state=open]:animate-in"
			>
				<div className="flex items-center gap-1.5 pt-3 pl-4">
					<div className="flex h-6 w-fit items-center justify-center rounded-md bg-neutral-200 px-2 dark:bg-neutral-900">
						<span className="font-[460] text-[13px] text-foreground capitalize">
							{currentPage}
						</span>
					</div>
				</div>
				<CommandInput
					placeholder={"Search patterns, solutions, and resources..."}
					value={query}
					onValueChange={handleQueryChange}
				/>
				<CommandList className="max-h-[400px] min-h-[120px] overflow-y-auto transition-all duration-300 ease-in-out">
					{isLoading ? (
						<div className="flex items-center justify-center py-6">
							<div className="text-muted-foreground text-sm">Searching...</div>
						</div>
					) : (
						<>
							<CommandEmpty>No results found.</CommandEmpty>
							{/* Page Content Results - Highest priority for current page */}
							{pageResults.length > 0 && (
								<div className="fade-in-0 slide-in-from-top-1 animate-in duration-200">
									<CommandGroup heading="On this page">
										{pageResults.slice(0, 5).map((result) => {
											const getIcon = () => {
												switch (result.type) {
													case "solution":
														return (
															<div className="h-4 w-4 rounded-full bg-blue-500" />
														);
													case "resource":
														return (
															<div className="h-4 w-4 rounded-full bg-green-500" />
														);
													case "heading":
														return (
															<HashIcon className="h-4 w-4 text-muted-foreground" />
														);
													default:
														return (
															<FileTextIcon className="h-4 w-4 text-muted-foreground" />
														);
												}
											};
											return (
												<CommandItem
													key={result.id}
													value={result.title}
													onSelect={() => {
														scrollToResult(result);
														setIsOpen(false);
													}}
													className="cursor-pointer px-3 py-2"
												>
													<div className="flex items-center gap-2">
														{getIcon()}
														<span className="truncate text-sm">
															{result.title}
														</span>
													</div>
												</CommandItem>
											);
										})}
									</CommandGroup>
								</div>
							)}
							{/* Patterns - Second priority */}
							{searchResults.patterns.length > 0 && (
								<div className="fade-in-0 slide-in-from-top-1 animate-in duration-200">
									<CommandGroup heading="Patterns">
										{searchResults.patterns.slice(0, 6).map((result) => {
											const context = getCompactMatchContext(
												result.title,
												result.description,
												query,
											);
											return (
												<CommandItem
													key={`pattern-${result._id}`}
													value={result.title || ""}
													onSelect={() => {
														if (result.slug)
															router.push(`/pattern/${result.slug}`);
														setIsOpen(false);
													}}
													className="cursor-pointer px-3 py-2"
												>
													<div className="flex w-full items-center gap-2">
														<AsteriskIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
														<div className="flex min-w-0 flex-1 flex-col">
															<span className="truncate text-sm">
																{result.title}
															</span>
															{context.snippet && (
																<span
																	/* biome-ignore lint/security/noDangerouslySetInnerHtml: safe snippet composed from sanitized highlight function */
																	dangerouslySetInnerHTML={{
																		__html: `...${context.snippet}...`,
																	}}
																/>
															)}
														</div>
														{context.hasMatch && !context.snippet && (
															<div className="flex flex-shrink-0 gap-1">
																{context.matchLocations.includes("title") && (
																	<div
																		className="h-1.5 w-1.5 rounded-full bg-blue-500"
																		title="Match in title"
																	/>
																)}
																{context.matchLocations.includes(
																	"description",
																) && (
																	<div
																		className="h-1.5 w-1.5 rounded-full bg-green-500"
																		title="Match in description"
																	/>
																)}
															</div>
														)}
													</div>
												</CommandItem>
											);
										})}
									</CommandGroup>
								</div>
							)}
							{/* Solutions - Third priority */}
							{searchResults.solutions.length > 0 && (
								<div className="fade-in-0 slide-in-from-top-1 animate-in duration-200">
									<CommandGroup heading="Solutions">
										{searchResults.solutions.slice(0, 6).map((sol) => {
											const context = getSolutionContext(sol, query);
											return (
												<CommandItem
													key={`solution-${sol._id}`}
													value={sol.title || ""}
													onSelect={() => {
														// Navigate to first parent pattern if available
														if (sol.patterns && sol.patterns.length > 0) {
															const firstPattern = sol.patterns[0];
															if (firstPattern?.slug) {
																router.push(
																	`/pattern/${firstPattern.slug}#${sol._id}`,
																);
															}
														}
														setIsOpen(false);
													}}
													className="cursor-pointer px-3 py-2"
												>
													<div className="flex w-full items-center gap-2">
														<LightbulbIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
														<div className="flex min-w-0 flex-1 flex-col">
															<span className="truncate text-sm">
																{sol.title}
															</span>
															{context.snippet && (
																<span
																	/* biome-ignore lint/security/noDangerouslySetInnerHtml: safe snippet composed from sanitized highlight function */
																	dangerouslySetInnerHTML={{
																		__html: `...${context.snippet}...`,
																	}}
																/>
															)}
															{sol.patterns &&
																sol.patterns.length > 0 &&
																sol.patterns[0]?.title && (
																	<span className="truncate text-muted-foreground text-xs">
																		in {sol.patterns[0].title}
																	</span>
																)}
														</div>
														{context.hasMatch && !context.snippet && (
															<div className="flex flex-shrink-0 gap-1">
																{context.matchLocations.includes("title") && (
																	<div
																		className="h-1.5 w-1.5 rounded-full bg-blue-500"
																		title="Match in title"
																	/>
																)}
																{context.matchLocations.includes(
																	"description",
																) && (
																	<div
																		className="h-1.5 w-1.5 rounded-full bg-green-500"
																		title="Match in description"
																	/>
																)}
															</div>
														)}
													</div>
												</CommandItem>
											);
										})}
									</CommandGroup>
								</div>
							)}
							{/* Resources - Fourth priority */}
							{searchResults.resources.length > 0 && (
								<div className="fade-in-0 slide-in-from-top-1 animate-in duration-200">
									<CommandGroup heading="Resources">
										{searchResults.resources.slice(0, 6).map((res) => {
											const context = getResourceContext(res, query);
											return (
												<CommandItem
													key={`resource-${res._id}`}
													value={res.title || ""}
													onSelect={() => {
														// Navigate to first parent pattern if available
														if (res.patterns && res.patterns.length > 0) {
															const firstPattern = res.patterns[0];
															if (firstPattern?.slug) {
																router.push(
																	`/pattern/${firstPattern.slug}#${res._id}`,
																);
															}
														}
														setIsOpen(false);
													}}
													className="cursor-pointer px-3 py-2"
												>
													<div className="flex w-full items-center gap-2">
														<FolderIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
														<div className="flex min-w-0 flex-1 flex-col">
															<span className="truncate text-sm">
																{res.title}
															</span>
															{context.snippet && (
																<span
																	/* biome-ignore lint/security/noDangerouslySetInnerHtml: safe snippet composed from sanitized highlight function */
																	dangerouslySetInnerHTML={{
																		__html: `...${context.snippet}...`,
																	}}
																/>
															)}
															{res.patterns &&
																res.patterns.length > 0 &&
																res.patterns[0]?.title && (
																	<span className="truncate text-muted-foreground text-xs">
																		in {res.patterns[0].title}
																	</span>
																)}
														</div>
														{context.hasMatch && !context.snippet && (
															<div className="flex flex-shrink-0 gap-1">
																{context.matchLocations.includes("title") && (
																	<div
																		className="h-1.5 w-1.5 rounded-full bg-blue-500"
																		title="Match in title"
																	/>
																)}
																{context.matchLocations.includes(
																	"description",
																) && (
																	<div
																		className="h-1.5 w-1.5 rounded-full bg-green-500"
																		title="Match in description"
																	/>
																)}
															</div>
														)}
													</div>
												</CommandItem>
											);
										})}
									</CommandGroup>
								</div>
							)}
							{/* Tags - Fifth priority */}
							{searchResults.tags.length > 0 && (
								<div className="fade-in-0 slide-in-from-top-1 animate-in duration-200">
									<CommandGroup heading="Tags">
										{searchResults.tags.slice(0, 6).map((tag) => {
											const context = getTagContext(tag, query);
											return (
												<CommandItem
													key={`tag-${tag._id}`}
													value={tag.title || ""}
													onSelect={() => {
														// Navigate to first pattern with this tag, or tags page
														if (tag.patterns && tag.patterns.length > 0) {
															const firstPattern = tag.patterns[0];
															if (firstPattern?.slug) {
																router.push(`/pattern/${firstPattern.slug}`);
															}
														} else {
															router.push(`/tags#${tag._id}`);
														}
														setIsOpen(false);
													}}
													className="cursor-pointer px-3 py-2"
												>
													<div className="flex w-full items-center gap-2">
														<HashIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
														<div className="flex min-w-0 flex-1 flex-col">
															<span className="truncate text-sm">
																{tag.title}
															</span>
															{tag.patterns && tag.patterns.length > 0 && (
																<span className="text-muted-foreground text-xs">
																	{tag.patterns.length} pattern
																	{tag.patterns.length !== 1 ? "s" : ""}
																</span>
															)}
														</div>
														{context.hasMatch && (
															<div className="flex flex-shrink-0 gap-1">
																<div
																	className="h-1.5 w-1.5 rounded-full bg-blue-500"
																	title="Match in tag name"
																/>
															</div>
														)}
													</div>
												</CommandItem>
											);
										})}
									</CommandGroup>
								</div>
							)}
						</>
					)}
				</CommandList>
				<div className="flex items-center justify-between border-border border-t bg-background px-4 py-3">
					<div className="text-muted-foreground text-sm">
						You are on the {currentPage.toLowerCase()} page
					</div>
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1.5">
								<div className="rounded bg-neutral-200 p-1 text-neutral-500 dark:bg-neutral-800">
									<ArrowUpIcon size={12} />
								</div>
								<div className="rounded bg-neutral-200 p-1 text-neutral-500 dark:bg-neutral-800">
									<ArrowDownIcon size={12} />
								</div>
							</div>
							<span className="text-muted-foreground text-xs">Navigation</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="rounded bg-neutral-200 p-1 text-neutral-500 dark:bg-neutral-800">
								<CornerDownLeftIcon size={12} />
							</div>
							<span className="text-muted-foreground text-xs">Open result</span>
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
			<Icon icon={Search02Icon} size={14} />
			<CommandIcon size={14} /> K
		</span>
	);
}
