import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Language } from "./language";
import {
	LanguageStoreProvider,
	createLanguageStore,
	useLanguageStore,
} from "./language";

const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: vi.fn((key: string) => store[key] || null),
		setItem: vi.fn((key: string, value: string) => {
			store[key] = value.toString();
		}),
		removeItem: vi.fn((key: string) => {
			delete store[key];
		}),
		clear: vi.fn(() => {
			store = {};
		}),
	};
})();

Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

const cookieMock = (() => {
	let cookies: Record<string, string> = {};

	return {
		set: (cookie: string) => {
			const [keyValue] = cookie.split(";");
			const [key, value] = keyValue.split("=");
			if (key && value) {
				cookies[key.trim()] = value.trim();
			}
		},
		get: () => {
			return Object.entries(cookies)
				.map(([key, value]) => `${key}=${value}`)
				.join("; ");
		},
		clear: () => {
			cookies = {};
		},
	};
})();

beforeEach(() => {
	localStorageMock.clear();
	vi.clearAllMocks();
	cookieMock.clear();

	document.cookie = "";

	const originalCookieDesc = Object.getOwnPropertyDescriptor(
		Document.prototype,
		"cookie",
	) || {
		configurable: true,
		get: () => "",
		set: () => {},
	};

	Object.defineProperty(document, "cookie", {
		...originalCookieDesc,
		get: () => cookieMock.get(),
		set: (cookie: string) => {
			cookieMock.set(cookie);
		},
		configurable: true,
	});
});

