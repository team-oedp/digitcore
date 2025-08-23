"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
	getAudienceNavigationUrl,
	getTagNavigationUrl,
	getThemeNavigationUrl,
} from "~/lib/badge-navigation";

type ClickableBadgeProps = {
	children: ReactNode;
	type: "tag" | "audience" | "theme";
	id: string;
	title?: string;
	className?: string;
};

/**
 * Wrapper component that makes pattern page badges clickable
 * Maintains the existing visual design while adding navigation functionality
 */
export function ClickableBadge({
	children,
	type,
	id,
	title,
	className = "",
}: ClickableBadgeProps) {
	// Generate the appropriate URL based on badge type
	const getNavigationUrl = (): string => {
		switch (type) {
			case "tag":
				return title ? getTagNavigationUrl(title) : "/tags";
			case "audience":
				return getAudienceNavigationUrl(id);
			case "theme":
				return getThemeNavigationUrl(id);
			default:
				return "/";
		}
	};

	const navigationUrl = getNavigationUrl();

	return (
		<Link
			href={navigationUrl}
			className={`inline-flex transition-all duration-200 ${className}`}
			aria-label={`Navigate to ${type}: ${title || id}`}
			data-testid={`clickable-badge-${type}`}
			data-type={type}
			data-id={id}
			{...(title && { "data-title": title })}
		>
			{children}
		</Link>
	);
}
