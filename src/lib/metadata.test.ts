import { describe, expect, it } from "vitest";
import { buildAbsoluteUrl, buildOgImage, buildTitle } from "./metadata";

describe("metadata utils", () => {
	it("buildAbsoluteUrl joins base and path", () => {
		expect(buildAbsoluteUrl("https://example.com", "/a/b")).toBe(
			"https://example.com/a/b",
		);
	});

	it("buildOgImage returns sized image object with absolute URL", () => {
		const images = buildOgImage("/og.png", "https://example.com");
		expect(images?.[0]).toMatchObject({
			url: "https://example.com/og.png",
			width: 1200,
			height: 630,
		});
	});

	it("buildTitle returns default/template", () => {
		expect(buildTitle("DIGITCORE")).toEqual({
			default: "DIGITCORE",
			template: "%s | DIGITCORE",
		});
	});
});
