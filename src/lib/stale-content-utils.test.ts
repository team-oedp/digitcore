import { describe, expect, it } from "vitest";
import {
	getStaleItemClasses,
	getStaleStatusText,
	staleIndicatorClasses,
} from "./stale-content-utils";

describe("stale-content-utils", () => {
	describe("getStaleItemClasses", () => {
		it("should return base classes when item is not stale", () => {
			const classes = getStaleItemClasses(false);

			expect(classes).toContain("carrier-bag-item-container");
			expect(classes).toContain("border-border");
			expect(classes).toContain("bg-background");
			expect(classes).not.toContain("border-amber-400");
			expect(classes).not.toContain("bg-amber-50");
		});

		it("should return stale classes when item is stale", () => {
			const classes = getStaleItemClasses(true);

			expect(classes).toContain("carrier-bag-item-container");
			expect(classes).toContain("border-amber-400");
			expect(classes).toContain("bg-amber-50");
			expect(classes).toContain("dark:border-amber-500");
			expect(classes).toContain("dark:bg-amber-950/30");
			expect(classes).not.toContain("border-border");
			expect(classes).not.toContain("bg-background");
		});

		it("should default to non-stale when no parameter provided", () => {
			const classes = getStaleItemClasses();

			expect(classes).toContain("border-border");
			expect(classes).toContain("bg-background");
			expect(classes).not.toContain("border-amber-400");
		});

		it("should include common classes regardless of stale state", () => {
			const freshClasses = getStaleItemClasses(false);
			const staleClasses = getStaleItemClasses(true);

			const commonClasses = [
				"carrier-bag-item-container",
				"flex",
				"items-center",
				"gap-3",
				"rounded-lg",
				"border",
				"px-3",
				"py-2.5",
				"transition-colors",
				"hover:bg-muted/50",
				"[&:hover_.item-actions]:opacity-100",
			];

			for (const className of commonClasses) {
				expect(freshClasses).toContain(className);
				expect(staleClasses).toContain(className);
			}
		});
	});

	describe("getStaleStatusText", () => {
		it("should return empty string when item is not stale", () => {
			const text = getStaleStatusText(false);
			expect(text).toBe("");
		});

		it("should return status text when item is stale", () => {
			const text = getStaleStatusText(true);
			expect(text).toBe("Content has been updated in the system");
		});

		it("should default to empty string when no parameter provided", () => {
			const text = getStaleStatusText();
			expect(text).toBe("");
		});

		it("should return consistent text for accessibility", () => {
			const text1 = getStaleStatusText(true);
			const text2 = getStaleStatusText(true);
			expect(text1).toBe(text2);
			expect(text1).toMatch(/content has been updated/i);
		});
	});

	describe("staleIndicatorClasses", () => {
		it("should have all required indicator class properties", () => {
			expect(staleIndicatorClasses).toHaveProperty("button");
			expect(staleIndicatorClasses).toHaveProperty("icon");
			expect(staleIndicatorClasses).toHaveProperty("border");
			expect(staleIndicatorClasses).toHaveProperty("background");
		});

		it("should have proper button classes for accessibility and styling", () => {
			const buttonClasses = staleIndicatorClasses.button;

			// Size and padding
			expect(buttonClasses).toContain("h-6");
			expect(buttonClasses).toContain("w-6");
			expect(buttonClasses).toContain("p-0");

			// Hover states
			expect(buttonClasses).toContain("hover:bg-amber-200");
			expect(buttonClasses).toContain("dark:hover:bg-amber-700");

			// Focus states for accessibility
			expect(buttonClasses).toContain("focus-visible:ring-amber-500");
		});

		it("should have proper icon classes for contrast", () => {
			const iconClasses = staleIndicatorClasses.icon;

			expect(iconClasses).toContain("text-amber-700");
			expect(iconClasses).toContain("dark:text-amber-300");
		});

		it("should have consistent amber color scheme across all classes", () => {
			const { button, icon, border, background } = staleIndicatorClasses;

			// All should use amber color variants
			expect(button).toMatch(/amber/);
			expect(icon).toMatch(/amber/);
			expect(border).toMatch(/amber/);
			expect(background).toMatch(/amber/);
		});

		it("should have proper contrast ratios for dark mode", () => {
			const { icon, border, background } = staleIndicatorClasses;

			// Dark mode variants should be present for accessibility
			expect(icon).toContain("dark:text-amber-300");
			expect(border).toContain("dark:border-amber-500");
			expect(background).toContain("dark:bg-amber-950/30");
		});

		it("should be consistent object reference", () => {
			// Object should maintain consistent references
			const originalButton = staleIndicatorClasses.button;
			const originalIcon = staleIndicatorClasses.icon;

			// References should be stable
			expect(staleIndicatorClasses.button).toBe(originalButton);
			expect(staleIndicatorClasses.icon).toBe(originalIcon);

			// Properties should be defined and non-empty
			expect(staleIndicatorClasses.button).toBeTruthy();
			expect(staleIndicatorClasses.icon).toBeTruthy();
		});
	});

	describe("integration scenarios", () => {
		it("should work together for complete stale item styling", () => {
			const isStale = true;

			const containerClasses = getStaleItemClasses(isStale);
			const statusText = getStaleStatusText(isStale);
			const buttonClasses = staleIndicatorClasses.button;
			const iconClasses = staleIndicatorClasses.icon;

			// Container should have stale styling
			expect(containerClasses).toContain("border-amber-400");
			expect(containerClasses).toContain("bg-amber-50");

			// Status should be set for screen readers
			expect(statusText).toBe("Content has been updated in the system");

			// Interactive elements should have consistent amber theming
			expect(buttonClasses).toContain("hover:bg-amber-200");
			expect(iconClasses).toContain("text-amber-700");
		});

		it("should work together for fresh item styling", () => {
			const isStale = false;

			const containerClasses = getStaleItemClasses(isStale);
			const statusText = getStaleStatusText(isStale);

			// Container should have normal styling
			expect(containerClasses).toContain("border-border");
			expect(containerClasses).toContain("bg-background");
			expect(containerClasses).not.toContain("amber");

			// No status text for fresh items
			expect(statusText).toBe("");
		});

		it("should handle edge cases gracefully", () => {
			// Undefined/null values should default to non-stale
			expect(getStaleItemClasses(undefined as boolean | undefined)).toContain(
				"border-border",
			);
			expect(getStaleStatusText(undefined as boolean | undefined)).toBe("");

			// All utility functions should be callable without errors
			expect(() => getStaleItemClasses()).not.toThrow();
			expect(() => getStaleStatusText()).not.toThrow();
			expect(() => staleIndicatorClasses.button).not.toThrow();
		});
	});
});
