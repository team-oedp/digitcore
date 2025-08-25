import { render, screen } from "@testing-library/react";
import type React from "react";
import { describe, expect, it, vi } from "vitest";
import type { DereferencedResource } from "./resources";

interface HugeiconsIconProps {
	icon: { name: string };
	size?: number | string;
	color?: string;
	strokeWidth?: number | string;
	className?: string;
}

interface CustomPortableTextProps {
	value?: Array<{
		children?: Array<{ text?: string }>;
	}>;
	className?: string;
}

interface BadgeProps {
	children?: React.ReactNode;
	variant?: string;
	icon?: React.ReactNode;
}

interface SolutionPreviewProps {
	children?: React.ReactNode;
	solutionNumber?: number;
	solutionTitle?: string;
}
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
vi.mock("~/components/global/custom-portable-text", () => ({
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
	it("should display 'FROM SOLUTION →' text when resource has solution references", () => {
		const mockResources: DereferencedResource[] = [
			{
				_id: "resource-1",
				title: "Test Resource",
				description: [
					{
						_type: "block",
						_key: "block1",
						children: [
							{
								_type: "span",
								_key: "span1",
								text: "This is a test resource description",
							},
						],
					},
				],
				solutionRefs: [
					{ _ref: "solution-1", _type: "reference", _key: "key1" },
					{ _ref: "solution-2", _type: "reference", _key: "key2" },
				],
			},
		];

		render(<Resources resources={mockResources} />);

		// Check that "FROM SOLUTION" text is displayed
		expect(screen.getByText("From")).toBeInTheDocument();
		expect(screen.getByText("SOLUTION")).toBeInTheDocument();
	});

	it("should display solution badges when resource has solution references", () => {
		const mockResources: DereferencedResource[] = [
			{
				_id: "resource-1",
				title: "Test Resource with Solutions",
				description: [
					{
						_type: "block",
						_key: "block1",
						children: [
							{
								_type: "span",
								_key: "span1",
								text: "Resource description",
							},
						],
					},
				],
				solutionRefs: [
					{ _ref: "solution-1", _type: "reference", _key: "key1" },
					{ _ref: "solution-2", _type: "reference", _key: "key2" },
					{ _ref: "solution-3", _type: "reference", _key: "key3" },
				],
			},
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
		const mockResources: DereferencedResource[] = [
			{
				_id: "resource-1",
				title: "Resource without Solutions",
				description: [
					{
						_type: "block",
						_key: "block1",
						children: [
							{
								_type: "span",
								_key: "span1",
								text: "Resource description",
							},
						],
					},
				],
				solutionRefs: undefined,
			},
		];

		render(<Resources resources={mockResources} />);

		// Check that no solution badges are displayed
		const solutionBadges = screen.queryAllByTestId("badge-solution");
		expect(solutionBadges).toHaveLength(0);

		// The "FROM SOLUTION" text should still be present but with no badges
		expect(screen.getByText("From")).toBeInTheDocument();
		expect(screen.getByText("SOLUTION")).toBeInTheDocument();
	});

	it("should display multiple resources with their respective solution badges", () => {
		const mockResources: DereferencedResource[] = [
			{
				_id: "resource-1",
				title: "First Resource",
				description: null,
				solutionRefs: [
					{ _ref: "solution-1", _type: "reference", _key: "key1" },
				],
			},
			{
				_id: "resource-2",
				title: "Second Resource",
				description: null,
				solutionRefs: [
					{ _ref: "solution-2", _type: "reference", _key: "key2" },
					{ _ref: "solution-3", _type: "reference", _key: "key3" },
				],
			},
			{
				_id: "resource-3",
				title: "Third Resource",
				description: null,
				solutionRefs: undefined,
			},
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
		const mockResources: DereferencedResource[] = [
			{
				_id: "resource-1",
				title: "Important Resource",
				description: [
					{
						_type: "block",
						_key: "block1",
						children: [
							{
								_type: "span",
								_key: "span1",
								text: "This resource provides important information",
							},
						],
					},
				],
				solutionRefs: [
					{ _ref: "solution-1", _type: "reference", _key: "key1" },
				],
			},
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

	it("should display link icon when resource has links", () => {
		const mockResources: DereferencedResource[] = [
			{
				_id: "resource-1",
				title: "Resource with Link",
				description: null,
				links: [{ href: "https://example.com" }],
				solutionRefs: [
					{ _ref: "solution-1", _type: "reference", _key: "key1" },
				],
			},
		];

		render(<Resources resources={mockResources} />);

		// Check that the link is rendered
		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "https://example.com");
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");

		// Check that the icon is within the link
		const icon = link.querySelector('[data-testid="hugeicon"]');
		expect(icon).toBeInTheDocument();
	});

	it("should display arrow icon between 'FROM SOLUTION' and badges", () => {
		const mockResources: DereferencedResource[] = [
			{
				_id: "resource-1",
				title: "Test Resource",
				description: null,
				solutionRefs: [
					{ _ref: "solution-1", _type: "reference", _key: "key1" },
				],
			},
		];

		render(<Resources resources={mockResources} />);

		// Check that the arrow icon is displayed (between FROM SOLUTION and badges)
		const icons = screen.getAllByTestId("hugeicon");
		// There should be at least one icon for the arrow
		expect(icons.length).toBeGreaterThanOrEqual(1);
	});

	it("should display solution badges with ChartRelationshipIcon", () => {
		const mockResources: DereferencedResource[] = [
			{
				_id: "resource-1",
				title: "Test Resource",
				description: null,
				solutionRefs: [
					{ _ref: "solution-1", _type: "reference", _key: "key1" },
				],
			},
		];

		render(<Resources resources={mockResources} />);

		// Check that the badge has an icon
		const badgeIcons = screen.getAllByTestId("badge-icon");
		expect(badgeIcons.length).toBeGreaterThan(0);
	});

	it("should properly handle solution references that are not valid", () => {
		const mockResources: DereferencedResource[] = [
			{
				_id: "resource-1",
				title: "Resource with mixed references",
				description: null,
				solutionRefs: [
					{ _ref: "solution-1", _type: "reference", _key: "key1" },
					// This should be filtered out by isSolutionReference
					{ _ref: "invalid", _type: "invalid", _key: "key2" },
					{ _ref: "solution-2", _type: "reference", _key: "key3" },
				],
			},
		];

		render(<Resources resources={mockResources} />);

		// Only valid solution badges should be displayed
		const solutionBadges = screen.getAllByTestId("badge-solution");
		expect(solutionBadges).toHaveLength(2);
		expect(screen.getByText("Solution 1")).toBeInTheDocument();
		expect(screen.getByText("Solution 3")).toBeInTheDocument(); // Index 2 becomes Solution 3
	});
});
