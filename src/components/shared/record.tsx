import type { PortableTextBlock } from "next-sanity";
import { CustomPortableText } from "~/components/sanity/custom-portable-text";

type RecordProps = {
	name?: string | null;
	description?: PortableTextBlock[] | null;
};

export function Record({ name, description }: RecordProps) {
	if (!name) return null;

	return (
		<div className="pl-8">
			<div>
				<h3 className="font-medium text-body">{name}</h3>
			</div>
			{description && (
				<CustomPortableText value={description} className="mt-5 text-body" />
			)}
		</div>
	);
}
