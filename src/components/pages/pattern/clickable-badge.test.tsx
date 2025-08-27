import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ClickableBadge } from "./clickable-badge";

// Mock the badge-navigation module
vi.mock("~/lib/badge-navigation", () => ({
	getTagNavigationUrl: vi.fn(
		(title: string) => `/tags#letter-${title?.[0]?.toUpperCase() || ""}`,
	),
	getAudienceNavigationUrl: vi.fn((id: string) => `/explore?audiences=${id}`),
	getThemeNavigationUrl: vi.fn((id: string) => `/explore?themes=${id}`),
}));

// Mock Next.js Link component
vi.mock("next/link", () => ({
	default: ({
		href,
		children,
		className,
		...props
	}: {
		href: string;
		children: React.ReactNode;
		className?: string;
		[key: string]: unknown;
	}) => (
		<a href={href} className={className} {...props}>
			{children}
		</a>
	),
}));

describe("ClickableBadge Component", () => {
	describe("Tag Badge", () => {
		it("should render tag badge with correct link", () => {
			render(
				<ClickableBadge type="tag" id={"tag-123"} title="accessibility">
					<span>accessibility</span>
				</ClickableBadge>,
			);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/tags#letter-A");
			expect(link).toHaveAttribute(
				"aria-label",
				"Navigate to tag: accessibility",
			);
			expect(screen.getByText("accessibility")).toBeInTheDocument();
		});

		it("should fallback to /tags when tag title is missing", () => {
			render(
				<ClickableBadge type="tag" id={"tag-123"}>
					<span>Unknown Tag</span>
				</ClickableBadge>,
			);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/tags");
			expect(link).toHaveAttribute("aria-label", "Navigate to tag: tag-123");
		});

		it("should apply custom className", () => {
			render(
				<ClickableBadge
					type="tag"
					id={"tag-123"}
					title="test"
					className="custom-class"
				>
					<span>Test</span>
				</ClickableBadge>,
			);

			const link = screen.getByRole("link");
			expect(link).toHaveClass("custom-class");
			expect(link).toHaveClass("inline-flex");
			expect(link).toHaveClass("transition-all");
		});
	});

	describe("Audience Badge", () => {
		it("should render audience badge with correct link", () => {
			render(
				<ClickableBadge type="audience" id={"audience-456"} title="Developers">
					<span>Developers</span>
				</ClickableBadge>,
			);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/explore?audiences=audience-456");
			expect(link).toHaveAttribute(
				"aria-label",
				"Navigate to audience: Developers",
			);
			expect(screen.getByText("Developers")).toBeInTheDocument();
		});

		it("should use ID in aria-label when title is missing", () => {
			render(
				<ClickableBadge type="audience" id={"audience-456"}>
					<span>Audience Content</span>
				</ClickableBadge>,
			);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute(
				"aria-label",
				"Navigate to audience: audience-456",
			);
		});
	});

	describe("Theme Badge", () => {
		it("should render theme badge with correct link", () => {
			render(
				<ClickableBadge type="theme" id={"theme-789"} title="Sustainability">
					<span>Sustainability</span>
				</ClickableBadge>,
			);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/explore?themes=theme-789");
			expect(link).toHaveAttribute(
				"aria-label",
				"Navigate to theme: Sustainability",
			);
			expect(screen.getByText("Sustainability")).toBeInTheDocument();
		});

		it("should use ID in aria-label when title is missing", () => {
			render(
				<ClickableBadge type="theme" id={"theme-789"}>
					<span>Theme Content</span>
				</ClickableBadge>,
			);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute(
				"aria-label",
				"Navigate to theme: theme-789",
			);
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty className prop", () => {
			render(
				<ClickableBadge type="tag" id={"tag-123"} title="test" className="">
					<span>Test</span>
				</ClickableBadge>,
			);

			const link = screen.getByRole("link");
			expect(link).toHaveClass("inline-flex");
			expect(link).toHaveClass("transition-all");
		});

		it("should render children correctly", () => {
			render(
				<ClickableBadge type="theme" id={"theme-123"} title="Test Theme">
					<div data-testid="badge-content">
						<span>Badge Text</span>
						<svg data-testid="badge-icon" />
					</div>
				</ClickableBadge>,
			);

			expect(screen.getByTestId("badge-content")).toBeInTheDocument();
			expect(screen.getByText("Badge Text")).toBeInTheDocument();
			expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
		});

		it("should handle special characters in title and id", () => {
			render(
				<ClickableBadge
					type="tag"
					id={"tag-with-special-@#$"}
					title="Tag & Title with <special> chars"
				>
					<span>Special Tag</span>
				</ClickableBadge>,
			);

			const link = screen.getByRole("link");
			expect(link).toHaveAttribute("href", "/tags#letter-T");
			expect(link).toHaveAttribute(
				"aria-label",
				"Navigate to tag: Tag & Title with <special> chars",
			);
		});
	});
});
