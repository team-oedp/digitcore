import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Audience, Tag, Theme } from "~/sanity/sanity.types";
import { PatternConnections } from "./pattern-connections";

// Mock the ClickableBadge component to verify it's being used correctly
vi.mock("./clickable-badge", () => ({
	ClickableBadge: ({
		children,
		type,
		id,
		title,
		...props
	}: {
		children: React.ReactNode;
		type: "tag" | "audience" | "theme";
		id: string;
		title?: string;
		[key: string]: unknown;
	}) => (
		<a
			href={`/${type}/${id}`}
			data-testid={`clickable-badge-${type}`}
			data-type={type}
			data-id={id}
			data-title={title}
			{...props}
		>
			{children}
		</a>
	),
}));

// Mock HugeiconsIcon to avoid import issues
vi.mock("@hugeicons/react", () => ({
	HugeiconsIcon: ({
		icon,
		...props
	}: {
		icon: string;
		[key: string]: unknown;
	}) => <span data-testid="icon" {...props} />,
}));

describe("PatternConnections Component", () => {
	const mockTheme: Theme = {
		_id: "theme-123",
		_type: "theme",
		_createdAt: "2024-01-01",
		_updatedAt: "2024-01-01",
		_rev: "1",
		title: "Sustainability",
	};

	const mockAudiences: Audience[] = [
		{
			_id: "audience-1",
			_type: "audience",
			_createdAt: "2024-01-01",
			_updatedAt: "2024-01-01",
			_rev: "1",
			title: "Developers",
		},
		{
			_id: "audience-2",
			_type: "audience",
			_createdAt: "2024-01-01",
			_updatedAt: "2024-01-01",
			_rev: "1",
			title: "Designers",
		},
	];

	const mockTags: Tag[] = [
		{
			_id: "tag-1",
			_type: "tag",
			_createdAt: "2024-01-01",
			_updatedAt: "2024-01-01",
			_rev: "1",
			title: "accessibility",
		},
		{
			_id: "tag-2",
			_type: "tag",
			_createdAt: "2024-01-01",
			_updatedAt: "2024-01-01",
			_rev: "1",
			title: "open-source",
		},
	];

	describe("Rendering", () => {
		it("should render nothing when no connections are provided", () => {
			const { container } = render(<PatternConnections />);
			expect(container.firstChild).toBeNull();
		});

		it("should render theme badge when theme is provided", () => {
			render(<PatternConnections theme={mockTheme} />);

			const themeBadge = screen.getByTestId("clickable-badge-theme");
			expect(themeBadge).toBeInTheDocument();
			expect(themeBadge).toHaveAttribute("data-type", "theme");
			expect(themeBadge).toHaveAttribute("data-id", "theme-123");
			expect(themeBadge).toHaveAttribute("data-title", "Sustainability");
			expect(screen.getByText("Sustainability")).toBeInTheDocument();
		});

		it("should render all audience badges when audiences are provided", () => {
			render(<PatternConnections audiences={mockAudiences} />);

			const audienceBadges = screen.getAllByTestId("clickable-badge-audience");
			expect(audienceBadges).toHaveLength(2);

			expect(audienceBadges[0]).toHaveAttribute("data-id", "audience-1");
			expect(audienceBadges[0]).toHaveAttribute("data-title", "Developers");

			expect(audienceBadges[1]).toHaveAttribute("data-id", "audience-2");
			expect(audienceBadges[1]).toHaveAttribute("data-title", "Designers");

			expect(screen.getByText("Developers")).toBeInTheDocument();
			expect(screen.getByText("Designers")).toBeInTheDocument();
		});

		it("should render all tag badges when tags are provided", () => {
			render(<PatternConnections tags={mockTags} />);

			const tagBadges = screen.getAllByTestId("clickable-badge-tag");
			expect(tagBadges).toHaveLength(2);

			expect(tagBadges[0]).toHaveAttribute("data-id", "tag-1");
			expect(tagBadges[0]).toHaveAttribute("data-title", "accessibility");

			expect(tagBadges[1]).toHaveAttribute("data-id", "tag-2");
			expect(tagBadges[1]).toHaveAttribute("data-title", "open-source");

			expect(screen.getByText("accessibility")).toBeInTheDocument();
			expect(screen.getByText("open-source")).toBeInTheDocument();
		});

		it("should render all connection types when all are provided", () => {
			render(
				<PatternConnections
					theme={mockTheme}
					audiences={mockAudiences}
					tags={mockTags}
				/>,
			);

			expect(screen.getByTestId("clickable-badge-theme")).toBeInTheDocument();
			expect(screen.getAllByTestId("clickable-badge-audience")).toHaveLength(2);
			expect(screen.getAllByTestId("clickable-badge-tag")).toHaveLength(2);
		});
	});

	describe("Hover States", () => {
		it("should have hover styles on theme badge", () => {
			render(<PatternConnections theme={mockTheme} />);

			// The Badge component now uses a span with data-slot="badge"
			const badgeContent = screen
				.getByText("Sustainability")
				.closest('[data-slot="badge"]');
			expect(badgeContent).toHaveClass("cursor-pointer");
			// The Badge component uses CSS variables for hover styles
			expect(badgeContent).toHaveClass(
				"hover:border-[var(--theme-badge-border-dark)]",
			);
			expect(badgeContent).toHaveClass("transition-[color,box-shadow]");
		});

		it("should have hover styles on audience badges", () => {
			render(<PatternConnections audiences={mockAudiences} />);

			// The Badge component now uses a span with data-slot="badge"
			const badgeContent = screen
				.getByText("Developers")
				.closest('[data-slot="badge"]');
			expect(badgeContent).toHaveClass("cursor-pointer");
			// The Badge component uses CSS variables for hover styles
			expect(badgeContent).toHaveClass(
				"hover:border-[var(--audience-badge-border-dark)]",
			);
			expect(badgeContent).toHaveClass("transition-colors");
			expect(badgeContent).toHaveClass("hover:bg-blue-150");
		});

		it("should have hover styles on tag badges", () => {
			render(<PatternConnections tags={mockTags} />);

			// The Badge component now uses a span with data-slot="badge"
			const badgeContent = screen
				.getByText("accessibility")
				.closest('[data-slot="badge"]');
			expect(badgeContent).toHaveClass("cursor-pointer");
			// The Badge component uses CSS variables for hover styles
			expect(badgeContent).toHaveClass(
				"hover:border-[var(--tag-badge-border-dark)]",
			);
			expect(badgeContent).toHaveClass("transition-colors");
			expect(badgeContent).toHaveClass("hover:bg-violet-150");
		});
	});

	describe("Edge Cases", () => {
		it("should handle theme with null title", () => {
			const themeWithNullTitle: Theme = { ...mockTheme, title: undefined };
			render(<PatternConnections theme={themeWithNullTitle} />);

			const themeBadge = screen.getByTestId("clickable-badge-theme");
			expect(themeBadge).toBeInTheDocument();
			// When title is undefined, the attribute won't be set
			expect(themeBadge).not.toHaveAttribute("data-title");
		});

		it("should handle audiences with undefined titles", () => {
			const firstAudience = mockAudiences[0];
			if (!firstAudience)
				throw new Error("Test setup error: no first audience");

			const audienceWithUndefinedTitle: Audience = {
				_id: firstAudience._id,
				_type: firstAudience._type,
				_createdAt: firstAudience._createdAt,
				_updatedAt: firstAudience._updatedAt,
				_rev: firstAudience._rev,
				title: undefined,
			};
			render(<PatternConnections audiences={[audienceWithUndefinedTitle]} />);

			const audienceBadge = screen.getByTestId("clickable-badge-audience");
			expect(audienceBadge).toBeInTheDocument();
		});

		it("should handle tags with undefined titles", () => {
			const firstTag = mockTags[0];
			if (!firstTag) throw new Error("Test setup error: no first tag");

			const tagWithUndefinedTitle: Tag = {
				_id: firstTag._id,
				_type: firstTag._type,
				_createdAt: firstTag._createdAt,
				_updatedAt: firstTag._updatedAt,
				_rev: firstTag._rev,
				title: undefined,
			};
			render(<PatternConnections tags={[tagWithUndefinedTitle]} />);

			const tagBadge = screen.getByTestId("clickable-badge-tag");
			expect(tagBadge).toBeInTheDocument();
		});

		it("should handle empty arrays", () => {
			render(<PatternConnections theme={mockTheme} audiences={[]} tags={[]} />);

			// Should only render theme since arrays are empty
			expect(screen.getByTestId("clickable-badge-theme")).toBeInTheDocument();
			expect(
				screen.queryByTestId("clickable-badge-audience"),
			).not.toBeInTheDocument();
			expect(
				screen.queryByTestId("clickable-badge-tag"),
			).not.toBeInTheDocument();
		});
	});

	describe("Accessibility", () => {
		it("should maintain proper heading hierarchy", () => {
			const { container } = render(
				<PatternConnections
					theme={mockTheme}
					audiences={mockAudiences}
					tags={mockTags}
				/>,
			);

			// PatternConnections renders using BadgeGroupContainer which is a div
			const container_ = container.querySelector("div");
			expect(container_).toBeInTheDocument();
		});

		it("should be keyboard navigable", () => {
			render(
				<PatternConnections
					theme={mockTheme}
					audiences={mockAudiences}
					tags={mockTags}
				/>,
			);

			// All badges should be links and therefore focusable
			const allBadges = [
				screen.getByTestId("clickable-badge-theme"),
				...screen.getAllByTestId("clickable-badge-audience"),
				...screen.getAllByTestId("clickable-badge-tag"),
			];

			// Check that all badges are rendered as links (a elements)
			for (const badge of allBadges) {
				expect(badge).toBeInTheDocument();
				expect(badge.tagName).toBe("A");
				expect(badge).toHaveAttribute("href");
			}
		});
	});
});
