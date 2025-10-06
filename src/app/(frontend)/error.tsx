"use client";

import { ArrowTurnBackwardIcon, Home09Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "~/components/shared/icon";
import { PageHeading } from "~/components/shared/page-heading";
import { Button } from "~/components/ui/button";

export default function ErrorPage({
	reset,
}: {
	reset: () => void;
}) {
	return (
		<div className="3xl:max-w-6xl max-w-4xl px-5 pt-0 pb-5 2xl:max-w-5xl">
			<div className="flex h-screen flex-col">
				<PageHeading title="Error" />

				<div className="mt-8 space-y-8">
					<div className="space-y-4 text-neutral-600 text-xl leading-normal">
						<p>An unexpected error occurred.</p>
						<p>
							You can try to load the page again or return to the homepage to
							continue using the DIGITCORE toolkit.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							onClick={reset}
							className="rounded-md border-border bg-card px-3 py-2 text-neutral-500 text-sm uppercase hover:bg-secondary"
						>
							<span className="flex items-center gap-3">
								Try again
								<Icon icon={ArrowTurnBackwardIcon} size={14} />
							</span>
						</Button>
						<Button
							variant="outline"
							asChild
							className="rounded-md border-border bg-card px-3 py-2 text-neutral-500 text-sm uppercase hover:bg-secondary"
						>
							<Link href="/" className="flex items-center gap-3">
								Go to homepage
								<Icon icon={Home09Icon} size={14} />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
