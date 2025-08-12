"use client";

import { useEffect } from "react";
import { useSectionInViewStore } from "~/stores/section-in-view";

export function useActiveLetter() {
  return useSectionInViewStore((s) => s.activeLetter);
}

export function useHeaderOffset() {
  return useSectionInViewStore((s) => s.headerOffset);
}

export function useRegisterAvailableLetters(letters: string[]) {
  const setAvailableLetters = useSectionInViewStore((s) => s.setAvailableLetters);
  useEffect(() => {
    setAvailableLetters(letters);
  }, [letters, setAvailableLetters]);
}

