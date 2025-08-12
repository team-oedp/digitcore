"use client";

import { create } from "zustand";

export type SectionInViewState = {
  activeLetter: string | null;
  setActiveLetter: (letter: string | null) => void;
  headerOffset: number; // pixels from top of viewport to measure in-view from (bottom of header)
  setHeaderOffset: (offset: number) => void;
  availableLetters: string[];
  setAvailableLetters: (letters: string[]) => void;
};

export const useSectionInViewStore = create<SectionInViewState>((set) => ({
  activeLetter: null,
  setActiveLetter: (letter) => set({ activeLetter: letter }),
  headerOffset: 0,
  setHeaderOffset: (offset) => set({ headerOffset: Math.max(0, Math.floor(offset)) }),
  availableLetters: [],
  setAvailableLetters: (letters) => set({ availableLetters: letters }),
}));

