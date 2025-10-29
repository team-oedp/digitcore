import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { StructuredData } from "~/components/global/structured-data";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { cn } from "~/lib/utils";
import { sanityFetch } from "~/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "~/sanity/lib/queries";
import { OrientationStoreProvider } from "~/stores/orientation";
import "~/styles/globals.css";
import { sans, signifier } from "./(frontend)/fonts";

export async function generateMetadata(): Promise<Metadata> {
	const { isEnabled } = await draftMode();
	const site = await sanityFetch({
		query: SITE_SETTINGS_QUERY,
		revalidate: 3600,
		tags: ["siteSettings"],
	});

	const siteUrl = site?.url ?? "https://digitcore.org";
	const titleDefault = site?.seoTitle ?? site?.title ?? "DIGITCORE";
	const descriptionDefault =
		site?.seoDescription ??
		site?.description ??
		"Digital Toolkit for Collaborative Environmental Research";
	const ogImage = site?.seoImage
		? [{ url: site.seoImage, width: 1200, height: 630, alt: titleDefault }]
		: undefined;

	return {
		metadataBase: new URL(siteUrl),
		title: {
			default: titleDefault,
			template: "%s | DIGITCORE",
		},
		description: descriptionDefault,
		icons: [{ rel: "icon", url: "/favicon.ico" }],
		openGraph: {
			siteName: site?.openGraph?.siteName ?? "DIGITCORE",
			type: "website",
			images: ogImage,
		},
		twitter: {
			card: "summary_large_image",
			site: site?.openGraph?.twitterHandle
				? `@${site.openGraph.twitterHandle.replace(/^@/, "")}`
				: undefined,
		},
		alternates: {
			canonical: siteUrl,
		},
	} satisfies Metadata;
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(sans.variable, signifier.variable)}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<OrientationStoreProvider>{children}</OrientationStoreProvider>
					{/* Site-level JSON-LD */}
					<StructuredData
						data={{
							"@context": "https://schema.org",
							"@type": "WebSite",
							name: "DIGITCORE",
						}}
					/>
				</ThemeProvider>
			</body>
		</html>
	);
}
