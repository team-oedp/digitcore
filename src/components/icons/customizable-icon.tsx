import React, { useMemo } from "react";

export type CustomizableIconProps = Omit<
	React.ImgHTMLAttributes<HTMLImageElement>,
	"src"
> & {
	/** Path to the SVG file (e.g., "/icons/icon-01.svg") */
	src: string;
	/** Custom fill color (overrides --icon-fill-color) */
	fillColor?: string;
	/** Custom fill opacity (overrides --icon-fill-opacity) */
	fillOpacity?: number;
	/** Custom stroke color (overrides --icon-stroke-color) */
	strokeColor?: string;
	/** Custom stroke opacity (overrides --icon-stroke-opacity) */
	strokeOpacity?: number;
	/** Custom stroke width (overrides --icon-stroke-width) */
	strokeWidth?: number;
};

/**
 * CustomizableIcon component that allows dynamic styling of SVG icons
 * using CSS custom properties. Works with SVG files that have been
 * converted to use CSS custom properties with fallback values.
 *
 * @example
 * // Default appearance (uses fallback colors from SVG)
 * <CustomizableIcon src="/icons/icon-01.svg" />
 *
 * @example
 * // Custom colors
 * <CustomizableIcon
 *   src="/icons/icon-01.svg"
 *   fillColor="#ff6b9d"
 *   strokeColor="#c44569"
 *   fillOpacity={0.8}
 * />
 */
export const CustomizableIcon = React.memo<CustomizableIconProps>(
	({
		src,
		fillColor,
		fillOpacity,
		strokeColor,
		strokeOpacity,
		strokeWidth,
		width,
		height,
		className = "",
		alt = "Icon",
		...props
	}) => {
		// Create CSS custom properties object
		const customProperties = useMemo(() => {
			const style: Record<string, string> = {};

			if (fillColor !== undefined) {
				style["--icon-fill-color"] = fillColor;
			}

			if (fillOpacity !== undefined) {
				style["--icon-fill-opacity"] = fillOpacity.toString();
			}

			if (strokeColor !== undefined) {
				style["--icon-stroke-color"] = strokeColor;
			}

			if (strokeOpacity !== undefined) {
				style["--icon-stroke-opacity"] = strokeOpacity.toString();
			}

			if (strokeWidth !== undefined) {
				style["--icon-stroke-width"] = strokeWidth.toString();
			}

			return style;
		}, [fillColor, fillOpacity, strokeColor, strokeOpacity, strokeWidth]);

		return (
			<img
				src={src}
				width={width}
				height={height}
				className={className}
				style={customProperties}
				{...props}
				alt={alt}
			/>
		);
	},
);

CustomizableIcon.displayName = "CustomizableIcon";
