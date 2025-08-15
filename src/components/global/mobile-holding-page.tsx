"use client";

export function MobileHoldingPage() {
	return (
		<div className="fixed top-0 left-0 flex h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-12">
			<div className="max-w-md text-center">
				<div className="mb-8">
					<h1 className="font-normal text-3xl text-foreground uppercase">
						Digitcore
					</h1>
				</div>

				<div className="space-y-4">
					<h2 className="font-normal text-2xl text-foreground">
						Mobile Version Coming Soon
					</h2>

					<div className="pt-8">
						<p className="text-muted-foreground text-sm">
							For the best experience, please visit us on a desktop device.
						</p>
					</div>

					<div className="pt-4">
						<div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-secondary-foreground text-sm">
							<span>In Development</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
