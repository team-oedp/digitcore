import type { Metadata } from "next";
import type { PortableTextBlock } from "next-sanity";
import { draftMode } from "next/headers";
import Image from "next/image";
import { CustomPortableText } from "~/components/global/custom-portable-text";
import { PageHeader } from "~/components/shared/page-header";
import { PageWrapper } from "~/components/shared/page-wrapper";
import { client } from "~/sanity/lib/client";
import { HOME_PAGE_QUERY, ICONS_QUERY } from "~/sanity/lib/queries";
import { urlFor } from "~/sanity/lib/image";
import { token } from "~/sanity/lib/token";
import type { Page } from "~/sanity/sanity.types";

// Temporary interface until types are regenerated
interface Icon {
	_id: string;
	_type: "icon";
	title: string;
	svg?: {
		asset?: {
			_ref: string;
			_type: "reference";
		};
		_type: "image";
	};
}

export const metadata: Metadata = {
	title: "DIGITCORE Toolkit | Home",
	description:
		"Community-centered open infrastructure empowering equitable collaboration between researchers, developers, and frontline communities.",
};

export default async function Home() {
	const isDraftMode = (await draftMode()).isEnabled;
	const fetchOptions = isDraftMode
		? { perspective: "previewDrafts", useCdn: false, stega: true, token }
		: { perspective: "published", useCdn: true };

	const [data, icons] = await Promise.all([
		client.fetch(HOME_PAGE_QUERY, {}, fetchOptions) as Promise<Page | null>,
		client.fetch(ICONS_QUERY, {}, fetchOptions) as Promise<Icon[]>,
	]);

	// Log icons data to debug
	console.log('Icons fetched from Sanity:', icons);

	const contentSections = (data?.content ?? []) as NonNullable<Page["content"]>;

	return (
		<PageWrapper>
			<div className="space-y-16 pb-16">
				<div className="sticky top-0 z-10 bg-primary-foreground pt-6 pb-2">
					<div className="flex items-start justify-between gap-6">
						<div className="flex-1">
							<PageHeader
								title={data?.title ?? undefined}
								description={
									data?.description as unknown as PortableTextBlock[]
								}
							/>
						</div>
					</div>
				</div>

				{/* Icons Section - Between header and content */}
				{icons.length > 0 && (
					<div className="lg:pl-20 pb-8">
						<div className="flex gap-6 justify-start">
							{icons.slice(0, 5).map((icon) => {
								// Log individual icon data
								if (icon.svg?.asset) {
									console.log(`Icon ${icon.title}:`, icon.svg);
								}
							return (
									<div 
										key={icon._id} 
										className="relative flex items-center justify-center w-16 h-16 overflow-hidden"
										title={icon.title}
									>
										{icon.svg?.asset ? (
											<Image
												src={urlFor(icon.svg).url()}
												alt={icon.title}
												width={48}
												height={48}
												className="object-contain"
												style={{ filter: 'brightness(0) saturate(100%) invert(69%) sepia(13%) saturate(500%) hue-rotate(90deg)' }}
											/>
										) : (
											<div className="text-xs text-neutral-400">No SVG</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				)}

				{contentSections.length > 0 && (
					<div className="space-y-8 lg:pl-20">
						{contentSections.map((section, index) => (
							<section
								key={section._key || index}
								className="max-w-4xl space-y-4"
							>
								{section.heading && (
									<h2 className="font-normal text-2xl text-neutral-500 uppercase tracking-wide">
										{section.heading}
									</h2>
								)}
								{section.body && (
									<CustomPortableText
										value={section.body as unknown as PortableTextBlock[]}
										className="prose-2xl prose-neutral-500 max-w-none prose-p:text-neutral-500 prose-p:leading-snug"
									/>
								)}
							</section>
						))}
					</div>
				)}
			</div>
		</PageWrapper>
	);
}
