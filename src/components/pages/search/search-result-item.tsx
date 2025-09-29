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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { getPatternIconWithMapping } from "~/lib/pattern-icons";
import {
	getMatchExplanation,
	highlightMatches,
	processDescriptionForDisplay,
} from "~/lib/search-utils";
import { cn } from "~/lib/utils";
import type { PatternDescription } from "~/sanity/lib/types";

// Use the centralized Sanity field types
type SanityBlockContent = PatternDescription;

type SearchResultItemProps = {
	pattern: {
		_id: string;
		_type: "pattern";
		_score?: number;
		title: string | null;
		description: SanityBlockContent | null;
		slug: string | null;
		tags?: Array<{
			_id: string;
			title?: string;
		}> | null;
		audiences?: Array<{
			_id: string;
			title: string | null;
		}> | null;
		theme?: {
			_id: string;
			title: string | null;
			description?: Array<unknown> | null;
		} | null;
		solutions?: Array<{
			_id: string;
			title?: string;
			description?: Array<unknown>;
		}> | null;
		resources?: Array<{
			_id: string;
			title?: string;
			description?: Array<unknown>;
			solutions?: Array<{
				_id: string;
				title?: string;
			}> | null;
		}> | null;
	};
	searchTerm?: string;
	showPatternIcon?: boolean;
};

// Shared base layout component
function SearchResultBase({ children }: { children: React.ReactNode }) {
	return (
		<div
			className={cn(
				"relative max-h-[280px] min-h-[160px] w-full overflow-hidden border-dashed-brand-t pb-0 lg:min-h-[220px]",
			)}
		>
			<div className="flex flex-col py-4">
				<div className="w-full space-y-0">{children}</div>
			</div>
		</div>
	);
}

// Pattern Search Result Component
function PatternSearchResult({
	pattern,
	searchTerm = "",
	showPatternIcon = false,
}: {
	pattern: SearchResultItemProps["pattern"];
	searchTerm?: string;
	showPatternIcon?: boolean;
}) {
	const pathname = usePathname();
	const title = pattern.title || "Untitled Pattern";
	const theme = pattern.theme;
	const tags = pattern.tags || [];
	const audiences = pattern.audiences || [];
	const rawDescription = pattern.description || [];

	// Hide tags and audiences on /patterns page
	const isPatternsPage = pathname === "/patterns";

	// Get the pattern-specific icon
	const PatternIcon = getPatternIconWithMapping(pattern.slug || "");

	// Process description for display (handles both search context and first sentence)
	const descriptionResult = processDescriptionForDisplay(
		rawDescription as PortableTextBlock[],
		searchTerm,
		200,
	);

	const displayDescription = descriptionResult.text;

	// Check where matches occur
	const matchExplanation = getMatchExplanation(
		title,
		rawDescription as PortableTextBlock[],
		searchTerm,
	);

	return (
		<SearchResultBase>
			{/* Title with Pattern Icon and Visit Button */}
			<div className="mb-4">
				<div className="flex items-start justify-start gap-3 lg:gap-6">
					{showPatternIcon && PatternIcon && (
						<div className="mt-1 flex h-5 w-5 flex-shrink-0 text-neutral-500 lg:mt-2 lg:h-6 lg:w-6">
							{React.createElement(PatternIcon, {
								className: "h-full w-full fill-icon/40 text-icon/70 opacity-40",
							})}
						</div>
					)}
					<div className="inline-flex w-full items-start justify-between gap-6">
						<Link
							href={`/pattern/${pattern.slug}`}
							className="inline-flex flex-1 items-start justify-start gap-3"
						>
							<h3
								className={cn(
									"line-clamp-2 text-left font-light text-lg text-primary leading-tight md:text-xl",
									isPatternsPage && "md:text-3xl",
								)}
							>
								{title}
							</h3>
						</Link>
						<Button
							variant="pattern"
							size="sm"
							asChild
							className="text-xs lg:text-sm"
						>
							<Link href={`/pattern/${pattern.slug}`}>Visit pattern</Link>
						</Button>
					</div>
				</div>
			</div>

			{/* Description with Search Context */}
			{descriptionResult.text && (
				<div className="mb-4">
					<div
						className={cn(
							"relative overflow-hidden",
							descriptionResult.displayType === "search-context"
								? "line-clamp-3"
								: "line-clamp-2",
						)}
					>
						<span className="block font-light text-description-muted text-sm md:text-lg dark:text-foreground">
							{renderHighlightedText(displayDescription, searchTerm)}
						</span>
					</div>

					{/* Match Indicators */}
					{searchTerm &&
						(matchExplanation.titleMatch ||
							matchExplanation.descriptionMatch) && (
							<div className="mt-2 flex items-center gap-1 text-minor">
								<span className="text-minor">Match found in</span>
								{matchExplanation.titleMatch && (
									<span className="text-minor">Title</span>
								)}
								{matchExplanation.titleMatch &&
									matchExplanation.descriptionMatch && (
										<span className="text-minor">and</span>
									)}
								{matchExplanation.descriptionMatch && (
									<span className="text-minor">Description</span>
								)}
								{descriptionResult.matchCount > 1 && (
									<span className="text-minor">
										({descriptionResult.matchCount} matches)
									</span>
								)}
							</div>
						)}
				</div>
			)}

			{/* Badges Groups */}
			<BadgeGroupContainer>
				{/* Theme Badges */}
				{!isPatternsPage && theme && (
					<BadgeGroup>
						<ClickableBadge
							type="theme"
							id={theme._id}
							title={theme.title || undefined}
						>
							<Badge
								variant="theme"
								icon={<ThemeMiniBadge />}
								className="cursor-pointer capitalize"
							>
								{theme.title}
							</Badge>
						</ClickableBadge>
					</BadgeGroup>
				)}

				{/* Audience Badges - Hidden on /patterns page */}
				{!isPatternsPage && audiences.length > 0 && (
					<BadgeGroup>
						{audiences.map((audience) => (
							<ClickableBadge
								key={audience._id}
								type="audience"
								id={audience._id}
								title={audience.title || undefined}
							>
								<Badge
									variant="audience"
									className="cursor-pointer"
									icon={
										<Icon
											icon={ChartRelationshipIcon}
											className="h-3.5 w-3.5 capitalize"
										/>
									}
								>
									{audience.title}
								</Badge>
							</ClickableBadge>
						))}
					</BadgeGroup>
				)}

				{/* Tag Badges - Hidden on /patterns page */}
				{!isPatternsPage && tags.length > 0 && (
					<BadgeGroup>
						{tags.map((tag) => (
							<ClickableBadge
								key={tag._id}
								type="tag"
								id={tag._id}
								title={tag.title || undefined}
							>
								<Badge
									variant="tag"
									className="cursor-pointer"
									icon={
										<Icon icon={Tag01Icon} className="h-3.5 w-3.5 capitalize" />
									}
								>
									{tag.title}
								</Badge>
							</ClickableBadge>
						))}
					</BadgeGroup>
				)}
			</BadgeGroupContainer>
		</SearchResultBase>
	);
}

