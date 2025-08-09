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

const CURRENT_YEAR = new Date().getFullYear();

export default function SiteFooterLinks() {
	return (
		<div className="mx-auto grid h-full max-w-6xl grid-cols-12 gap-8 px-8 py-6">
			<div className="col-span-12 flex h-full flex-col justify-between lg:col-span-6">
				<div className="flex items-center">
					<Image
						src="/oedp-icon.png"
						alt="Digital Toolkit logo"
						width={24}
						height={24}
						className="mr-3"
						priority
					/>
					<h2 className="font-normal text-xl">
						Digital Toolkit for Open Environmental Research
					</h2>
				</div>
				<p className="mt-auto text-left text-gray-600 text-sm">
					Copyright {CURRENT_YEAR} © Open Environmental Data Project
				</p>
			</div>

			<nav
				className="col-span-12 lg:col-span-2 lg:col-start-10"
				aria-label="Social media links"
			>
				<ul className="space-y-2">
					{SOCIAL_LINKS.map((link) => (
						<li key={link.name}>
							<a
								href={link.href}
								className="text-base hover:underline focus:underline focus:outline-none"
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
	);
}
