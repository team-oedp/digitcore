"use client";

import {
	ArrowRight02Icon,
	ChartRelationshipIcon,
	Share02Icon,
	Tag01Icon,
} from "@hugeicons/core-free-icons";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import type { SearchPattern } from "~/app/actions/search";
import { Icon } from "~/components/shared/icon";
import {
	extractTextFromPortableText,
	getMatchExplanation,
	hasMatchInTitle,
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
	buttonElement,
	showPatternIcon = false,
}: {
	children: React.ReactNode;
	title: string;
	buttonElement: React.ReactNode;
	showPatternIcon?: boolean;
}) {
	return (
		<div className="relative w-full border-border border-t border-dashed pb-9">
			<div className="flex flex-col py-4 md:flex-row md:items-start md:justify-between">
				<div className="w-full flex-shrink-0 space-y-4 md:max-w-[600px]">
					<div className="flex items-start gap-3 md:items-center">
						{showPatternIcon && (
							<Icon
								icon={Share02Icon}
								className="h-5 w-5 flex-shrink-0 text-neutral-500"
								strokeWidth={1.5}
							/>
						)}
						<h3 className="w-full text-pattern-list-item-title">{title}</h3>
					</div>
					{children}
					<div className="pt-2 md:hidden">{buttonElement}</div>
				</div>
				<div className="hidden flex-shrink-0 pt-2 md:block">
					{buttonElement}
				</div>
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
	const titleHasMatch = hasMatchInTitle(title, searchTerm);

	const buttonElement = (
		<a
			href={`/pattern/${pattern.slug}`}
			className="inline-flex items-center gap-2 rounded-md border border-[#d1a7f3] bg-[#ead1fa] px-[9px] py-[5px] text-[#4f065f] transition-opacity hover:opacity-80"
		>
			<span className="text-button text-sm">Visit Pattern</span>
		</a>
	);

	return (
		<SearchResultPreview description={displayDescription} patternTitle={title}>
			<SearchResultBase
				title={title}
				buttonElement={buttonElement}
				showPatternIcon={showPatternIcon}
			>
				{/* Theme Badge */}
				{theme && (
					<div className="mb-4 flex w-full items-center gap-2.5 overflow-hidden">
						<div className="flex h-6 cursor-pointer items-center gap-2.5 rounded-md border border-neutral-300 px-2 py-1.5">
							<span className="whitespace-nowrap text-neutral-500 text-sm capitalize tracking-[-0.28px]">
								{theme.title}
							</span>
						</div>
					</div>
				)}

				{/* Description with Search Context */}
				{descriptionResult.text && (
					<div className="mb-4">
						{/* Smooth expand/collapse using CSS max-height + line clamp */}
						<div
							className={cn(
								"relative overflow-hidden transition-[max-height] duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] md:pr-10",
								showFullDescription
									? "max-h-[1500px]"
									: "line-clamp-3 max-h-[96px]",
							)}
						>
							<span className="block text-sm text-zinc-600 leading-relaxed md:text-base">
								{renderHighlightedText(
									extractTextFromPortableText(rawDescription),
									searchTerm,
								)}
							</span>

							{/* Inline Expand/Collapse Toggle */}
							{descriptionResult.isTruncated && (
								<button
									onClick={() => setShowFullDescription(!showFullDescription)}
									type="button"
									aria-label={
										showFullDescription
											? "Collapse description"
											: "Expand description"
									}
									className="mt-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-blue-600 transition-colors hover:border hover:border-current/40 hover:bg-blue-50/10 focus:outline-none md:absolute md:right-0 md:bottom-0 md:mt-0"
								>
									{showFullDescription ? (
										<MinusIcon className="size-4" aria-hidden="true" />
									) : (
										<PlusIcon className="size-4" aria-hidden="true" />
									)}
								</button>
							)}
						</div>

						{/* Match Indicators */}
						{searchTerm &&
							(matchExplanation.titleMatch ||
								matchExplanation.descriptionMatch) && (
								<div className="mt-2 flex items-center gap-2 text-neutral-500 text-xs">
									<span>Match found in:</span>
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
										<span className="text-neutral-400">
											({descriptionResult.matchCount} matches)
										</span>
									)}
								</div>
							)}
					</div>
				)}

				{/* Tags */}
				{tags.length > 0 && (
					<div className="mb-4 flex items-center gap-2">
						{tags.map((tag) => (
							<div
								key={tag._id}
								className="flex h-5 items-center gap-2.5 rounded-md border border-green-200 bg-green-100 py-1.5 pr-2 pl-[9px] md:h-6 md:py-2 md:pr-3"
							>
								<span className="whitespace-nowrap text-[#166534] text-xs capitalize md:text-sm">
									{tag.title}
								</span>
								<Icon icon={Tag01Icon} className="h-3.5 w-3.5 text-[#166534]" />
							</div>
						))}
					</div>
				)}

				{/* Audiences */}
				{audiences.length > 0 && (
					<div className="flex items-center gap-2">
						{audiences.map((audience) => (
							<div
								key={audience._id}
								className="flex h-5 items-center gap-2.5 rounded-md border border-blue-200 bg-blue-100 py-1.5 pr-2 pl-[9px] md:h-6 md:py-2 md:pr-3"
							>
								<span className="whitespace-nowrap text-[#1e40ae] text-xs md:text-sm">
									{audience.title}
								</span>
								<Icon
									icon={ChartRelationshipIcon}
									className="h-3.5 w-3.5 text-[#1e40ae]"
								/>
							</div>
						))}
					</div>
				)}
			</SearchResultBase>
		</SearchResultPreview>
	);
}

