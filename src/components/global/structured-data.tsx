type JsonLdProps = { data: Record<string, unknown> };

export function StructuredData({ data }: JsonLdProps) {
	return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}
