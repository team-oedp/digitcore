import type { Metadata } from "next";
import { cn } from "~/lib/utils";
import { OnboardingStoreProvider } from "~/stores/onboarding";
import "~/styles/globals.css";
import { sans, signifier } from "./(frontend)/fonts";

export const metadata: Metadata = {
	title: "DIGITCORE",
	description: "Digital Toolkit for Collaborative Environmental Research",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(sans.variable, signifier.variable)}>
				<OnboardingStoreProvider>{children}</OnboardingStoreProvider>
			</body>
		</html>
	);
}
