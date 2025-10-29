import "~/styles/globals.css";

import { randomUUID } from "node:crypto";
import { Home09Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { sans, signifier } from "~/app/[language]/fonts";
import { ErrorHeader } from "~/components/global/error-header";
import { Icon } from "~/components/shared/icon";
import { PageHeading } from "~/components/shared/page-heading";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { getNotFoundContent } from "./not-found-content";

export default function GlobalNotFound() {
	const englishContent = getNotFoundContent("en");
	const spanishContent = getNotFoundContent("es");
	const paragraphs = [
		...englishContent.paragraphs.map((text) => ({ id: randomUUID(), text })),
		...spanishContent.paragraphs.map((text) => ({ id: randomUUID(), text })),
	];

	return (
		<html lang="en" className="light" suppressHydrationWarning>
			<body className={cn(sans.variable, signifier.variable)}>
				<div className="flex h-screen w-full flex-col overflow-hidden">
					<ErrorHeader />
					<div className="flex flex-1 gap-2 overflow-hidden bg-page-background pt-16 md:pt-14">
						<div className="m-2 flex min-h-0 flex-1 flex-col overflow-y-auto rounded-md bg-container-background">
							<div className="3xl:max-w-6xl max-w-4xl px-5 pt-0 pb-5 2xl:max-w-5xl">
								<PageHeading title="404" />
								<div className="mt-8 space-y-8">
									<div className="space-y-4 text-neutral-600 text-xl leading-normal">
										{paragraphs.map((paragraph) => (
											<p key={paragraph.id}>{paragraph.text}</p>
										))}
									</div>

									<Button
										variant="outline"
										asChild
										className="rounded-md border-border bg-card px-3 py-2 text-neutral-500 text-sm uppercase hover:bg-secondary"
									>
										<Link href="/" className="flex items-center gap-3">
											{englishContent.ctaLabel}
											<Icon icon={Home09Icon} size={14} />
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
