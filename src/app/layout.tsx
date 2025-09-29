import type { Metadata } from "next";
import { cn } from "~/lib/utils";
import { OnboardingStoreProvider } from "~/stores/onboarding";
import "~/styles/globals.css";
import { sans, signifier } from "./(frontend)/fonts";

export const metadata: Metadata = {
	title: "Digitcore",
	description: "Digitcore Sanity Studio",
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