// Main component that routes to the appropriate sub-component
export function SearchResultItem({
	pattern,
	searchTerm,
	showPatternIcon,
}: SearchResultItemProps) {
	// Since we only handle patterns with _type: "pattern", we only handle that case
	return (
		<PatternSearchResult
			pattern={pattern}
			searchTerm={searchTerm}
			showPatternIcon={showPatternIcon}
		/>
	);
}

function renderHighlightedText(text: string, searchTerm: string) {
	if (!searchTerm.trim()) return text;
	const highlighted = highlightMatches(text, searchTerm);
	const parts = highlighted.split(
		/(<mark class="bg-yellow-200 rounded-sm">|<\/mark>)/g,
	);
	const result: React.ReactNode[] = [];
	let inMark = false;
	let markBuffer = "";
	let markKey = 0;
	let textKey = 0;
	for (const part of parts) {
		if (part === '<mark class="bg-yellow-200 rounded-sm">') {
			inMark = true;
			markBuffer = "";
		} else if (part === "</mark>") {
			if (inMark) {
				result.push(
					<mark
						key={`highlight-${markKey++}`}
						className="rounded-sm bg-yellow-200"
					>
						{markBuffer}
					</mark>,
				);
				markBuffer = "";
				inMark = false;
			}
		} else if (inMark) {
			markBuffer += part;
		} else {
			result.push(<span key={`text-${textKey++}`}>{part}</span>);
		}
	}
	return result;
}

// Theme Mini Badge Component
function ThemeMiniBadge() {
	return (
		<div className="flex h-[16px] items-center justify-center rounded border border-[var(--theme-mini-icon-border)] px-1 py-0 md:h-[18px] md:px-1.5">
			<span className="font-normal text-[10px] text-[var(--theme-badge-text)] tracking-tighter md:text-[12px]">
				Theme
			</span>
		</div>
	);
}
