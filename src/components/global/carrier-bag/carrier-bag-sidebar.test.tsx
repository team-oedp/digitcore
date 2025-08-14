import {
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
import { SiteHeader } from "~/components/global/site-header";
import { PageHeader } from "~/components/shared/pattern-header";
import { SidebarProvider } from "~/components/ui/sidebar";
import type { Pattern } from "~/sanity/sanity.types";
import { CarrierBagStoreProvider } from "~/stores/carrier-bag";

// Mock the pattern icons utility
vi.mock("~/utils/pattern-icons", () => ({
	getPatternIconWithMapping: () => null,
}));

// Mock the icon component
vi.mock("~/components/shared/icon", () => ({
	Icon: ({ icon, ...props }: { icon: unknown; [key: string]: unknown }) => (
		<span data-testid="icon" {...props} />
	),
}));

// Mock PDF preview modal
vi.mock("~/components/pdf/pdf-preview-modal", () => ({
	PDFPreviewModal: ({ children }: { children: React.ReactNode }) => (
		<>{children}</>
	),
}));

// Mock pattern content hook
vi.mock("~/hooks/use-pattern-content", () => ({
	useCarrierBagDocument: () => null,
}));

// Mock mobile hook
vi.mock("~/hooks/use-mobile", () => ({
	useIsMobile: () => false,
}));

// Mock hydration hook
vi.mock("~/hooks/use-hydration", () => ({
	useHydration: () => true,
}));

// Mock router and navigation
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: vi.fn(),
	}),
	usePathname: () => "/test-page",
}));

