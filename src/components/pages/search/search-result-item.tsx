"use client";

import {
	ArrowRight02Icon,
	ChartRelationshipIcon,
	Tag01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import React, { useState } from "react";
import type { SearchPattern } from "~/app/actions/search";
import {
	BadgeGroup,
	BadgeGroupContainer,
} from "~/components/shared/badge-group";
import { Icon } from "~/components/shared/icon";
import { Badge } from "~/components/ui/badge";
import { getPatternIconWithMapping } from "~/lib/pattern-icons";
import {
	extractTextFromPortableText,
	getMatchExplanation,
	highlightMatches,
	truncateWithContext,
} from "~/lib/search-utils";
import { cn } from "~/lib/utils";
import { SearchResultPreview } from "./search-result-preview";

// Base search result type
type BaseSearchResultData = {
	_id: string;
	_type: string;
	title?: string | null;
	slug?: string | null;
	description?: Array<{
		children?: Array<{
			text?: string;
			_type: string;
			_key: string;
		}>;
		_type: string;
		_key: string;
	}> | null;
};

// Pattern-specific type - Updated to handle both search results and patterns page
type PatternSearchResultData = BaseSearchResultData & {
	_type: "pattern";
	descriptionPlainText?: string | null;
	theme?: {
		_id: string;
		title?: string;
		description?: Array<unknown>;
	} | null;
	tags?: Array<{
		_id: string;
		title?: string;
	}> | null;
	audiences?: Array<{
		_id: string;
		title: string | null;
	}> | null;
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
		solution?: Array<{
			_id: string;
			title?: string;
		}> | null;
	}> | null;
};

// Resource-specific type
type ResourceSearchResultData = BaseSearchResultData & {
	_type: "resource";
	solutions?: Array<{
		_id: string;
		title?: string;
	}> | null;
	pattern?: {
		_id: string;
		title?: string;
		slug?: string;
	} | null;
};

// Solution-specific type
type SolutionSearchResultData = BaseSearchResultData & {
	_type: "solution";
	audiences?: Array<{
		_id: string;
		title?: string;
	}> | null;
	pattern?: {
		_id: string;
		title?: string;
		slug?: string;
	} | null;
};

