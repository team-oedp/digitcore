export function PageHeading({ title }: { title: string }) {
	return (
		<header className="w-fit">
			<h1 className="text-page-heading">{title}</h1>
		</header>
	);
}
