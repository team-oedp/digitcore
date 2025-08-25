import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "../global/custom-portable-text";

export function PageHeading({
	title,
	description,
}: { title: string; description: PortableTextBlock[] }) {
	return (
		<header id="page-header" className="flex flex-col gap-5">
			<h1 className="text-page-heading">{title}</h1>
			<CustomPortableText
				value={description as PortableTextBlock[]}
				className="text-body"
			/>
		</header>
	);
}
