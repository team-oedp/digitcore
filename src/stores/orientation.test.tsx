import { act, renderHook } from "@testing-library/react";
import type React from "react";
import { beforeEach, describe, expect, it } from "vitest";
import {
	OrientationStoreProvider,
	createOrientationStore,
	useOrientationStore,
} from "./orientation";

describe("Orientation Store", () => {
	let store: ReturnType<typeof createOrientationStore>;

	beforeEach(() => {
		// Create a fresh store for each test
		store = createOrientationStore();
		// Clear the store state
		store.setState({
			hasHydrated: false,
			hasSeenOrientation: false,
			hasCompletedOrientation: false,
			hasSkippedOrientation: false,
			selectedAudienceIds: [],
			selectedThemeIds: [],
			completedAt: undefined,
			skippedAt: undefined,
		});
	});

	describe("Initial state", () => {
		it("should have correct initial values", () => {
			const state = store.getState();
			expect(state.hasHydrated).toBe(false);
			expect(state.hasSeenOrientation).toBe(false);
			expect(state.hasCompletedOrientation).toBe(false);
			expect(state.hasSkippedOrientation).toBe(false);
			expect(state.selectedAudienceIds).toEqual([]);
			expect(state.selectedThemeIds).toEqual([]);
			expect(state.completedAt).toBeUndefined();
			expect(state.skippedAt).toBeUndefined();
		});
	});

	describe("Hydration", () => {
		it("should start with hasHydrated false", () => {
			expect(store.getState().hasHydrated).toBe(false);
		});

		it("should set hydration state", () => {
			store.getState().setHasHydrated(true);
			expect(store.getState().hasHydrated).toBe(true);

			store.getState().setHasHydrated(false);
			expect(store.getState().hasHydrated).toBe(false);
		});
	});

	describe("setSeen", () => {
		it("should set hasSeenOrientation", () => {
			store.getState().setSeen(true);
			expect(store.getState().hasSeenOrientation).toBe(true);

			store.getState().setSeen(false);
			expect(store.getState().hasSeenOrientation).toBe(false);
		});
	});

	describe("setCompleted", () => {
		it("should set completed state and timestamp", () => {
			const before = Date.now();
			store.getState().setCompleted(true);
			const after = Date.now();

			const state = store.getState();
			expect(state.hasCompletedOrientation).toBe(true);
			expect(state.hasSkippedOrientation).toBe(false); // Should clear skip
			expect(state.completedAt).toBeDefined();
			expect(state.skippedAt).toBeUndefined(); // Should clear skip timestamp

			if (state.completedAt) {
				const completedTime = new Date(state.completedAt).getTime();
				expect(completedTime).toBeGreaterThanOrEqual(before);
				expect(completedTime).toBeLessThanOrEqual(after);
			}
		});

		it("should clear completed state when set to false", () => {
			store.getState().setCompleted(true);
			store.getState().setCompleted(false);

			const state = store.getState();
			expect(state.hasCompletedOrientation).toBe(false);
			expect(state.completedAt).toBeUndefined();
		});
	});

	describe("setSkipped", () => {
		it("should set skipped state and timestamp", () => {
			const before = Date.now();
			store.getState().setSkipped(true);
			const after = Date.now();

			const state = store.getState();
			expect(state.hasSkippedOrientation).toBe(true);
			expect(state.skippedAt).toBeDefined();

			if (state.skippedAt) {
				const skippedTime = new Date(state.skippedAt).getTime();
				expect(skippedTime).toBeGreaterThanOrEqual(before);
				expect(skippedTime).toBeLessThanOrEqual(after);
			}
		});

		it("should clear skipped state when set to false", () => {
			store.getState().setSkipped(true);
			store.getState().setSkipped(false);

			const state = store.getState();
			expect(state.hasSkippedOrientation).toBe(false);
			expect(state.skippedAt).toBeUndefined();
		});
	});

	describe("shouldShowOrientation", () => {
		it("should return false if completed", () => {
			store.getState().setCompleted(true);
			expect(store.getState().shouldShowOrientation()).toBe(false);
		});

		it("should return true if never seen", () => {
			expect(store.getState().shouldShowOrientation()).toBe(true);
		});

		it("should return false if skipped recently", () => {
			store.getState().setSeen(true);
			store.getState().setSkipped(true);
			expect(store.getState().shouldShowOrientation()).toBe(false);
		});

		it("should return false if skip expired (>24 hours) without reset", () => {
			store.getState().setSeen(true);
			// Set skipped time to 25 hours ago
			const expiredTime = new Date(
				Date.now() - 25 * 60 * 60 * 1000,
			).toISOString();
			store.setState({
				hasSkippedOrientation: true,
				skippedAt: expiredTime,
			});
			// shouldShowOrientation does not auto-reset; remains false until reset is performed
			expect(store.getState().shouldShowOrientation()).toBe(false);
			// No side effects from shouldShowOrientation
			expect(store.getState().hasSkippedOrientation).toBe(true);
			expect(store.getState().skippedAt).toBe(expiredTime);
		});

		it("should return false if seen but not skipped or completed", () => {
			store.getState().setSeen(true);
			expect(store.getState().shouldShowOrientation()).toBe(false);
		});
	});

	describe("canSkipExpire", () => {
		it("should return false if not skipped", () => {
			expect(store.getState().canSkipExpire()).toBe(false);
		});

		it("should return false if skipped recently", () => {
			store.getState().setSkipped(true);
			expect(store.getState().canSkipExpire()).toBe(false);
		});

		it("should return true if skip expired", () => {
			// Set skipped time to 25 hours ago
			const expiredTime = new Date(
				Date.now() - 25 * 60 * 60 * 1000,
			).toISOString();
			store.setState({
				hasSkippedOrientation: true,
				skippedAt: expiredTime,
			});
			expect(store.getState().canSkipExpire()).toBe(true);
		});
	});

	describe("checkAndResetExpiredSkip", () => {
		it("should return false if not skipped", () => {
			expect(store.getState().checkAndResetExpiredSkip()).toBe(false);
		});

		it("should return false if skipped recently", () => {
			store.getState().setSkipped(true);
			expect(store.getState().checkAndResetExpiredSkip()).toBe(false);
		});

		it("should return true and reset state if skip expired", () => {
			// Set skipped time to 25 hours ago
			const expiredTime = new Date(
				Date.now() - 25 * 60 * 60 * 1000,
			).toISOString();
			store.setState({
				hasSkippedOrientation: true,
				skippedAt: expiredTime,
			});

			// Should return true and reset the skip status
			expect(store.getState().checkAndResetExpiredSkip()).toBe(true);
			expect(store.getState().hasSkippedOrientation).toBe(false);
			expect(store.getState().skippedAt).toBeUndefined();
		});

		it("should return false if skippedAt is missing", () => {
			store.setState({
				hasSkippedOrientation: true,
				skippedAt: undefined,
			});
			expect(store.getState().checkAndResetExpiredSkip()).toBe(false);
		});
	});

	describe("Preference setters", () => {
		it("should set selected audiences", () => {
			const audiences = ["audience1", "audience2"];
			store.getState().setSelectedAudiences(audiences);
			expect(store.getState().selectedAudienceIds).toEqual(audiences);
		});

		it("should set selected themes", () => {
			const themes = ["theme1", "theme2", "theme3"];
			store.getState().setSelectedThemes(themes);
			expect(store.getState().selectedThemeIds).toEqual(themes);
		});
	});

	describe("reset", () => {
		it("should reset all state to initial values but preserve hydration", () => {
			// Set some state including hydration
			store.getState().setHasHydrated(true);
			store.getState().setSeen(true);
			store.getState().setCompleted(true);
			store.getState().setSelectedAudiences(["a1", "a2"]);
			store.getState().setSelectedThemes(["t1"]);

			// Reset
			store.getState().reset();

			// Check all values are reset but hydration is preserved
			const state = store.getState();
			expect(state.hasHydrated).toBe(true); // Should preserve hydration state
			expect(state.hasSeenOrientation).toBe(false);
			expect(state.hasCompletedOrientation).toBe(false);
			expect(state.hasSkippedOrientation).toBe(false);
			expect(state.selectedAudienceIds).toEqual([]);
			expect(state.selectedThemeIds).toEqual([]);
			expect(state.completedAt).toBeUndefined();
			expect(state.skippedAt).toBeUndefined();
		});
	});

	describe("useOrientationStore hook", () => {
		it("should work with provider and selector", () => {
			const wrapper = ({ children }: { children: React.ReactNode }) => (
				<OrientationStoreProvider>{children}</OrientationStoreProvider>
			);

			const { result } = renderHook(
				() => ({
					hasSeenOrientation: useOrientationStore((s) => s.hasSeenOrientation),
					setSeen: useOrientationStore((s) => s.setSeen),
				}),
				{ wrapper },
			);

			expect(result.current.hasSeenOrientation).toBe(false);

			act(() => {
				result.current.setSeen(true);
			});

			expect(result.current.hasSeenOrientation).toBe(true);
		});

		it("should throw error when used outside provider", () => {
			expect(() => {
				renderHook(() => useOrientationStore());
			}).toThrow(
				"useOrientationStore must be used within OrientationStoreProvider",
			);
		});
	});
});
