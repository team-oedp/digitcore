/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom/vitest" />
import { render } from "@testing-library/react";
import { vi } from "vitest";
import { CustomizablePatternCombination } from "../customizable-pattern-combination";

// Mock the shape icon components
vi.mock("~/components/icons/shapes/icon-01", () => ({
	default: ({ style, ...props }: React.SVGProps<SVGSVGElement>) => (
		<svg data-testid="icon-01" style={style} {...props}>
			<title>icon-01</title>
			<path fill="var(--icon-fill-color, #85A374)" />
		</svg>
	),
}));

vi.mock("~/components/icons/shapes/icon-02", () => ({
	default: ({ style, ...props }: React.SVGProps<SVGSVGElement>) => (
		<svg data-testid="icon-02" style={style} {...props}>
			<title>icon-02</title>
			<path fill="var(--icon-fill-color, #85A374)" />
		</svg>
	),
}));

vi.mock("~/components/icons/shapes/icon-03", () => ({
	default: ({ style, ...props }: React.SVGProps<SVGSVGElement>) => (
		<svg data-testid="icon-03" style={style} {...props}>
			<title>icon-03</title>
			<path fill="var(--icon-fill-color, #85A374)" />
		</svg>
	),
}));

describe("CustomizablePatternCombination", () => {
	it("renders with default props", () => {
		render(<CustomizablePatternCombination />);

		// Should render a container
		const container = document.querySelector('[aria-hidden="true"]');
		expect(container).toBeInTheDocument();
	});

	it("applies custom colors to icons", () => {
		render(
			<CustomizablePatternCombination
				patterns={[1, 2, 3]}
				fillColor="#A35C89"
				strokeColor="#A35C89"
				fillOpacity={0.7}
				strokeOpacity={0.8}
			/>,
		);

		// Should render icons with custom colors
		const container = document.querySelector('[aria-hidden="true"]');
		const icons = container?.querySelectorAll("svg") || [];
		expect(icons.length).toBeGreaterThan(0);

		for (const icon of icons as unknown as Element[]) {
			const style = icon.getAttribute("style") || "";
			expect(style).toContain("--icon-fill-color: #A35C89");
			expect(style).toContain("--icon-stroke-color: #A35C89");
		}
	});

	it("uses specified patterns", () => {
		const { container } = render(
			<CustomizablePatternCombination patterns={[5, 10, 15]} />,
		);

		// Just verify the component renders without errors
		const patternContainer = container.querySelector('[aria-hidden="true"]');
		expect(patternContainer).toBeInTheDocument();
	});

	it("generates random patterns when specified", () => {
		const { container } = render(
			<CustomizablePatternCombination randomPatterns={4} />,
		);

		// Just verify the component renders without errors
		const patternContainer = container.querySelector('[aria-hidden="true"]');
		expect(patternContainer).toBeInTheDocument();
	});

	it("applies size classes correctly", () => {
		const { container } = render(<CustomizablePatternCombination size="lg" />);

		const wrapper = container.querySelector('[aria-hidden="true"]');
		expect(wrapper).toHaveClass("h-64");
	});

	it("handles custom numeric size", () => {
		render(<CustomizablePatternCombination size={100} patterns={[1]} />);

		const container = document.querySelector('[aria-hidden="true"]');
		const icon = container?.querySelector("svg");
		expect(icon).toHaveAttribute("width", "100");
		expect(icon).toHaveAttribute("height", "100");
	});
});
