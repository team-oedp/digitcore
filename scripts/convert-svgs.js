#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const ICONS_DIR = path.join(__dirname, "../public/icons");
const BACKUP_DIR = path.join(__dirname, "../public/icons-backup");

// Regex patterns for SVG attribute replacement
const ATTRIBUTE_PATTERNS = {
	fill: /fill="([^"]+)"/g,
	stroke: /stroke="([^"]+)"/g,
	fillOpacity: /fill-opacity="([^"]+)"/g,
	strokeOpacity: /stroke-opacity="([^"]+)"/g,
	strokeWidth: /stroke-width="([^"]+)"/g,
};

// CSS custom property mappings
/** @type {Record<string, (value: string) => string>} */
const CSS_VARIABLE_MAPPINGS = {
	fill: (originalValue) => `fill="var(--icon-fill-color, ${originalValue})"`,
	stroke: (originalValue) =>
		`stroke="var(--icon-stroke-color, ${originalValue})"`,
	fillOpacity: (originalValue) =>
		`fill-opacity="var(--icon-fill-opacity, ${originalValue})"`,
	strokeOpacity: (originalValue) =>
		`stroke-opacity="var(--icon-stroke-opacity, ${originalValue})"`,
	strokeWidth: (originalValue) =>
		`stroke-width="var(--icon-stroke-width, ${originalValue})"`,
};

/**
 * Convert SVG content to use CSS custom properties
 * @param {string} svgContent - Original SVG content
 * @returns {{ modifiedContent: string; conversionsApplied: number }} - result
 */
function convertSvgToCssVariables(svgContent) {
	let modifiedContent = svgContent;
	let conversionsApplied = 0;

	// Process each attribute type
	for (const [attributeName, pattern] of Object.entries(ATTRIBUTE_PATTERNS)) {
		const mapping = CSS_VARIABLE_MAPPINGS[attributeName];
		if (!mapping) continue;
		modifiedContent = modifiedContent.replace(
			pattern,
			(match, originalValue) => {
				// Skip if value is already a CSS custom property
				if (originalValue.includes("var(")) {
					return match;
				}

				// Skip 'none' values for fill and stroke
				if (
					(attributeName === "fill" || attributeName === "stroke") &&
					originalValue === "none"
				) {
					return match;
				}

				conversionsApplied++;
				return mapping(originalValue);
			},
		);
	}

	return { modifiedContent, conversionsApplied };
}

/**
 * Create backup directory if it doesn't exist
 */
function ensureBackupDirectory() {
	if (!fs.existsSync(BACKUP_DIR)) {
		fs.mkdirSync(BACKUP_DIR, { recursive: true });
		console.log(`✅ Created backup directory: ${BACKUP_DIR}`);
	}
}

/**
 * Process a single SVG file
 * @param {string} filePath - Path to the SVG file
 * @returns {{ success: boolean; fileName: string; conversionsApplied?: number; error?: string; message: string }} - result
 */
function processSvgFile(filePath) {
	const fileName = path.basename(filePath);
	const backupPath = path.join(BACKUP_DIR, fileName);

	try {
		// Read original SVG content
		const originalContent = fs.readFileSync(filePath, "utf8");

		// Create backup
		fs.copyFileSync(filePath, backupPath);

		// Convert to CSS custom properties
		const { modifiedContent, conversionsApplied } =
			convertSvgToCssVariables(originalContent);

		// Write modified content back to original file
		fs.writeFileSync(filePath, modifiedContent, "utf8");

		return {
			success: true,
			fileName,
			conversionsApplied,
			message: `✅ Converted ${fileName} (${conversionsApplied} attributes modified)`,
		};
	} catch (error) {
		const err = /** @type {Error} */ (error);
		return {
			success: false,
			fileName,
			error: err.message,
			message: `❌ Failed to convert ${fileName}: ${err.message}`,
		};
	}
}

/**
 * Main conversion function
 */
function convertAllSvgs() {
	console.log("🚀 Starting SVG conversion to CSS custom properties...\n");

	// Ensure backup directory exists
	ensureBackupDirectory();

	// Check if icons directory exists
	if (!fs.existsSync(ICONS_DIR)) {
		console.error(`❌ Icons directory not found: ${ICONS_DIR}`);
		process.exit(1);
	}

	// Get all SVG files
	const files = fs
		.readdirSync(ICONS_DIR)
		.filter((file) => file.endsWith(".svg"))
		.map((file) => path.join(ICONS_DIR, file));

	if (files.length === 0) {
		console.log("⚠️  No SVG files found in icons directory");
		return;
	}

	console.log(`📁 Found ${files.length} SVG files to process\n`);

	// Process each file
	/** @type {{ success: boolean; fileName: string; conversionsApplied?: number; error?: string; message: string }[]} */
	const results = files.map(processSvgFile);

	// Generate summary
	const successful = results.filter((r) => r.success);
	const failed = results.filter((r) => !r.success);
	const totalConversions = successful.reduce(
		(sum, r) => sum + (r.conversionsApplied || 0),
		0,
	);

	// Display results
	console.log("\n📊 Conversion Results:");
	console.log("─".repeat(50));

	for (const result of results) {
		console.log(result.message);
	}

	console.log("\n📈 Summary:");
	console.log(`✅ Successfully converted: ${successful.length} files`);
	console.log(`❌ Failed conversions: ${failed.length} files`);
	console.log(`🔄 Total attribute conversions: ${totalConversions}`);
	console.log(`💾 Backups created in: ${BACKUP_DIR}`);

	if (failed.length > 0) {
		console.log("\n❌ Failed files:");
		for (const result of failed) {
			console.log(`   - ${result.fileName}: ${result.error}`);
		}
	}

	console.log("\n🎉 SVG conversion completed!");
}

// Run the conversion
convertAllSvgs();
