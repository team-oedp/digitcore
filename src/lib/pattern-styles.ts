/**
 * Unified style system for pattern components
 * Single source of truth for styling across web and PDF renderers
 */

// Design tokens - shared values
export const designTokens = {
	colors: {
		primary: "#000000",
		secondary: "#71717a",
		muted: "#a1a1aa",
		border: "#d4d4d8",
		background: "#ffffff",
		tag: {
			background: "#f3f4f6",
			text: "#374151",
		},
		audience: {
			background: "#dbeafe",
			border: "#bfdbfe",
			text: "#1e40af",
		},
		success: {
			background: "#f0fdf4",
			border: "#bbf7d0",
			text: "#166534",
		},
	},
	typography: {
		fontFamily: "UntitledSans",
		sizes: {
			xs: 10,
			sm: 12,
			base: 14,
			lg: 16,
			xl: 18,
			"2xl": 24,
			"3xl": 32,
		},
		weights: {
			light: 300,
			normal: 400,
			medium: 500,
			semibold: 600,
			bold: 700,
		},
		lineHeights: {
			tight: 1.4,
			normal: 1.5,
			relaxed: 1.6,
		},
	},
	spacing: {
		xs: 4,
		sm: 8,
		md: 12,
		lg: 16,
		xl: 20,
		"2xl": 24,
		"3xl": 32,
		"4xl": 40,
	},
	borders: {
		radius: {
			sm: 4,
			md: 6,
			lg: 8,
		},
		width: {
			thin: 1,
			medium: 2,
		},
	},
} as const;

