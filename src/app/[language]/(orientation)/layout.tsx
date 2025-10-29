import { sans, signifier } from "~/app/[language]/fonts";
import { cn } from "~/lib/utils";

export default function OrientationLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				sans.variable,
				signifier.variable,
				"min-h-screen overflow-hidden bg-page-background text-foreground",
			)}
		>
			{children}
		</div>
	);
}
