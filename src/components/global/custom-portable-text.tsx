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
import { Fragment } from "react";

import {
	type GlossaryTerm,
	processTextWithGlossaryTerms,
} from "~/lib/glossary-utils";
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
	glossaryTerms?: GlossaryTerm[];
}) {
	// Function to process children and detect glossary terms
	const processChildren = (children: React.ReactNode, blockKey?: string) => {
		if (!glossaryTerms || glossaryTerms.length === 0) {
			return children;
		}

		// Process each child node
		const processNode = (node: React.ReactNode): React.ReactNode => {
			if (typeof node === "string") {
				// Process plain text for glossary terms
				return processTextWithGlossaryTerms(
					node,
					glossaryTerms,
					(term, text, key) => (
						<GlossaryPill key={key} term={term}>
							{text}
						</GlossaryPill>
					),
				);
			}
			return node;
		};

		if (Array.isArray(children)) {
			return children.map((child, index) => {
				const key = blockKey
					? `${blockKey}-child-${index}`
					: typeof child === "string"
						? `${child.slice(0, 20)}-${index}`
						: `node-${index}`;
				return <Fragment key={key}>{processNode(child)}</Fragment>;
			});
		}

		return processNode(children);
	};

	const components: PortableTextComponents = {
		block: {
			normal: ({ children, value }) => (
				<p>{processChildren(children, value?._key)}</p>
			),
			h1: ({ children, value }) => (
				// Add an anchor to the h1
				<h1 className="group relative">
					{processChildren(children, value?._key)}
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
			),
			h2: ({ children, value }) => {
				// Add an anchor to the h2
				return (
					<h2 className="group relative">
						{processChildren(children, value?._key)}
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
			h3: ({ children, value }) => (
				<h3>{processChildren(children, value?._key)}</h3>
			),
			h4: ({ children, value }) => (
				<h4>{processChildren(children, value?._key)}</h4>
			),
			blockquote: ({ children, value }) => (
				<blockquote>{processChildren(children, value?._key)}</blockquote>
			),
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
			bullet: ({ children, value }) => (
				<li>{processChildren(children, value?._key)}</li>
			),
			number: ({ children, value }) => (
				<li>{processChildren(children, value?._key)}</li>
			),
		},
	};

	return (
		<Component className={cn(className, "prose max-w-none")}>
			<PortableText components={components} value={value} />
		</Component>
	);
}
