import { File01Icon, Share04Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";

import { Icon } from "~/components/shared/icon";
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
		const isExternal =
			resolvedLink.startsWith("http://") || resolvedLink.startsWith("https://");
		// Open in new tab if external OR if forceNewTab is true
		const shouldOpenInNewTab = isExternal || forceNewTab;

		return (
			<Link
				href={resolvedLink}
				target={shouldOpenInNewTab ? "_blank" : undefined}
				rel={shouldOpenInNewTab ? "noopener noreferrer" : undefined}
				className={className}
			>
				<span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-primary/5 px-2.5 py-0 text-box-trim text-primary no-underline transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary">
					{children}
					<Icon
						icon={isExternal ? Share04Icon : File01Icon}
						size={14}
						strokeWidth={2}
						className="inline-block flex-shrink-0"
					/>
				</span>
			</Link>
		);
	}
	return <>{children}</>;
}
