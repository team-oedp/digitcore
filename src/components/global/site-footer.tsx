import { Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { PortableTextBlock } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { GitHubIcon } from "~/components/icons/logos/github-icon";
import { ZenodoIcon } from "~/components/icons/logos/zenodo-icon";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";
import type { FOOTER_QUERYResult } from "~/sanity/sanity.types";

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
	const license = footerData?.licenseLink;

	// Note: External links from Sanity are available but currently using hardcoded icons
	// Future enhancement: Could integrate externalLinks data with dynamic icon rendering

	return (
		<footer className="mx-3 mt-auto h-[300px] rounded-md bg-secondary md:h-[200px]">
			<div className="pb-3">
				<div className="flex h-[300px] flex-col px-4 py-3 md:h-[200px] md:px-8 md:py-6">
					{/* Mobile Layout - Vertical Stack */}
					<div className="flex h-full flex-col justify-between md:hidden">
						{/* 1. Logo + Title */}
						<div className="flex items-center">
							<Image
								src="/pattern-logo.svg"
								alt="Digitcore logo"
								width={24}
								height={24}
								className="mr-3"
								style={{ height: "auto" }}
								priority
							/>
							<h2 className="text-balance font-normal text-md">DIGITCORE</h2>
						</div>

						{/* 2. Internal Links */}
						{internalLinks.length > 0 && (
							<nav aria-label="Internal navigation links">
								<ul className="space-y-1">
									{[...internalLinks]
										.sort((a, b) => {
											if (a.label === "Acknowledgements") return 1;
											if (b.label === "Acknowledgements") return -1;
											return 0;
										})
										.map((link) => (
											<li key={link._key}>
												<Link
													href={`/${link.page?.slug || "#"}`}
													className="text-link text-sm leading-normal focus:outline-none"
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
								{/* OEDP Icon */}
								<a
									href="https://openenvironmentaldata.org"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Open Environmental Data Project (opens in new tab)"
									className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none"
								>
									<Image
										src="/oedp-icon.png"
										alt="OEDP"
										width={19.2}
										height={19.2}
										style={{ height: "auto" }}
									/>
								</a>

								{/* GitHub Icon */}
								<a
									href="https://github.com/oedp"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="GitHub (opens in new tab)"
									className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none"
								>
									<GitHubIcon className="h-[1.2rem] w-[1.2rem]" />
								</a>

								{/* Zenodo Icon */}
								<a
									href="https://zenodo.org/communities/oedp"
									target="_blank"
									rel="noopener noreferrer"
									aria-label="Zenodo (opens in new tab)"
									className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none"
								>
									<ZenodoIcon className="h-[1.2rem] w-[1.2rem]" />
								</a>

								{/* Email Icon */}
								<a
									href="mailto:info@openenvironmentaldata.org"
									aria-label="Email Open Environmental Data Project"
									className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none"
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
						<div className="w-full text-left text-primary text-xs">
							{license ? (
								<Link
									href={license.href || "#"}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex w-fit items-center gap-1 rounded-md border border-neutral-300 bg-primary/5 px-2.5 pt-0.5 pb-1 align-middle text-primary text-xs leading-normal no-underline transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
								>
									{license.label || "License"}
								</Link>
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
										src="/pattern-logo.svg"
										alt="Digitcore logo"
										width={24}
										height={24}
										className="mr-3"
										style={{ height: "auto" }}
										priority
									/>
									<h2 className="text-balance font-normal text-lg lg:hidden">
										DIGITCORE
									</h2>
									<h2 className="hidden text-balance font-normal text-lg lg:block">
										{title}
									</h2>
								</div>
							</div>

							{/* External links as horizontal row of icons in top right */}
							<nav
								className="col-span-4 flex justify-end"
								aria-label="External links"
							>
								<div className="flex items-center gap-4">
									{/* OEDP Icon */}
									<a
										href="https://openenvironmentaldata.org"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Open Environmental Data Project (opens in new tab)"
										className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none"
									>
										<Image
											src="/oedp-icon.png"
											alt="OEDP"
											width={19.2}
											height={19.2}
											style={{ height: "auto" }}
										/>
									</a>

									{/* GitHub Icon */}
									<a
										href="https://github.com/oedp"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="GitHub (opens in new tab)"
										className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none"
									>
										<GitHubIcon className="h-[1.2rem] w-[1.2rem]" />
									</a>

									{/* Zenodo Icon */}
									<a
										href="https://zenodo.org/communities/oedp"
										target="_blank"
										rel="noopener noreferrer"
										aria-label="Zenodo (opens in new tab)"
										className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none"
									>
										<ZenodoIcon className="h-[1.2rem] w-[1.2rem]" />
									</a>

									{/* Email Icon */}
									<a
										href="mailto:info@openenvironmentaldata.org"
										aria-label="Email Open Environmental Data Project"
										className="rounded text-primary transition-colors hover:text-primary/80 focus:outline-none"
									>
										<HugeiconsIcon
											icon={Mail01Icon}
											size={19.2}
											color="currentColor"
											strokeWidth={1.5}
										/>
									</a>
								</div>
							</nav>
						</div>

						{/* Bottom section with internal text links on the right, license on the left */}
						<div className="mt-auto grid grid-cols-12 items-end">
							{/* License left column */}
							<div className="col-span-8 col-start-1 w-full self-end text-left text-primary text-xs leading-normal">
								{license ? (
									<Link
										href={license.href || "#"}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex w-fit items-center gap-1 rounded-md border border-neutral-300 bg-primary/5 px-2.5 pt-0.5 pb-1 align-middle text-primary text-xs leading-normal no-underline transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
									>
										{license.label || "License"}
									</Link>
								) : (
									<p>Open Environmental Data Project 2025</p>
								)}
							</div>

							{/* Internal links right side, text left-aligned */}
							{internalLinks.length > 0 && (
								<nav
									className="col-span-3 col-start-10 self-end text-right"
									aria-label="Internal navigation links"
								>
									<ul className="space-y-1">
										{[...internalLinks]
											.sort((a, b) => {
												if (a.label === "Acknowledgements") return 1;
												if (b.label === "Acknowledgements") return -1;
												return 0;
											})
											.map((link) => (
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
