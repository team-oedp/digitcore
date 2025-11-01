"use client";

import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ExploreMenuState = {
	isOpen: boolean;
	setOpen: (open: boolean) => void;
	toggle: () => void;
};

export const createExploreMenuStore = () =>
	createStore<ExploreMenuState>()(
		persist(
			(set, get) => ({
				isOpen: false,
				setOpen: (open: boolean) => set({ isOpen: open }),
				toggle: () => set({ isOpen: !get().isOpen }),
			}),
			{
				name: "explore-menu-state",
				storage: createJSONStorage(() => localStorage),
				partialize: (state) => ({
					isOpen: state.isOpen,
				}),
				version: 0,
			},
		),
	);

const ExploreMenuStoreContext = createContext<ReturnType<
	typeof createExploreMenuStore
> | null>(null);

export const ExploreMenuStoreProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const storeRef = useRef<
		ReturnType<typeof createExploreMenuStore> | undefined
	>(undefined);
	if (!storeRef.current) {
		storeRef.current = createExploreMenuStore();
	}

	return (
		<ExploreMenuStoreContext.Provider value={storeRef.current}>
			{children}
		</ExploreMenuStoreContext.Provider>
	);
};

const identitySelector = (state: ExploreMenuState) => state;

export const useExploreMenuStore = <T = ExploreMenuState>(
	selector?: (state: ExploreMenuState) => T,
) => {
	const store = useContext(ExploreMenuStoreContext);
	if (!store) {
		throw new Error(
			"useExploreMenuStore must be used within ExploreMenuStoreProvider",
		);
	}

	const stableSelector =
		selector || (identitySelector as (state: ExploreMenuState) => T);
	return useStore(store, stableSelector);
};
