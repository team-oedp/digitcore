/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom/vitest" />
import { fireEvent } from "@testing-library/dom";
import { render, screen } from "@testing-library/react";
import { expect, vi } from "vitest";
import { CustomizableIcon } from "../customizable-icon";

describe("CustomizableIcon Color Customization", () => {
	const testIconPath = "/icons/icon-01.svg";

	describe("CSS Custom Properties Application", () => {
		it("applies fill color as CSS custom property", () => {
			render(
				<CustomizableIcon
					src={testIconPath}
					fillColor="#ff6b9d"
					alt="Test icon"
				/>,
			);

			const icon = screen.getByAltText("Test icon");
			const computedStyle = window.getComputedStyle(icon);

			// Check that the CSS custom property is set
			expect(icon).toHaveStyle({ "--icon-fill-color": "#ff6b9d" });
		});

		it("applies stroke color as CSS custom property", () => {
			render(
				<CustomizableIcon
					src={testIconPath}
					strokeColor="#8b5cf6"
					alt="Test icon"
				/>,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({ "--icon-stroke-color": "#8b5cf6" });
		});

		it("applies fill opacity as CSS custom property", () => {
			render(
				<CustomizableIcon
					src={testIconPath}
					fillOpacity={0.7}
					alt="Test icon"
				/>,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({ "--icon-fill-opacity": "0.7" });
		});

		it("applies stroke opacity as CSS custom property", () => {
			render(
				<CustomizableIcon
					src={testIconPath}
					strokeOpacity={0.8}
					alt="Test icon"
				/>,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({ "--icon-stroke-opacity": "0.8" });
		});

		it("applies stroke width as CSS custom property", () => {
			render(
				<CustomizableIcon src={testIconPath} strokeWidth={3} alt="Test icon" />,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({ "--icon-stroke-width": "3" });
		});

		it("applies multiple CSS custom properties simultaneously", () => {
			render(
				<CustomizableIcon
					src={testIconPath}
					fillColor="#ff6b9d"
					fillOpacity={0.8}
					strokeColor="#8b5cf6"
					strokeOpacity={0.9}
					strokeWidth={2}
					alt="Test icon"
				/>,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({
				"--icon-fill-color": "#ff6b9d",
				"--icon-fill-opacity": "0.8",
				"--icon-stroke-color": "#8b5cf6",
				"--icon-stroke-opacity": "0.9",
				"--icon-stroke-width": "2",
			});
		});

		it("does not apply CSS custom properties when values are undefined", () => {
			render(<CustomizableIcon src={testIconPath} alt="Test icon" />);

			const icon = screen.getByAltText("Test icon");
			const style = icon.getAttribute("style");

			// Should not have any CSS custom properties when no props are provided
			if (style) {
				expect(style).not.toContain("--icon-fill-color");
				expect(style).not.toContain("--icon-stroke-color");
				expect(style).not.toContain("--icon-fill-opacity");
				expect(style).not.toContain("--icon-stroke-opacity");
				expect(style).not.toContain("--icon-stroke-width");
			} else {
				// If style is null, that's also correct - no custom properties applied
				expect(style).toBeNull();
			}
		});
	});

	describe("Color Value Formats", () => {
		it("handles hex colors", () => {
			render(
				<CustomizableIcon
					src={testIconPath}
					fillColor="#ff6b9d"
					alt="Test icon"
				/>,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({ "--icon-fill-color": "#ff6b9d" });
		});

		it("handles RGB colors", () => {
			render(
				<CustomizableIcon
					src={testIconPath}
					fillColor="rgb(255, 107, 157)"
					alt="Test icon"
				/>,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({ "--icon-fill-color": "rgb(255, 107, 157)" });
		});

		it("handles HSL colors", () => {
			render(
				<CustomizableIcon
					src={testIconPath}
					fillColor="hsl(330, 100%, 71%)"
					alt="Test icon"
				/>,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({ "--icon-fill-color": "hsl(330, 100%, 71%)" });
		});

		it("handles CSS color names", () => {
			render(
				<CustomizableIcon src={testIconPath} fillColor="red" alt="Test icon" />,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({ "--icon-fill-color": "red" });
		});

		it("handles CSS custom properties as values", () => {
			render(
				<CustomizableIcon
					src={testIconPath}
					fillColor="var(--primary-color)"
					alt="Test icon"
				/>,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({ "--icon-fill-color": "var(--primary-color)" });
		});
	});

	describe("Opacity Value Handling", () => {
		it("handles opacity value 0", () => {
			render(
				<CustomizableIcon src={testIconPath} fillOpacity={0} alt="Test icon" />,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({ "--icon-fill-opacity": "0" });
		});

		it("handles opacity value 1", () => {
			render(
				<CustomizableIcon src={testIconPath} fillOpacity={1} alt="Test icon" />,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({ "--icon-fill-opacity": "1" });
		});

		it("handles decimal opacity values", () => {
			render(
				<CustomizableIcon
					src={testIconPath}
					fillOpacity={0.5}
					strokeOpacity={0.75}
					alt="Test icon"
				/>,
			);

			const icon = screen.getByAltText("Test icon");
			expect(icon).toHaveStyle({
				"--icon-fill-opacity": "0.5",
				"--icon-stroke-opacity": "0.75",
			});
		});
	});

	describe("Performance and Re-rendering", () => {
		it("memoizes style object when props do not change", () => {
			const { rerender } = render(
				<CustomizableIcon
					src={testIconPath}
					fillColor="#ff6b9d"
					alt="Test icon"
				/>,
			);

			const icon1 = screen.getByAltText("Test icon");
			const style1 = icon1.getAttribute("style");

			// Re-render with same props
			rerender(
				<CustomizableIcon
					src={testIconPath}
					fillColor="#ff6b9d"
					alt="Test icon"
				/>,
			);

			const icon2 = screen.getByAltText("Test icon");
			const style2 = icon2.getAttribute("style");

			// Style should be the same (memoized)
			expect(style1).toBe(style2);
		});

		it("updates style object when props change", () => {
			const { rerender } = render(
				<CustomizableIcon
					src={testIconPath}
					fillColor="#ff6b9d"
					alt="Test icon"
				/>,
			);

			const icon1 = screen.getByAltText("Test icon");
			expect(icon1).toHaveStyle({ "--icon-fill-color": "#ff6b9d" });

			// Re-render with different props
			rerender(
				<CustomizableIcon
					src={testIconPath}
					fillColor="#8b5cf6"
					alt="Test icon"
				/>,
			);

			const icon2 = screen.getByAltText("Test icon");
			expect(icon2).toHaveStyle({ "--icon-fill-color": "#8b5cf6" });
		});
	});

	describe("Integration with Standard Props", () => {
		it("combines custom styling with standard img props", () => {
			render(
				<CustomizableIcon
					src={testIconPath}
					fillColor="#ff6b9d"
					width={64}
					height={64}
					className="custom-class"
					alt="Test icon"
					data-testid="custom-icon"
				/>,
			);

			const icon = screen.getByTestId("custom-icon");

			// Check custom styling
			expect(icon).toHaveStyle({ "--icon-fill-color": "#ff6b9d" });

			// Check standard props
			expect(icon).toHaveAttribute("width", "64");
			expect(icon).toHaveAttribute("height", "64");
			expect(icon).toHaveClass("custom-class");
			expect(icon).toHaveAttribute("alt", "Test icon");
		});

		it("forwards event handlers correctly", () => {
			const handleClick = vi.fn();
			const handleLoad = vi.fn();

			render(
				<CustomizableIcon
					src={testIconPath}
					fillColor="#ff6b9d"
					onClick={handleClick}
					onLoad={handleLoad}
					alt="Test icon"
				/>,
			);

			const icon = screen.getByAltText("Test icon");

			// Test that event handlers are attached (they exist as properties)
			expect(icon).toHaveProperty("onclick");
			expect(icon).toHaveProperty("onload");

			// Test click handler
			fireEvent.click(icon);
			expect(handleClick).toHaveBeenCalledTimes(1);
		});
	});
});
