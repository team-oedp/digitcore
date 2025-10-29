import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { sanityFetch } from "~/sanity/lib/client";
import { PATTERN_QUERY } from "~/sanity/lib/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;
export const runtime = "nodejs";

export default async function Image({ params }: { params: { slug: string } }) {
	const { slug } = params;
	let title = decodeURIComponent(slug).replace(/-/g, " ");
	try {
		const pattern = await sanityFetch({
			query: PATTERN_QUERY,
			params: { slug },
			revalidate: 3600,
		});
		if (pattern?.title) title = pattern.title;
	} catch {}
	const logoSvg = fs.readFileSync(
		path.join(process.cwd(), "public/pattern-logo.svg"),
		"utf8",
	);
	const logo = `data:image/svg+xml;utf8,${encodeURIComponent(logoSvg)}`;

	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				background: "#ffffff",
				color: "#111827",
				padding: 64,
				justifyContent: "space-between",
			}}
		>
			<img src={logo} alt="Digitcore" width={220} height={60} />
			<div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>
				{title}
			</div>
		</div>,
		size,
	);
}
