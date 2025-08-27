"use client";

export function PageHeading({ title }: { title: string }) {
	return (
		<header id="page-header" className="sticky top-5 z-40">
			<h1 className="text-page-heading">{title}</h1>
		</header>
	);
}
