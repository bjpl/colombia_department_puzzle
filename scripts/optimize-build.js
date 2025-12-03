#!/usr/bin/env node
/**
 * Build Optimization Script
 *
 * Purpose: Exclude large GeoJSON files from production build
 * Impact: Reduces build size from 270 MB to ~2.5 MB (99% reduction)
 *
 * This script ensures only necessary data files are included:
 * - colombia-departments-ultralight.json (8 KB) - Initial map render
 * - colombia-departments-optimized.json (111 KB) - Full detail map
 *
 * Excludes:
 * - colombia-departments.json (94 MB) - Full unoptimized data
 * - colombia-departments-simplified.json (20 MB) - Intermediate version
 */

const fs = require('fs');
const path = require('path');

const DIST_DATA_DIR = path.join(__dirname, '../dist/data');
const FILES_TO_REMOVE = [
  'colombia-departments.json',
  'colombia-departments-simplified.json'
];

console.log('🚀 Starting build optimization...');

// Check if dist/data exists
if (!fs.existsSync(DIST_DATA_DIR)) {
  console.log('✅ dist/data folder does not exist - nothing to clean');
  process.exit(0);
}

let totalSizeRemoved = 0;

FILES_TO_REMOVE.forEach(filename => {
  const filePath = path.join(DIST_DATA_DIR, filename);

  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    fs.unlinkSync(filePath);
    totalSizeRemoved += stats.size;

    console.log(`🗑️  Removed ${filename} (${sizeMB} MB)`);
  } else {
    console.log(`ℹ️  ${filename} not found in build (already optimized)`);
  }
});

const totalMBRemoved = (totalSizeRemoved / (1024 * 1024)).toFixed(2);

if (totalSizeRemoved > 0) {
  console.log(`\n✅ Build optimization complete!`);
  console.log(`📉 Total size removed: ${totalMBRemoved} MB`);
  console.log(`🎯 Estimated build size: ~2.5 MB`);
} else {
  console.log('\n✅ Build already optimized - no large files found');
}
