import { describe, expect, it } from "vitest";
import * as og from "./opengraph-image";

describe("default opengraph image route", () => {
	it("exports size and contentType", () => {
		expect(og.size).toEqual({ width: 1200, height: 630 });
		expect(og.contentType).toBe("image/png");
	});
});
