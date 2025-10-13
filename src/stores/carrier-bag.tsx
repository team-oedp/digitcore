"use client";

import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
	CarrierBagItem,
	PatternForCarrierBag,
} from "~/components/global/carrier-bag/carrier-bag-item";

type CarrierBagState = {
	items: CarrierBagItem[];
	isHydrated: boolean;
	isOpen: boolean;
	isPinned: boolean;
	isModalMode: boolean;
	stalePatternIds: string[];
	updatingPatternIds: string[];
	recentlyUpdatedIds: string[];
	hasUnseenUpdates: boolean;
	lastUpdateTime: number | null;
	showClearConfirmation: boolean;
	addPattern: (pattern: PatternForCarrierBag, notes?: string) => void;
	removePattern: (patternId: string) => void;
	updatePattern: (
		patternId: string,
		updatedPattern: PatternForCarrierBag,
	) => void;
	updateNotes: (patternId: string, notes: string) => void;
	clearBag: () => void;
	setItems: (items: CarrierBagItem[]) => void;
	hasPattern: (patternId: string) => boolean;
	getPattern: (patternId: string) => CarrierBagItem | undefined;
	setHydrated: (hydrated: boolean) => void;
	toggleOpen: () => void;
	setOpen: (open: boolean) => void;
	togglePin: () => void;
	setPin: (pinned: boolean) => void;
	toggleModalMode: () => void;
	setModalMode: (modalMode: boolean) => void;
	setStalePatternIds: (ids: string[]) => void;
	isPatternStale: (patternId: string) => boolean;
	markPatternFresh: (patternId: string, newVersion: string) => void;
	setUpdatingPatternIds: (ids: string[]) => void;
	addUpdatingPattern: (patternId: string) => void;
	removeUpdatingPattern: (patternId: string) => void;
	isPatternUpdating: (patternId: string) => boolean;
	isPatternRecentlyUpdated: (patternId: string) => boolean;
	markPatternUpdated: (patternId: string) => void;
	markUpdatesAsSeen: () => void;
	clearExpiredUpdates: () => void;
	showClearConfirmationPane: () => void;
	hideClearConfirmationPane: () => void;
};

