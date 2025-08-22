import type { PortableTextBlock } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import type { FOOTER_QUERYResult } from "~/sanity/sanity.types";
import { CustomPortableText } from "./custom-portable-text";

type SiteFooterProps = {
	footerData: FOOTER_QUERYResult;
};

// Fallback data in case Sanity data is not available
const FALLBACK_SOCIAL_LINKS = [
	{
		name: "Instagram",
		href: "https://www.instagram.com/openenvirodata/",
		isExternal: true,
	},
	{
		name: "LinkedIn",
		href: "https://www.linkedin.com/company/open-environmental-data-project/",
		isExternal: true,
	},
	{
		name: "GitHub",
		href: "https://github.com/oedp",
		isExternal: true,
	},
	{
		name: "Medium",
		href: "https://openenvironmentaldata.medium.com/",
		isExternal: true,
	},
	{
		name: "Substack",
		href: "https://substack.com/@openenvironmentaldataproject",
		isExternal: true,
	},
	{
		name: "Email",
		href: "mailto:info@openenvironmentaldata.org",
		isExternal: false,
	},
];

export function SiteFooter({ footerData }: SiteFooterProps) {
	// Use Sanity data if available, otherwise fall back to hardcoded data
	const title =
		footerData?.title || "Digital Toolkit for Open Environmental Research";
	const internalLinks = footerData?.internalLinks || [];
	const externalLinks = footerData?.externalLinks || [];
	const license = footerData?.license;

	// Combine internal and external links, fallback to hardcoded social links if no external links from Sanity
	const allExternalLinks =
		externalLinks.length > 0
			? externalLinks
			: FALLBACK_SOCIAL_LINKS.map((link) => ({
					_key: link.name.toLowerCase(),
					label: link.name,
					url: link.href,
				}));

	return (
		<footer className="mx-3 mt-auto h-[400px] rounded-md bg-background">
			<div className="pb-3">
				<div className="flex h-[400px] flex-col px-4 py-3 md:px-8 md:py-6">
					{/* Main content area */}
					<div className="grid grid-cols-1 gap-16 md:grid-cols-12">
						{/* Header with logo and title */}
						<div className="flex items-start md:col-span-8">
							<div className="flex items-start md:items-center">
								<Image
									src="/oedp-icon.png"
									alt="Digital Toolkit logo"
									width={24}
									height={24}
									className="mt-1 mr-3 md:mt-0"
									style={{ height: "auto" }}
									priority
								/>
								<h2 className="text-balance font-normal text-md md:text-lg">
									{title}
								</h2>
							</div>
						</div>

						{/* Navigation links */}
						<nav
							className="md:col-span-4 md:col-start-9"
							aria-label="Footer navigation links"
						>
							<ul className="space-y-1">
								{/* Internal links from Sanity */}
								{internalLinks.map((link) => (
									<li key={link._key}>
										<Link
											href={`/${link.page?.slug || "#"}`}
											className="link text-sm focus:outline-none"
										>
											{link.label}
										</Link>
									</li>
								))}

								{/* External links from Sanity or fallback social links */}
								{allExternalLinks.map((link) => {
									const isExternal =
										link.url?.startsWith("http") ||
										link.url?.startsWith("mailto");
									return (
										<li key={link._key}>
											<a
												href={link.url || "#"}
												className="link text-sm focus:outline-none"
												{...(isExternal && {
													target: "_blank",
													rel: "noopener noreferrer",
													"aria-label": `${link.label} (opens in new tab)`,
												})}
											>
												{link.label}
											</a>
										</li>
									);
								})}
							</ul>
						</nav>
					</div>

					{/* License/Copyright text */}
					<div className="mt-auto text-left text-primary text-xs">
						{license ? (
							<CustomPortableText
								value={license as PortableTextBlock[]}
								className="prose max-w-none text-primary text-xs"
								as="div"
							/>
						) : (
							<p>Open Environmental Data Project 2025</p>
						)}
					</div>
				</div>
			</div>
		</footer>
	);
}
