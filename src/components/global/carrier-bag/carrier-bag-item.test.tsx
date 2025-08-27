import { fireEvent, render, screen } from "@testing-library/react";
import type Link from "next/link";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { CarrierBagItem, type CarrierBagItemData } from "./carrier-bag-item";

type LinkProps = ComponentProps<typeof Link>;

vi.mock("next/link", () => ({
	default: ({ children, href, ...props }: LinkProps) => (
		<a
			href={typeof href === "string" ? href : href?.pathname || ""}
			{...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
		>
			{children}
		</a>
	),
}));

describe("CarrierBagItem", () => {
	const mockOnRemove = vi.fn();
	const mockOnVisit = vi.fn();

	const baseItem: CarrierBagItemData = {
		id: "test-123",
		title: "Test Pattern",
		slug: "test-pattern",
		subtitle: "Test Theme",
	};

	beforeEach(() => {
		mockOnRemove.mockClear();
		mockOnVisit.mockClear();
	});

	it("renders the pattern title and subtitle", () => {
		render(
			<CarrierBagItem
				item={baseItem}
				onRemove={mockOnRemove}
				onVisit={mockOnVisit}
			/>,
		);

		expect(screen.getByText("Test Pattern")).toBeInTheDocument();
		expect(screen.getByText("Test Theme")).toBeInTheDocument();
	});

	it("renders a link to the pattern page when slug is provided", () => {
		render(
			<CarrierBagItem
				item={baseItem}
				onRemove={mockOnRemove}
				onVisit={mockOnVisit}
			/>,
		);

		const link = screen.getByRole("link", { name: /Test Pattern/i });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "/pattern/test-pattern");
	});

	it("does not render a link when slug is not provided", () => {
		const itemWithoutSlug = { ...baseItem, slug: undefined };
		render(
			<CarrierBagItem
				item={itemWithoutSlug}
				onRemove={mockOnRemove}
				onVisit={mockOnVisit}
			/>,
		);

		const link = screen.queryByRole("link");
		expect(link).not.toBeInTheDocument();
		expect(screen.getByText("Test Pattern")).toBeInTheDocument();
	});

	it("calls onRemove with the correct id when remove button is clicked", () => {
		render(
			<CarrierBagItem
				item={baseItem}
				onRemove={mockOnRemove}
				onVisit={mockOnVisit}
			/>,
		);

		const removeButton = screen.getByRole("button", {
			name: /Remove Test Pattern/i,
		});
		fireEvent.click(removeButton);

		expect(mockOnRemove).toHaveBeenCalledTimes(1);
		expect(mockOnRemove).toHaveBeenCalledWith("test-123");
	});

	it("calls onVisit with the slug when visit button is clicked", () => {
		render(
			<CarrierBagItem
				item={baseItem}
				onRemove={mockOnRemove}
				onVisit={mockOnVisit}
			/>,
		);

		const visitButton = screen.getByRole("button", {
			name: /Visit Test Pattern/i,
		});
		fireEvent.click(visitButton);

		expect(mockOnVisit).toHaveBeenCalledTimes(1);
		expect(mockOnVisit).toHaveBeenCalledWith("test-pattern");
	});

	it("stops event propagation when buttons are clicked", () => {
		const mockParentClick = vi.fn();
		const { container } = render(
			<button
				type="button"
				onClick={mockParentClick}
				onPointerDown={mockParentClick}
				onKeyDown={mockParentClick}
				style={{ display: "block" }}
			>
				<CarrierBagItem
					item={baseItem}
					onRemove={mockOnRemove}
					onVisit={mockOnVisit}
				/>
			</button>,
		);

		const visitButton = screen.getByRole("button", {
			name: /Visit Test Pattern/i,
		});
		const removeButton = screen.getByRole("button", {
			name: /Remove Test Pattern/i,
		});

		// Click visit button - should not trigger parent click
		fireEvent.click(visitButton);
		fireEvent.pointerDown(visitButton);
		expect(mockOnVisit).toHaveBeenCalledTimes(1);
		expect(mockParentClick).not.toHaveBeenCalled();

		// Click remove button - should not trigger parent click
		fireEvent.click(removeButton);
		fireEvent.pointerDown(removeButton);
		expect(mockOnRemove).toHaveBeenCalledTimes(1);
		expect(mockParentClick).not.toHaveBeenCalled();

		// Click the link - should not trigger parent click
		const link = screen.getByRole("link", { name: /Test Pattern/i });
		fireEvent.click(link);
		fireEvent.pointerDown(link);
		expect(mockParentClick).not.toHaveBeenCalled();
	});

	it("disables the visit button when slug is not provided", () => {
		const itemWithoutSlug = { ...baseItem, slug: undefined };
		render(
			<CarrierBagItem
				item={itemWithoutSlug}
				onRemove={mockOnRemove}
				onVisit={mockOnVisit}
			/>,
		);

		const visitButton = screen.getByRole("button", {
			name: /Visit Test Pattern/i,
		});
		expect(visitButton).toBeDisabled();
	});

	it("does not call onVisit when visit button is clicked and slug is undefined", () => {
		const itemWithoutSlug = { ...baseItem, slug: undefined };
		render(
			<CarrierBagItem
				item={itemWithoutSlug}
				onRemove={mockOnRemove}
				onVisit={mockOnVisit}
			/>,
		);

		const visitButton = screen.getByRole("button", {
			name: /Visit Test Pattern/i,
		});
		fireEvent.click(visitButton);

		expect(mockOnVisit).not.toHaveBeenCalled();
	});

	it("handles missing callbacks gracefully", () => {
		render(<CarrierBagItem item={baseItem} />);

		const removeButton = screen.getByRole("button", {
			name: /Remove Test Pattern/i,
		});
		const visitButton = screen.getByRole("button", {
			name: /Visit Test Pattern/i,
		});

		// Should not throw errors when clicking buttons without callbacks
		expect(() => fireEvent.click(removeButton)).not.toThrow();
		expect(() => fireEvent.click(visitButton)).not.toThrow();
	});
});
