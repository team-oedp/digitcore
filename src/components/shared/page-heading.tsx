import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "../global/custom-portable-text";

export function PageHeading({
	title,
	description,
}: { title: string; description: PortableTextBlock[] }) {
	return (
		<header className="flex flex-col gap-5">
			<h1 className="text-heading">{title}</h1>
			<CustomPortableText value={description as PortableTextBlock[]} />
		</header>
	);
}
