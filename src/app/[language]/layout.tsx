import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { StructuredData } from "~/components/global/structured-data";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { type Language, i18n, supportedLanguageIds } from "~/i18n/config";
import { cn } from "~/lib/utils";
import { sanityFetch } from "~/sanity/lib/client";
import { SITE_SETTINGS_QUERY } from "~/sanity/lib/queries";
import { OrientationStoreProvider } from "~/stores/orientation";
import "~/styles/globals.css";
import { sans, signifier } from "./fonts";

export function generateStaticParams() {
	return i18n.languages.map((language) => ({ language: language.id }));
}

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

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ language: Language }>;
}) {
	const { language } = await params;
	const lang = supportedLanguageIds.has(language) ? language : i18n.base;

	return (
		<html lang={lang} suppressHydrationWarning>
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