export const createCarrierBagStore = () =>
	createStore<CarrierBagState>()(
		persist(
			(set, get) => ({
				items: [],
				isHydrated: false,
				isOpen: false,
				isPinned: false,
				isModalMode: false,
				stalePatternIds: [],
				updatingPatternIds: [],
				recentlyUpdatedIds: [],
				hasUnseenUpdates: false,
				lastUpdateTime: null,
				showClearConfirmation: false,

				addPattern: (pattern: PatternForCarrierBag, notes?: string) => {
					const { items } = get();

					if (items.some((item) => item.pattern._id === pattern._id)) {
						return;
					}

					const newItem: CarrierBagItem = {
						pattern,
						dateAdded: new Date().toISOString(),
						notes,
						contentVersion: pattern._updatedAt,
					};

					set({ items: [...items, newItem], isOpen: true });
				},

				removePattern: (patternId: string) => {
					const { items } = get();
					set({
						items: items.filter((item) => item.pattern._id !== patternId),
					});
				},

				updatePattern: (
					patternId: string,
					updatedPattern: PatternForCarrierBag,
				) => {
					const { items, markPatternUpdated } = get();
					set({
						items: items.map((item) =>
							item.pattern._id === patternId
								? {
										...item,
										pattern: updatedPattern,
										contentVersion: updatedPattern._updatedAt,
									}
								: item,
						),
					});
					// Mark this pattern as recently updated
					markPatternUpdated(patternId);
				},

				setItems: (items: CarrierBagItem[]) => {
					set({ items });
				},

				updateNotes: (patternId: string, notes: string) => {
					const { items } = get();
					set({
						items: items.map((item) =>
							item.pattern._id === patternId ? { ...item, notes } : item,
						),
					});
				},

				clearBag: () => {
					set({ items: [], showClearConfirmation: false });
				},

				hasPattern: (patternId: string) => {
					const { items } = get();
					return items.some((item) => item.pattern._id === patternId);
				},

				getPattern: (patternId: string) => {
					const { items } = get();
					return items.find((item) => item.pattern._id === patternId);
				},

				setHydrated: (hydrated: boolean) => {
					set({ isHydrated: hydrated });
				},

				toggleOpen: () => {
					const { isOpen } = get();
					set({ isOpen: !isOpen });
				},

				setOpen: (open: boolean) => {
					const { markUpdatesAsSeen } = get();
					set({ isOpen: open });
					// Mark updates as seen when drawer is opened
					if (open) {
						markUpdatesAsSeen();
					}
				},

				togglePin: () => {
					const { isPinned } = get();
					set({ isPinned: !isPinned });
				},

				setPin: (pinned: boolean) => {
					set({ isPinned: pinned });
				},

				toggleModalMode: () => {
					const { isModalMode } = get();
					set({ isModalMode: !isModalMode });
				},

				setModalMode: (modalMode: boolean) => {
					set({ isModalMode: modalMode });
				},

				setStalePatternIds: (ids: string[]) => {
					set({ stalePatternIds: ids });
				},

				isPatternStale: (patternId: string) => {
					const { stalePatternIds } = get();
					return stalePatternIds.includes(patternId);
				},

				markPatternFresh: (patternId: string, newVersion: string) => {
					const { items, stalePatternIds } = get();

					// Update contentVersion for the pattern
					const updatedItems = items.map((item) =>
						item.pattern._id === patternId
							? { ...item, contentVersion: newVersion }
							: item,
					);

					// Remove from stale list
					const updatedStaleIds = stalePatternIds.filter(
						(id) => id !== patternId,
					);

					set({
						items: updatedItems,
						stalePatternIds: updatedStaleIds,
					});
				},

				setUpdatingPatternIds: (ids: string[]) => {
					set({ updatingPatternIds: ids });
				},

				addUpdatingPattern: (patternId: string) => {
					const { updatingPatternIds } = get();
					if (!updatingPatternIds.includes(patternId)) {
						set({ updatingPatternIds: [...updatingPatternIds, patternId] });
					}
				},

				removeUpdatingPattern: (patternId: string) => {
					const { updatingPatternIds } = get();
					set({
						updatingPatternIds: updatingPatternIds.filter(
							(id) => id !== patternId,
						),
					});
				},

				isPatternUpdating: (patternId: string) => {
					const { updatingPatternIds } = get();
					return updatingPatternIds.includes(patternId);
				},

				isPatternRecentlyUpdated: (patternId: string) => {
					const { recentlyUpdatedIds } = get();
					return recentlyUpdatedIds.includes(patternId);
				},

				markPatternUpdated: (patternId: string) => {
					const { recentlyUpdatedIds } = get();
					if (!recentlyUpdatedIds.includes(patternId)) {
						set({
							recentlyUpdatedIds: [...recentlyUpdatedIds, patternId],
							hasUnseenUpdates: true,
							lastUpdateTime: Date.now(),
						});
					}
				},

				markUpdatesAsSeen: () => {
					set({
						hasUnseenUpdates: false,
					});
				},

				clearExpiredUpdates: () => {
					const { lastUpdateTime } = get();
					if (lastUpdateTime && Date.now() - lastUpdateTime > 120000) {
						// 2 minutes
						set({
							recentlyUpdatedIds: [],
							hasUnseenUpdates: false,
							lastUpdateTime: null,
						});
					}
				},

				showClearConfirmationPane: () => {
					set({ showClearConfirmation: true });
				},

				hideClearConfirmationPane: () => {
					set({ showClearConfirmation: false });
				},
			}),
			{
				name: "carrier-bag",
				storage: createJSONStorage(() => localStorage),
				onRehydrateStorage: () => (state) => {
					state?.setHydrated(true);
					// Ensure sidebar is closed on initial load
					state?.setOpen(false);
				},
				partialize: (state) => ({
					// Only persist items, not UI state or transient staleness/update notification data
					items: state.items,
				}),
			},
		),
	);

const CarrierBagStoreContext = createContext<ReturnType<
	typeof createCarrierBagStore
> | null>(null);

export const CarrierBagStoreProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const storeRef = useRef<ReturnType<typeof createCarrierBagStore>>(
		createCarrierBagStore(),
	);
	if (!storeRef.current) {
		storeRef.current = createCarrierBagStore();
	}

	return (
		<CarrierBagStoreContext.Provider value={storeRef.current}>
			{children}
		</CarrierBagStoreContext.Provider>
	);
};

// Stable identity selector to avoid infinite loops
const carrierBagIdentitySelector = (state: CarrierBagState) => state;

export const useCarrierBagStore = <T = CarrierBagState>(
	selector?: (state: CarrierBagState) => T,
) => {
	const store = useContext(CarrierBagStoreContext);
	if (!store) {
		throw new Error(
			"useCarrierBagStore must be used within CarrierBagStoreProvider",
		);
	}

	// Use stable identity selector when no selector provided
	const stableSelector =
		selector || (carrierBagIdentitySelector as (state: CarrierBagState) => T);
	return useStore(store, stableSelector);
};
