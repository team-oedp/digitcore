"use client";

/**
 * This component uses Portable Text to render rich text.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import {
	PortableText,
	type PortableTextBlock,
	type PortableTextComponents,
} from "next-sanity";

import {
	type GlossaryTerm,
	processTextWithGlossaryTerms,
} from "~/lib/glossary-utils";
import { cn } from "~/lib/utils";
import { GlossaryPill } from "./glossary-pill";
import { useGlossary } from "./glossary-provider";
import ResolvedLink from "./resolved-link";

export function CustomPortableText({
	className,
	value,
	as: Component = "div",
	glossaryTerms,
}: {
	className?: string;
	value: PortableTextBlock[];
	as?: React.ElementType;
	glossaryTerms?: GlossaryTerm[];
}) {
	const glossaryStore = useGlossary();

	const processText = (text: string, blockKey?: string) => {
		if (!glossaryTerms || glossaryTerms.length === 0) {
			return text;
		}

		return processTextWithGlossaryTerms(
			text,
			glossaryTerms,
			(term, text, key, shouldStyle) => (
				<GlossaryPill key={key} term={term} shouldStyle={shouldStyle}>
					{text}
				</GlossaryPill>
			),
			glossaryStore.hasSeenTerm,
			glossaryStore.addSeenTerm,
		);
	};

	const components: PortableTextComponents = {
		block: {
			normal: ({ children, value }) => {
				const processedChildren = Array.isArray(children)
					? children.map((child, index) => {
							if (typeof child === "string") {
								return processText(child, value?._key);
							}
							return child;
						})
					: typeof children === "string"
						? processText(children, value?._key)
						: children;

				return <p className={className}>{processedChildren}</p>;
			},
			h1: ({ children, value }) => {
				const processedChildren = Array.isArray(children)
					? children.map((child, index) => {
							if (typeof child === "string") {
								return processText(child, value?._key);
							}
							return child;
						})
					: typeof children === "string"
						? processText(children, value?._key)
						: children;

				return (
					<h1 className={cn(className, "group relative")}>
						{processedChildren}
						<a
							href={`#${value?._key}`}
							className="-ml-6 absolute top-0 bottom-0 left-0 flex items-center opacity-0 transition-opacity group-hover:opacity-100"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<title>Anchor link</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
								/>
							</svg>
						</a>
					</h1>
				);
			},
			h2: ({ children, value }) => {
				const processedChildren = Array.isArray(children)
					? children.map((child, index) => {
							if (typeof child === "string") {
								return processText(child, value?._key);
							}
							return child;
						})
					: typeof children === "string"
						? processText(children, value?._key)
						: children;

				return (
					<h2 className={cn(className, "group relative")}>
						{processedChildren}
						<a
							href={`#${value?._key}`}
							className="-ml-6 absolute top-0 bottom-0 left-0 flex items-center opacity-0 transition-opacity group-hover:opacity-100"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<title>Anchor link</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M13.828 10.172a4 4 0 00-5.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
								/>
							</svg>
						</a>
					</h2>
				);
			},
			h3: ({ children, value }) => {
				const processedChildren = Array.isArray(children)
					? children.map((child, index) => {
							if (typeof child === "string") {
								return processText(child, value?._key);
							}
							return child;
						})
					: typeof children === "string"
						? processText(children, value?._key)
						: children;

				return <h3 className={className}>{processedChildren}</h3>;
			},
			h4: ({ children, value }) => {
				const processedChildren = Array.isArray(children)
					? children.map((child, index) => {
							if (typeof child === "string") {
								return processText(child, value?._key);
							}
							return child;
						})
					: typeof children === "string"
						? processText(children, value?._key)
						: children;

				return <h4 className={className}>{processedChildren}</h4>;
			},
			blockquote: ({ children, value }) => {
				const processedChildren = Array.isArray(children)
					? children.map((child, index) => {
							if (typeof child === "string") {
								return processText(child, value?._key);
							}
							return child;
						})
					: typeof children === "string"
						? processText(children, value?._key)
						: children;

				return <blockquote>{processedChildren}</blockquote>;
			},
		},
		marks: {
			link: ({ children, value: link }) => {
				return (
					<ResolvedLink link={link} forceNewTab={Boolean(link?.openInNewTab)}>
						{children}
					</ResolvedLink>
				);
			},
			strong: ({ children }) => (
				<strong className="font-medium">{children}</strong>
			),
			em: ({ children }) => <em className="italic">{children}</em>,
		},
		list: {
			bullet: ({ children }) => <ul>{children}</ul>,
			number: ({ children }) => <ol>{children}</ol>,
		},
		listItem: {
			bullet: ({ children, value }) => {
				const processedChildren = Array.isArray(children)
					? children.map((child, index) => {
							if (typeof child === "string") {
								return processText(child, value?._key);
							}
							return child;
						})
					: typeof children === "string"
						? processText(children, value?._key)
						: children;

				return <li>{processedChildren}</li>;
			},
			number: ({ children, value }) => {
				const processedChildren = Array.isArray(children)
					? children.map((child, index) => {
							if (typeof child === "string") {
								return processText(child, value?._key);
							}
							return child;
						})
					: typeof children === "string"
						? processText(children, value?._key)
						: children;

				return <li>{processedChildren}</li>;
			},
		},
	};

	return (
		<Component className={cn(className, "prose max-w-none")}>
			<PortableText components={components} value={value} />
		</Component>
	);
}
