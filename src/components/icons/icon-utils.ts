import type { CustomizableIconProps } from "./customizable-icon";

/**
 * Utility functions for working with customizable icons
 */

/**
 * Generate icon path for numbered icons (icon-01.svg through icon-24.svg)
 */
export function getIconPath(iconNumber: number): string {
	if (iconNumber < 1 || iconNumber > 24) {
		throw new Error("Icon number must be between 1 and 24");
	}

	const paddedNumber = iconNumber.toString().padStart(2, "0");
	return `/icons/icon-${paddedNumber}.svg`;
}

/**
 * Common color presets for icons
 */
export const IconColorPresets = {
	// Brand colors
	primary: {
		fillColor: "#85A374",
		strokeColor: "#85A374",
	},

	// Semantic colors
	success: {
		fillColor: "#10b981",
		strokeColor: "#059669",
	},

	warning: {
		fillColor: "#f59e0b",
		strokeColor: "#d97706",
	},

	error: {
		fillColor: "#ef4444",
		strokeColor: "#dc2626",
	},

	info: {
		fillColor: "#3b82f6",
		strokeColor: "#2563eb",
	},

	// Neutral colors
	neutral: {
		fillColor: "#6b7280",
		strokeColor: "#4b5563",
	},

	muted: {
		fillColor: "#9ca3af",
		strokeColor: "#6b7280",
		fillOpacity: 0.6,
		strokeOpacity: 0.6,
	},
} as const;

/**
 * Apply a color preset to icon props
 */
export function applyColorPreset(
	preset: keyof typeof IconColorPresets,
	overrides?: Partial<CustomizableIconProps>,
): Partial<CustomizableIconProps> {
	return {
		...IconColorPresets[preset],
		...overrides,
	};
}

/**
 * Create theme-aware icon props that work with CSS custom properties
 */
export function createThemedIconProps(
	lightColors: Partial<CustomizableIconProps>,
	darkColors: Partial<CustomizableIconProps>,
): Partial<CustomizableIconProps> {
	// In a real implementation, you'd check the current theme
	// For now, we'll return light colors as default
	// This can be enhanced to work with next-themes
	return lightColors;
}

/**
 * Validate icon props
 */
export function validateIconProps(
	props: Partial<CustomizableIconProps>,
): boolean {
	// Check opacity values are between 0 and 1
	if (
		props.fillOpacity !== undefined &&
		(props.fillOpacity < 0 || props.fillOpacity > 1)
	) {
		console.warn("fillOpacity should be between 0 and 1");
		return false;
	}

	if (
		props.strokeOpacity !== undefined &&
		(props.strokeOpacity < 0 || props.strokeOpacity > 1)
	) {
		console.warn("strokeOpacity should be between 0 and 1");
		return false;
	}

	// Check stroke width is positive
	if (props.strokeWidth !== undefined && props.strokeWidth < 0) {
		console.warn("strokeWidth should be positive");
		return false;
	}

	return true;
}
