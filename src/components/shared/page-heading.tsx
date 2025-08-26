"use client";

export function PageHeading({ title }: { title: string }) {
	return (
		<header id="page-header" className="sticky top-0 z-40 flex flex-col gap-5">
			<h1 className="text-page-heading">{title}</h1>
		</header>
	);
}