// Resource Search Result Component
function ResourceSearchResult({
	pattern,
	searchTerm = "",
}: { pattern: ResourceSearchResultData; searchTerm?: string }) {
	const title = pattern.title || "Untitled Resource";
	const solutions = pattern.solutions || [];
	const patternInfo = pattern.pattern;
	const description =
		pattern.description?.[0]?.children?.[0]?.text || "No description available";

	const buttonElement = (
		<a
			href={`/pattern/${patternInfo?.slug}/#resource-${pattern.slug}`}
			className="flex items-center gap-2 rounded-md border border-[#bfdbfe] bg-[#dbeafe] px-[9px] py-[5px] text-[#1e40af] transition-opacity hover:opacity-80"
		>
			<span className="font-normal text-[14px] uppercase leading-[20px]">
				Visit Resource
			</span>
			<Icon icon={Share02Icon} className="h-3.5 w-3.5 text-[#1e40af]" />
		</a>
	);

	return (
		<SearchResultBase title={title} buttonElement={buttonElement}>
			{/* Solutions */}
			{solutions.length > 0 && (
				<div className="mb-4 flex items-center gap-2">
					{solutions.map((solution) => (
						<div
							key={solution._id}
							className="flex h-6 items-center gap-2.5 rounded-md border border-green-200 bg-green-100 py-2 pr-3 pl-[9px]"
						>
							<span className="whitespace-nowrap text-[#166534] text-[14px]">
								{solution.title}
							</span>
							<Icon
								icon={ChartRelationshipIcon}
								className="h-3.5 w-3.5 text-[#166534]"
							/>
						</div>
					))}
				</div>
			)}

			{/* From Pattern Line */}
			{patternInfo && (
				<div className="mb-4 flex w-full items-center gap-2.5 overflow-hidden">
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
						<div className="flex h-6 cursor-pointer items-center gap-2.5 rounded-lg border border-neutral-300 px-2 py-1.5">
							<span className="whitespace-nowrap text-[14px] text-neutral-500 capitalize tracking-[-0.28px]">
								{patternInfo.title}
							</span>
							<Icon
								icon={Share02Icon}
								className="h-3.5 w-3.5 text-neutral-500"
							/>
						</div>
					</SearchResultPreview>
				</div>
			)}
		</SearchResultBase>
	);
}

// Solution Search Result Component
function SolutionSearchResult({
	pattern,
	searchTerm = "",
}: { pattern: SolutionSearchResultData; searchTerm?: string }) {
	const title = pattern.title || "Untitled Solution";
	const audiences = pattern.audiences || [];
	const patternInfo = pattern.pattern;
	const description =
		pattern.description?.[0]?.children?.[0]?.text || "No description available";

	const buttonElement = (
		<a
			href={`/pattern/${patternInfo?.slug}/#solution-${pattern.slug}`}
			className="flex items-center gap-2 rounded-md border border-[#bbf7d0] bg-[#dcfce7] px-[9px] py-[5px] text-[#166534] transition-opacity hover:opacity-80"
		>
			<span className="font-normal text-[14px] uppercase leading-[20px]">
				Visit Solution
			</span>
			<Icon icon={Share02Icon} className="h-3.5 w-3.5 text-[#166534]" />
		</a>
	);

	return (
		<SearchResultBase title={title} buttonElement={buttonElement}>
			{/* Audiences */}
			{audiences.length > 0 && (
				<div className="mb-4 flex items-center gap-2">
					{audiences.map((audience) => (
						<div
							key={audience._id}
							className="flex h-6 items-center gap-2.5 rounded-md border border-blue-200 bg-blue-100 py-2 pr-3 pl-[9px]"
						>
							<span className="whitespace-nowrap text-[#1e40ae] text-[14px]">
								{audience.title}
							</span>
							<Icon
								icon={ChartRelationshipIcon}
								className="h-3.5 w-3.5 text-[#1e40ae]"
							/>
						</div>
					))}
				</div>
			)}

			{/* From Pattern Line */}
			{patternInfo && (
				<div className="mb-4 flex w-full items-center gap-2.5 overflow-hidden">
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
							<Icon
								icon={Share02Icon}
								className="h-3.5 w-3.5 text-neutral-500"
							/>
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
