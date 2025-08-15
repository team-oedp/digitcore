import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "../global/custom-portable-text";

export function PageHeader({
	title,
	description,
}: { title: string; description: PortableTextBlock[] }) {
	return (
		<header>
			<h1 className="text-heading">{title}</h1>
			<CustomPortableText value={description as PortableTextBlock[]} />
		</header>
	);
}
