"use client";

import { ChartRelationshipIcon, Tag01Icon } from "@hugeicons/core-free-icons";
import type { PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { ClickableBadge } from "~/components/pages/pattern/clickable-badge";
import {
	BadgeGroup,
	BadgeGroupContainer,
} from "~/components/shared/badge-group";
import { Icon } from "~/components/shared/icon";
import { ThemeMiniBadge } from "~/components/shared/theme-mini-badge";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { Language } from "~/i18n/config";
import { buildLocaleHref, parseLocalePath } from "~/lib/locale-path";
import { getPatternIconWithMapping } from "~/lib/pattern-icons";
import {
	getMatchExplanation,
	highlightMatches,
	processDescriptionForDisplay,
} from "~/lib/search-utils";
import { cn } from "~/lib/utils";
import type { PATTERN_UTILITIES_QUERYResult } from "~/sanity/sanity.types";
import type { SearchPattern } from "~/types/search";

type BadgeConfig = {
	type: "theme" | "audience" | "tag";
	items: Array<{ _id: string; title: string | null }>;
	variant: "theme" | "audience" | "tag";
	getIcon: (item: { title: string | null }) => React.ReactNode;
};

type SearchResultItemProps = {
	pattern: SearchPattern;
	searchTerm?: string;
	showPatternIcon?: boolean;
	patternUtilities?: PATTERN_UTILITIES_QUERYResult | null;
};

function PatternIcon({
	icon,
	className,
	isPatternsPage = false,
}: {
	icon: React.ComponentType<React.ComponentPropsWithoutRef<"svg">>;
	className?: string;
	isPatternsPage?: boolean;
}) {
	return (
		<div
			className={cn(
				"shrink-0 text-neutral-500",
				isPatternsPage ? "h-5 w-5" : "h-4 w-4",
				className,
			)}
		>
			{React.createElement(icon, {
				className: "h-full w-full fill-icon/40 text-icon/70 opacity-40",
			})}
		</div>
	);
}

function SearchResultBase({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative min-h-[220px] w-full border-neutral-300 border-t border-dashed py-4 pb-6">
			<div className="flex flex-col">
				<div className="w-full space-y-4">{children}</div>
			</div>
		</div>
	);
}

function ResultTitle({
	title,
	href,
	showPatternIcon,
	icon,
	isPatternsPage = false,
	language,
	visitPatternButtonLabel,
}: {
	title: string;
	href: string;
	showPatternIcon: boolean;
	icon?: React.ComponentType<React.ComponentPropsWithoutRef<"svg">>;
	isPatternsPage?: boolean;
	language: Language;
	visitPatternButtonLabel?: string | null;
}) {
	const buttonText =
		visitPatternButtonLabel ??
		(language === "es" ? "Patrón de visitas" : "Visit pattern");

	return (
		<div className="inline-flex w-full items-start justify-between gap-6">
			<div className="inline-flex flex-1 items-baseline justify-start gap-4">
				{showPatternIcon && icon && (
					<PatternIcon icon={icon} isPatternsPage={isPatternsPage} />
				)}
				<Link href={href} className="inline-flex items-start gap-3">
					<h3
						className={cn(
							"line-clamp-3 text-left font-light text-primary leading-tight",
							isPatternsPage ? "text-2xl md:text-3xl" : "text-xl md:text-2xl",
						)}
					>
						{title}
					</h3>
				</Link>
			</div>
			<Button
				variant="pattern"
				size="sm"
				asChild
				className="text-xs lg:text-sm"
			>
				<Link href={href}>{buttonText}</Link>
			</Button>
		</div>
	);
}

function ResultDescription({
	text,
	searchTerm,
	matchExplanation,
	matchCount,
}: {
	text: string;
	searchTerm?: string;
	matchExplanation: { titleMatch: boolean; descriptionMatch: boolean };
	matchCount: number;
}) {
	if (!text) return null;

	const hasMatches =
		matchExplanation.titleMatch || matchExplanation.descriptionMatch;

	return (
		<div className="mb-4">
			<div className="relative line-clamp-3 overflow-hidden">
				<span className="block font-light text-base text-description-muted md:text-xl dark:text-foreground">
					{renderHighlightedText(text, searchTerm || "")}
				</span>
			</div>

			{searchTerm && hasMatches && (
				<MatchIndicator
					titleMatch={matchExplanation.titleMatch}
					descriptionMatch={matchExplanation.descriptionMatch}
					matchCount={matchCount}
				/>
			)}
		</div>
	);
}

function MatchIndicator({
	titleMatch,
	descriptionMatch,
	matchCount,
}: {
	titleMatch: boolean;
	descriptionMatch: boolean;
	matchCount: number;
}) {
	const matchParts = [
		titleMatch && "Title",
		descriptionMatch && "Description",
	].filter(Boolean);

	return (
		<div className="mt-2 flex items-center gap-1 text-minor">
			<span>Match found in</span>
			<span>{matchParts.join(" and ")}</span>
			{matchCount > 1 && <span>({matchCount} matches)</span>}
		</div>
	);
}

function BadgeGroupRenderer({ config }: { config: BadgeConfig }) {
	if (config.items.length === 0) return null;

	return (
		<BadgeGroup>
			{config.items.map((item) => (
				<Badge
					key={item._id}
					variant={config.variant}
					className="cursor-pointer capitalize"
					asChild
				>
					<ClickableBadge
						type={config.type}
						id={item._id}
						title={item.title || undefined}
						icon={config.getIcon(item)}
					>
						{item.title}
					</ClickableBadge>
				</Badge>
			))}
		</BadgeGroup>
	);
}

export function SearchResultItem({
	pattern,
	searchTerm = "",
	showPatternIcon = false,
	patternUtilities,
}: SearchResultItemProps) {
	const pathname = usePathname();
	const { normalizedPath, language } = parseLocalePath(pathname);
	const isPatternsPage = normalizedPath === "/patterns";
	const title = pattern.title || "Untitled Pattern";
	const rawDescription = pattern.description || [];
	const slug = pattern.slug || "";
	const patternHref = buildLocaleHref(language, `/pattern/${slug}`);

	const PatternIconComponent = getPatternIconWithMapping(pattern.slug || "");

	const descriptionResult = processDescriptionForDisplay(
		rawDescription as PortableTextBlock[],
		searchTerm,
		200,
	);

	const matchExplanation = getMatchExplanation(
		title,
		rawDescription as PortableTextBlock[],
		searchTerm,
	);

	const badgeConfigs: BadgeConfig[] = [
		{
			type: "theme",
			items: pattern.theme ? [pattern.theme] : [],
			variant: "theme",
			getIcon: () => (
				<ThemeMiniBadge label={patternUtilities?.themeMiniBadgeLabel} />
			),
		},
		{
			type: "audience",
			items: pattern.audiences || [],
			variant: "audience",
			getIcon: () => (
				<Icon icon={ChartRelationshipIcon} className="h-3.5 w-3.5 capitalize" />
			),
		},
		{
			type: "tag",
			items: pattern.tags || [],
			variant: "tag",
			getIcon: () => (
				<Icon icon={Tag01Icon} className="h-3.5 w-3.5 capitalize" />
			),
		},
	];

	return (
		<SearchResultBase>
			<ResultTitle
				title={title}
				href={patternHref}
				showPatternIcon={showPatternIcon}
				icon={PatternIconComponent}
				isPatternsPage={isPatternsPage}
				language={language}
				visitPatternButtonLabel={patternUtilities?.visitPatternButtonLabel}
			/>

			<ResultDescription
				text={descriptionResult.text}
				searchTerm={searchTerm}
				matchExplanation={matchExplanation}
				matchCount={descriptionResult.matchCount}
			/>

			{!isPatternsPage && (
				<BadgeGroupContainer>
					{badgeConfigs.map((config) => (
						<BadgeGroupRenderer key={config.type} config={config} />
					))}
				</BadgeGroupContainer>
			)}
		</SearchResultBase>
	);
}

function renderHighlightedText(text: string, searchTerm: string) {
	if (!searchTerm.trim()) return text;

	const highlighted = highlightMatches(text, searchTerm);
	const parts = highlighted.split(
		/(<mark class="bg-yellow-200 rounded-sm">|<\/mark>)/g,
	);

	let isHighlight = false;
	let highlightBuffer = "";
	let keyCounter = 0;

	return parts.reduce<React.ReactNode[]>((acc, part) => {
		if (part === '<mark class="bg-yellow-200 rounded-sm">') {
			isHighlight = true;
			highlightBuffer = "";
		} else if (part === "</mark>") {
			if (isHighlight && highlightBuffer) {
				acc.push(
					<mark key={`h-${keyCounter++}`} className="rounded-sm bg-yellow-200">
						{highlightBuffer}
					</mark>,
				);
			}
			isHighlight = false;
			highlightBuffer = "";
		} else if (isHighlight) {
			highlightBuffer += part;
		} else if (part) {
			acc.push(<span key={`t-${keyCounter++}`}>{part}</span>);
		}
		return acc;
	}, []);
}
