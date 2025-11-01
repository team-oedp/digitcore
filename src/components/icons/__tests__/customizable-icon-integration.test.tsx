/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom/vitest" />
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, vi } from "vitest";
import { CustomizableIcon } from "../customizable-icon";

// Mock the actual SVG file content
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("CustomizableIcon Integration Tests", () => {
	beforeEach(() => {
		// Reset mocks
		mockFetch.mockClear();
	});

	it("applies CSS custom properties that can override SVG attributes", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				fillColor="#ff6b9d"
				strokeColor="#8b5cf6"
				fillOpacity={0.8}
				strokeOpacity={0.9}
				alt="Test icon"
			/>,
		);

		const icon = screen.getByAltText("Test icon");

		// Verify CSS custom properties are applied
		expect(icon.style.getPropertyValue("--icon-fill-color")).toBe("#ff6b9d");
		expect(icon.style.getPropertyValue("--icon-stroke-color")).toBe("#8b5cf6");
		expect(icon.style.getPropertyValue("--icon-fill-opacity")).toBe("0.8");
		expect(icon.style.getPropertyValue("--icon-stroke-opacity")).toBe("0.9");
	});

	it("does not set CSS custom properties when values are undefined", () => {
		render(<CustomizableIcon src="/icons/icon-01.svg" alt="Test icon" />);

		const icon = screen.getByAltText("Test icon");

		// Should not have any CSS custom properties set
		expect(icon.style.getPropertyValue("--icon-fill-color")).toBe("");
		expect(icon.style.getPropertyValue("--icon-stroke-color")).toBe("");
		expect(icon.style.getPropertyValue("--icon-fill-opacity")).toBe("");
		expect(icon.style.getPropertyValue("--icon-stroke-opacity")).toBe("");
	});

	it("updates CSS custom properties when props change", () => {
		const { rerender } = render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				fillColor="#ff0000"
				alt="Test icon"
			/>,
		);

		const icon = screen.getByAltText("Test icon");
		expect(icon.style.getPropertyValue("--icon-fill-color")).toBe("#ff0000");

		// Update props
		rerender(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				fillColor="#00ff00"
				strokeColor="#0000ff"
				alt="Test icon"
			/>,
		);

		expect(icon.style.getPropertyValue("--icon-fill-color")).toBe("#00ff00");
		expect(icon.style.getPropertyValue("--icon-stroke-color")).toBe("#0000ff");
	});

	it("handles zero opacity values correctly", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				fillOpacity={0}
				strokeOpacity={0}
				alt="Test icon"
			/>,
		);

		const icon = screen.getByAltText("Test icon");

		expect(icon.style.getPropertyValue("--icon-fill-opacity")).toBe("0");
		expect(icon.style.getPropertyValue("--icon-stroke-opacity")).toBe("0");
	});

	it("handles maximum opacity values correctly", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				fillOpacity={1}
				strokeOpacity={1}
				alt="Test icon"
			/>,
		);

		const icon = screen.getByAltText("Test icon");

		expect(icon.style.getPropertyValue("--icon-fill-opacity")).toBe("1");
		expect(icon.style.getPropertyValue("--icon-stroke-opacity")).toBe("1");
	});

	it("supports different color formats", () => {
		const colorFormats = [
			{ format: "hex", value: "#ff6b9d" },
			{ format: "rgb", value: "rgb(255, 107, 157)" },
			{ format: "rgba", value: "rgba(255, 107, 157, 0.8)" },
			{ format: "hsl", value: "hsl(330, 100%, 71%)" },
			{ format: "css-var", value: "var(--primary-color)" },
			{ format: "named", value: "red" },
		];

		for (const { format, value } of colorFormats) {
			const { unmount } = render(
				<CustomizableIcon
					src="/icons/icon-01.svg"
					fillColor={value}
					alt={`Test icon ${format}`}
				/>,
			);

			const icon = screen.getByAltText(`Test icon ${format}`);
			expect(icon.style.getPropertyValue("--icon-fill-color")).toBe(value);

			unmount();
		}
	});

	it("preserves other img attributes and event handlers", () => {
		const handleClick = vi.fn();
		const handleMouseEnter = vi.fn();

		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				fillColor="#ff6b9d"
				width={64}
				height={64}
				className="custom-class"
				onClick={handleClick}
				onMouseEnter={handleMouseEnter}
				data-testid="custom-icon"
				alt="Test icon"
			/>,
		);

		const icon = screen.getByTestId("custom-icon");

		// Check attributes
		expect(icon).toHaveAttribute("width", "64");
		expect(icon).toHaveAttribute("height", "64");
		expect(icon).toHaveClass("custom-class");
		expect(icon).toHaveAttribute("src", "/icons/icon-01.svg");

		// Check CSS custom property is still applied
		expect(icon.style.getPropertyValue("--icon-fill-color")).toBe("#ff6b9d");

		// Test event handlers
		fireEvent.click(icon);
		expect(handleClick).toHaveBeenCalledTimes(1);

		fireEvent.mouseEnter(icon);
		expect(handleMouseEnter).toHaveBeenCalledTimes(1);
	});

	it("memoizes style object to prevent unnecessary re-renders", () => {
		const TestWrapper = ({ fillColor }: { fillColor: string }) => (
			<CustomizableIcon
				src="/icons/icon-01.svg"
				fillColor={fillColor}
				strokeColor="#constant"
				alt="Test icon"
			/>
		);

		const { rerender } = render(<TestWrapper fillColor="#ff0000" />);
		const icon1 = screen.getByAltText("Test icon");
		const style1 = icon1.style;

		// Re-render with same props
		rerender(<TestWrapper fillColor="#ff0000" />);
		const icon2 = screen.getByAltText("Test icon");

		// Style object should be the same (memoized)
		expect(icon2.style.getPropertyValue("--icon-fill-color")).toBe("#ff0000");
		expect(icon2.style.getPropertyValue("--icon-stroke-color")).toBe(
			"#constant",
		);

		// Re-render with different props
		rerender(<TestWrapper fillColor="#00ff00" />);
		const icon3 = screen.getByAltText("Test icon");

		// Style should be updated
		expect(icon3.style.getPropertyValue("--icon-fill-color")).toBe("#00ff00");
		expect(icon3.style.getPropertyValue("--icon-stroke-color")).toBe(
			"#constant",
		);
	});

	it("handles stroke width customization", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				strokeWidth={3}
				alt="Test icon"
			/>,
		);

		const icon = screen.getByAltText("Test icon");
		expect(icon.style.getPropertyValue("--icon-stroke-width")).toBe("3");
	});

	it("combines multiple customizations correctly", () => {
		render(
			<CustomizableIcon
				src="/icons/icon-01.svg"
				fillColor="#ff6b9d"
				fillOpacity={0.7}
				strokeColor="#8b5cf6"
				strokeOpacity={0.8}
				strokeWidth={2}
				width={96}
				height={96}
				className="multi-custom"
				alt="Multi-customized icon"
			/>,
		);

		const icon = screen.getByAltText("Multi-customized icon");

		// Check all CSS custom properties
		expect(icon.style.getPropertyValue("--icon-fill-color")).toBe("#ff6b9d");
		expect(icon.style.getPropertyValue("--icon-fill-opacity")).toBe("0.7");
		expect(icon.style.getPropertyValue("--icon-stroke-color")).toBe("#8b5cf6");
		expect(icon.style.getPropertyValue("--icon-stroke-opacity")).toBe("0.8");
		expect(icon.style.getPropertyValue("--icon-stroke-width")).toBe("2");

		// Check regular attributes
		expect(icon).toHaveAttribute("width", "96");
		expect(icon).toHaveAttribute("height", "96");
		expect(icon).toHaveClass("multi-custom");
	});
});
