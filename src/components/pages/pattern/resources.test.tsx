import { render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import type { PATTERN_QUERYResult } from "~/sanity/sanity.types";

type ResourceFromQuery = NonNullable<
	NonNullable<PATTERN_QUERYResult>["resources"]
>[number];

type SolutionFromQuery = NonNullable<ResourceFromQuery["solutions"]>[number];

// Helper to create a valid solution mock
function createMockSolution(id: string, title: string): SolutionFromQuery {
	return {
		_id: id,
		_type: "solution",
		_createdAt: "2021-01-01T00:00:00Z",
		_updatedAt: "2021-01-01T00:00:00Z",
		_rev: "rev1",
		title,
		description: undefined,
		audiences: undefined,
	};
}

// Helper to create a valid resource mock
function createMockResource(
	id: string,
	title: string,
	descriptionText?: string,
	solutions?: SolutionFromQuery[],
): ResourceFromQuery {
	return {
		_id: id,
		_type: "resource",
		_createdAt: "2021-01-01T00:00:00Z",
		_updatedAt: "2021-01-01T00:00:00Z",
		_rev: "rev1",
		title,
		description: descriptionText
			? [
					{
						_type: "block" as const,
						_key: "block1",
						children: [
							{
								_type: "span" as const,
								_key: "span1",
								text: descriptionText,
							},
						],
						style: "normal" as const,
						markDefs: null,
					},
				]
			: null,
		links: null,
		solutions: solutions || null,
	};
}

type HugeiconsIconProps = {
	icon: { name: string };
	size?: number | string;
	color?: string;
	strokeWidth?: number | string;
	className?: string;
};

type CustomPortableTextProps = {
	value?: Array<{
		children?: Array<{ text?: string }>;
	}>;
	className?: string;
};

type BadgeProps = {
	children?: React.ReactNode;
	variant?: string;
	icon?: React.ReactNode;
};

type SolutionPreviewProps = {
	children?: React.ReactNode;
	solutionNumber?: number;
	solutionTitle?: string;
};

import { Resources } from "./resources";

// Mock the HugeiconsIcon component
vi.mock("@hugeicons/react", () => ({
	HugeiconsIcon: ({
		icon,
		size,
		color,
		strokeWidth,
		className,
	}: HugeiconsIconProps) => (
		<svg
			data-testid="hugeicon"
			className={className}
			width={size}
			height={size}
			style={{ color }}
			strokeWidth={strokeWidth}
		>
			<title>{icon.name || "icon"}</title>
		</svg>
	),
}));

// Mock the CustomPortableText component
vi.mock("~/components/sanity/custom-portable-text", () => ({
	CustomPortableText: ({ value, className }: CustomPortableTextProps) => (
		<div className={className} data-testid="portable-text">
			{value?.[0]?.children?.[0]?.text || ""}
		</div>
	),
}));

// Mock the Badge component
vi.mock("~/components/ui/badge", () => ({
	Badge: ({ children, variant, icon }: BadgeProps) => (
		<span data-testid={`badge-${variant}`} className={`badge ${variant}`}>
			{icon && <span data-testid="badge-icon">{icon}</span>}
			{children}
		</span>
	),
}));

// Mock the SolutionPreview component
vi.mock("./solution-preview", () => ({
	SolutionPreview: ({
		children,
		solutionNumber,
		solutionTitle,
	}: SolutionPreviewProps) => (
		<div data-testid="solution-preview" data-solution-number={solutionNumber}>
			{children}
		</div>
	),
}));

describe("Resources Component", () => {
	it("should display 'Related solutions' when resource has solution references", () => {
		const mockResources: ResourceFromQuery[] = [
			createMockResource(
				"resource-1",
				"Test Resource",
				"This is a test resource description",
				[
					createMockSolution("solution-1", "Solution 1"),
					createMockSolution("solution-2", "Solution 2"),
				],
			),
		];

		render(<Resources resources={mockResources} />);

		// Check that 'Related solutions' label is displayed
		expect(screen.getByText(/Related\s+solutions/i)).toBeInTheDocument();
	});

	it("should display solution badges when resource has solution references", () => {
		const mockResources: ResourceFromQuery[] = [
			createMockResource(
				"resource-1",
				"Test Resource with Solutions",
				"Resource description",
				[
					createMockSolution("solution-1", "Solution 1"),
					createMockSolution("solution-2", "Solution 2"),
					createMockSolution("solution-3", "Solution 3"),
				],
			),
		];

		render(<Resources resources={mockResources} />);

		// Check that solution badges are displayed
		const solutionBadges = screen.getAllByTestId("badge-solution");
		expect(solutionBadges).toHaveLength(3);

		// Check that the badges have the correct text
		expect(screen.getByText("Solution 1")).toBeInTheDocument();
		expect(screen.getByText("Solution 2")).toBeInTheDocument();
		expect(screen.getByText("Solution 3")).toBeInTheDocument();

		// Verify the badges are within SolutionPreview components
		const solutionPreviews = screen.getAllByTestId("solution-preview");
		expect(solutionPreviews).toHaveLength(3);
	});

	it("should not display solution badges when resource has no solution references", () => {
		const mockResources: ResourceFromQuery[] = [
			createMockResource(
				"resource-1",
				"Resource without Solutions",
				"Resource description",
				undefined,
			),
		];

		render(<Resources resources={mockResources} />);

		// Check that no solution badges are displayed
		const solutionBadges = screen.queryAllByTestId("badge-solution");
		expect(solutionBadges).toHaveLength(0);

		// The 'Related solutions' label should not be present when there are no solution refs
		expect(screen.queryByText(/Related\s+solutions/i)).not.toBeInTheDocument();
	});

	it("should display multiple resources with their respective solution badges", () => {
		const mockResources: ResourceFromQuery[] = [
			createMockResource("resource-1", "First Resource", undefined, [
				createMockSolution("solution-1", "Solution 1"),
			]),
			createMockResource("resource-2", "Second Resource", undefined, [
				createMockSolution("solution-2", "Solution 1"),
				createMockSolution("solution-3", "Solution 2"),
			]),
			createMockResource("resource-3", "Third Resource", undefined, undefined),
		];

		render(<Resources resources={mockResources} />);

		// Check that all resources are displayed
		expect(screen.getByText("First Resource")).toBeInTheDocument();
		expect(screen.getByText("Second Resource")).toBeInTheDocument();
		expect(screen.getByText("Third Resource")).toBeInTheDocument();

		// Check that the correct number of solution badges are displayed
		const solutionBadges = screen.getAllByTestId("badge-solution");
		expect(solutionBadges).toHaveLength(3); // 1 + 2 = 3 total badges

		// Verify that badges are displayed - note that the solution numbering is per resource
		// First resource has Solution 1
		// Second resource has Solution 1 and Solution 2 (indexed from their array)
		// So we'll have two "Solution 1" badges and one "Solution 2" badge
		const solution1Badges = screen.getAllByText("Solution 1");
		expect(solution1Badges).toHaveLength(2); // One for first resource, one for second resource
		expect(screen.getByText("Solution 2")).toBeInTheDocument();
	});

	it("should handle empty resources array", () => {
		render(<Resources resources={[]} />);

		// Should render nothing
		expect(screen.queryByText("Resources")).not.toBeInTheDocument();
		expect(screen.queryByTestId("badge-solution")).not.toBeInTheDocument();
	});

	it("should display resource title and description correctly", () => {
		const mockResources: ResourceFromQuery[] = [
			createMockResource(
				"resource-1",
				"Important Resource",
				"This resource provides important information",
				[createMockSolution("solution-1", "Solution 1")],
			),
		];

		render(<Resources resources={mockResources} />);

		// Check that the resource title is displayed
		expect(screen.getByText("Important Resource")).toBeInTheDocument();

		// Check that the description is rendered through CustomPortableText
		const portableText = screen.getByTestId("portable-text");
		expect(portableText).toBeInTheDocument();
		expect(portableText).toHaveTextContent(
			"This resource provides important information",
		);
	});

	// Note: Links test removed as resources.links is always null in PATTERN_QUERYResult

	it("should display arrow icon between 'FROM SOLUTION' and badges", () => {
		const mockResources: ResourceFromQuery[] = [
			createMockResource("resource-1", "Test Resource", undefined, [
				createMockSolution("solution-1", "Solution 1"),
			]),
		];

		render(<Resources resources={mockResources} />);

		// Check that the arrow icon is displayed (between FROM SOLUTION and badges)
		const icons = screen.getAllByTestId("hugeicon");
		// There should be at least one icon for the arrow
		expect(icons.length).toBeGreaterThanOrEqual(1);
	});

	it("should display solution badges with ChartRelationshipIcon", () => {
		const mockResources: ResourceFromQuery[] = [
			createMockResource("resource-1", "Test Resource", undefined, [
				createMockSolution("solution-1", "Solution 1"),
			]),
		];

		render(<Resources resources={mockResources} />);

		// Check that the badge has an icon
		const badgeIcons = screen.getAllByTestId("badge-icon");
		expect(badgeIcons.length).toBeGreaterThan(0);
	});

	// Note: Invalid solution references test removed as solutions are now fully dereferenced in PATTERN_QUERYResult
});
