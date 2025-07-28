import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "./use-mobile";

// Mock window.matchMedia
const mockMatchMedia = vi.fn();

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: mockMatchMedia,
});

// Mock window.innerWidth
Object.defineProperty(window, "innerWidth", {
	writable: true,
	value: 1024,
});

describe("useIsMobile hook", () => {
	const mockMql = {
		matches: false,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	};

	beforeEach(() => {
		mockMatchMedia.mockReturnValue(mockMql);
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should return false for desktop width", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(false);
	});

	it("should return true for mobile width", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 600,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(true);
	});

	it("should set up media query listener correctly", () => {
		renderHook(() => useIsMobile());

		expect(mockMatchMedia).toHaveBeenCalledWith("(max-width: 767px)");
		expect(mockMql.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
	});

	it("should clean up event listener on unmount", () => {
		const { unmount } = renderHook(() => useIsMobile());

		unmount();

		expect(mockMql.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
	});

	it("should handle breakpoint transition", () => {
		const { result } = renderHook(() => useIsMobile());

		// Simulate window resize by calling the change handler
		const changeHandler = mockMql.addEventListener.mock.calls[0][1];

		// Simulate mobile breakpoint
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 600,
		});

		act(() => {
			changeHandler();
		});

		expect(result.current).toBe(true);
	});
});