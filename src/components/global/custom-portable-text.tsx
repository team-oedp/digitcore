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

import type { GlossaryTerm } from "~/lib/glossary-utils";
import { cn } from "~/lib/utils";
import { GlossaryPill } from "./glossary-pill";
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
	glossaryTerms?: GlossaryTerm[]; // kept for backward-compat; no longer used for auto-detection
}) {
	// Glossary terms are now editor-annotated; no auto-detection during render.

	const components: PortableTextComponents = {
block: {
			normal: ({ children }) => {
				return <p className={className}>{children}</p>;
			},
			h1: ({ children, value }) => {
				return (
					<h1 className={cn(className, "group relative")}>
						{children}
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
				return (
					<h2 className={cn(className, "group relative")}>
						{children}
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
			h3: ({ children }) => {
				return <h3 className={className}>{children}</h3>;
			},
			h4: ({ children }) => {
				return <h4 className={className}>{children}</h4>;
			},
			blockquote: ({ children }) => {
				return <blockquote>{children}</blockquote>;
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
			glossaryTerm: ({ children, value }) => {
				// value.glossary may be a resolved object from queries, fallback to children text
				const v = value as unknown as { glossary?: { _id?: string; title?: string } };
				const titleFromValue = v?.glossary?.title;
				const idFromValue = v?.glossary?._id ?? "";
				const childText = Array.isArray(children)
					? children.filter((c): c is string => typeof c === "string").join("")
					: typeof children === "string"
						? children
						: undefined;
				const term: GlossaryTerm | null = titleFromValue
					? { _id: idFromValue, title: titleFromValue }
					: childText
						? { _id: idFromValue, title: childText }
						: null;
				if (!term) return <>{children}</>;
				return (
					<GlossaryPill term={term} shouldStyle>
						{children}
					</GlossaryPill>
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
			bullet: ({ children }) => {
				return <li>{children}</li>;
			},
			number: ({ children }) => {
				return <li>{children}</li>;
			},
		},
	};

	return (
		<Component className={cn(className, "prose max-w-none")}>
			<PortableText components={components} value={value} />
		</Component>
	);
}
