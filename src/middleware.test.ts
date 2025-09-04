import type { NextRequest } from "next/server";
import { type Mock, beforeEach, describe, expect, it, vi } from "vitest";

declare global {
	var __mockRedirect: Mock;
	var __mockNext: Mock;
}

// Mock next/server module - vi.mock is hoisted so we need to define mocks inline
vi.mock("next/server", () => {
	const mockRedirect = vi.fn();
	const mockNext = vi.fn();

	// Store mocks in a way we can access them later
	if (typeof globalThis !== "undefined") {
		globalThis.__mockRedirect = mockRedirect;
		globalThis.__mockNext = mockNext;
	}

	return {
		NextResponse: {
			redirect: mockRedirect,
			next: mockNext,
		},
	};
});

// Import middleware after mocking
import { middleware } from "./middleware";

// Get the mock functions from global
const mockRedirect = globalThis.__mockRedirect;
const mockNext = globalThis.__mockNext;

type CookieMap = Record<string, string>;

function createNextUrl(fullUrl: string) {
	const base = new URL(fullUrl);
	return {
		pathname: base.pathname,
		search: base.search,
		searchParams: new URLSearchParams(base.searchParams.toString()),
		clone() {
			// fresh object each time to mimic NextURL.clone()
			return createNextUrl(base.toString());
		},
		toString() {
			return base.toString();
		},
	};
}

function createRequest(
	fullUrl: string,
	cookies: CookieMap = {},
	method = "GET",
): NextRequest {
	const cookieStore = {
		get(name: string) {
			const v = cookies[name];
			return v ? { name, value: v } : undefined;
		},
	};

	return {
		nextUrl: createNextUrl(fullUrl) as unknown as NextRequest["nextUrl"],
		cookies: cookieStore as unknown as NextRequest["cookies"],
		method,
		url: fullUrl,
	} as unknown as NextRequest;
}

describe("middleware onboarding redirect", () => {
	beforeEach(() => {
		mockRedirect.mockReset();
		mockNext.mockReset();
	});

	it("redirects first-time visitor to /onboarding with returnTo", () => {
		const req = createRequest("https://example.com/explore");
		middleware(req);

		expect(mockRedirect).toHaveBeenCalledTimes(1);
		const arg = mockRedirect.mock.calls[0][0];
		expect(arg.pathname).toBe("/onboarding");
		expect(arg.searchParams.get("returnTo")).toBe("/explore");
	});

	it("preserves pattern slug and query params in redirect", () => {
		const req = createRequest("https://example.com/pattern/foo?bar=baz");
		middleware(req);

		expect(mockRedirect).toHaveBeenCalledTimes(1);
		const arg = mockRedirect.mock.calls[0][0];
		expect(arg.pathname).toBe("/onboarding");
		expect(arg.searchParams.get("pattern")).toBe("foo");
		expect(arg.searchParams.get("returnTo")).toBe("/pattern/foo?bar=baz");
	});

	it("allows navigation when onboarding cookie is present", () => {
		const req = createRequest("https://example.com/explore?x=1", {
			onboarding_completed: "1",
		});
		middleware(req);

		expect(mockRedirect).not.toHaveBeenCalled();
		expect(mockNext).toHaveBeenCalledTimes(1);
	});

	it("allows navigation when onboarding cookie value is 'true'", () => {
		const req = createRequest("https://example.com/explore?x=1", {
			onboarding_completed: "true",
		});
		middleware(req);

		expect(mockRedirect).not.toHaveBeenCalled();
		expect(mockNext).toHaveBeenCalledTimes(1);
	});

	it("does not redirect non-GET requests", () => {
		const req = createRequest("https://example.com/explore", {}, "POST");
		middleware(req);

		expect(mockRedirect).not.toHaveBeenCalled();
		expect(mockNext).toHaveBeenCalledTimes(1);
	});

	it("does not redirect when already on /onboarding", () => {
		const req = createRequest("https://example.com/onboarding");
		middleware(req);

		expect(mockRedirect).not.toHaveBeenCalled();
		expect(mockNext).toHaveBeenCalledTimes(1);
	});
});
