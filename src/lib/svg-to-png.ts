/**
 * SVG to PNG conversion utility for PDF generation
 * Converts SVG files to PNG data URIs that can be used in @react-pdf/renderer
 */

export type SvgToPngOptions = {
	width?: number;
	height?: number;
	scale?: number;
};

/**
 * Converts an SVG file to a PNG data URI
 * @param svgPath - Path to the SVG file (relative to public directory)
 * @param options - Conversion options
 * @returns Promise that resolves to PNG data URI
 */
export async function svgToPngDataUri(
	svgPath: string,
	options: SvgToPngOptions = {},
): Promise<string> {
	const { width = 64, height = 64, scale = 2 } = options;

	try {
		// Fetch the SVG content
		const response = await fetch(svgPath);
		if (!response.ok) {
			throw new Error(`Failed to fetch SVG: ${response.statusText}`);
		}

		const svgText = await response.text();

		// Create canvas for rendering
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			throw new Error("Could not get canvas context");
		}

		// Set canvas dimensions with scaling for high quality
		const scaledWidth = width * scale;
		const scaledHeight = height * scale;
		canvas.width = scaledWidth;
		canvas.height = scaledHeight;

		// Create image element
		const img = new Image();

		return new Promise((resolve, reject) => {
			img.onload = () => {
				try {
					// Clear canvas and draw with high quality
					ctx.clearRect(0, 0, scaledWidth, scaledHeight);
					ctx.imageSmoothingEnabled = true;
					ctx.imageSmoothingQuality = "high";

					// Draw the SVG image onto canvas
					ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

					// Convert to PNG data URI
					const dataUri = canvas.toDataURL("image/png");
					resolve(dataUri);
				} catch (error) {
					reject(new Error(`Failed to draw image: ${error}`));
				}
			};

			img.onerror = () => {
				reject(new Error("Failed to load SVG image"));
			};

			// Convert SVG to data URI and set as image source
			const svgDataUri = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgText)))}`;
			img.src = svgDataUri;
		});
	} catch (error) {
		throw new Error(`SVG to PNG conversion failed: ${error}`);
	}
}

/**
 * Cache for converted SVG images to avoid repeated conversions
 */
const conversionCache = new Map<string, Promise<string>>();

/**
 * Converts SVG to PNG with caching to improve performance
 * @param svgPath - Path to the SVG file
 * @param options - Conversion options
 * @returns Promise that resolves to PNG data URI
 */
export async function svgToPngCached(
	svgPath: string,
	options: SvgToPngOptions = {},
): Promise<string> {
	const cacheKey = `${svgPath}_${JSON.stringify(options)}`;

	const cachedPromise = conversionCache.get(cacheKey);
	if (cachedPromise) return cachedPromise;

	const conversionPromise = svgToPngDataUri(svgPath, options);
	conversionCache.set(cacheKey, conversionPromise);

	return conversionPromise;
}

/**
 * Clears the conversion cache (useful for testing or memory management)
 */
export function clearSvgConversionCache(): void {
	conversionCache.clear();
}
