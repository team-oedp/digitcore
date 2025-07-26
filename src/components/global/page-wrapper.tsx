import type * as React from "react";

export function PageWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen p-5">
			<div className="max-w-4xl">{children}</div>
		</div>
	);
}