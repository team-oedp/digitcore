import { describe, expect, it } from "vitest";
import { buildHreflang } from "./seo";

describe("buildHreflang", () => {
	it("builds absolute URLs for locales and x-default", () => {
		const map = buildHreflang("https://example.com", "/about", ["en", "es"]);
		expect(map.en).toBe("https://example.com/en/about");
		expect(map.es).toBe("https://example.com/es/about");
		expect(map["x-default"]).toBe("https://example.com/");
	});

	it("handles root path correctly", () => {
		const map = buildHreflang("https://example.com", "/", ["en"]);
		expect(map.en).toBe("https://example.com/en");
	});
});
