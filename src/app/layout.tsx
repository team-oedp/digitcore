import type { Metadata } from "next";
import "~/styles/globals.css";

export const metadata: Metadata = {
	title: "Digitcore",
	description: "Digitcore Sanity Studio",
	icons: [{ rel: "icon", url: "/oedp-icon.png" }],
};

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>{children}</body>
		</html>
	);
}
