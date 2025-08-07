"use client";

import { Backpack03Icon } from "@hugeicons/core-free-icons";
import type { PortableTextBlock } from "next-sanity";
import { usePathname } from "next/navigation";
import type { Pattern } from "~/sanity/sanity.types";
import { useCarrierBagStore } from "~/stores/carrier-bag";

import { Icon } from "./icon";
import { CustomPortableText } from "./portable-text";

type PageHeaderProps = {
	title?: string;
	description?: string | PortableTextBlock[];
	slug?: string;
	pattern?: Pattern;
};

export function PageHeader({
	title,
	description,
	slug,
	pattern,
}: PageHeaderProps) {
	const pathname = usePathname();
	const { addPattern, hasPattern, setOpen, isHydrated } = useCarrierBagStore();

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

	const handleSaveToCarrierBag = () => {
		if (pattern) {
			addPattern(pattern);
			setOpen(true); // Open the carrier bag sidebar to show the added item
		}
	};

	// Only check if pattern is in bag after hydration to avoid server/client mismatch
	const isPatternInBag =
		isHydrated && pattern ? hasPattern(pattern._id) : false;

	return (
		<header className="max-w-4xl space-y-5">
			<h1 className="font-light text-[32px] text-primary capitalize">
				{pageTitle}
			</h1>
			{isPatternPage && pattern && (
				<button
					type="button"
					className={`flex items-center gap-2.5 rounded-lg border border-border px-[7px] py-1 transition-colors ${
						!isHydrated
							? "cursor-pointer bg-white hover:bg-secondary"
							: isPatternInBag
								? "cursor-default border-green-200 bg-green-50"
								: "cursor-pointer bg-white hover:bg-secondary"
					}`}
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
				<div className="text-primary text-sm">
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
		</header>
	);
}
