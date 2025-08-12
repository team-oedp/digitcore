"use client";

import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OnboardingState = {
	hasSeenOnboarding: boolean;
	hasCompletedOnboarding: boolean;
	selectedAudienceIds: string[];
	selectedThemeIds: string[];
	completedAt?: string;
	setSeen: (seen: boolean) => void;
	setCompleted: (completed: boolean) => void;
	setSelectedAudiences: (ids: string[]) => void;
	setSelectedThemes: (ids: string[]) => void;
	reset: () => void;
};

export const createOnboardingStore = () =>
	createStore<OnboardingState>()(
		persist(
			(set) => ({
				hasSeenOnboarding: false,
				hasCompletedOnboarding: false,
				selectedAudienceIds: [],
				selectedThemeIds: [],
				completedAt: undefined,

				setSeen: (seen: boolean) => set({ hasSeenOnboarding: seen }),

				setCompleted: (completed: boolean) =>
					set({
						hasCompletedOnboarding: completed,
						completedAt: completed ? new Date().toISOString() : undefined,
					}),

				setSelectedAudiences: (ids: string[]) =>
					set({ selectedAudienceIds: ids }),

				setSelectedThemes: (ids: string[]) => set({ selectedThemeIds: ids }),

				reset: () =>
					set({
						hasSeenOnboarding: false,
						hasCompletedOnboarding: false,
						selectedAudienceIds: [],
						selectedThemeIds: [],
						completedAt: undefined,
					}),
			}),
			{
				name: "onboarding-preferences",
				storage: createJSONStorage(() => localStorage),
				partialize: (state) => ({
					hasSeenOnboarding: state.hasSeenOnboarding,
					hasCompletedOnboarding: state.hasCompletedOnboarding,
					selectedAudienceIds: state.selectedAudienceIds,
					selectedThemeIds: state.selectedThemeIds,
					completedAt: state.completedAt,
				}),
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
	const storeRef = useRef<ReturnType<typeof createOnboardingStore>>(
		createOnboardingStore(),
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
