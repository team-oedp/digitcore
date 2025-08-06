"use client";

import {
	ArrowRight02Icon,
	ChartRelationshipIcon,
	Share02Icon,
	Tag01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import type { SearchPattern } from "~/app/actions/search";
import { 
	truncateWithContext, 
	highlightMatches, 
	hasMatchInTitle,
	getMatchExplanation 
} from "~/lib/search-utils";
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
	themes?: Array<{
		_id: string;
		title?: string;
		description?: Array<unknown>;
	}> | null;
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
		solution?: unknown;
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

type SearchResultData =
	| PatternSearchResultData
	| ResourceSearchResultData
	| SolutionSearchResultData;

type SearchResultItemProps = {
	pattern: SearchPattern;
	searchTerm?: string;
};

// Shared base layout component
function SearchResultBase({
	children,
	title,
	buttonElement,
}: {
	children: React.ReactNode;
	title: string;
	buttonElement: React.ReactNode;
}) {
	return (
		<div className="relative w-full pb-9">
			{/* Dashed border at bottom */}
			<div className="absolute right-0 bottom-0 left-0 h-px border-zinc-300 border-t border-dashed" />

			<div className="py-[15px]">
				<div className="flex items-start justify-between gap-[150px]">
					{/* Left Content */}
					<div className="w-[600px] max-w-[600px] flex-shrink-0">
						{/* Title */}
						<h3 className="mb-4 w-[700px] font-light text-[#323232] text-[28px] leading-[37.8px] tracking-[-0.9px]">
							{title}
						</h3>

						{children}
					</div>

					{/* Right Button */}
					<div className="flex-shrink-0 pt-0.5">{buttonElement}</div>
				</div>
			</div>
		</div>
	);
}

// Pattern Search Result Component
function PatternSearchResult({
	pattern,
	searchTerm = "",
}: { pattern: PatternSearchResultData; searchTerm?: string }) {
	const [showFullDescription, setShowFullDescription] = useState(false);
	const title = pattern.title || "Untitled Pattern";
	const theme = pattern.themes?.[0];
	const tags = pattern.tags || [];
	const audiences = pattern.audiences || [];
	const rawDescription = pattern.description || [];

	// Process description for search context
	const descriptionResult = truncateWithContext(rawDescription, searchTerm, 200);
	const displayDescription = showFullDescription ? rawDescription : descriptionResult.text;
	
	// Check where matches occur
	const matchExplanation = getMatchExplanation(title, rawDescription, searchTerm);
	const titleHasMatch = hasMatchInTitle(title, searchTerm);

	const buttonElement = (
		<a
			href={`/pattern/${pattern.slug}`}
			className="flex items-center gap-2 rounded-md border border-[#d1a7f3] bg-[#ead1fa] px-[9px] py-[5px] text-[#4f065f] transition-opacity hover:opacity-80"
		>
			<span className="font-normal text-[14px] uppercase leading-[20px]">
				Visit Pattern
			</span>
			<HugeiconsIcon
				icon={Share02Icon}
				className="h-3.5 w-3.5 text-[#4f065f]"
			/>
		</a>
	);

	return (
		<SearchResultPreview description={displayDescription} patternTitle={title}>
			<SearchResultBase title={title} buttonElement={buttonElement}>
				{/* Theme Badge */}
				{theme && (
					<div className="mb-4 flex w-full items-center gap-2.5 overflow-hidden">
						<div className="flex h-6 cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-300 px-2 py-1.5">
							<span className="whitespace-nowrap text-[14px] text-zinc-500 capitalize tracking-[-0.28px]">
								{theme.title}
							</span>
							<HugeiconsIcon
								icon={Share02Icon}
								className="h-3.5 w-3.5 text-zinc-500"
							/>
						</div>
					</div>
				)}

				{/* Description with Search Context */}
				{descriptionResult.text && (
					<div className="mb-4">
						<div 
							className="text-sm text-zinc-600 leading-relaxed"
							dangerouslySetInnerHTML={{ 
								__html: highlightMatches(displayDescription, searchTerm) 
							}}
						/>
						
						{/* Match Indicators */}
						{searchTerm && (matchExplanation.titleMatch || matchExplanation.descriptionMatch) && (
							<div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
								<span>Match found in:</span>
								{matchExplanation.titleMatch && (
									<span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Title</span>
								)}
								{matchExplanation.descriptionMatch && (
									<span className="bg-green-100 text-green-700 px-2 py-1 rounded">Description</span>
								)}
								{descriptionResult.matchCount > 1 && (
									<span className="text-zinc-400">({descriptionResult.matchCount} matches)</span>
								)}
							</div>
						)}
						
						{/* Expand/Collapse Toggle */}
						{descriptionResult.isTruncated && (
							<button
								onClick={() => setShowFullDescription(!showFullDescription)}
								className="mt-2 text-xs text-blue-600 hover:text-blue-800"
							>
								{showFullDescription ? 'Show less' : 'Show more'}
							</button>
						)}
					</div>
				)}

				{/* Tags */}
				{tags.length > 0 && (
					<div className="mb-4 flex items-center gap-2">
						{tags.map((tag) => (
							<div
								key={tag._id}
								className="flex h-6 items-center gap-2.5 rounded-lg border border-green-200 bg-green-100 py-2 pr-3 pl-[9px]"
							>
								<span className="whitespace-nowrap text-[#166534] text-[14px]">
									{tag.title}
								</span>
								<HugeiconsIcon
									icon={Tag01Icon}
									className="h-3.5 w-3.5 text-[#166534]"
								/>
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
								className="flex h-6 items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-100 py-2 pr-3 pl-[9px]"
							>
								<span className="whitespace-nowrap text-[#1e40ae] text-[14px]">
									{audience.title}
								</span>
								<HugeiconsIcon
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
			<HugeiconsIcon
				icon={Share02Icon}
				className="h-3.5 w-3.5 text-[#1e40af]"
			/>
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
							className="flex h-6 items-center gap-2.5 rounded-lg border border-green-200 bg-green-100 py-2 pr-3 pl-[9px]"
						>
							<span className="whitespace-nowrap text-[#166534] text-[14px]">
								{solution.title}
							</span>
							<HugeiconsIcon
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
					<div className="whitespace-nowrap text-[14px] text-zinc-500 tracking-[-0.14px]">
						<span>From </span>
						<span className="uppercase">PATTERN</span>
					</div>

					<div className="flex h-6 w-6 items-center justify-center">
						<HugeiconsIcon
							icon={ArrowRight02Icon}
							className="h-4 w-4 text-zinc-500"
						/>
					</div>

					<SearchResultPreview
						description={description}
						patternTitle={patternInfo.title || "Pattern"}
					>
						<div className="flex h-6 cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-300 px-2 py-1.5">
							<span className="whitespace-nowrap text-[14px] text-zinc-500 capitalize tracking-[-0.28px]">
								{patternInfo.title}
							</span>
							<HugeiconsIcon
								icon={Share02Icon}
								className="h-3.5 w-3.5 text-zinc-500"
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
			<HugeiconsIcon
				icon={Share02Icon}
				className="h-3.5 w-3.5 text-[#166534]"
			/>
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
							className="flex h-6 items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-100 py-2 pr-3 pl-[9px]"
						>
							<span className="whitespace-nowrap text-[#1e40ae] text-[14px]">
								{audience.title}
							</span>
							<HugeiconsIcon
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
					<div className="whitespace-nowrap text-[14px] text-zinc-500 tracking-[-0.14px]">
						<span>From </span>
						<span className="uppercase">PATTERN</span>
					</div>

					<div className="flex h-6 w-6 items-center justify-center">
						<HugeiconsIcon
							icon={ArrowRight02Icon}
							className="h-4 w-4 text-zinc-500"
						/>
					</div>

					<SearchResultPreview
						description={description}
						patternTitle={patternInfo.title || "Pattern"}
					>
						<div className="flex h-6 cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-300 px-2 py-1.5">
							<span className="whitespace-nowrap text-[14px] text-zinc-500 capitalize tracking-[-0.28px]">
								{patternInfo.title}
							</span>
							<HugeiconsIcon
								icon={Share02Icon}
								className="h-3.5 w-3.5 text-zinc-500"
							/>
						</div>
					</SearchResultPreview>
				</div>
			)}
		</SearchResultBase>
	);
}

// Main component that routes to the appropriate sub-component
export function SearchResultItem({ pattern, searchTerm }: SearchResultItemProps) {
	switch (pattern._type) {
		case "pattern":
			return <PatternSearchResult pattern={pattern as PatternSearchResultData} searchTerm={searchTerm} />;
		case "resource":
			return <ResourceSearchResult pattern={pattern as ResourceSearchResultData} searchTerm={searchTerm} />;
		case "solution":
			return <SolutionSearchResult pattern={pattern as SolutionSearchResultData} searchTerm={searchTerm} />;
		default:
			// Fallback for unknown types - default to pattern
			return (
				<PatternSearchResult pattern={pattern as PatternSearchResultData} searchTerm={searchTerm} />
			);
	}
}
