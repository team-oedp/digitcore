import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { cn } from "~/lib/utils";
import { themeScript } from "~/lib/theme-script";
import "~/styles/globals.css";
import { sans, signifier } from "./(frontend)/fonts";

export const metadata: Metadata = {
	title: "Digitcore",
	description: "Digitcore Sanity Studio",
	icons: [{ rel: "icon", url: "/oedp-icon.png" }],
};

export const viewport: Viewport = {
	colorScheme: "light",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<Script
					id="theme-script"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{ __html: themeScript }}
				/>
			</head>
			<body className={cn(sans.variable, signifier.variable)}>{children}</body>
		</html>
	);
}
