import fs from "node:fs";
import path from "node:path";
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { CustomizableIcon } from "../customizable-icon";

// Mock fetch to return actual SVG content
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("SVG Integration Tests", () => {
	beforeEach(() => {
		mockFetch.mockClear();
	});

	it("works with converted SVG files that have CSS custom properties", async () => {
		// Read an actual converted SVG file
		const svgPath = path.join(process.cwd(), "public/icons/icon-01.svg");
		const svgContent = fs.readFileSync(svgPath, "utf8");

		// Verify the SVG has been converted to use CSS custom properties
		expect(svgContent).toContain("var(--icon-fill-color, #85A374)");
		expect(svgContent).toContain("var(--icon-fill-opacity, 0.5)");
		expect(svgContent).toContain("var(--icon-stroke-color, #85A374)");
		expect(svgContent).toContain("var(--icon-stroke-opacity, 0.5)");
	});

	it("preserves fallback values from original SVG", async () => {
		// Read both original and converted SVG
		const originalPath = path.join(
			process.cwd(),
			"public/icons-backup/icon-01.svg",
		);
		const convertedPath = path.join(process.cwd(), "public/icons/icon-01.svg");

		const originalContent = fs.readFileSync(originalPath, "utf8");
		const convertedContent = fs.readFileSync(convertedPath, "utf8");

		// Extract original values
		const originalFillMatch = originalContent.match(/fill="([^"]+)"/);
		const originalStrokeMatch = originalContent.match(/stroke="([^"]+)"/);
		const originalFillOpacityMatch = originalContent.match(
			/fill-opacity="([^"]+)"/,
		);
		const originalStrokeOpacityMatch = originalContent.match(
			/stroke-opacity="([^"]+)"/,
		);

		if (originalFillMatch && originalFillMatch[1] !== "none") {
			expect(convertedContent).toContain(
				`var(--icon-fill-color, ${originalFillMatch[1]})`,
			);
		}

		if (originalStrokeMatch && originalStrokeMatch[1] !== "none") {
			expect(convertedContent).toContain(
				`var(--icon-stroke-color, ${originalStrokeMatch[1]})`,
			);
		}

		if (originalFillOpacityMatch) {
			expect(convertedContent).toContain(
				`var(--icon-fill-opacity, ${originalFillOpacityMatch[1]})`,
			);
		}

		if (originalStrokeOpacityMatch) {
			expect(convertedContent).toContain(
				`var(--icon-stroke-opacity, ${originalStrokeOpacityMatch[1]})`,
			);
		}
	});

	it("applies custom colors that override SVG fallbacks", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				fillColor="#ff0000"
				strokeColor="#00ff00"
				fillOpacity={0.9}
				strokeOpacity={0.8}
				alt="Test icon"
			/>,
		);

		const icon = screen.getByAltText("Test icon");

		// These custom values should override the SVG fallbacks
		expect(icon).toHaveStyle({
			"--icon-fill-color": "#ff0000",
			"--icon-stroke-color": "#00ff00",
			"--icon-fill-opacity": "0.9",
			"--icon-stroke-opacity": "0.8",
		});
	});

	it("works with all converted icon files", () => {
		// Test that all 24 icons can be rendered with custom colors
		for (let i = 1; i <= 24; i++) {
			const iconNumber = i.toString().padStart(2, "0");
			const { unmount } = render(
				<CustomizableIcon
					src={`/icons/icon-${iconNumber}.svg`}
					fillColor="#ff6b9d"
					strokeColor="#8b5cf6"
					alt={`Icon ${iconNumber}`}
				/>,
			);

			const icon = screen.getByAltText(`Icon ${iconNumber}`);
			expect(icon).toHaveStyle({
				"--icon-fill-color": "#ff6b9d",
				"--icon-stroke-color": "#8b5cf6",
			});

			unmount();
		}
	});

	it("handles edge cases in SVG content", () => {
		// Test with various edge cases
		const testCases = [
			{ fillColor: "transparent", expected: "transparent" },
			{ fillColor: "currentColor", expected: "currentColor" },
			{ fillColor: "inherit", expected: "inherit" },
			{ strokeColor: "none", expected: "none" },
		];

		for (const { fillColor, strokeColor, expected } of testCases) {
			const { unmount } = render(
				<CustomizableIcon
					src="/icons/icon-01.svg"
					fillColor={fillColor}
					strokeColor={strokeColor}
					alt="Edge case icon"
				/>,
			);

			const icon = screen.getByAltText("Edge case icon");

			if (fillColor) {
				expect(icon).toHaveStyle({ "--icon-fill-color": expected });
			}
			if (strokeColor) {
				expect(icon).toHaveStyle({ "--icon-stroke-color": expected });
			}

			unmount();
		}
	});

	it("maintains accessibility with custom colors", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				fillColor="#ff6b9d"
				alt="Accessible icon"
				role="img"
				aria-label="Custom colored icon"
			/>,
		);

		const icon = screen.getByRole("img");
		expect(icon).toHaveAttribute("alt", "Accessible icon");
		expect(icon).toHaveAttribute("aria-label", "Custom colored icon");
		expect(icon).toHaveStyle({ "--icon-fill-color": "#ff6b9d" });
	});
});