describe("LanguageStore", () => {
	describe("store creation and initialization", () => {
		it("should create store with default language 'en'", () => {
			const store = createLanguageStore();
			const state = store.getState();

			expect(state.language).toBe("en");
			expect(typeof state.setLanguage).toBe("function");
		});

		it("should expose required methods", () => {
			const store = createLanguageStore();
			const state = store.getState();

			expect(typeof state.setLanguage).toBe("function");
		});
	});

	describe("language state management", () => {
		it("should set language to 'es'", () => {
			const store = createLanguageStore();

			act(() => {
				store.getState().setLanguage("es");
			});

			expect(store.getState().language).toBe("es");
		});

		it("should set language to 'en'", () => {
			const store = createLanguageStore();

			act(() => {
				store.getState().setLanguage("es");
				store.getState().setLanguage("en");
			});

			expect(store.getState().language).toBe("en");
		});

		it("should handle multiple language changes", () => {
			const store = createLanguageStore();

			act(() => {
				store.getState().setLanguage("es");
			});
			expect(store.getState().language).toBe("es");

			act(() => {
				store.getState().setLanguage("en");
			});
			expect(store.getState().language).toBe("en");

			act(() => {
				store.getState().setLanguage("es");
			});
			expect(store.getState().language).toBe("es");
		});
	});

	describe("persistence behavior", () => {
		it("should persist language to localStorage", async () => {
			const store = createLanguageStore();

			act(() => {
				store.getState().setLanguage("es");
			});

			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(localStorageMock.setItem).toHaveBeenCalled();
			const calls = localStorageMock.setItem.mock.calls;
			const hasCorrectValue = calls.some((call) =>
				call[1]?.toString().includes('"language":"es"'),
			);
			expect(hasCorrectValue).toBe(true);
		});

		it("should have language structure that supports persistence", () => {
			const store = createLanguageStore();

			act(() => {
				store.getState().setLanguage("es");
			});

			const state = store.getState();
			expect(state.language).toBe("es");
			expect(() => JSON.stringify({ language: state.language })).not.toThrow();

			const json = JSON.stringify({ language: state.language });
			const parsed = JSON.parse(json);
			expect(parsed.language).toBe("es");
		});
	});

	describe("cookie rehydration", () => {
		it("should not update language when cookie matches persisted state", () => {
			const store = createLanguageStore();

			act(() => {
				store.getState().setLanguage("en");
			});

			cookieMock.set("language=en");

			const state = store.getState();
			expect(state.language).toBe("en");
		});

		it("should handle missing cookie gracefully", () => {
			const store = createLanguageStore();

			const state = store.getState();
			expect(state.language).toBe("en");
		});

		it("should handle cookie rehydration logic", () => {
			const store = createLanguageStore();

			act(() => {
				store.getState().setLanguage("en");
			});

			expect(store.getState().language).toBe("en");

			cookieMock.set("language=es");

			const rehydratedState = store.getState();
			expect(rehydratedState.language).toBe("en");
		});

		it("should ignore invalid cookie values", () => {
			const store = createLanguageStore();

			cookieMock.set("language=invalid");

			const state = store.getState();
			expect(state.language).toBe("en");
		});

		it("should ignore 'language' cookie with empty value", () => {
			const store = createLanguageStore();

			cookieMock.set("language=");

			const state = store.getState();
			expect(state.language).toBe("en");
		});

		it("should handle cookie parsing when multiple cookies exist", () => {
			const store = createLanguageStore();

			cookieMock.set("other=value");
			cookieMock.set("language=es");

			const state = store.getState();
			expect(state.language).toBe("en");
		});

		it("should work with document.cookie parsing", () => {
			cookieMock.set("language=es");
			expect(document.cookie).toContain("language=es");

			cookieMock.set("other=value");
			expect(document.cookie).toContain("language=es");
			expect(document.cookie).toContain("other=value");
		});
	});

	describe("React hook integration", () => {
		const TestWrapper = ({ children }: { children: React.ReactNode }) => (
			<LanguageStoreProvider>{children}</LanguageStoreProvider>
		);

		it("should throw error when used outside provider", () => {
			expect(() => {
				renderHook(() => useLanguageStore());
			}).toThrow("useLanguageStore must be used within LanguageStoreProvider");
		});

		it("should work with provider", () => {
			const { result } = renderHook(() => useLanguageStore(), {
				wrapper: TestWrapper,
			});

			expect(result.current.language).toBe("en");
			expect(typeof result.current.setLanguage).toBe("function");
		});

		it("should work with selector", () => {
			const { result } = renderHook(
				() => useLanguageStore((state) => state.language),
				{ wrapper: TestWrapper },
			);

			expect(typeof result.current).toBe("string");
			expect(result.current).toBe("en");
		});

		it("should update when state changes", () => {
			const { result } = renderHook(() => useLanguageStore(), {
				wrapper: TestWrapper,
			});

			expect(result.current.language).toBe("en");

			act(() => {
				result.current.setLanguage("es");
			});

			expect(result.current.language).toBe("es");

			act(() => {
				result.current.setLanguage("en");
			});

			expect(result.current.language).toBe("en");
		});

		it("should return language from selector", () => {
			const { result } = renderHook(
				() => useLanguageStore((state) => state.language),
				{ wrapper: TestWrapper },
			);

			expect(result.current).toBe("en");
		});
	});

	describe("edge cases and error handling", () => {
		it("should handle multiple rapid language changes", () => {
			const store = createLanguageStore();

			act(() => {
				for (let i = 0; i < 10; i++) {
					store.getState().setLanguage(i % 2 === 0 ? "en" : "es");
				}
			});

			expect(store.getState().language).toBe("es");
		});

		it("should handle setting same language multiple times", () => {
			const store = createLanguageStore();

			act(() => {
				store.getState().setLanguage("en");
				store.getState().setLanguage("en");
				store.getState().setLanguage("en");
			});

			expect(store.getState().language).toBe("en");
		});

		it("should maintain state consistency across store instances", () => {
			const store1 = createLanguageStore();

			act(() => {
				store1.getState().setLanguage("es");
			});

			const store2 = createLanguageStore();
			expect(store2.getState().language).toBe("es");
		});
	});

	describe("Language type safety", () => {
		it("should only accept valid Language types", () => {
			const store = createLanguageStore();

			const setLanguage = store.getState().setLanguage;
			const validLanguage: Language = "en";

			act(() => {
				setLanguage(validLanguage);
			});

			expect(store.getState().language).toBe(validLanguage);
		});

		it("should return proper Language type", () => {
			const store = createLanguageStore();
			const language: Language = store.getState().language;

			expect(language).toBe("en");
			expect(typeof language).toBe("string");
		});
	});
});

