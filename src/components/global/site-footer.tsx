import Image from "next/image";

type SocialLink = {
	name: string;
	href: string;
	isExternal: boolean;
};

const SOCIAL_LINKS: SocialLink[] = [
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

export function SiteFooter() {
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
									Digital Toolkit for Open Environmental Research
								</h2>
							</div>
						</div>

						{/* Social media navigation */}
						<nav
							className="md:col-span-4 md:col-start-9"
							aria-label="Social media links"
						>
							<ul className="space-y-1">
								{SOCIAL_LINKS.map((link) => (
									<li key={link.name}>
										<a
											href={link.href}
											className="text-sm hover:underline focus:underline focus:outline-none"
											{...(link.isExternal && {
												target: "_blank",
												rel: "noopener noreferrer",
												"aria-label": `${link.name} (opens in new tab)`,
											})}
										>
											{link.name}
										</a>
									</li>
								))}
							</ul>
						</nav>
					</div>

					{/* Copyright text */}
					<p className="mt-auto text-left text-primary text-xs">
						Open Environmental Data Project 2025
					</p>
				</div>
			</div>
		</footer>
	);
}
