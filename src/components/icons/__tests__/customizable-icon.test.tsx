/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { CustomizableIcon } from "../customizable-icon";
import {
	applyColorPreset,
	getIconPath,
	validateIconProps,
} from "../icon-utils";

describe("CustomizableIcon", () => {
	it("renders with default props", () => {
		render(<CustomizableIcon src="/icons/icon-01.svg" alt="Test icon" />);

		const icon = screen.getByAltText("Test icon");
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute("src", "/icons/icon-01.svg");
	});

	it("applies custom fill color", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				fillColor="#ff6b9d"
				alt="Test icon"
			/>,
		);

		const icon = screen.getByAltText("Test icon");
		expect(icon).toHaveStyle({ "--icon-fill-color": "#ff6b9d" });
	});

	it("applies custom stroke color", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				strokeColor="#8b5cf6"
				alt="Test icon"
			/>,
		);

		const icon = screen.getByAltText("Test icon");
		expect(icon).toHaveStyle({ "--icon-stroke-color": "#8b5cf6" });
	});

	it("applies opacity values", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				fillOpacity={0.5}
				strokeOpacity={0.8}
				alt="Test icon"
			/>,
		);

		const icon = screen.getByAltText("Test icon");
		expect(icon).toHaveStyle({
			"--icon-fill-opacity": "0.5",
			"--icon-stroke-opacity": "0.8",
		});
	});

	it("applies width and height", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				width={64}
				height={64}
				alt="Test icon"
			/>,
		);

		const icon = screen.getByAltText("Test icon");
		expect(icon).toHaveAttribute("width", "64");
		expect(icon).toHaveAttribute("height", "64");
	});

	it("applies className", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				className="custom-class"
				alt="Test icon"
			/>,
		);

		const icon = screen.getByAltText("Test icon");
		expect(icon).toHaveClass("custom-class");
	});

	it("forwards additional props", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				alt="Test icon"
				data-testid="custom-icon"
			/>,
		);

		const icon = screen.getByTestId("custom-icon");
		expect(icon).toBeInTheDocument();
	});
});

describe("Icon Utilities", () => {
	describe("getIconPath", () => {
		it("generates correct paths for valid icon numbers", () => {
			expect(getIconPath(1)).toBe("/icons/icon-01.svg");
			expect(getIconPath(15)).toBe("/icons/icon-15.svg");
			expect(getIconPath(24)).toBe("/icons/icon-24.svg");
		});

		it("throws error for invalid icon numbers", () => {
			expect(() => getIconPath(0)).toThrow(
				"Icon number must be between 1 and 24",
			);
			expect(() => getIconPath(25)).toThrow(
				"Icon number must be between 1 and 24",
			);
			expect(() => getIconPath(-1)).toThrow(
				"Icon number must be between 1 and 24",
			);
		});
	});

	describe("applyColorPreset", () => {
		it("applies success preset correctly", () => {
			const preset = applyColorPreset("success");
			expect(preset).toEqual({
				fillColor: "#10b981",
				strokeColor: "#059669",
			});
		});

		it("applies preset with overrides", () => {
			const preset = applyColorPreset("success", { fillOpacity: 0.8 });
			expect(preset).toEqual({
				fillColor: "#10b981",
				strokeColor: "#059669",
				fillOpacity: 0.8,
			});
		});

		it("applies muted preset with opacity", () => {
			const preset = applyColorPreset("muted");
			expect(preset).toEqual({
				fillColor: "#9ca3af",
				strokeColor: "#6b7280",
				fillOpacity: 0.6,
				strokeOpacity: 0.6,
			});
		});
	});

	describe("validateIconProps", () => {
		it("validates correct props", () => {
			expect(
				validateIconProps({
					fillOpacity: 0.5,
					strokeOpacity: 0.8,
					strokeWidth: 2,
				}),
			).toBe(true);
		});

		it("validates opacity ranges", () => {
			// Mock console.warn to avoid test output
			const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

			expect(validateIconProps({ fillOpacity: -0.1 })).toBe(false);
			expect(validateIconProps({ fillOpacity: 1.1 })).toBe(false);
			expect(validateIconProps({ strokeOpacity: -0.1 })).toBe(false);
			expect(validateIconProps({ strokeOpacity: 1.1 })).toBe(false);

			consoleSpy.mockRestore();
		});

		it("validates stroke width", () => {
			const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

			expect(validateIconProps({ strokeWidth: -1 })).toBe(false);
			expect(validateIconProps({ strokeWidth: 0 })).toBe(true);
			expect(validateIconProps({ strokeWidth: 2 })).toBe(true);

			consoleSpy.mockRestore();
		});
	});
});