type SearchResultItemProps = {
	pattern:
		| SearchPattern
		| PatternSearchResultData
		| ResourceSearchResultData
		| SolutionSearchResultData;
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
}: {
	children: React.ReactNode;
	title: string;
	titleElement?: React.ReactNode;
	showPatternIcon?: boolean;
	patternIcon?: React.ComponentType<React.ComponentPropsWithoutRef<"svg">>;
}) {
	return (
		<div className="relative w-full border-neutral-400 border-t border-dashed pb-9">
			<div className="flex flex-col py-4">
				{/* Header with title */}
				<div className="mb-4">
					{titleElement ? (
						titleElement
					) : (
						<div className="flex items-start gap-3">
							{showPatternIcon && patternIcon && (
								<div className="h-6 w-6 flex-shrink-0 text-neutral-500">
									{React.createElement(patternIcon, {
										className:
											"h-full w-full fill-icon/40 text-icon/70 opacity-40",
									})}
								</div>
							)}
							<h3 className="w-full text-left font-normal text-lg text-primary uppercase leading-tight md:text-xl">
								{title}
							</h3>
						</div>
					)}
				</div>
				{/* Content area with full width */}
				<div className="w-full space-y-4">{children}</div>
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
	pattern: PatternSearchResultData;
	searchTerm?: string;
	showPatternIcon?: boolean;
}) {
	const [showFullDescription, setShowFullDescription] = useState(false);
	const title = pattern.title || "Untitled Pattern";
	const theme = pattern.theme;
	const tags = pattern.tags || [];
	const audiences = pattern.audiences || [];
	const rawDescription = pattern.description || [];

	// Get the pattern-specific icon
	const PatternIcon = getPatternIconWithMapping(pattern.slug || "");

	// Process description for search context
	const descriptionResult = truncateWithContext(
		extractTextFromPortableText(rawDescription),
		searchTerm,
		200,
	);
	const displayDescription = showFullDescription
		? extractTextFromPortableText(rawDescription)
		: descriptionResult.text;

	// Check where matches occur
	const matchExplanation = getMatchExplanation(
		title,
		rawDescription,
		searchTerm,
	);

	// Create clickable title element using Next.js Link
	const titleElement = (
		<div className="flex items-start gap-3">
			{showPatternIcon && PatternIcon && (
				<div className="h-6 w-6 flex-shrink-0 text-neutral-500">
					{React.createElement(PatternIcon, {
						className: "h-full w-full fill-icon/40 text-icon/70 opacity-40",
					})}
				</div>
			)}
			<Link
				href={`/pattern/${pattern.slug}`}
				className="group inline-flex items-start gap-3"
			>
				<h3 className="text-left font-normal text-lg text-primary uppercase leading-tight md:text-xl">
					{title}
				</h3>
				<span className="mt-0.5 inline-flex items-center rounded-full border-[0.75px] border-border bg-background px-2 py-0.5 font-normal text-[10px] text-muted-foreground uppercase transition-colors group-hover:border-primary/40 group-hover:bg-primary/5 group-hover:text-primary/80">
					View
				</span>
			</Link>
		</div>
	);

	return (
		<SearchResultPreview description={displayDescription} patternTitle={title}>
			<SearchResultBase
				title={title}
				titleElement={titleElement}
				showPatternIcon={showPatternIcon}
				patternIcon={PatternIcon}
			>
				{/* Description with Search Context */}
				{descriptionResult.text && (
					<div className="mb-4">
						{/* Smooth expand/collapse using CSS max-height + line clamp */}
						<div
							className={cn(
								"relative overflow-hidden transition-[max-height] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]",
								showFullDescription
									? "max-h-[1500px]"
									: "line-clamp-3 max-h-[96px]",
							)}
						>
							<span className="block text-description-muted">
								{renderHighlightedText(
									extractTextFromPortableText(rawDescription),
									searchTerm,
								)}
							</span>
						</div>

						{/* Show more/less button below description */}
						{descriptionResult.isTruncated && (
							<button
								onClick={() => setShowFullDescription(!showFullDescription)}
								type="button"
								aria-label={
									showFullDescription
										? "Collapse description"
										: "Expand description"
								}
								className="mt-3 inline-flex items-center text-neutral-600 text-xs uppercase transition-colors hover:text-neutral-800 focus:text-neutral-800 focus:outline-none"
							>
								{showFullDescription ? "Show less" : "Show more"}
							</button>
						)}

						{/* Match Indicators */}
						{searchTerm &&
							(matchExplanation.titleMatch ||
								matchExplanation.descriptionMatch) && (
								<div className="mt-2 flex items-center gap-2 text-description-muted">
									<span className="text-minor">Match found in:</span>
									{matchExplanation.titleMatch && (
										<span className="rounded bg-blue-100 px-2 py-1 text-blue-700">
											Title
										</span>
									)}
									{matchExplanation.descriptionMatch && (
										<span className="rounded bg-green-100 px-2 py-1 text-green-700">
											Description
										</span>
									)}
									{descriptionResult.matchCount > 1 && (
										<span className="text-description-muted">
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
					{theme && (
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

					{/* Audience Badges */}
					{audiences.length > 0 && (
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

					{/* Tag Badges */}
					{tags.length > 0 && (
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

// Resource Search Result Component
function _ResourceSearchResult({
	pattern,
	searchTerm = "",
}: {
	pattern: ResourceSearchResultData;
	searchTerm?: string;
}) {
	const title = pattern.title || "Untitled Resource";
	const solutions = pattern.solutions || [];
	const patternInfo = pattern.pattern;
	const description =
		pattern.description?.[0]?.children?.[0]?.text || "No description available";

	// Get the pattern-specific icon
	const PatternIcon = patternInfo
		? getPatternIconWithMapping(patternInfo.slug || "")
		: null;

	const buttonElement = (
		<a
			href={`/pattern/${patternInfo?.slug}/#resource-${pattern.slug}`}
			className="flex items-center gap-2 rounded-md border border-[var(--resource-button-border)] bg-[var(--resource-button-background)] px-2 py-1 text-[var(--resource-button-text)] transition-opacity hover:opacity-80 md:px-3 md:py-1"
		>
			<span className="font-normal text-xs uppercase">Visit Resource</span>
			{PatternIcon && (
				<PatternIcon className="h-3 w-3 text-[var(--resource-button-text)] opacity-40" />
			)}
		</a>
	);

	return (
		<SearchResultBase title={title}>
			{/* Solutions */}
			{solutions.length > 0 && (
				<BadgeGroup className="mb-3">
					{solutions.map((solution) => (
						<Badge
							key={solution._id}
							variant="solution"
							icon={
								<Icon icon={ChartRelationshipIcon} className="h-3.5 w-3.5" />
							}
						>
							{solution.title}
						</Badge>
					))}
				</BadgeGroup>
			)}

			{/* From Pattern Line */}
			{patternInfo && (
				<div className="mb-3 flex w-full items-center gap-2.5 overflow-hidden">
					<div className="whitespace-nowrap text-[14px] text-neutral-500 tracking-[-0.14px]">
						<span>From </span>
						<span className="uppercase">PATTERN</span>
					</div>

					<div className="flex h-6 w-6 items-center justify-center">
						<Icon icon={ArrowRight02Icon} className="h-4 w-4 text-accent" />
					</div>

					<SearchResultPreview
						description={description}
						patternTitle={patternInfo.title || "Pattern"}
					>
						<Badge
							variant="pattern"
							icon={
								PatternIcon && (
									<PatternIcon className="h-3.5 w-3.5 opacity-40" />
								)
							}
						>
							{patternInfo.title}
						</Badge>
					</SearchResultPreview>
				</div>
			)}
		</SearchResultBase>
	);
}

// Solution Search Result Component
function _SolutionSearchResult({
	pattern,
	searchTerm = "",
}: {
	pattern: SolutionSearchResultData;
	searchTerm?: string;
}) {
	const title = pattern.title || "Untitled Solution";
	const audiences = pattern.audiences || [];
	const patternInfo = pattern.pattern;
	const description =
		pattern.description?.[0]?.children?.[0]?.text || "No description available";

	// Get the pattern-specific icon
	const PatternIcon = patternInfo
		? getPatternIconWithMapping(patternInfo.slug || "")
		: null;

	const buttonElement = (
		<a
			href={`/pattern/${patternInfo?.slug}/#solution-${pattern.slug}`}
			className="flex items-center gap-2 rounded-md border border-[var(--solution-button-border)] bg-[var(--solution-button-background)] px-2 py-1 text-[var(--solution-button-text)] transition-opacity hover:opacity-80 md:px-3 md:py-1"
		>
			<span className="font-normal text-xs uppercase">Visit Solution</span>
			{PatternIcon && (
				<PatternIcon className="h-3 w-3 text-[var(--solution-button-text)] opacity-40" />
			)}
		</a>
	);

	return (
		<SearchResultBase title={title}>
			{/* Audiences */}
			{audiences.length > 0 && (
				<BadgeGroup className="mb-3">
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

			{/* From Pattern Line */}
			{patternInfo && (
				<div className="mb-3 flex w-full items-center gap-2.5 overflow-hidden">
					<div className="whitespace-nowrap text-[14px] text-neutral-500 tracking-[-0.14px]">
						<span>From </span>
						<span className="uppercase">PATTERN</span>
					</div>

					<div className="flex h-6 w-6 items-center justify-center">
						<Icon
							icon={ArrowRight02Icon}
							className="h-4 w-4 text-neutral-500"
						/>
					</div>

					<SearchResultPreview
						description={description}
						patternTitle={patternInfo.title || "Pattern"}
					>
						<div className="flex h-6 cursor-pointer items-center gap-2 py-1.5">
							<span className="whitespace-nowrap text-[14px] text-neutral-500 capitalize tracking-[-0.28px]">
								{patternInfo.title}
							</span>
							{PatternIcon && (
								<PatternIcon className="h-3.5 w-3.5 text-neutral-500 opacity-40" />
							)}
						</div>
					</SearchResultPreview>
				</div>
			)}
		</SearchResultBase>
	);
}

// Main component that routes to the appropriate sub-component
export function SearchResultItem({
	pattern,
	searchTerm,
	showPatternIcon,
}: SearchResultItemProps) {
	// Since SearchPattern always has _type: "pattern", we only handle that case
	return (
		<PatternSearchResult
			pattern={pattern as PatternSearchResultData}
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
