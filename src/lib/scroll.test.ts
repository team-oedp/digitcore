import {
	type Mock,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

// Mock the `sonner` toast library before importing the module under test
vi.mock("sonner", () => ({
	toast: {
		error: vi.fn(),
	},
}));

import { toast } from "sonner";
import {
	scrollToAnchor,
	scrollToAnchorFromSearchParams,
	useGlossaryScroll,
} from "./scroll";

// Helper to get the mocked toast.error for assertions
afterEach(() => {
	vi.clearAllMocks();
	// Clean up any elements we created during the tests
	if (document?.body) {
		document.body.innerHTML = "";
	}
});

// Store original values for SSR testing
const originalWindow = global.window;
const originalDocument = global.document;

// Helper to mock SSR environment
function mockSSREnvironment() {
	Object.defineProperty(global, 'window', {
		value: undefined,
		writable: true,
		configurable: true
	});
	Object.defineProperty(global, 'document', {
		value: undefined,
		writable: true,
		configurable: true
	});
}

// Helper to restore browser environment
function restoreBrowserEnvironment() {
	Object.defineProperty(global, 'window', {
		value: originalWindow,
		writable: true,
		configurable: true
	});
	Object.defineProperty(global, 'document', {
		value: originalDocument,
		writable: true,
		configurable: true
	});
}

function createAnchor(id: string) {
	const el = document.createElement("div");
	el.id = id;
	el.scrollIntoView = vi.fn();
	document.body.appendChild(el);
	return el as HTMLDivElement & { scrollIntoView: ReturnType<typeof vi.fn> };
}

describe("scroll utilities", () => {
	describe("scrollToAnchor", () => {
		it("should scroll to the element when it exists", () => {
			const el = createAnchor("my-anchor");

			const result = scrollToAnchor("my-anchor");

			expect(result).toBe(true);
			expect(el.scrollIntoView).toHaveBeenCalledWith({
				behavior: "smooth",
				block: "start",
				inline: "nearest",
			});
			expect(toast.error as Mock).not.toHaveBeenCalled();
		});

		it("should show an error toast and return false when the element does not exist", () => {
			const result = scrollToAnchor("missing-anchor");

			expect(result).toBe(false);
			expect(toast.error as Mock).toHaveBeenCalledWith(
				"Item not found on page",
			);
		});

		it("should return false in SSR environment", () => {
			mockSSREnvironment();

			const result = scrollToAnchor("any-anchor");

			expect(result).toBe(false);
			expect(toast.error as Mock).not.toHaveBeenCalled();

			restoreBrowserEnvironment();
		});

		it("should handle invalid anchor IDs", () => {
			const testCases = ["", "   ", null as any, undefined as any, 123 as any];

			testCases.forEach((invalidId) => {
				const result = scrollToAnchor(invalidId);

				expect(result).toBe(false);
				expect(toast.error as Mock).toHaveBeenCalledWith(
					"Invalid anchor ID provided",
				);
				vi.clearAllMocks();
			});
		});

		it("should use custom error handler when provided", () => {
			const mockErrorHandler = vi.fn();

			const result = scrollToAnchor("missing-anchor", {
				onError: mockErrorHandler,
			});

			expect(result).toBe(false);
			expect(mockErrorHandler).toHaveBeenCalledWith("Item not found on page");
			expect(toast.error as Mock).not.toHaveBeenCalled();
		});

		it("should handle scrollIntoView errors gracefully", () => {
			const el = createAnchor("error-anchor");
			el.scrollIntoView = vi.fn().mockImplementation(() => {
				throw new Error("Scroll failed");
			});

			const result = scrollToAnchor("error-anchor");

			expect(result).toBe(false);
			expect(toast.error as Mock).toHaveBeenCalledWith(
				"Failed to scroll to element",
			);
		});

		it("should trim whitespace from anchor IDs", () => {
			const el = createAnchor("trimmed-anchor");

			const result = scrollToAnchor("  trimmed-anchor  ");

			expect(result).toBe(true);
			expect(el.scrollIntoView).toHaveBeenCalled();
		});

		it("should accept custom scroll options", () => {
			const el = createAnchor("custom-options");

			const result = scrollToAnchor("custom-options", {
				behavior: "instant",
				block: "center",
				inline: "start",
			});

			expect(result).toBe(true);
			expect(el.scrollIntoView).toHaveBeenCalledWith({
				behavior: "instant",
				block: "center",
				inline: "start",
			});
		});
	});

	describe("scrollToAnchorFromSearchParams", () => {
		beforeEach(() => {
			// Ensure the target element exists for positive tests
			createAnchor("search-anchor");
		});

		it("should scroll to the element when the search param is present", () => {
			const params = new URLSearchParams("word=search-anchor");

			const result = scrollToAnchorFromSearchParams(params);

			expect(result).toBe(true);
			// The element is created in beforeEach; pull it for assertion
			const el = document.getElementById("search-anchor") as HTMLDivElement & {
				scrollIntoView: ReturnType<typeof vi.fn>;
			};
			expect(el.scrollIntoView).toHaveBeenCalled();
		});

		it("should return false when the search param is missing", () => {
			const params = new URLSearchParams();

			const result = scrollToAnchorFromSearchParams(params);

			expect(result).toBe(false);
		});

		it("should work with custom parameter names", () => {
			createAnchor("custom-param-anchor");
			const params = new URLSearchParams("term=custom-param-anchor");

			const result = scrollToAnchorFromSearchParams(params, "term");

			expect(result).toBe(true);
		});

		it("should handle malformed search params gracefully", () => {
			const params = new URLSearchParams("word=");

			const result = scrollToAnchorFromSearchParams(params);

			expect(result).toBe(false);
		});

		it("should return false in SSR environment", () => {
			mockSSREnvironment();
			const params = new URLSearchParams("word=test");

			const result = scrollToAnchorFromSearchParams(params);

			expect(result).toBe(false);

			restoreBrowserEnvironment();
		});
	});

	describe("useGlossaryScroll", () => {
		it("should expose helper functions that delegate to underlying implementations", () => {
			const { scrollToWord, scrollToWordFromParams } = useGlossaryScroll();

			// Provide element for positive path
			const el = createAnchor("glossary-word");

			expect(scrollToWord("glossary-word")).toBe(true);
			expect(el.scrollIntoView).toHaveBeenCalled();

			const params = new URLSearchParams("word=glossary-word");
			expect(scrollToWordFromParams(params)).toBe(true);
		});

		it("should use glossary-specific error messages", () => {
			const { scrollToWord } = useGlossaryScroll();

			const result = scrollToWord("missing-word");

			expect(result).toBe(false);
			expect(toast.error as Mock).toHaveBeenCalledWith(
				"Word is not in glossary",
			);
		});
	});
});
