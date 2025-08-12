import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
	it("should merge class names correctly", () => {
		const result = cn("px-4", "py-2", "bg-blue-500");
		expect(result).toBe("px-4 py-2 bg-blue-500");
	});

	it("should handle conditional classes", () => {
		const result = cn("px-4", false && "hidden", "py-2");
		expect(result).toBe("px-4 py-2");
	});

	it("should handle empty inputs", () => {
		const result = cn();
		expect(result).toBe("");
	});

	it("should merge conflicting Tailwind classes", () => {
		const result = cn("px-4", "px-8");
		expect(result).toBe("px-8");
	});

	it("should handle objects and arrays", () => {
		const result = cn(
			"base-class",
			{
				"conditional-class": true,
				"hidden-class": false,
			},
			["array-class-1", "array-class-2"],
		);
		expect(result).toBe(
			"base-class conditional-class array-class-1 array-class-2",
		);
	});
});
