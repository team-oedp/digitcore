"use client";

import { Backpack03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname } from "next/navigation";
import type { PortableTextBlock } from "next-sanity";

import CustomPortableText from "./portable-text";

interface PageHeaderProps {
	title?: string;
	description?: string | PortableTextBlock[];
	slug?: string;
}

export function PageHeader({ title, description, slug }: PageHeaderProps) {
	const pathname = usePathname();

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

	return (
		<header className="max-w-4xl space-y-5">
			<h1 className="font-light text-[32px] text-primary capitalize">
				{pageTitle}
			</h1>
			{isPatternPage && (
				<button
					type="button"
					className="flex items-center gap-2.5 rounded-lg border border-border bg-white px-[7px] py-1 transition-colors hover:bg-secondary"
				>
					<span className="font-normal text-[12px] text-primary uppercase leading-[20px]">
						Add to Carrier Bag
					</span>
					<HugeiconsIcon
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
