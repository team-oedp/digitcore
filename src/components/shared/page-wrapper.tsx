import type * as React from "react";

export function PageWrapper({ children }: { children: React.ReactNode }) {
	return <div className="min-h-screen max-w-4xl px-5 pb-5">{children}</div>;
}
