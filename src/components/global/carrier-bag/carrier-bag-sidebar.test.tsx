import {
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PatternForCarrierBag } from "~/components/global/carrier-bag/carrier-bag-item";
import { CarrierBagSidebar } from "~/components/global/carrier-bag/carrier-bag-sidebar";
import { SiteHeader } from "~/components/global/site-header";
import { PatternHeading } from "~/components/shared/pattern-heading";
import { SidebarProvider } from "~/components/ui/sidebar";
import type {
	HEADER_QUERYResult,
	SEARCH_CONFIG_QUERYResult,
} from "~/sanity/sanity.types";
import { CarrierBagStoreProvider } from "~/stores/carrier-bag";
import { ExploreMenuStoreProvider } from "~/stores/explore-menu";
import { FontStoreProvider } from "~/stores/font";

const mockHeaderData: HEADER_QUERYResult = {
	_id: "test-header",
	_type: "header",
	_createdAt: "2024-01-01T00:00:00Z",
	_updatedAt: "2024-01-01T00:00:00Z",
	_rev: "test-rev",
	title: "Test Header",
	language: "en",
	internalLinks: [
		{
			_key: "orientation",
			label: "Orientation",
			page: {
				_id: "orientation-page",
				_type: "page",
				title: "Orientation",
				slug: "orientation",
			},
		},
		{
			_key: "about",
			label: "About",
			page: {
				_id: "about-page",
				_type: "page",
				title: "About",
				slug: "about",
			},
		},
		{
			_key: "search",
			label: "Search",
			page: {
				_id: "search-page",
				_type: "page",
				title: "Search",
				slug: "search",
			},
		},
	],
	languageSelectorButtonLabel: null,
	fontToggleButtonLabel: null,
	fontToggleSrOnlyLabel: null,
	fontSerifLabel: null,
	fontSansSerifLabel: null,
	modeToggleButtonLabel: null,
	modeToggleSrOnlyLabel: null,
	themeLightLabel: null,
	themeDarkLabel: null,
	themeSystemLabel: null,
	exploreButtonLabel: null,
};

const mockSearchData: SEARCH_CONFIG_QUERYResult = {
	_id: "test-search",
	_type: "search",
	_createdAt: "2024-01-01T00:00:00Z",
	_updatedAt: "2024-01-01T00:00:00Z",
	_rev: "test-rev",
	title: "Test Search",
	language: "en",
	searchInputPlaceholder: null,
	clearButtonLabel: null,
	audiencesFilterLabel: null,
	audiencesPlaceholder: null,
	audiencesSearchPlaceholder: null,
	audiencesEmptyMessage: null,
	themesFilterLabel: null,
	themesPlaceholder: null,
	themesSearchPlaceholder: null,
	themesEmptyMessage: null,
	tagsFilterLabel: null,
	tagsPlaceholder: null,
	tagsSearchPlaceholder: null,
	tagsEmptyMessage: null,
	suggestionsHeading: null,
	enhanceLabel: null,
	enhanceResultsTitle: null,
	audiencePreferencesLabel: null,
	themePreferencesLabel: null,
	preferencesConjunction: null,
	enhanceHoverDescriptionPrefix: null,
	enhanceHoverDescriptionSuffix: null,
	commandMenuInputPlaceholder: null,
	commandMenuLoadingText: null,
	commandMenuEmptyState: null,
	commandMenuOnThisPageHeading: null,
	commandMenuPatternsHeading: null,
	commandMenuSolutionsHeading: null,
	commandMenuResourcesHeading: null,
	commandMenuTagsHeading: null,
	commandMenuStatusText: null,
	commandMenuNavigationLabel: null,
	commandMenuOpenResultLabel: null,
	commandMenuInPatternText: null,
	commandMenuPatternCountText: null,
	commandMenuMatchInTitleTooltip: null,
	commandMenuMatchInDescriptionTooltip: null,
	commandMenuMatchInTagTooltip: null,
	resultsHeaderResultText: null,
	resultsHeaderResultsText: null,
	resultsHeaderForText: null,
};

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
	useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js components
vi.mock("next/link", () => ({
	default: ({
		href,
		children,
		...props
	}: {
		href: string;
		children: React.ReactNode;
		[key: string]: unknown;
	}) => {
		const { onClick: origOnClick, ...rest } =
			(props as React.AnchorHTMLAttributes<HTMLAnchorElement>) || {};
		return (
			<a
				href={href}
				{...rest}
				onClick={(e) => {
					e.preventDefault();
					origOnClick?.(e as React.MouseEvent<HTMLAnchorElement, MouseEvent>);
				}}
			>
				{children}
			</a>
		);
	},
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
		<FontStoreProvider>
			<CarrierBagStoreProvider>
				<ExploreMenuStoreProvider>
					<SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
				</ExploreMenuStoreProvider>
			</CarrierBagStoreProvider>
		</FontStoreProvider>
	);
}

describe("Carrier Bag Sidebar", () => {
	const mockPattern: PatternForCarrierBag = {
		_id: "test-pattern-1",
		_type: "pattern",
		_createdAt: "2023-01-01T00:00:00Z",
		_updatedAt: "2023-01-01T00:00:00Z",
		_rev: "1",
		title: "Test Pattern",
		language: "en",
		slug: "test-pattern",
		description: null,
		descriptionPlainText: "",
		tags: null,
		audiences: null,
		theme: null,
		solutions: null,
		resources: null,
	};

	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
	});

	describe("Integration", () => {
		it("should open sidebar when save pattern button is clicked", async () => {
			render(
				<TestWrapper>
					<PatternHeading
						title="Test Pattern"
						slug="test-pattern"
						pattern={mockPattern}
					/>
					<CarrierBagSidebar data-testid="carrier-bag-sidebar" language="en" />
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
					<PatternHeading
						title="Test Pattern"
						slug="test-pattern"
						pattern={mockPattern}
					/>
					<CarrierBagSidebar data-testid="carrier-bag-sidebar" language="en" />
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
					<PatternHeading
						title="Test Pattern"
						slug="test-pattern"
						pattern={mockPattern}
					/>
					<CarrierBagSidebar data-testid="carrier-bag-sidebar" language="en" />
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
				name: /remove all items/i,
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
					<SiteHeader
						headerData={mockHeaderData}
						language="en"
						searchData={mockSearchData}
					/>
					<PatternHeading
						title="Test Pattern"
						slug="test-pattern"
						pattern={mockPattern}
					/>
					<CarrierBagSidebar data-testid="carrier-bag-sidebar" language="en" />
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
					<SiteHeader
						headerData={mockHeaderData}
						language="en"
						searchData={mockSearchData}
					/>
					<PatternHeading
						title="Test Pattern"
						slug="test-pattern"
						pattern={mockPattern}
					/>
					<CarrierBagSidebar data-testid="carrier-bag-sidebar" language="en" />
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
					<SiteHeader
						headerData={mockHeaderData}
						language="en"
						searchData={mockSearchData}
					/>
					<PatternHeading
						title="Test Pattern"
						slug="test-pattern"
						pattern={mockPattern}
					/>
					<CarrierBagSidebar data-testid="carrier-bag-sidebar" language="en" />
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
