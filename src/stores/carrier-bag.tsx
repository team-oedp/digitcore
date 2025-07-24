"use client";

import { createStore, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useRef, createContext, useContext } from "react";
import type { Pattern, CarrierBagItem } from "~/types/pattern";

interface CarrierBagState {
  items: CarrierBagItem[];
  isHydrated: boolean;
  addPattern: (pattern: Pattern, notes?: string) => void;
  removePattern: (patternId: string) => void;
  updateNotes: (patternId: string, notes: string) => void;
  clearBag: () => void;
  hasPattern: (patternId: string) => boolean;
  getPattern: (patternId: string) => CarrierBagItem | undefined;
  setHydrated: (hydrated: boolean) => void;
}

export const createCarrierBagStore = () => createStore<CarrierBagState>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      addPattern: (pattern: Pattern, notes?: string) => {
        const { items } = get();
        
        if (items.some(item => item.pattern._id === pattern._id)) {
          return;
        }

        const newItem: CarrierBagItem = {
          pattern,
          dateAdded: new Date().toISOString(),
          notes,
        };

        set({ items: [...items, newItem] });
      },

      removePattern: (patternId: string) => {
        const { items } = get();
        set({ items: items.filter(item => item.pattern._id !== patternId) });
      },

      updateNotes: (patternId: string, notes: string) => {
        const { items } = get();
        set({
          items: items.map(item =>
            item.pattern._id === patternId
              ? { ...item, notes }
              : item
          ),
        });
      },

      clearBag: () => {
        set({ items: [] });
      },

      hasPattern: (patternId: string) => {
        const { items } = get();
        return items.some(item => item.pattern._id === patternId);
      },

      getPattern: (patternId: string) => {
        const { items } = get();
        return items.find(item => item.pattern._id === patternId);
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: "carrier-bag",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

const CarrierBagStoreContext = createContext<ReturnType<typeof createCarrierBagStore> | null>(null);

export const CarrierBagStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef<ReturnType<typeof createCarrierBagStore>>(createCarrierBagStore());
  if (!storeRef.current) {
    storeRef.current = createCarrierBagStore();
  }
  
  return (
    <CarrierBagStoreContext.Provider value={storeRef.current}>
      {children}
    </CarrierBagStoreContext.Provider>
  );
};

export const useCarrierBagStore = () => {
  const store = useContext(CarrierBagStoreContext);
  if (!store) {
    throw new Error('useCarrierBagStore must be used within CarrierBagStoreProvider');
  }
  return useStore(store);
};