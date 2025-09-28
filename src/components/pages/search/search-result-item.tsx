"use client";

import { ChartRelationshipIcon, Tag01Icon } from "@hugeicons/core-free-icons";
import type { PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
	BadgeGroup,
	BadgeGroupContainer,
} from "~/components/shared/badge-group";
import { Icon } from "~/components/shared/icon";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { getPatternIconWithMapping } from "~/lib/pattern-icons";
import {
	extractFirstSentence,
	extractTextFromPortableText,
	getMatchExplanation,
	highlightMatches,
	truncateWithContext,
} from "~/lib/search-utils";
import { cn } from "~/lib/utils";
import type { PatternDescription } from "~/sanity/lib/types";
import { SearchResultPreview } from "./search-result-preview";

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
function SearchResultBase({
	children,
	title,
	titleElement,
	showPatternIcon = false,
	patternIcon,
	isPatternsPage = false,
}: {
	children: React.ReactNode;
	title: string;
	titleElement?: React.ReactNode;
	showPatternIcon?: boolean;
	patternIcon?: React.ComponentType<React.ComponentPropsWithoutRef<"svg">>;
	isPatternsPage?: boolean;
}) {
	return (
		<div
			className={cn(
				"relative h-[200px] w-full border-dashed-brand-b pb-0",
				isPatternsPage && "group",
			)}
		>
			<div className="flex flex-col py-4">
				<div className="mb-4">
					{titleElement ? (
						titleElement
					) : (
						<div className="flex items-start gap-6">
							{showPatternIcon && patternIcon && (
								<div className="h-6 w-6 flex-shrink-0 text-neutral-500">
									{React.createElement(patternIcon, {
										className:
											"h-full w-full fill-icon/40 text-icon/70 opacity-40",
									})}
								</div>
							)}
							<h3 className="w-full text-left font-light text-lg text-primary capitalize leading-tight md:text-2xl">
								{title}
							</h3>
						</div>
					)}
				</div>
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
	const [showFullDescription, setShowFullDescription] = useState(false);
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

	// Process description for search context
	const fullDescriptionText = extractTextFromPortableText(
		rawDescription as PortableTextBlock[],
	);

	// On patterns page, show only first sentence; otherwise use normal truncation
	const descriptionResult = isPatternsPage
		? {
				text: extractFirstSentence(fullDescriptionText),
				isTruncated: false,
				hasMatch: false,
				matchCount: 0,
			}
		: truncateWithContext(fullDescriptionText, searchTerm, 200);

	const displayDescription = showFullDescription
		? fullDescriptionText
		: descriptionResult.text;

	// Check where matches occur
	const matchExplanation = getMatchExplanation(
		title,
		rawDescription as PortableTextBlock[],
		searchTerm,
	);

	// Create clickable title element using Next.js Link
	const titleElement = (
		<div className="flex items-start gap-6">
			{showPatternIcon && PatternIcon && (
				<div className="mt-2 flex h-6 w-6 flex-shrink-0 text-neutral-500">
					{React.createElement(PatternIcon, {
						className: "h-full w-full fill-icon/40 text-icon/70 opacity-40",
					})}
				</div>
			)}
			<div className="inline-flex w-full justify-between">
				<Link
					href={`/pattern/${pattern.slug}`}
					className="inline-flex flex-1 items-start justify-start gap-3"
				>
					<h3 className="line-clamp-2 text-left font-light text-lg text-neutral capitalize leading-tight md:text-3xl">
						{title}
					</h3>
				</Link>
				<Button variant="pattern" size="sm" asChild className="text-sm">
					<Link href={`/pattern/${pattern.slug}`}>Visit pattern</Link>
				</Button>
			</div>
		</div>
	);

	return (
		<SearchResultPreview description={displayDescription} patternTitle={title}>
			<SearchResultBase
				title={title}
				titleElement={titleElement}
				showPatternIcon={showPatternIcon}
				patternIcon={PatternIcon}
				isPatternsPage={isPatternsPage}
			>
				{/* Description with Search Context */}
				{descriptionResult.text && (
					<div className="mb-4">
						<div className="relative line-clamp-3 overflow-hidden">
							<span className="block font-light text-neutral-500 text-xl dark:text-foreground">
								{renderHighlightedText(displayDescription, searchTerm)}
							</span>
						</div>

						{/* Match Indicators */}
						{searchTerm &&
							(matchExplanation.titleMatch ||
								matchExplanation.descriptionMatch) && (
								<div className="mt-2 flex items-center gap-2 text-body-muted">
									<span className="text-minor">Match found in</span>
									{matchExplanation.titleMatch && (
										<span className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-2.5 pt-0.5 pb-1 align-middle text-blue-700 leading-[0.9] no-underline">
											Title
										</span>
									)}
									{matchExplanation.descriptionMatch && (
										<span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2.5 pt-0.5 pb-1 align-middle text-green-700 leading-[0.9] no-underline">
											Description
										</span>
									)}
									{descriptionResult.matchCount > 1 && (
										<span className="text-body-muted">
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
							<Badge
								variant="theme"
								icon={<ThemeMiniBadge />}
								className="capitalize"
							>
								{theme.title}
							</Badge>
						</BadgeGroup>
					)}

					{/* Audience Badges - Hidden on /patterns page */}
					{!isPatternsPage && audiences.length > 0 && (
						<BadgeGroup>
							{audiences.map((audience) => (
								<Badge
									key={audience._id}
									variant="audience"
									icon={
										<Icon
											icon={ChartRelationshipIcon}
											className="h-3.5 w-3.5 capitalize"
										/>
									}
								>
									{audience.title}
								</Badge>
							))}
						</BadgeGroup>
					)}

					{/* Tag Badges - Hidden on /patterns page */}
					{!isPatternsPage && tags.length > 0 && (
						<BadgeGroup>
							{tags.map((tag) => (
								<Badge
									key={tag._id}
									variant="tag"
									icon={
										<Icon icon={Tag01Icon} className="h-3.5 w-3.5 capitalize" />
									}
								>
									{tag.title}
								</Badge>
							))}
						</BadgeGroup>
					)}
				</BadgeGroupContainer>
			</SearchResultBase>
		</SearchResultPreview>
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
