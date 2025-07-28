import { usePathname, useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";

import { useTheme } from "next-themes";

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

type ItemProps = {
	heading: string;
	group: {
		title: string;
		icon: React.ReactNode;
		slug: string;
		isNew?: boolean;
		shortcut?: string;
	}[];
};

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

	const ITEMS: ItemProps[] = [
		{
			heading: "Suggestions",
			group: [
				{
					title: "Home",
					icon: <div style={{ width: 22, height: 22 }} />,
					slug: "/",
					shortcut: "h",
				},
				{
					title: "Updates",
					icon: <div style={{ width: 22, height: 22 }} />,
					slug: "/updates",
					shortcut: "u",
				},
			],
		},
		{
			heading: "Get Started",
			group: [
				{
					title: "Installation",
					icon: <div style={{ width: 22, height: 22 }} />,
					slug: "/ui/installation",
					shortcut: "i",
				},
				{
					title: "CLI",
					icon: <div style={{ width: 22, height: 22 }} />,
					slug: "/ui/cli",
					shortcut: "j",
				},
			],
		},
		{
			heading: "Components",
			group: [
				{
					title: "Accordion",
					slug: "/ui/accordion",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Animated Tabs",
					slug: "/ui/animated-tabs",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Avatar",
					slug: "/ui/avatar",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Badge",
					slug: "/ui/badge",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Button",
					slug: "/ui/button",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Card",
					slug: "/ui/card",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Checkbox",
					slug: "/ui/checkbox",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Dialog",
					slug: "/ui/dialog",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Dropdown Menu",
					slug: "/ui/dropdown-menu",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Input",
					slug: "/ui/input",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Input OTP",
					slug: "/ui/input-otp",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Multi Step Modal",
					slug: "/ui/multi-step-modal",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Navigation Menu",
					slug: "/ui/navigation-menu",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Spinner",
					slug: "/ui/spinner",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Switch",
					slug: "/ui/switch",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Text",
					slug: "/ui/text",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
				{
					title: "Tooltip",
					slug: "/ui/tooltip",
					icon: <div style={{ width: 22, height: 22 }} />,
				},
			],
		},
	];

	const getCurrentPageLabel = () => {
		if (pathname === "/") return "Home";
		if (pathname === "/faq") return "FAQ";
		if (pathname === "/search") return "Search";
		if (pathname === "/tags") return "Tags";
		if (pathname === "/values") return "Values";
		if (pathname === "/glossary") return "Glossary";
		if (pathname === "/onboarding") return "Onboarding";
		if (pathname === "/carrier-bag") return "Carrier Bag";
		if (pathname.startsWith("/pattern/")) return "Pattern";
		return pathname.split("/").pop() || "Unknown";
	};

	const isApp = pathname === "/" || pathname.startsWith("/updates");
	const isHomePage = pathname === "/";
	const uiPage = pathname.startsWith("/ui");

	const category = isApp ? "App" : "Docs";

	let currentPage = "";
	let subCategory = "";

	if (uiPage) {
		const pathParts = pathname.split("/").filter(Boolean);

		if (pathParts.length >= 2) {
			const isComponentPage = ITEMS.some(
				(item) =>
					item.heading === "Components" &&
					item.group.some((group) => group.slug === pathname),
			);

			if (isComponentPage) {
				subCategory = "Components";
				currentPage = pathParts[1]?.replace(/-/g, " ") ?? "";
			}

			if (pathParts[1] === "installation") {
				subCategory = "Installation";
				currentPage = pathParts[2] ? pathParts[2].replace(/-/g, " ") : "";
			}

			if (!isComponentPage && pathParts[1] !== "installation") {
				currentPage = pathParts[1]?.replace(/-/g, " ") ?? "";
			}
		}
	}

	if (isHomePage) {
		currentPage = "Home";
	}

	if (!uiPage && !isHomePage) {
		currentPage = pathname.split("/")[1] ?? "";
	}

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
					"group relative flex items-center rounded-md border border-border px-2 py-0.5 dark:border-border/50",
					"bg-background outline-none duration-150 ease-linear hover:bg-main-foreground/40 focus-visible:ring-1 focus-visible:ring-neutral-300/80 dark:focus-visible:ring-neutral-800 dark:hover:border-white/10 dark:hover:bg-main-foreground/20",
				)}
			>
				<CommandMenuIcon />
			</button>
			<CommandDialog open={isOpen} onOpenChange={setIsOpen}>
				<div className="flex items-center gap-1.5 pt-3 pl-4">
					<div className="flex h-6 w-fit items-center justify-center rounded-md bg-neutral-200 px-2 dark:bg-neutral-900">
						<span className="font-[460] text-[13px] text-foreground capitalize">
							{category}
						</span>
					</div>
					{subCategory && (
						<div className="flex h-6 w-fit items-center justify-center rounded-md bg-neutral-200 px-2 dark:bg-neutral-900">
							<span className="font-[460] text-[13px] text-foreground capitalize">
								{subCategory}
							</span>
						</div>
					)}
					{currentPage && (
						<div className="flex h-6 w-fit items-center justify-center rounded-md bg-neutral-200 px-2 dark:bg-neutral-900">
							<span
								className={cn(
									"font-[460] text-[13px] text-foreground",
									currentPage === "cli" ? "uppercase" : "capitalize",
								)}
							>
								{currentPage}
							</span>
						</div>
					)}
				</div>
				<CommandInput placeholder="What are you searching for?" />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<div className="space-y-1.5 pt-1 pb-1.5">
						{ITEMS.map(({ heading, group }) => (
							<CommandGroup key={heading} heading={heading}>
								{group.map(({ title, slug, icon, shortcut }) => (
									<CommandMenuItem
										key={title}
										icon={icon}
										setIsOpen={setIsOpen}
										onSelect={() => {
											router.push(slug);
											setIsOpen(false);
										}}
										onAction={() => router.push(slug)}
										shortcut={shortcut}
									>
										{title}
									</CommandMenuItem>
								))}
							</CommandGroup>
						))}
					</div>
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
		<span className={cn("text-primary text-sm", "flex items-center gap-0.5")}>
			<CommandIcon size={14} /> K
		</span>
	);
}
