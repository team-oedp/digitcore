/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
import fs from "node:fs";
import path from "node:path";

describe("Converted SVG Files", () => {
	const iconsDir = path.join(process.cwd(), "public/icons");
	const backupDir = path.join(process.cwd(), "public/icons-backup");

	// Get all SVG files
	const svgFiles = fs
		.readdirSync(iconsDir)
		.filter((file) => file.endsWith(".svg"))
		.sort();

	it("should have 24 SVG files in icons directory", () => {
		expect(svgFiles).toHaveLength(24);

		// Verify we have icon-01.svg through icon-24.svg
		for (let i = 1; i <= 24; i++) {
			const expectedFile = `icon-${i.toString().padStart(2, "0")}.svg`;
			expect(svgFiles).toContain(expectedFile);
		}
	});

	it("should have backup files for all converted SVGs", () => {
		expect(fs.existsSync(backupDir)).toBe(true);

		const backupFiles = fs
			.readdirSync(backupDir)
			.filter((file) => file.endsWith(".svg"))
			.sort();

		expect(backupFiles).toHaveLength(24);
		expect(backupFiles).toEqual(svgFiles);
	});

	describe.each(svgFiles)("SVG file: %s", (fileName) => {
		let svgContent: string;
		let backupContent: string;

		beforeAll(() => {
			svgContent = fs.readFileSync(path.join(iconsDir, fileName), "utf8");
			backupContent = fs.readFileSync(path.join(backupDir, fileName), "utf8");
		});

		it("should contain CSS custom properties for fill color", () => {
			expect(svgContent).toMatch(/fill="var\(--icon-fill-color,\s*[^)]+\)"/);
		});

		it("should contain CSS custom properties for fill opacity", () => {
			expect(svgContent).toMatch(
				/fill-opacity="var\(--icon-fill-opacity,\s*[^)]+\)"/,
			);
		});

		it("should contain CSS custom properties for stroke color", () => {
			expect(svgContent).toMatch(
				/stroke="var\(--icon-stroke-color,\s*[^)]+\)"/,
			);
		});

		it("should contain CSS custom properties for stroke opacity", () => {
			expect(svgContent).toMatch(
				/stroke-opacity="var\(--icon-stroke-opacity,\s*[^)]+\)"/,
			);
		});

		it("should preserve original values as fallbacks", () => {
			// Extract original fill color from backup
			const originalFillMatch = backupContent.match(/fill="([^"]+)"/);
			const originalStrokeMatch = backupContent.match(/stroke="([^"]+)"/);
			const originalFillOpacityMatch = backupContent.match(
				/fill-opacity="([^"]+)"/,
			);
			const originalStrokeOpacityMatch = backupContent.match(
				/stroke-opacity="([^"]+)"/,
			);

			if (originalFillMatch) {
				const originalFill = originalFillMatch[1];
				// Only expect conversion if the fill is not 'none'
				if (originalFill !== "none") {
					expect(svgContent).toContain(
						`var(--icon-fill-color, ${originalFill})`,
					);
				} else {
					// 'none' values should remain unchanged
					expect(svgContent).toContain('fill="none"');
				}
			}

			if (originalStrokeMatch) {
				const originalStroke = originalStrokeMatch[1];
				// Only expect conversion if the stroke is not 'none'
				if (originalStroke !== "none") {
					expect(svgContent).toContain(
						`var(--icon-stroke-color, ${originalStroke})`,
					);
				} else {
					// 'none' values should remain unchanged
					expect(svgContent).toContain('stroke="none"');
				}
			}

			if (originalFillOpacityMatch) {
				const originalFillOpacity = originalFillOpacityMatch[1];
				expect(svgContent).toContain(
					`var(--icon-fill-opacity, ${originalFillOpacity})`,
				);
			}

			if (originalStrokeOpacityMatch) {
				const originalStrokeOpacity = originalStrokeOpacityMatch[1];
				expect(svgContent).toContain(
					`var(--icon-stroke-opacity, ${originalStrokeOpacity})`,
				);
			}
		});

		it("should maintain valid SVG structure", () => {
			// Check that it's still valid XML/SVG
			expect(svgContent).toMatch(/^<svg[^>]*>/);
			expect(svgContent).toContain("</svg>");
			expect(svgContent).toContain("viewBox=");
			expect(svgContent).toContain('xmlns="http://www.w3.org/2000/svg"');
		});

		it("should not contain hardcoded colors (except in fallbacks)", () => {
			// Remove CSS custom property declarations to check for remaining hardcoded colors
			const withoutCssVars = svgContent
				.replace(/var\([^)]+\)/g, "CSS_VAR")
				.replace(/fill="CSS_VAR"/g, "")
				.replace(/stroke="CSS_VAR"/g, "")
				.replace(/fill-opacity="CSS_VAR"/g, "")
				.replace(/stroke-opacity="CSS_VAR"/g, "");

			// Should not have standalone color attributes (outside of CSS vars)
			expect(withoutCssVars).not.toMatch(/fill="#[0-9A-Fa-f]{6}"/);
			expect(withoutCssVars).not.toMatch(/stroke="#[0-9A-Fa-f]{6}"/);
		});

		it("should have different content from backup (proving conversion occurred)", () => {
			expect(svgContent).not.toBe(backupContent);

			// Should have more content due to CSS custom properties
			expect(svgContent.length).toBeGreaterThan(backupContent.length);
		});
	});

	it("should have consistent conversion pattern across all files", () => {
		const conversionPatterns = svgFiles.map((fileName) => {
			const content = fs.readFileSync(path.join(iconsDir, fileName), "utf8");

			return {
				fileName,
				hasFillVar: content.includes("var(--icon-fill-color,"),
				hasStrokeVar: content.includes("var(--icon-stroke-color,"),
				hasFillOpacityVar: content.includes("var(--icon-fill-opacity,"),
				hasStrokeOpacityVar: content.includes("var(--icon-stroke-opacity,"),
			};
		});

		// All files should have the same conversion pattern
		const firstPattern = conversionPatterns[0];
		for (const pattern of conversionPatterns) {
			expect(pattern.hasFillVar).toBe(firstPattern.hasFillVar);
			expect(pattern.hasStrokeVar).toBe(firstPattern.hasStrokeVar);
			expect(pattern.hasFillOpacityVar).toBe(firstPattern.hasFillOpacityVar);
			expect(pattern.hasStrokeOpacityVar).toBe(
				firstPattern.hasStrokeOpacityVar,
			);
		}
	});
});
