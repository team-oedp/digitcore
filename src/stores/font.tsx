"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { createStore, useStore } from "zustand";
import { persist } from "zustand/middleware";

export type FontMode = "serif" | "sans-serif";

interface FontStore {
	mode: FontMode;
	setMode: (mode: FontMode) => void;
	toggleMode: () => void;
}

const createFontStore = () =>
	createStore<FontStore>()(
		persist(
			(set, get) => ({
				mode: "serif" as FontMode,
				setMode: (mode: FontMode) => set({ mode }),
				toggleMode: () =>
					set((state) => ({
						mode: state.mode === "serif" ? "sans-serif" : "serif",
					})),
			}),
			{
				name: "font-storage",
			},
		),
	);

type FontStoreApi = ReturnType<typeof createFontStore>;

const FontStoreContext = createContext<FontStoreApi | undefined>(undefined);

export interface FontStoreProviderProps {
	children: ReactNode;
}

export const FontStoreProvider = ({ children }: FontStoreProviderProps) => {
	const [store] = useState(() => createFontStore());

	useEffect(() => {
		const mode = store.getState().mode;
		const body = document.body;
		
		// Apply the font mode to the body element
		if (mode === "sans-serif") {
			body.classList.add("font-sans-body");
			body.classList.remove("font-serif-body");
		} else {
			body.classList.add("font-serif-body");
			body.classList.remove("font-sans-body");
		}
	}, [store]);

	// Subscribe to store changes and update body classes
	useEffect(() => {
		const unsubscribe = store.subscribe((state) => {
			const body = document.body;
			
			if (state.mode === "sans-serif") {
				body.classList.add("font-sans-body");
				body.classList.remove("font-serif-body");
			} else {
				body.classList.add("font-serif-body");
				body.classList.remove("font-sans-body");
			}
		});

		return unsubscribe;
	}, [store]);

	return (
		<FontStoreContext.Provider value={store}>
			{children}
		</FontStoreContext.Provider>
	);
};

export const useFontStore = <T,>(selector: (store: FontStore) => T): T => {
	const fontStoreContext = useContext(FontStoreContext);

	if (!fontStoreContext) {
		throw new Error("useFontStore must be used within FontStoreProvider");
	}

	return useStore(fontStoreContext, selector);
};