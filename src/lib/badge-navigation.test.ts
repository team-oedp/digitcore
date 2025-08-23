import { describe, expect, it } from "vitest";
import {
	getAudienceNavigationUrl,
	getBadgeNavigationUrl,
	getTagNavigationUrl,
	getThemeNavigationUrl,
} from "./badge-navigation";

describe("Badge Navigation Helper Functions", () => {
	describe("getTagNavigationUrl", () => {
		it("should generate correct URL for tags with lowercase titles", () => {
			const url = getTagNavigationUrl("accessibility");
			expect(url).toBe("/tags#letter-A");
		});

		it("should generate correct URL for tags with uppercase titles", () => {
			const url = getTagNavigationUrl("Blockchain");
			expect(url).toBe("/tags#letter-B");
		});

		it("should generate correct URL for tags with mixed case titles", () => {
			const url = getTagNavigationUrl("Open Source");
			expect(url).toBe("/tags#letter-O");
		});

		it("should handle tags starting with numbers", () => {
			const url = getTagNavigationUrl("3D printing");
			expect(url).toBe("/tags#letter-3");
		});

		it("should handle empty string", () => {
			const url = getTagNavigationUrl("");
			expect(url).toBe("/tags#letter-");
		});
	});

	describe("getAudienceNavigationUrl", () => {
		it("should generate correct URL with audience ID", () => {
			const url = getAudienceNavigationUrl("audience-123");
			expect(url).toBe("/explore?audiences=audience-123");
		});

		it("should handle special characters in audience ID", () => {
			const url = getAudienceNavigationUrl("audience_with-special.chars");
			expect(url).toBe("/explore?audiences=audience_with-special.chars");
		});

		it("should handle empty audience ID", () => {
			const url = getAudienceNavigationUrl("");
			expect(url).toBe("/explore?audiences=");
		});
	});

	describe("getThemeNavigationUrl", () => {
		it("should generate correct URL with theme ID", () => {
			const url = getThemeNavigationUrl("theme-456");
			expect(url).toBe("/explore?themes=theme-456");
		});

		it("should handle special characters in theme ID", () => {
			const url = getThemeNavigationUrl("theme_with-special.chars");
			expect(url).toBe("/explore?themes=theme_with-special.chars");
		});

		it("should handle empty theme ID", () => {
			const url = getThemeNavigationUrl("");
			expect(url).toBe("/explore?themes=");
		});
	});

	describe("getBadgeNavigationUrl", () => {
		describe("tag type", () => {
			it("should generate correct URL for tag with title", () => {
				const url = getBadgeNavigationUrl("tag", "tag-123", "Web Development");
				expect(url).toBe("/tags#letter-W");
			});

			it("should fallback to /tags when tag title is missing", () => {
				const url = getBadgeNavigationUrl("tag", "tag-123");
				expect(url).toBe("/tags");
			});

			it("should handle empty tag title", () => {
				const url = getBadgeNavigationUrl("tag", "tag-123", "");
				expect(url).toBe("/tags#letter-");
			});
		});

		describe("audience type", () => {
			it("should generate correct URL for audience", () => {
				const url = getBadgeNavigationUrl("audience", "aud-789", "Developers");
				expect(url).toBe("/explore?audiences=aud-789");
			});

			it("should ignore title for audience type", () => {
				const url = getBadgeNavigationUrl("audience", "aud-789");
				expect(url).toBe("/explore?audiences=aud-789");
			});
		});

		describe("theme type", () => {
			it("should generate correct URL for theme", () => {
				const url = getBadgeNavigationUrl("theme", "theme-012", "Sustainability");
				expect(url).toBe("/explore?themes=theme-012");
			});

			it("should ignore title for theme type", () => {
				const url = getBadgeNavigationUrl("theme", "theme-012");
				expect(url).toBe("/explore?themes=theme-012");
			});
		});

		describe("unknown type", () => {
			it("should return root URL for unknown badge type", () => {
				// @ts-expect-error Testing invalid type
				const url = getBadgeNavigationUrl("unknown", "id-123", "Title");
				expect(url).toBe("/");
			});
		});
	});
});
