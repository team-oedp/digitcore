import type { Metadata } from "next";
import { ThemeProvider } from "~/components/theme/theme-provider";
import { type Language, i18n, supportedLanguageIds } from "~/i18n/config";
import { cn } from "~/lib/utils";
import { OrientationStoreProvider } from "~/stores/orientation";
import "~/styles/globals.css";
import { sans, signifier } from "./fonts";

export function generateStaticParams() {
	return i18n.languages.map((language) => ({ language: language.id }));
}

export const metadata: Metadata = {
	title: "DIGITCORE",
	description: "Digital Toolkit for Collaborative Environmental Research",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

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
				</ThemeProvider>
			</body>
		</html>
	);
}