// Mock Next.js components
vi.mock("next/link", () => ({
	default: ({
		href,
		children,
		...props
	}: { href: string; children: React.ReactNode; [key: string]: unknown }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

// Mock theme components
vi.mock("~/components/theme/language-selector", () => ({
	LanguageSelector: () => <div data-testid="language-selector">Language</div>,
}));

vi.mock("~/components/theme/mode-toggle", () => ({
	ModeToggle: () => <div data-testid="mode-toggle">Mode</div>,
}));

vi.mock("~/components/global/command-menu", () => ({
	CommandMenu: () => <div data-testid="command-menu">Command</div>,
}));

// Create a wrapper component that provides all necessary contexts
function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<CarrierBagStoreProvider>
			<SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
		</CarrierBagStoreProvider>
	);
}

describe("Carrier Bag Sidebar", () => {
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
		localStorage.clear();
	});

	describe("Integration", () => {
		it("should open sidebar when save pattern button is clicked", async () => {
			render(
				<TestWrapper>
					<PageHeader
						title="Test Pattern"
						slug="test-pattern"
						pattern={mockPattern}
					/>
					<CarrierBagSidebar data-testid="carrier-bag-sidebar" />
				</TestWrapper>,
			);

			// Find and click the save button
			const saveButton = screen.getByRole("button", {
				name: /save to carrier bag/i,
			});
			expect(saveButton).toBeInTheDocument();
			expect(saveButton).toHaveTextContent("Save to Carrier Bag");

			fireEvent.click(saveButton);

			// Wait for the button state to change
			await waitFor(() => {
				const updatedButton = screen
					.getByText("Saved to Carrier Bag")
					.closest("button");
				expect(updatedButton).toHaveTextContent("Saved to Carrier Bag");
				expect(updatedButton).toBeDisabled();
			});

			// Wait for the sidebar to open and show expanded state
			await waitFor(() => {
				const sidebarContainer = document.querySelector(
					'[data-slot="sidebar"][data-state="expanded"]',
				);
				expect(sidebarContainer).toBeInTheDocument();
			});

			// Verify the pattern appears in the sidebar (look for it within sidebar container)
			await waitFor(() => {
				const sidebar = screen.getByTestId("carrier-bag-sidebar");
				const patternInSidebar = within(sidebar).getByText("Test Pattern");
				expect(patternInSidebar).toBeInTheDocument();
			});
		});

		it("should show correct button state for patterns already in bag", async () => {
			render(
				<TestWrapper>
					<PageHeader
						title="Test Pattern"
						slug="test-pattern"
						pattern={mockPattern}
					/>
					<CarrierBagSidebar data-testid="carrier-bag-sidebar" />
				</TestWrapper>,
			);

			const saveButton = screen.getByRole("button", {
				name: /save to carrier bag/i,
			});

			// Click save button first time
			fireEvent.click(saveButton);

			// Wait for button state to change to disabled/saved state
			await waitFor(() => {
				const disabledButton = screen
					.getByText("Saved to Carrier Bag")
					.closest("button");
				expect(disabledButton).toBeDisabled();
				expect(disabledButton).toHaveTextContent("Saved to Carrier Bag");
			});

			// Verify pattern appears in sidebar
			await waitFor(() => {
				const sidebar = screen.getByTestId("carrier-bag-sidebar");
				const patternInSidebar = within(sidebar).getByText("Test Pattern");
				expect(patternInSidebar).toBeInTheDocument();
			});

			// Button should remain disabled and show saved state
			const finalButton = screen
				.getByText("Saved to Carrier Bag")
				.closest("button");
			expect(finalButton).toBeDisabled();
			expect(finalButton).toHaveTextContent("Saved to Carrier Bag");
			expect(finalButton).toHaveClass("border-green-200", "bg-green-50");
		});

		it("should show pattern count in sidebar", async () => {
			render(
				<TestWrapper>
					<PageHeader
						title="Test Pattern"
						slug="test-pattern"
						pattern={mockPattern}
					/>
					<CarrierBagSidebar data-testid="carrier-bag-sidebar" />
				</TestWrapper>,
			);

			const saveButton = screen.getByRole("button", {
				name: /save to carrier bag/i,
			});
			fireEvent.click(saveButton);

			// Wait for sidebar to open and show the pattern
			await waitFor(() => {
				const sidebar = screen.getByTestId("carrier-bag-sidebar");
				const patternInSidebar = within(sidebar).getByText("Test Pattern");
				expect(patternInSidebar).toBeInTheDocument();
			});

			// Verify clear and download buttons are enabled
			const clearButton = screen.getByRole("button", {
				name: /clear all items/i,
			});
			const downloadButton = screen.getByRole("button", {
				name: /download list as json/i,
			});

			expect(clearButton).not.toBeDisabled();
			expect(downloadButton).not.toBeDisabled();
		});
	});

	describe("Closing and Reopening", () => {
		it("should close sidebar when close button is clicked", async () => {
			render(
				<TestWrapper>
					<SiteHeader />
					<PageHeader
						title="Test Pattern"
						slug="test-pattern"
						pattern={mockPattern}
					/>
					<CarrierBagSidebar data-testid="carrier-bag-sidebar" />
				</TestWrapper>,
			);

			// Add a pattern to open the sidebar
			const saveButton = screen.getByRole("button", {
				name: /save to carrier bag/i,
			});
			fireEvent.click(saveButton);

			// Wait for sidebar to open
			await waitFor(() => {
				const sidebarContainer = document.querySelector(
					'[data-slot="sidebar"][data-state="expanded"]',
				);
				expect(sidebarContainer).toBeInTheDocument();
			});

			// Verify pattern appears in sidebar
			await waitFor(() => {
				const sidebar = screen.getByTestId("carrier-bag-sidebar");
				const patternInSidebar = within(sidebar).getByText("Test Pattern");
				expect(patternInSidebar).toBeInTheDocument();
			});

			// Click the close button in the sidebar
			const closeButton = screen.getByRole("button", {
				name: /close sidebar/i,
			});
			fireEvent.click(closeButton);

			// Wait for sidebar to close
			await waitFor(
				() => {
					const sidebarContainer = document.querySelector(
						'[data-slot="sidebar"][data-state="collapsed"]',
					);
					expect(sidebarContainer).toBeInTheDocument();
				},
				{ timeout: 3000 },
			);
		});

		it("should close sidebar when header toggle button is clicked", async () => {
			render(
				<TestWrapper>
					<SiteHeader />
					<PageHeader
						title="Test Pattern"
						slug="test-pattern"
						pattern={mockPattern}
					/>
					<CarrierBagSidebar data-testid="carrier-bag-sidebar" />
				</TestWrapper>,
			);

			// Add a pattern to open the sidebar
			const saveButton = screen.getByRole("button", {
				name: /save to carrier bag/i,
			});
			fireEvent.click(saveButton);

			// Wait for sidebar to open
			await waitFor(() => {
				const sidebarContainer = document.querySelector(
					'[data-slot="sidebar"][data-state="expanded"]',
				);
				expect(sidebarContainer).toBeInTheDocument();
			});

			// Click the header toggle button (sidebar icon in header)
			const headerToggleButton = screen.getByRole("button", {
				name: /toggle sidebar/i,
			});
			fireEvent.click(headerToggleButton);

			// Wait for sidebar to close
			await waitFor(
				() => {
					const sidebarContainer = document.querySelector(
						'[data-slot="sidebar"][data-state="collapsed"]',
					);
					expect(sidebarContainer).toBeInTheDocument();
				},
				{ timeout: 3000 },
			);
		});

		it("should allow sidebar to reopen after being closed", async () => {
			render(
				<TestWrapper>
					<SiteHeader />
					<PageHeader
						title="Test Pattern"
						slug="test-pattern"
						pattern={mockPattern}
					/>
					<CarrierBagSidebar data-testid="carrier-bag-sidebar" />
				</TestWrapper>,
			);

			// Add a pattern to open the sidebar
			const saveButton = screen.getByRole("button", {
				name: /save to carrier bag/i,
			});
			fireEvent.click(saveButton);

			// Wait for sidebar to open
			await waitFor(() => {
				const sidebarContainer = document.querySelector(
					'[data-slot="sidebar"][data-state="expanded"]',
				);
				expect(sidebarContainer).toBeInTheDocument();
			});

			// Close sidebar using close button
			const closeButton = screen.getByRole("button", {
				name: /close sidebar/i,
			});
			fireEvent.click(closeButton);

			// Wait for sidebar to close
			await waitFor(
				() => {
					const sidebarContainer = document.querySelector(
						'[data-slot="sidebar"][data-state="collapsed"]',
					);
					expect(sidebarContainer).toBeInTheDocument();
				},
				{ timeout: 3000 },
			);

			// Reopen sidebar using header toggle button
			const headerToggleButton = screen.getByRole("button", {
				name: /toggle sidebar/i,
			});
			fireEvent.click(headerToggleButton);

			// Wait for sidebar to reopen
			await waitFor(
				() => {
					const sidebarContainer = document.querySelector(
						'[data-slot="sidebar"][data-state="expanded"]',
					);
					expect(sidebarContainer).toBeInTheDocument();
				},
				{ timeout: 3000 },
			);

			// Verify pattern is still there
			const sidebar = screen.getByTestId("carrier-bag-sidebar");
			const patternInSidebar = within(sidebar).getByText("Test Pattern");
			expect(patternInSidebar).toBeInTheDocument();
		});
	});
});
