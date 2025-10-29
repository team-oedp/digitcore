import type { Metadata } from "next";
import { ThemeProvider } from "~/components/theme/theme-provider";
import type { Language } from "~/i18n/config";
import { i18n } from "~/i18n/config";
import { cn } from "~/lib/utils";
import { OrientationStoreProvider } from "~/stores/orientation";
import "~/styles/globals.css";
import { sans, signifier } from "./(frontend)/fonts";

export const metadata: Metadata = {
	title: "DIGITCORE",
	description: "Digital Toolkit for Collaborative Environmental Research",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export async function generateStaticParams() {
	return i18n.languages.map((language) => ({ language: language.id }));
}

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ language: Language }>;
}) {
	const { language } = await params;
	console.log("language", language);
	return (
		<html lang={language} suppressHydrationWarning>
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
