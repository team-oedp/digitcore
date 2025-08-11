"use client";

import { ComingSoon01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "../shared/icon";

export function MobileHoldingPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
			<div className="max-w-md text-center">
				<div className="mb-8">
					<h1 className="font-normal text-3xl text-foreground uppercase">
						Digitcore
					</h1>
				</div>

				<div className="space-y-4">
					<h2 className="font-normal text-2xl text-foreground">
						Mobile Experience Coming Soon
					</h2>

					<p className="text-muted-foreground">
						We're working hard to bring you an optimized mobile experience. Our
						responsive design is currently in development and will be ready
						soon.
					</p>

					<div className="pt-8">
						<p className="text-muted-foreground text-sm">
							For the best experience, please visit us on a desktop device.
						</p>
					</div>

					<div className="pt-4">
						<div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-secondary-foreground text-sm">
							<Icon icon={ComingSoon01Icon} className="h-4 w-4" />
							<span>In Development</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
