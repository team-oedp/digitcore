"use client";

import { Backpack03Icon } from "@hugeicons/core-free-icons";
import type { PortableTextBlock } from "next-sanity";
import { usePathname } from "next/navigation";
import { useSidebar } from "~/components/ui/sidebar";
import type { Pattern } from "~/sanity/sanity.types";
import { useCarrierBagStore } from "~/stores/carrier-bag";
import { getPatternIconWithMapping } from "~/utils/pattern-icons";

import { CustomPortableText } from "~/components/global/custom-portable-text";
import { cn } from "~/lib/utils";
import { Icon } from "./icon";

type PageHeaderProps = {
	title?: string;
	description?: string | PortableTextBlock[];
	slug?: string;
	pattern?: Pattern;
	withIndent?: boolean;
};

export function PageHeader({
	title,
	description,
	slug,
	pattern,
	withIndent = true,
}: PageHeaderProps) {
	const pathname = usePathname();
	const { addPattern, hasPattern, setOpen, isHydrated } = useCarrierBagStore();
	const { isMobile, setOpen: setUISidebarOpen, setOpenMobile } = useSidebar();

	const pageTitle = (() => {
		if (title) return title;
		if (slug) return slug.replace(/-/g, " ");
		if (pathname === "/") return "Home";
		if (pathname === "/faq") return "FAQ";
		if (pathname === "/search") return "Search";
		if (pathname === "/tags") return "Tags";
		if (pathname === "/values") return "Values";
		if (pathname === "/glossary") return "Glossary";
		if (pathname === "/onboarding") return "Onboarding";
		if (pathname === "/carrier-bag") return "Carrier Bag";
		return pathname.split("/").pop() || "";
	})();

	const isPatternPage = pathname.startsWith("/pattern/");

	// Get the appropriate Digitcore icon for this pattern
	const PatternIcon =
		isPatternPage && slug ? getPatternIconWithMapping(slug) : null;

	const handleSaveToCarrierBag = () => {
		if (pattern) {
			addPattern(pattern);
			// Ensure the carrier bag UI is visible after saving
			if (isMobile) {
				setOpenMobile(true);
			} else {
				setUISidebarOpen(true);
			}
			// Also set the store open flag (used by modal mode)
			setOpen(true);
		}
	};

	// Only check if pattern is in bag after hydration to avoid server/client mismatch
	const isPatternInBag =
		isHydrated && pattern ? hasPattern(pattern._id) : false;

	return (
		<header id="page-header" className={cn("relative max-w-4xl")}>
			{PatternIcon && (
				<div className="absolute top-1 left-4 h-10 w-10 flex-shrink-0 lg:left-6">
					<PatternIcon className="h-full w-full fill-icon/50 text-icon/50" />
				</div>
			)}
			<div className={cn(withIndent && "lg:pl-25")}>
				<div className="flex items-center gap-3">
					<h1 className="font-light text-[32px] text-primary capitalize">
						{pageTitle}
					</h1>
				</div>
				{isPatternPage && pattern && (
					<button
						type="button"
						className={cn(
							"mt-5 flex items-center gap-2.5 rounded-lg border border-border px-[7px] py-1 transition-colors",
							!isHydrated
								? "cursor-pointer bg-white hover:bg-secondary"
								: isPatternInBag
									? "cursor-default border-green-200 bg-green-50"
									: "cursor-pointer bg-white hover:bg-secondary",
						)}
						onClick={isPatternInBag ? undefined : handleSaveToCarrierBag}
						disabled={isPatternInBag}
					>
						<span className="font-normal text-[12px] text-primary uppercase leading-[20px]">
							{!isHydrated
								? "Save to Carrier Bag"
								: isPatternInBag
									? "Saved to Carrier Bag"
									: "Save to Carrier Bag"}
						</span>
						<Icon
							icon={Backpack03Icon}
							size={14}
							color="#71717a"
							strokeWidth={1.5}
						/>
					</button>
				)}
				{description && (
					<div className="mt-5 text-primary text-sm">
						{typeof description === "string" ? (
							<p>{description}</p>
						) : (
							<CustomPortableText
								value={description}
								className="prose-sm prose-p:text-primary prose-p:text-sm"
							/>
						)}
					</div>
				)}
			</div>
		</header>
	);
}
