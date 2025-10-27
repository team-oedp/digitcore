#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SHAPES_DIR = path.join(__dirname, '../src/components/icons/shapes');

// Regex patterns for attribute replacement
const ATTRIBUTE_PATTERNS = {
  fill: /fill="([^"]+)"/g,
  stroke: /stroke="([^"]+)"/g,
  fillOpacity: /fillOpacity="([^"]+)"/g,
  strokeOpacity: /strokeOpacity="([^"]+)"/g,
};

// CSS custom property mappings
const CSS_VARIABLE_MAPPINGS = {
  fill: (originalValue) => `fill="var(--icon-fill-color, ${originalValue})"`,
  stroke: (originalValue) => `stroke="var(--icon-stroke-color, ${originalValue})"`,
  fillOpacity: (originalValue) => `fillOpacity="var(--icon-fill-opacity, ${originalValue})"`,
  strokeOpacity: (originalValue) => `strokeOpacity="var(--icon-stroke-opacity, ${originalValue})"`,
};

/**
 * Convert React component content to use CSS custom properties
 * @param {string} content - Original component content
 * @returns {string} - Modified component content with CSS custom properties
 */
function convertComponentToCssVariables(content) {
  let modifiedContent = content;
  let conversionsApplied = 0;

  // Process each attribute type
  Object.entries(ATTRIBUTE_PATTERNS).forEach(([attributeName, pattern]) => {
    const mapping = CSS_VARIABLE_MAPPINGS[attributeName];
    
    if (mapping) {
      modifiedContent = modifiedContent.replace(pattern, (match, originalValue) => {
        // Skip if value is already a CSS custom property
        if (originalValue.includes('var(')) {
          return match;
        }
        
        // Skip 'none' values for fill and stroke
        if ((attributeName === 'fill' || attributeName === 'stroke') && originalValue === 'none') {
          return match;
        }
        
        conversionsApplied++;
        return mapping(originalValue);
      });
    }
  });

  return { modifiedContent, conversionsApplied };
}

/**
 * Process a single React component file
 * @param {string} filePath - Path to the component file
 * @returns {Object} - Processing result
 */
function processComponentFile(filePath) {
  const fileName = path.basename(filePath);
  
  try {
    // Read original component content
    const originalContent = fs.readFileSync(filePath, 'utf8');
    
    // Convert to CSS custom properties
    const { modifiedContent, conversionsApplied } = convertComponentToCssVariables(originalContent);
    
    // Only write if changes were made
    if (conversionsApplied > 0) {
      fs.writeFileSync(filePath, modifiedContent, 'utf8');
      
      return {
        success: true,
        fileName,
        conversionsApplied,
        message: `✅ Converted ${fileName} (${conversionsApplied} attributes modified)`
      };
    } else {
      return {
        success: true,
        fileName,
        conversionsApplied: 0,
        message: `⏭️  Skipped ${fileName} (already converted or no attributes to convert)`
      };
    }
  } catch (error) {
    return {
      success: false,
      fileName,
      error: error.message,
      message: `❌ Failed to convert ${fileName}: ${error.message}`
    };
  }
}

/**
 * Main conversion function
 */
function convertAllShapeIcons() {
  console.log('🚀 Starting React shape icon conversion to CSS custom properties...\n');
  
  // Check if shapes directory exists
  if (!fs.existsSync(SHAPES_DIR)) {
    console.error(`❌ Shapes directory not found: ${SHAPES_DIR}`);
    process.exit(1);
  }
  
  // Get all TypeScript/TSX files
  const files = fs.readdirSync(SHAPES_DIR)
    .filter(file => file.endsWith('.tsx') || file.endsWith('.ts'))
    .map(file => path.join(SHAPES_DIR, file));
  
  if (files.length === 0) {
    console.log('⚠️  No TypeScript component files found in shapes directory');
    return;
  }
  
  console.log(`📁 Found ${files.length} component files to process\n`);
  
  // Process each file
  const results = files.map(processComponentFile);
  
  // Generate summary
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalConversions = successful.reduce((sum, r) => sum + r.conversionsApplied, 0);
  
  // Display results
  console.log('\n📊 Conversion Results:');
  console.log('─'.repeat(50));
  
  results.forEach(result => {
    console.log(result.message);
  });
  
  console.log('\n📈 Summary:');
  console.log(`✅ Successfully processed: ${successful.length} files`);
  console.log(`❌ Failed conversions: ${failed.length} files`);
  console.log(`🔄 Total attribute conversions: ${totalConversions}`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed files:');
    failed.forEach(result => {
      console.log(`   - ${result.fileName}: ${result.error}`);
    });
  }
  
  console.log('\n🎉 Shape icon conversion completed!');
}

// Run the conversion
convertAllShapeIcons();