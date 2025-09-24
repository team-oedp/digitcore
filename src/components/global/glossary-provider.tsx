"use client";

import { createContext, useCallback, useContext, useRef } from "react";

type GlossaryContextType = {
	seenTerms: Set<string>;
	addSeenTerm: (termId: string) => void;
	hasSeenTerm: (termId: string) => boolean;
	resetSeenTerms: () => void;
};

const GlossaryContext = createContext<GlossaryContextType | null>(null);

/**
 * Page-scoped glossary provider
 * Tracks glossary terms seen only within the current page and resets on route changes.
 * Uses a ref-backed Set to avoid React state updates during render, which would
 * otherwise cause "Cannot update a component while rendering a different component".
 */
export function GlossaryProvider({ children }: { children: React.ReactNode }) {
	const seenTermsRef = useRef<Set<string>>(new Set());

	// Important: StrictMode in dev double-invokes render. If we carry the Set across
	// render passes, the second pass would see terms already marked and produce
	// different markup than the first pass (causing hydration mismatch). Starting with
	// a fresh Set on every render keeps SSR and client hydration consistent.
	seenTermsRef.current = new Set();

	const addSeenTerm = useCallback((termId: string) => {
		// Safe to mutate refs during render; does not trigger re-render
		seenTermsRef.current.add(termId);
	}, []);

	const hasSeenTerm = useCallback((termId: string) => {
		return seenTermsRef.current.has(termId);
	}, []);

	const resetSeenTerms = useCallback(() => {
		seenTermsRef.current = new Set();
	}, []);

	const value: GlossaryContextType = {
		seenTerms: seenTermsRef.current,
		addSeenTerm,
		hasSeenTerm,
		resetSeenTerms,
	};

	return (
		<GlossaryContext.Provider value={value}>
			{children}
		</GlossaryContext.Provider>
	);
}

export function useGlossary(): GlossaryContextType {
	const context = useContext(GlossaryContext);
	if (!context) {
		throw new Error("useGlossary must be used within a GlossaryProvider");
	}
	return context;
}