// Component-specific style definitions
export const patternStyles = {
	// Document structure
	page: {
		backgroundColor: designTokens.colors.background,
		fontFamily: designTokens.typography.fontFamily,
		fontSize: designTokens.typography.sizes.sm,
		lineHeight: designTokens.typography.lineHeights.tight,
		color: designTokens.colors.primary,
	},

	// Cover page
	coverTitle: {
		fontSize: designTokens.typography.sizes["3xl"],
		fontWeight: designTokens.typography.weights.light,
		color: designTokens.colors.primary,
		textTransform: "capitalize" as const,
		marginBottom: designTokens.spacing.xl,
	},
	coverSubtitle: {
		fontSize: designTokens.typography.sizes.base,
		color: designTokens.colors.secondary,
		marginBottom: designTokens.spacing["4xl"],
	},
	coverMeta: {
		fontSize: designTokens.typography.sizes.sm,
		color: designTokens.colors.muted,
	},

	// Table of contents
	tocTitle: {
		fontSize: designTokens.typography.sizes["2xl"],
		fontWeight: designTokens.typography.weights.light,
		color: designTokens.colors.primary,
		marginBottom: designTokens.spacing["3xl"],
	},
	tocItem: {
		paddingVertical: designTokens.spacing.sm,
		borderBottomWidth: designTokens.borders.width.thin,
		borderBottomColor: "#f4f4f5",
	},
	tocItemTitle: {
		fontSize: designTokens.typography.sizes.base,
		color: designTokens.colors.primary,
		textTransform: "capitalize" as const,
	},
	tocItemPage: {
		fontSize: designTokens.typography.sizes.sm,
		color: designTokens.colors.secondary,
	},

	// Pattern header
	patternTitle: {
		fontSize: designTokens.typography.sizes["3xl"],
		fontWeight: designTokens.typography.weights.light,
		color: designTokens.colors.primary,
		textTransform: "capitalize" as const,
		marginBottom: designTokens.spacing.xl,
	},
	patternDescription: {
		fontSize: designTokens.typography.sizes.base,
		color: designTokens.colors.primary,
		lineHeight: designTokens.typography.lineHeights.relaxed,
		marginBottom: designTokens.spacing["2xl"],
	},

	// Section headers
	sectionTitle: {
		fontSize: designTokens.typography.sizes["3xl"],
		fontWeight: designTokens.typography.weights.light,
		color: designTokens.colors.primary,
		marginTop: designTokens.spacing["3xl"],
		marginBottom: designTokens.spacing.lg,
	},

	// Connections/tags
	connectionContainer: {
		marginBottom: designTokens.spacing["3xl"],
	},
	connectionSection: {
		marginBottom: designTokens.spacing.lg,
	},
	connectionTitle: {
		fontSize: designTokens.typography.sizes.sm,
		fontWeight: designTokens.typography.weights.semibold,
		color: designTokens.colors.tag.text,
		textTransform: "uppercase" as const,
		marginBottom: designTokens.spacing.sm,
	},
	tag: {
		backgroundColor: designTokens.colors.tag.background,
		color: designTokens.colors.tag.text,
		fontSize: designTokens.typography.sizes.xs,
		paddingHorizontal: designTokens.spacing.sm,
		paddingVertical: designTokens.spacing.xs,
		borderRadius: designTokens.borders.radius.sm,
	},

	// Solutions
	solutionContainer: {
		marginBottom: designTokens.spacing["2xl"],
	},
	solutionNumber: {
		fontSize: designTokens.typography.sizes.xl,
		fontWeight: designTokens.typography.weights.normal,
		color: designTokens.colors.primary,
		width: 40,
	},
	solutionTitle: {
		fontSize: designTokens.typography.sizes.xl,
		fontWeight: designTokens.typography.weights.normal,
		color: designTokens.colors.primary,
		marginBottom: designTokens.spacing.md,
	},
	solutionDescription: {
		fontSize: designTokens.typography.sizes.base,
		color: designTokens.colors.secondary,
		lineHeight: designTokens.typography.lineHeights.normal,
		marginBottom: designTokens.spacing.md,
	},
	audienceTag: {
		backgroundColor: designTokens.colors.audience.background,
		borderColor: designTokens.colors.audience.border,
		borderWidth: designTokens.borders.width.thin,
		color: designTokens.colors.audience.text,
		fontSize: designTokens.typography.sizes.base,
		paddingHorizontal: 9,
		paddingVertical: designTokens.spacing.xs,
		borderRadius: designTokens.borders.radius.md,
	},

	// Resources
	resourceContainer: {
		borderTopColor: designTokens.colors.border,
		borderTopWidth: designTokens.borders.width.thin,
		borderStyle: "dashed" as const,
		paddingTop: designTokens.spacing.xl,
		paddingBottom: designTokens.spacing.xl,
	},
	resourceTitle: {
		fontSize: designTokens.typography.sizes.lg,
		fontWeight: designTokens.typography.weights.semibold,
		color: designTokens.colors.primary,
		marginBottom: designTokens.spacing.sm,
	},
	resourceDescription: {
		fontSize: designTokens.typography.sizes.base,
		color: designTokens.colors.secondary,
		lineHeight: designTokens.typography.lineHeights.normal,
		marginBottom: designTokens.spacing.md,
	},
	resourceSolutions: {
		fontSize: designTokens.typography.sizes.sm,
		color: "#6b7280",
		fontStyle: "italic" as const,
	},

	// Notes
	notesContainer: {
		marginTop: designTokens.spacing.xl,
		paddingTop: designTokens.spacing.lg,
		borderTopColor: "#e5e7eb",
		borderTopWidth: designTokens.borders.width.thin,
	},
	notesTitle: {
		fontSize: designTokens.typography.sizes.base,
		fontWeight: designTokens.typography.weights.semibold,
		color: designTokens.colors.tag.text,
		marginBottom: designTokens.spacing.sm,
	},
	notesText: {
		fontSize: designTokens.typography.sizes.sm,
		color: "#6b7280",
		lineHeight: designTokens.typography.lineHeights.normal,
	},

	// Page elements
	pageNumber: {
		fontSize: designTokens.typography.sizes.xs,
		color: designTokens.colors.muted,
	},
} as const;

export type PatternStyleKey = keyof typeof patternStyles;
