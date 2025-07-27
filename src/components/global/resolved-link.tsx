import Link from "next/link";

import { linkResolver } from "~/sanity/lib/utils";
import type { Link as LinkType } from "~/sanity/sanity.types";

type ResolvedLinkProps = {
	link: LinkType;
	children: React.ReactNode;
	className?: string;
	forceNewTab?: boolean;
};

/**
 * Resolves Sanity link objects into Next.js Link components.
 * Automatically opens external links in new tabs and optionally forces internal links to open in new tabs.
 */
export default function ResolvedLink({
	link,
	children,
	className,
	forceNewTab = false,
}: ResolvedLinkProps) {
	// resolveLink() is used to determine the type of link and return the appropriate URL.
	const resolvedLink = linkResolver(link);

	if (typeof resolvedLink === "string") {
		// Check if the link is external (starts with http:// or https://)
		const isExternal = resolvedLink.startsWith("http://") || resolvedLink.startsWith("https://");
		// Open in new tab if external OR if forceNewTab is true
		const shouldOpenInNewTab = isExternal || forceNewTab;
		
		return (
			<Link
				href={resolvedLink}
				target={shouldOpenInNewTab ? "_blank" : undefined}
				rel={shouldOpenInNewTab ? "noopener noreferrer" : undefined}
				className={className}
			>
				{children}
			</Link>
		);
	}
	return <>{children}</>;
}
