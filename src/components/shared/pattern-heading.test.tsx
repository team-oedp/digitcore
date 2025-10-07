import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Pattern } from "~/sanity/sanity.types";
import { CarrierBagStoreProvider } from "~/stores/carrier-bag";
import { PatternHeading } from "./pattern-heading";

// Mock the pattern icons utility
vi.mock("~/utils/pattern-icons", () => ({
	getPatternIconWithMapping: () => null,
}));

// Mock the icon component
vi.mock("./icon", () => ({
	Icon: ({ icon, ...props }: { icon?: string; [key: string]: unknown }) => (
		<span data-testid="icon" {...props} />
	),
}));

// Create a wrapper component that provides the carrier bag context
function TestWrapper({ children }: { children: React.ReactNode }) {
	return <CarrierBagStoreProvider>{children}</CarrierBagStoreProvider>;
}

describe("PageHeading Carrier Bag Functionality", () => {
	const mockPattern: Pattern = {
		_id: "test-pattern-1",
		_type: "pattern",
		_createdAt: "2023-01-01T00:00:00Z",
		_updatedAt: "2023-01-01T00:00:00Z",
		_rev: "1",
		title: "Test Pattern",
		slug: { _type: "slug", current: "test-pattern" },
	};

	beforeEach(() => {
		vi.clearAllMocks();
		// Clear localStorage before each test
		localStorage.clear();
	});

	it("should render save button when pattern is provided", () => {
		render(
			<TestWrapper>
				<PatternHeading
					title="Test Pattern"
					slug="test-pattern"
					pattern={mockPattern}
				/>
			</TestWrapper>,
		);

		const saveButton = screen.getByRole("button", {
			name: /save to carrier bag/i,
		});
		expect(saveButton).toBeInTheDocument();
		expect(saveButton).toHaveTextContent("Save to Carrier Bag");
	});

	it("should not render save button when pattern is not provided", () => {
		render(
			<TestWrapper>
				<PatternHeading title="Test Pattern" slug="test-pattern" />
			</TestWrapper>,
		);

		const saveButton = screen.queryByRole("button", {
			name: /save to carrier bag/i,
		});
		expect(saveButton).not.toBeInTheDocument();
	});

	it("should show inactive button state initially", () => {
		render(
			<TestWrapper>
				<PatternHeading
					title="Test Pattern"
					slug="test-pattern"
					pattern={mockPattern}
				/>
			</TestWrapper>,
		);

		const saveButton = screen.getByRole("button", {
			name: /save to carrier bag/i,
		});

		// Should have hover styles (not green active state)
		expect(saveButton).toHaveClass(
			"cursor-pointer",
			"bg-transparent",
			"hover:bg-secondary",
		);
		expect(saveButton).not.toHaveClass("border-green-200", "bg-green-50");
		expect(saveButton).not.toBeDisabled();
	});

	it("should change button state and text when pattern is added to carrier bag", async () => {
		render(
			<TestWrapper>
				<PatternHeading
					title="Test Pattern"
					slug="test-pattern"
					pattern={mockPattern}
				/>
			</TestWrapper>,
		);

		const saveButton = screen.getByRole("button", {
			name: /save to carrier bag/i,
		});

		// Click the save button
		fireEvent.click(saveButton);

		// Wait for state update and check the button state
		const updatedButton = screen.getByRole("button");
		expect(updatedButton).toHaveTextContent("Saved to Carrier Bag");
		expect(updatedButton).toHaveClass(
			"cursor-default",
			"border-green-200",
			"bg-green-50",
		);
		expect(updatedButton).toBeDisabled();
	});

	it("should prevent duplicate additions to carrier bag", async () => {
		render(
			<TestWrapper>
				<PatternHeading
					title="Test Pattern"
					slug="test-pattern"
					pattern={mockPattern}
				/>
			</TestWrapper>,
		);

		const saveButton = screen.getByRole("button", {
			name: /save to carrier bag/i,
		});

		// Click the save button twice
		fireEvent.click(saveButton);
		fireEvent.click(saveButton); // This should not do anything

		// Button should still show as saved (only one item should be added)
		const updatedButton = screen.getByRole("button");
		expect(updatedButton).toHaveTextContent("Saved to Carrier Bag");
		expect(updatedButton).toBeDisabled();
	});

	it("should maintain active state when component re-renders with same pattern", () => {
		const { rerender } = render(
			<TestWrapper>
				<PatternHeading
					title="Test Pattern"
					slug="test-pattern"
					pattern={mockPattern}
				/>
			</TestWrapper>,
		);

		const saveButton = screen.getByRole("button", {
			name: /save to carrier bag/i,
		});
		fireEvent.click(saveButton);

		// Re-render with same pattern
		rerender(
			<TestWrapper>
				<PatternHeading
					title="Test Pattern Updated"
					slug="test-pattern"
					pattern={mockPattern}
				/>
			</TestWrapper>,
		);

		const updatedButton = screen.getByRole("button");
		expect(updatedButton).toHaveTextContent("Saved to Carrier Bag");
		expect(updatedButton).toHaveClass("border-green-200", "bg-green-50");
		expect(updatedButton).toBeDisabled();
	});
});
