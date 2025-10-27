"use client";

import { createContext, useContext, useRef } from "react";
import { createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Language = "en" | "es";

type LanguageState = {
	language: Language;
	setLanguage: (language: Language) => void;
};

const defaultLanguage: Language = "en";

export const createLanguageStore = () =>
	createStore<LanguageState>()(
		persist(
			(set) => ({
				language: defaultLanguage,

				setLanguage: (language: Language) => set({ language }),
			}),
			{
				name: "language-state",
				storage: createJSONStorage(() => localStorage),
				partialize: (state) => ({
					language: state.language,
				}),
				onRehydrateStorage: () => (state) => {
					if (state && typeof document !== "undefined") {
						const cookieLanguage = document.cookie
							.split("; ")
							.find((row) => row.startsWith("language="))
							?.split("=")[1] as Language | undefined;

						if (cookieLanguage && cookieLanguage !== state.language) {
							state.setLanguage(cookieLanguage);
						}
					}
				},
			},
		),
	);

const LanguageStoreContext = createContext<ReturnType<
	typeof createLanguageStore
> | null>(null);

export const LanguageStoreProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const storeRef = useRef<ReturnType<typeof createLanguageStore>>(
		createLanguageStore(),
	);
	if (!storeRef.current) {
		storeRef.current = createLanguageStore();
	}

	return (
		<LanguageStoreContext.Provider value={storeRef.current}>
			{children}
		</LanguageStoreContext.Provider>
	);
};

const languageIdentitySelector = (state: LanguageState) => state;

export const useLanguageStore = <T = LanguageState>(
	selector?: (state: LanguageState) => T,
) => {
	const store = useContext(LanguageStoreContext);
	if (!store) {
		throw new Error(
			"useLanguageStore must be used within LanguageStoreProvider",
		);
	}

	const stableSelector =
		selector || (languageIdentitySelector as (state: LanguageState) => T);
	return useStore(store, stableSelector);
};
