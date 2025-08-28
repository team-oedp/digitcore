import { Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { PortableTextBlock } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { GitHubIcon } from "~/components/icons/logos/github-icon";
import { ZenodoIcon } from "~/components/icons/logos/zenodo-icon";
import type { FOOTER_QUERYResult } from "~/sanity/sanity.types";
import { CustomPortableText } from "./custom-portable-text";

type SiteFooterProps = {
	footerData: FOOTER_QUERYResult;
};

// Fallback data in case Sanity data is not available
const FALLBACK_SOCIAL_LINKS = [
	{
		name: "GitHub",
		href: "https://github.com/oedp",
		isExternal: true,
	},
	{
		name: "Email",
		href: "mailto:info@openenvironmentaldata.org",
		isExternal: false,
	},
	{
		name: "LinkedIn",
		href: "https://www.linkedin.com/company/open-environmental-data-project/",
		isExternal: true,
	},
	{
		name: "Substack",
		href: "https://substack.com/@openenvironmentaldataproject",
		isExternal: true,
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
	const _allExternalLinks =
		externalLinks.length > 0
			? externalLinks
			: FALLBACK_SOCIAL_LINKS.map((link) => ({
					_key: link.name.toLowerCase(),
					label: link.name,
					url: link.href,
				}));

	return (
		<footer className="mx-3 mt-auto h-[400px] rounded-md bg-secondary">
			<div className="pb-3">
				<div className="flex h-[400px] flex-col px-4 py-3 md:px-8 md:py-6">
					{/* Mobile Layout - Vertical Stack */}
					<div className="flex h-full flex-col justify-between md:hidden">
						{/* 1. Logo + Title */}
						<div className="flex items-start">
							<Image
								src="/oedp-icon.png"
								alt="Digital Toolkit logo"
								width={24}
								height={24}
								className="mt-1 mr-3"
								style={{ height: "auto" }}
								priority
							/>
							<h2 className="text-balance font-normal text-md">{title}</h2>
						</div>

						{/* 2. Internal Links */}
						{internalLinks.length > 0 && (
							<nav aria-label="Internal navigation links">
								<ul className="space-y-1">
									{internalLinks.map((link) => (
										<li key={link._key}>
											<Link
												href={`/${link.page?.slug || "#"}`}
												className="text-link text-sm focus:outline-none"
											>
												{link.label}
											</Link>
										</li>
									))}
								</ul>
							</nav>
						)}

						{/* 3. External Icon Links */}
						<nav aria-label="External links">
							<div className="flex items-center gap-4">
								{/* GitHub Icon */}
								<a
									href="https://github.com/oedp"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="GitHub (opens in new tab)"
									className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
								>
									<GitHubIcon className="h-6 w-6" />
								</a>

								{/* Zenodo Icon */}
								<a
									href="https://zenodo.org/communities/oedp"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Zenodo (opens in new tab)"
									className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
								>
									<ZenodoIcon className="h-6 w-6" />
								</a>

								{/* Email Icon */}
								<a
									href="mailto:info@openenvironmentaldata.org"
									aria-label="Email Open Environmental Data Project"
									className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
								>
									<HugeiconsIcon
										icon={Mail01Icon}
										size={24}
										color="currentColor"
										strokeWidth={1.5}
									/>
								</a>
							</div>
						</nav>

						{/* 4. License/Copyright - Last */}
						<div className="text-left text-primary text-xs">
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

					{/* Desktop Layout - Grid */}
					<div className="hidden md:flex md:h-full md:flex-col">
						{/* Top section with logo + title on left, external icon links on right */}
						<div className="mb-8 grid grid-cols-12 gap-16">
							<div className="col-span-8 flex items-start">
								<div className="flex items-center">
									<Image
										src="/oedp-icon.png"
										alt="Digital Toolkit logo"
										width={24}
										height={24}
										className="mr-3"
										style={{ height: "auto" }}
										priority
									/>
									<h2 className="text-balance font-normal text-lg">{title}</h2>
								</div>
							</div>

							{/* External links as horizontal row of icons in top right */}
							<nav
								className="col-span-4 col-start-9 flex justify-end"
								aria-label="External links"
							>
								<div className="flex items-center gap-4">
									{/* GitHub Icon */}
									<a
										href="https://github.com/oedp"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="GitHub (opens in new tab)"
										className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
									>
										<GitHubIcon className="h-6 w-6" />
									</a>

									{/* Zenodo Icon */}
									<a
										href="https://zenodo.org/communities/oedp"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Zenodo (opens in new tab)"
										className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
									>
										<ZenodoIcon className="h-6 w-6" />
									</a>

									{/* Email Icon */}
									<a
										href="mailto:info@openenvironmentaldata.org"
										aria-label="Email Open Environmental Data Project"
										className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
									>
										<HugeiconsIcon
											icon={Mail01Icon}
											size={24}
											color="currentColor"
											strokeWidth={1.5}
										/>
									</a>
								</div>
							</nav>
						</div>

						{/* Bottom section with internal text links column anchored to bottom, and license */}
						<div className="mt-auto grid grid-cols-12 items-end">
							{/* License bottom-left */}
							<div className="col-span-4 col-start-1 self-end text-left text-primary text-xs">
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

							{/* Internal links vertical column anchored at bottom, moved two columns over */}
							{internalLinks.length > 0 && (
								<nav
									className="col-span-3 col-start-7 self-end"
									aria-label="Internal navigation links"
								>
									<ul className="space-y-1">
										{internalLinks.map((link) => (
											<li key={link._key}>
												<Link
													href={`/${link.page?.slug || "#"}`}
													className="text-link text-sm focus:outline-none"
												>
													{link.label}
												</Link>
											</li>
										))}
									</ul>
								</nav>
							)}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
