"use client";

import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OrientationState = {
	// Hydration state
	hasHydrated: boolean;

	// Redirect control states
	hasSeenOrientation: boolean;
	hasCompletedOrientation: boolean;
	hasSkippedOrientation: boolean;
	skippedAt?: string;
	completedAt?: string;

	// User preferences
	selectedAudienceIds: string[];
	selectedThemeIds: string[];

	// Actions
	setHasHydrated: (hydrated: boolean) => void;
	setSeen: (seen: boolean) => void;
	setCompleted: (completed: boolean) => void;
	setSkipped: (skipped: boolean) => void;
	setSelectedAudiences: (ids: string[]) => void;
	setSelectedThemes: (ids: string[]) => void;
	shouldShowOrientation: () => boolean;
	checkAndResetExpiredSkip: () => boolean;
	canSkipExpire: () => boolean;
	reset: () => void;
};

// Skip expiry duration in milliseconds (24 hours)
const SKIP_EXPIRY_MS = 24 * 60 * 60 * 1000;

export const createOrientationStore = () =>
	createStore<OrientationState>()(
		persist(
			(set, get) => ({
				// Hydration state
				hasHydrated: false,

				// Redirect control states
				hasSeenOrientation: false,
				hasCompletedOrientation: false,
				hasSkippedOrientation: false,
				skippedAt: undefined,
				completedAt: undefined,

				// User preferences
				selectedAudienceIds: [],
				selectedThemeIds: [],

				setHasHydrated: (hydrated: boolean) => set({ hasHydrated: hydrated }),
				setSeen: (seen: boolean) => set({ hasSeenOrientation: seen }),

				setCompleted: (completed: boolean) =>
					set({
						hasCompletedOrientation: completed,
						hasSkippedOrientation: false, // Clear skip status when completed
						completedAt: completed ? new Date().toISOString() : undefined,
						skippedAt: undefined,
					}),

				setSkipped: (skipped: boolean) =>
					set({
						hasSkippedOrientation: skipped,
						skippedAt: skipped ? new Date().toISOString() : undefined,
					}),

				setSelectedAudiences: (ids: string[]) =>
					set({ selectedAudienceIds: ids }),

				setSelectedThemes: (ids: string[]) => set({ selectedThemeIds: ids }),

				checkAndResetExpiredSkip: () => {
					const state = get();
					if (!state.hasSkippedOrientation || !state.skippedAt) {
						return false;
					}

					const skippedTime = new Date(state.skippedAt).getTime();
					const now = Date.now();
					const hasExpired = now - skippedTime > SKIP_EXPIRY_MS;

					if (hasExpired) {
						// Reset skip status if expired
						set({ hasSkippedOrientation: false, skippedAt: undefined });
						return true;
					}
					return false;
				},

				shouldShowOrientation: () => {
					const state = get();

					// Never show if completed
					if (state.hasCompletedOrientation) {
						return false;
					}

					// Never show if currently skipped (and not expired)
					if (state.hasSkippedOrientation && state.skippedAt) {
						const skippedTime = new Date(state.skippedAt).getTime();
						const now = Date.now();
						const hasExpired = now - skippedTime > SKIP_EXPIRY_MS;
						if (!hasExpired) {
							return false; // Skip is still valid, don't show orientation
						}
					}

					// Show if never seen
					if (!state.hasSeenOrientation) {
						return true;
					}

					// If we reach here, user has seen but skip has expired
					return false;
				},

				canSkipExpire: () => {
					const state = get();
					if (!state.hasSkippedOrientation || !state.skippedAt) {
						return false;
					}
					const skippedTime = new Date(state.skippedAt).getTime();
					const now = Date.now();
					return now - skippedTime > SKIP_EXPIRY_MS;
				},

				reset: () => {
					const currentHydrationState = get().hasHydrated;
					set({
						hasHydrated: currentHydrationState, // Preserve hydration state
						hasSeenOrientation: false,
						hasCompletedOrientation: false,
						hasSkippedOrientation: false,
						selectedAudienceIds: [],
						selectedThemeIds: [],
						completedAt: undefined,
						skippedAt: undefined,
					});
				},
			}),
			{
				name: "orientation-state",
				storage: createJSONStorage(() => localStorage),
				partialize: (state) => ({
					// Don't persist hydration state
					// Persist redirect control states
					hasSeenOrientation: state.hasSeenOrientation,
					hasCompletedOrientation: state.hasCompletedOrientation,
					hasSkippedOrientation: state.hasSkippedOrientation,
					skippedAt: state.skippedAt,
					completedAt: state.completedAt,
					// Persist user preferences
					selectedAudienceIds: state.selectedAudienceIds,
					selectedThemeIds: state.selectedThemeIds,
				}),
				onRehydrateStorage: () => (state) => {
					// Mark as hydrated once the store is restored from localStorage
					if (state) {
						state.setHasHydrated(true);
					}
				},
				// Speed up hydration by skipping version check
				version: 0,
			},
		),
	);

const OrientationStoreContext = createContext<ReturnType<
	typeof createOrientationStore
> | null>(null);

export const OrientationStoreProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const storeRef = useRef<
		ReturnType<typeof createOrientationStore> | undefined
	>(undefined);
	if (!storeRef.current) {
		storeRef.current = createOrientationStore();
	}

	return (
		<OrientationStoreContext.Provider value={storeRef.current}>
			{children}
		</OrientationStoreContext.Provider>
	);
};

// Stable identity selector to avoid infinite loops
const identitySelector = (state: OrientationState) => state;

export const useOrientationStore = <T = OrientationState>(
	selector?: (state: OrientationState) => T,
) => {
	const store = useContext(OrientationStoreContext);
	if (!store) {
		throw new Error(
			"useOrientationStore must be used within OrientationStoreProvider",
		);
	}

	// Use stable identity selector when no selector provided
	const stableSelector =
		selector || (identitySelector as (state: OrientationState) => T);
	return useStore(store, stableSelector);
};
