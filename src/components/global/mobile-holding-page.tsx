"use client";

export function MobileHoldingPage() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
			<div className="max-w-md text-center">
				<div className="mb-8">
					{/* You can replace this with your logo */}
					<h1 className="text-3xl font-bold text-foreground">Digitcore</h1>
				</div>
				
				<div className="space-y-4">
					<h2 className="text-2xl font-semibold text-foreground">
						Mobile Experience Coming Soon
					</h2>
					
					<p className="text-muted-foreground">
						We're working hard to bring you an optimized mobile experience. 
						Our responsive design is currently in development and will be ready soon.
					</p>
					
					<div className="pt-8">
						<p className="text-sm text-muted-foreground">
							For the best experience, please visit us on a desktop device.
						</p>
					</div>
					
					<div className="pt-4">
						<div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-secondary-foreground">
							<svg
								className="h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>In Development</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
