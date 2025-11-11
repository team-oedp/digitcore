"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, forwardRef } from "react";
import {
	getAudienceNavigationUrl,
	getTagNavigationUrl,
	getThemeNavigationUrl,
} from "~/lib/badge-navigation";
import { buildLocaleHref, parseLocalePath } from "~/lib/locale-path";

type ClickableBadgeProps = {
	children: ReactNode;
	type: "tag" | "audience" | "theme";
	id: string;
	title?: string;
	className?: string;
	icon?: ReactNode;
};

/**
 * Wrapper component that makes pattern page badges clickable
 * Maintains the existing visual design while adding navigation functionality
 * Forwards refs and merges classNames for use with Radix Slot (asChild)
 */
export const ClickableBadge = forwardRef<
	HTMLAnchorElement,
	ClickableBadgeProps
>(({ children, type, id, title, className = "", icon, ...props }, ref) => {
	const pathname = usePathname();
	const { language } = parseLocalePath(pathname);

	// Generate the appropriate URL based on badge type
	const getNavigationUrl = (): string => {
		switch (type) {
			case "tag":
				return title ? getTagNavigationUrl(title) : "/page/tags";
			case "audience":
				return getAudienceNavigationUrl(id);
			case "theme":
				return getThemeNavigationUrl(id);
			default:
				return "/";
		}
	};

	const navigationUrl = buildLocaleHref(language, getNavigationUrl());

	return (
		<Link
			ref={ref}
			href={navigationUrl}
			className={className}
			aria-label={`Navigate to ${type}: ${title || id}`}
			data-testid={`clickable-badge-${type}`}
			data-type={type}
			data-id={id}
			{...(title && { "data-title": title })}
			{...props}
		>
			{icon && <span className="flex-shrink-0">{icon}</span>}
			{children}
		</Link>
	);
});

ClickableBadge.displayName = "ClickableBadge";
