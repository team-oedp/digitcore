import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Pattern } from "~/sanity/sanity.types";
import {
	CarrierBagStoreProvider,
	createCarrierBagStore,
	useCarrierBagStore,
} from "./carrier-bag";

// Mock localStorage
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

// Sample pattern data
const mockPattern1: Pattern = {
	_id: "pattern-1",
	_type: "pattern",
	_createdAt: "2024-01-01T00:00:00Z",
	_updatedAt: "2024-01-01T00:00:00Z",
	_rev: "1",
	title: "Test Pattern 1",
	slug: { current: "test-pattern-1", _type: "slug" },
	description: [],
	audiences: [],
	tags: [],
	solutions: [],
	resources: [],
};

const mockPattern2: Pattern = {
	_id: "pattern-2",
	_type: "pattern",
	_createdAt: "2024-01-01T00:00:00Z",
	_updatedAt: "2024-01-01T00:00:00Z",
	_rev: "1",
	title: "Test Pattern 2",
	slug: { current: "test-pattern-2", _type: "slug" },
	description: [],
	audiences: [],
	tags: [],
	solutions: [],
	resources: [],
};

// Test wrapper component
const TestWrapper = ({ children }: { children: ReactNode }) => (
	<CarrierBagStoreProvider>{children}</CarrierBagStoreProvider>
);

