import "@testing-library/jest-dom";
import type { TestingLibraryMatchers } from "@testing-library/jest-dom/matchers";

declare module "vitest" {
	// Augment Vitest's Assertion interface with Testing Library matchers
	interface Assertion<T = unknown> extends TestingLibraryMatchers<T, void> {}
	interface AsymmetricMatchersContaining
		extends TestingLibraryMatchers<unknown, void> {}
}
