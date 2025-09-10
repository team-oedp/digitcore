"use client";

import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OnboardingState = {
	// Hydration state
	hasHydrated: boolean;

	// Redirect control states
	hasSeenOnboarding: boolean;
	hasCompletedOnboarding: boolean;
	hasSkippedOnboarding: boolean;
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
	shouldShowOnboarding: () => boolean;
	checkAndResetExpiredSkip: () => boolean;
	canSkipExpire: () => boolean;
	reset: () => void;
};

// Skip expiry duration in milliseconds (24 hours)
const SKIP_EXPIRY_MS = 24 * 60 * 60 * 1000;

export const createOnboardingStore = () =>
	createStore<OnboardingState>()(
		persist(
			(set, get) => ({
				// Hydration state
				hasHydrated: false,

				// Redirect control states
				hasSeenOnboarding: false,
				hasCompletedOnboarding: false,
				hasSkippedOnboarding: false,
				skippedAt: undefined,
				completedAt: undefined,

				// User preferences
				selectedAudienceIds: [],
				selectedThemeIds: [],

				setHasHydrated: (hydrated: boolean) => set({ hasHydrated: hydrated }),
				setSeen: (seen: boolean) => set({ hasSeenOnboarding: seen }),

				setCompleted: (completed: boolean) =>
					set({
						hasCompletedOnboarding: completed,
						hasSkippedOnboarding: false, // Clear skip status when completed
						completedAt: completed ? new Date().toISOString() : undefined,
						skippedAt: undefined,
					}),

				setSkipped: (skipped: boolean) =>
					set({
						hasSkippedOnboarding: skipped,
						skippedAt: skipped ? new Date().toISOString() : undefined,
					}),

				setSelectedAudiences: (ids: string[]) =>
					set({ selectedAudienceIds: ids }),

				setSelectedThemes: (ids: string[]) => set({ selectedThemeIds: ids }),

				checkAndResetExpiredSkip: () => {
					const state = get();
					if (!state.hasSkippedOnboarding || !state.skippedAt) {
						return false;
					}

					const skippedTime = new Date(state.skippedAt).getTime();
					const now = Date.now();
					const hasExpired = now - skippedTime > SKIP_EXPIRY_MS;

					if (hasExpired) {
						// Reset skip status if expired
						set({ hasSkippedOnboarding: false, skippedAt: undefined });
						return true;
					}
					return false;
				},

				shouldShowOnboarding: () => {
					const state = get();

					// Never show if completed
					if (state.hasCompletedOnboarding) {
						return false;
					}

					// Show if never seen
					if (!state.hasSeenOnboarding) {
						return true;
					}

					// Check if skip has expired (pure check, no side effects)
					if (state.hasSkippedOnboarding && state.skippedAt) {
						const skippedTime = new Date(state.skippedAt).getTime();
						const now = Date.now();
						const hasExpired = now - skippedTime > SKIP_EXPIRY_MS;
						return hasExpired;
					}

					return false;
				},

				canSkipExpire: () => {
					const state = get();
					if (!state.hasSkippedOnboarding || !state.skippedAt) {
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
						hasSeenOnboarding: false,
						hasCompletedOnboarding: false,
						hasSkippedOnboarding: false,
						selectedAudienceIds: [],
						selectedThemeIds: [],
						completedAt: undefined,
						skippedAt: undefined,
					});
				},
			}),
			{
				name: "onboarding-state",
				storage: createJSONStorage(() => localStorage),
				partialize: (state) => ({
					// Don't persist hydration state
					// Persist redirect control states
					hasSeenOnboarding: state.hasSeenOnboarding,
					hasCompletedOnboarding: state.hasCompletedOnboarding,
					hasSkippedOnboarding: state.hasSkippedOnboarding,
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
			},
		),
	);

const OnboardingStoreContext = createContext<ReturnType<
	typeof createOnboardingStore
> | null>(null);

export const OnboardingStoreProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const storeRef = useRef<ReturnType<typeof createOnboardingStore> | undefined>(
		undefined,
	);
	if (!storeRef.current) {
		storeRef.current = createOnboardingStore();
	}

	return (
		<OnboardingStoreContext.Provider value={storeRef.current}>
			{children}
		</OnboardingStoreContext.Provider>
	);
};

export const useOnboardingStore = <T = OnboardingState>(
	selector?: (state: OnboardingState) => T,
) => {
	const store = useContext(OnboardingStoreContext);
	if (!store) {
		throw new Error(
			"useOnboardingStore must be used within OnboardingStoreProvider",
		);
	}
	return selector ? useStore(store, selector) : (useStore(store) as T);
};
