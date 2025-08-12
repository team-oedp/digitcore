import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Dynamically import all Digitcore icons
const Icon01 = dynamic(() => import("~/components/icons/digitcore/icon-01"));
const Icon02 = dynamic(() => import("~/components/icons/digitcore/icon-02"));
const Icon03 = dynamic(() => import("~/components/icons/digitcore/icon-03"));
const Icon04 = dynamic(() => import("~/components/icons/digitcore/icon-04"));
const Icon05 = dynamic(() => import("~/components/icons/digitcore/icon-05"));
const Icon06 = dynamic(() => import("~/components/icons/digitcore/icon-06"));
const Icon07 = dynamic(() => import("~/components/icons/digitcore/icon-07"));
const Icon08 = dynamic(() => import("~/components/icons/digitcore/icon-08"));
const Icon09 = dynamic(() => import("~/components/icons/digitcore/icon-09"));
const Icon10 = dynamic(() => import("~/components/icons/digitcore/icon-10"));
const Icon11 = dynamic(() => import("~/components/icons/digitcore/icon-11"));
const Icon12 = dynamic(() => import("~/components/icons/digitcore/icon-12"));
const Icon13 = dynamic(() => import("~/components/icons/digitcore/icon-13"));
const Icon14 = dynamic(() => import("~/components/icons/digitcore/icon-14"));
const Icon15 = dynamic(() => import("~/components/icons/digitcore/icon-15"));
const Icon16 = dynamic(() => import("~/components/icons/digitcore/icon-16"));
const Icon17 = dynamic(() => import("~/components/icons/digitcore/icon-17"));
const Icon18 = dynamic(() => import("~/components/icons/digitcore/icon-18"));
const Icon19 = dynamic(() => import("~/components/icons/digitcore/icon-19"));
const Icon20 = dynamic(() => import("~/components/icons/digitcore/icon-20"));
const Icon21 = dynamic(() => import("~/components/icons/digitcore/icon-21"));
const Icon22 = dynamic(() => import("~/components/icons/digitcore/icon-22"));
const Icon23 = dynamic(() => import("~/components/icons/digitcore/icon-23"));
const Icon24 = dynamic(() => import("~/components/icons/digitcore/icon-24"));

// Array of all available icons
const icons: ComponentType<React.ComponentPropsWithoutRef<"svg">>[] = [
	Icon01,
	Icon02,
	Icon03,
	Icon04,
	Icon05,
	Icon06,
	Icon07,
	Icon08,
	Icon09,
	Icon10,
	Icon11,
	Icon12,
	Icon13,
	Icon14,
	Icon15,
	Icon16,
	Icon17,
	Icon18,
	Icon19,
	Icon20,
	Icon21,
	Icon22,
	Icon23,
	Icon24,
];

/**
 * Get a unique icon for a pattern based on its slug or ID
 * Uses a simple hash function to consistently map patterns to icons
 */
export function getPatternIcon(
	slugOrId: string,
): ComponentType<React.ComponentPropsWithoutRef<"svg">> {
	// Simple hash function to get a number from a string
	let hash = 0;
	for (let i = 0; i < slugOrId.length; i++) {
		const char = slugOrId.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}

	// Use the absolute value and modulo to get an index within our icon array
	const index = Math.abs(hash) % icons.length;
	const icon = icons[index];
	if (!icon) {
		// This should never happen as we use modulo, but satisfies TypeScript
		return icons[0] as ComponentType<React.ComponentPropsWithoutRef<"svg">>;
	}
	return icon;
}

/**
 * Pre-defined mappings for specific patterns if desired
 * This allows manual control over which icon goes with which pattern
 */
export const patternIconMap: Record<
	string,
	ComponentType<React.ComponentPropsWithoutRef<"svg">>
> = {
	// Add specific mappings here if you want to manually assign icons
	// Example:
	// "pattern-slug-1": Icon01,
	// "pattern-slug-2": Icon02,
};

/**
 * Get icon for a pattern, checking manual mappings first
 */
export function getPatternIconWithMapping(
	slug: string,
): ComponentType<React.ComponentPropsWithoutRef<"svg">> {
	// Check if there's a manual mapping first
	if (patternIconMap[slug]) {
		return patternIconMap[slug];
	}

	// Otherwise use the hash-based selection
	return getPatternIcon(slug);
}