describe("CarrierBagStore", () => {
	beforeEach(() => {
		localStorageMock.clear();
		vi.clearAllMocks();
	});

	describe("store creation and initialization", () => {
		it("should create store with initial values", () => {
			const store = createCarrierBagStore();
			const state = store.getState();

			expect(state.items).toEqual([]);
			expect(state.isOpen).toBe(false);
			expect(state.isPinned).toBe(false);
			expect(state.isModalMode).toBe(false);
		});

		it("should expose all required methods", () => {
			const store = createCarrierBagStore();
			const state = store.getState();

			expect(typeof state.addPattern).toBe("function");
			expect(typeof state.removePattern).toBe("function");
			expect(typeof state.updateNotes).toBe("function");
			expect(typeof state.clearBag).toBe("function");
			expect(typeof state.hasPattern).toBe("function");
			expect(typeof state.getPattern).toBe("function");
			expect(typeof state.setHydrated).toBe("function");
			expect(typeof state.toggleOpen).toBe("function");
			expect(typeof state.setOpen).toBe("function");
			expect(typeof state.togglePin).toBe("function");
			expect(typeof state.setPin).toBe("function");
			expect(typeof state.toggleModalMode).toBe("function");
			expect(typeof state.setModalMode).toBe("function");
		});
	});

	describe("pattern management", () => {
		it("should add pattern to bag", () => {
			const store = createCarrierBagStore();
			const { addPattern } = store.getState();

			act(() => {
				addPattern(mockPattern1, "Test notes");
			});

			const { items } = store.getState();
			expect(items).toHaveLength(1);
			expect(items[0]?.pattern).toEqual(mockPattern1);
			expect(items[0]?.notes).toBe("Test notes");
			expect(typeof items[0]?.dateAdded).toBe("string");
		});

		it("should add pattern without notes", () => {
			const store = createCarrierBagStore();
			const { addPattern } = store.getState();

			act(() => {
				addPattern(mockPattern1);
			});

			const { items } = store.getState();
			expect(items).toHaveLength(1);
			expect(items[0]?.notes).toBeUndefined();
		});

		it("should not add duplicate patterns", () => {
			const store = createCarrierBagStore();
			const { addPattern } = store.getState();

			act(() => {
				addPattern(mockPattern1, "First notes");
				addPattern(mockPattern1, "Second notes");
			});

			const { items } = store.getState();
			expect(items).toHaveLength(1);
			expect(items[0]?.notes).toBe("First notes");
		});

		it("should add multiple different patterns", () => {
			const store = createCarrierBagStore();
			const { addPattern } = store.getState();

			act(() => {
				addPattern(mockPattern1, "Notes 1");
				addPattern(mockPattern2, "Notes 2");
			});

			const { items } = store.getState();
			expect(items).toHaveLength(2);
			expect(items[0]?.pattern._id).toBe("pattern-1");
			expect(items[1]?.pattern._id).toBe("pattern-2");
		});

		it("should remove pattern from bag", () => {
			const store = createCarrierBagStore();
			const { addPattern, removePattern } = store.getState();

			act(() => {
				addPattern(mockPattern1);
				addPattern(mockPattern2);
			});

			expect(store.getState().items).toHaveLength(2);

			act(() => {
				removePattern("pattern-1");
			});

			const { items } = store.getState();
			expect(items).toHaveLength(1);
			expect(items[0]?.pattern._id).toBe("pattern-2");
		});

		it("should handle removing non-existent pattern", () => {
			const store = createCarrierBagStore();
			const { addPattern, removePattern } = store.getState();

			act(() => {
				addPattern(mockPattern1);
			});

			expect(store.getState().items).toHaveLength(1);

			act(() => {
				removePattern("non-existent-id");
			});

			expect(store.getState().items).toHaveLength(1);
		});

		it("should clear all patterns from bag", () => {
			const store = createCarrierBagStore();
			const { addPattern, clearBag } = store.getState();

			act(() => {
				addPattern(mockPattern1);
				addPattern(mockPattern2);
			});

			expect(store.getState().items).toHaveLength(2);

			act(() => {
				clearBag();
			});

			expect(store.getState().items).toHaveLength(0);
		});
	});

	describe("notes management", () => {
		it("should update notes for existing pattern", () => {
			const store = createCarrierBagStore();
			const { addPattern, updateNotes } = store.getState();

			act(() => {
				addPattern(mockPattern1, "Original notes");
			});

			act(() => {
				updateNotes("pattern-1", "Updated notes");
			});

			const { items } = store.getState();
			expect(items[0]?.notes).toBe("Updated notes");
		});

		it("should handle updating notes for non-existent pattern", () => {
			const store = createCarrierBagStore();
			const { addPattern, updateNotes } = store.getState();

			act(() => {
				addPattern(mockPattern1, "Original notes");
			});

			act(() => {
				updateNotes("non-existent-id", "New notes");
			});

			const { items } = store.getState();
			expect(items[0]?.notes).toBe("Original notes");
		});

		it("should update notes for correct pattern when multiple exist", () => {
			const store = createCarrierBagStore();
			const { addPattern, updateNotes } = store.getState();

			act(() => {
				addPattern(mockPattern1, "Notes 1");
				addPattern(mockPattern2, "Notes 2");
			});

			act(() => {
				updateNotes("pattern-2", "Updated notes 2");
			});

			const { items } = store.getState();
			expect(items[0]?.notes).toBe("Notes 1");
			expect(items[1]?.notes).toBe("Updated notes 2");
		});
	});

	describe("pattern queries", () => {
		it("should check if pattern exists in bag", () => {
			const store = createCarrierBagStore();
			const { addPattern, hasPattern } = store.getState();

			act(() => {
				addPattern(mockPattern1);
			});

			expect(hasPattern("pattern-1")).toBe(true);
			expect(hasPattern("pattern-2")).toBe(false);
			expect(hasPattern("non-existent")).toBe(false);
		});

		it("should get pattern from bag", () => {
			const store = createCarrierBagStore();
			const { addPattern, getPattern } = store.getState();

			act(() => {
				addPattern(mockPattern1, "Test notes");
			});

			const item = getPattern("pattern-1");
			expect(item).toBeDefined();
			expect(item?.pattern._id).toBe("pattern-1");
			expect(item?.notes).toBe("Test notes");

			const nonExistent = getPattern("non-existent");
			expect(nonExistent).toBeUndefined();
		});
	});

	describe("UI state management", () => {
		it("should manage hydration state", () => {
			const store = createCarrierBagStore();
			const { setHydrated } = store.getState();

			act(() => {
				setHydrated(false);
			});

			expect(store.getState().isHydrated).toBe(false);

			act(() => {
				setHydrated(true);
			});

			expect(store.getState().isHydrated).toBe(true);
		});

		it("should toggle and set open state", () => {
			const store = createCarrierBagStore();
			const { toggleOpen, setOpen } = store.getState();

			expect(store.getState().isOpen).toBe(false);

			act(() => {
				toggleOpen();
			});

			expect(store.getState().isOpen).toBe(true);

			act(() => {
				toggleOpen();
			});

			expect(store.getState().isOpen).toBe(false);

			act(() => {
				setOpen(true);
			});

			expect(store.getState().isOpen).toBe(true);

			act(() => {
				setOpen(false);
			});

			expect(store.getState().isOpen).toBe(false);
		});

		it("should toggle and set pin state", () => {
			const store = createCarrierBagStore();
			const { togglePin, setPin } = store.getState();

			expect(store.getState().isPinned).toBe(false);

			act(() => {
				togglePin();
			});

			expect(store.getState().isPinned).toBe(true);

			act(() => {
				setPin(false);
			});

			expect(store.getState().isPinned).toBe(false);
		});

		it("should toggle and set modal mode", () => {
			const store = createCarrierBagStore();
			const { toggleModalMode, setModalMode } = store.getState();

			expect(store.getState().isModalMode).toBe(false);

			act(() => {
				toggleModalMode();
			});

			expect(store.getState().isModalMode).toBe(true);

			act(() => {
				setModalMode(false);
			});

			expect(store.getState().isModalMode).toBe(false);
		});
	});

	describe("React hook integration", () => {
		it("should throw error when used outside provider", () => {
			expect(() => {
				renderHook(() => useCarrierBagStore());
			}).toThrow(
				"useCarrierBagStore must be used within CarrierBagStoreProvider",
			);
		});

		it("should work with provider", () => {
			const { result } = renderHook(() => useCarrierBagStore(), {
				wrapper: TestWrapper,
			});

			expect(Array.isArray(result.current.items)).toBe(true);
			expect(typeof result.current.addPattern).toBe("function");
		});

		it("should work with selector", () => {
			const { result } = renderHook(
				() => useCarrierBagStore((state) => state.items.length),
				{ wrapper: TestWrapper },
			);

			expect(typeof result.current).toBe("number");
			expect(result.current).toBe(0);
		});

		it("should update when state changes", () => {
			const { result } = renderHook(() => useCarrierBagStore(), {
				wrapper: TestWrapper,
			});

			act(() => {
				result.current.addPattern(mockPattern1, "Test notes");
			});

			expect(result.current.items).toHaveLength(1);
			expect(result.current.items[0]?.pattern._id).toBe("pattern-1");
		});
	});

	describe("edge cases and error handling", () => {
		it("should handle empty item removal gracefully", () => {
			const store = createCarrierBagStore();
			const { removePattern } = store.getState();

			act(() => {
				removePattern("non-existent");
			});

			expect(store.getState().items).toEqual([]);
		});

		it("should handle multiple rapid additions", () => {
			const store = createCarrierBagStore();
			const { addPattern } = store.getState();

			act(() => {
				for (let i = 0; i < 10; i++) {
					const pattern: Pattern = {
						...mockPattern1,
						_id: `pattern-${i}`,
						title: `Pattern ${i}`,
					};
					addPattern(pattern, `Notes ${i}`);
				}
			});

			expect(store.getState().items).toHaveLength(10);
		});

		it("should maintain item order", () => {
			const store = createCarrierBagStore();
			const { addPattern } = store.getState();

			const patterns: Pattern[] = [];
			for (let i = 0; i < 5; i++) {
				patterns.push({
					...mockPattern1,
					_id: `pattern-${i}`,
					title: `Pattern ${i}`,
				});
			}

			act(() => {
				patterns.forEach((pattern, index) => {
					addPattern(pattern, `Notes ${index}`);
				});
			});

			const { items } = store.getState();
			expect(items.map((item) => item.pattern._id)).toEqual([
				"pattern-0",
				"pattern-1",
				"pattern-2",
				"pattern-3",
				"pattern-4",
			]);
		});

		it("should handle concurrent operations", () => {
			const store = createCarrierBagStore();
			const { addPattern, updateNotes, removePattern } = store.getState();

			act(() => {
				addPattern(mockPattern1, "Initial notes");
				updateNotes("pattern-1", "Updated notes");
				addPattern(mockPattern2, "Pattern 2 notes");
				removePattern("pattern-1");
			});

			const { items } = store.getState();
			expect(items).toHaveLength(1);
			expect(items[0]?.pattern._id).toBe("pattern-2");
		});
	});

	describe("persistence behavior", () => {
		it("should have items structure that supports persistence", () => {
			const store = createCarrierBagStore();
			const { addPattern } = store.getState();

			act(() => {
				addPattern(mockPattern1, "Test notes");
			});

			const { items } = store.getState();
			// Verify structure matches what would be persisted
			expect(items[0]).toHaveProperty("pattern");
			expect(items[0]).toHaveProperty("dateAdded");
			expect(items[0]).toHaveProperty("notes");
			expect(typeof items[0]?.dateAdded).toBe("string");
		});

		it("should only include persistable data in items", () => {
			const store = createCarrierBagStore();
			const { addPattern } = store.getState();

			act(() => {
				addPattern(mockPattern1, "Test notes");
			});

			const { items } = store.getState();
			const item = items[0] as unknown as NonNullable<(typeof items)[number]>;

			// Check that the item structure is JSON serializable
			expect(() => JSON.stringify(item)).not.toThrow();

			const parsed = JSON.parse(JSON.stringify(item));
			expect(parsed.pattern._id).toBe("pattern-1");
			expect(parsed.notes).toBe("Test notes");
		});
	});
});
