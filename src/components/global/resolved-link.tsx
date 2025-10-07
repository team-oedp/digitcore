import { File01Icon, Share04Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Icon } from "~/components/shared/icon";
import { cn } from "~/lib/utils";
import { linkResolver } from "~/sanity/lib/utils";
import type { Link as LinkType } from "~/sanity/sanity.types";
import { inlineAnnotationClassName } from "./glossary-pill";

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
		const isExternal =
			resolvedLink.startsWith("http://") || resolvedLink.startsWith("https://");
		// Open in new tab if external OR if forceNewTab is true
		const shouldOpenInNewTab = isExternal || forceNewTab;

		return (
			<Link
				href={resolvedLink}
				target={shouldOpenInNewTab ? "_blank" : undefined}
				rel={shouldOpenInNewTab ? "noopener noreferrer" : undefined}
				className={cn(inlineAnnotationClassName, className)}
			>
				{children}
				<Icon
					icon={isExternal ? Share04Icon : File01Icon}
					size={12}
					strokeWidth={2}
					className="inline-block flex-shrink-0"
				/>
			</Link>
		);
	}
	return <>{children}</>;
}
