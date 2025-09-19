const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

/**
 * Aggressively optimize GeoJSON for web performance
 * Using ruv-swarm inspired optimization patterns
 */
async function optimizeGeoJSON() {
  console.log('🚀 Starting aggressive GeoJSON optimization...');

  const inputPath = path.join(__dirname, '../public/data/colombia-departments.json');
  const outputPath = path.join(__dirname, '../public/data/colombia-departments-optimized.json');

  // Read the original GeoJSON
  const geoJSON = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  console.log(`📊 Original features: ${geoJSON.features.length}`);
  console.log(`📦 Original file size: ${(fs.statSync(inputPath).size / 1024 / 1024).toFixed(2)} MB`);

  // Optimize each feature
  const optimizedFeatures = geoJSON.features.map((feature, index) => {
    console.log(`⚡ Optimizing ${feature.properties.name}...`);

    // 1. Simplify geometry aggressively
    let simplified = turf.simplify(feature, {
      tolerance: 0.01,  // Much higher tolerance for web display
      highQuality: false // Faster simplification
    });

    // 2. Reduce coordinate precision to 4 decimal places (11m accuracy)
    simplified.geometry.coordinates = reducePrecision(simplified.geometry.coordinates, 4);

    // 3. Remove unnecessary properties
    const optimizedFeature = {
      type: 'Feature',
      properties: {
        id: feature.properties.id || feature.properties.code || index.toString(),
        name: feature.properties.name,
        // Only keep essential properties
      },
      geometry: simplified.geometry
    };

    // 4. Calculate complexity reduction
    const originalPoints = countPoints(feature.geometry.coordinates);
    const optimizedPoints = countPoints(optimizedFeature.geometry.coordinates);
    const reduction = ((1 - optimizedPoints / originalPoints) * 100).toFixed(1);
    console.log(`   ✅ Reduced ${originalPoints} → ${optimizedPoints} points (${reduction}% reduction)`);

    return optimizedFeature;
  });

  // Create optimized GeoJSON
  const optimizedGeoJSON = {
    type: 'FeatureCollection',
    features: optimizedFeatures
  };

  // Save optimized version
  fs.writeFileSync(outputPath, JSON.stringify(optimizedGeoJSON));

  const optimizedSize = fs.statSync(outputPath).size / 1024 / 1024;
  console.log(`\n✨ Optimization complete!`);
  console.log(`📦 Optimized file size: ${optimizedSize.toFixed(2)} MB`);
  console.log(`🎯 Size reduction: ${((1 - optimizedSize / (fs.statSync(inputPath).size / 1024 / 1024)) * 100).toFixed(1)}%`);

  // Create an ultra-light version for initial loading
  createUltraLightVersion(optimizedGeoJSON);
}

/**
 * Create ultra-light version with bounding boxes only
 */
function createUltraLightVersion(geoJSON) {
  const ultraLightPath = path.join(__dirname, '../public/data/colombia-departments-ultralight.json');

  const ultraLightFeatures = geoJSON.features.map(feature => {
    const bbox = turf.bbox(feature);
    const bboxPolygon = turf.bboxPolygon(bbox);

    return {
      type: 'Feature',
      properties: {
        id: feature.properties.id,
        name: feature.properties.name,
        bbox: bbox
      },
      geometry: bboxPolygon.geometry
    };
  });

  const ultraLightGeoJSON = {
    type: 'FeatureCollection',
    features: ultraLightFeatures
  };

  fs.writeFileSync(ultraLightPath, JSON.stringify(ultraLightGeoJSON));

  const ultraLightSize = fs.statSync(ultraLightPath).size / 1024;
  console.log(`\n🚄 Ultra-light version created: ${ultraLightSize.toFixed(1)} KB`);
}

/**
 * Reduce coordinate precision recursively
 */
function reducePrecision(coords, precision) {
  if (typeof coords === 'number') {
    return Math.round(coords * Math.pow(10, precision)) / Math.pow(10, precision);
  }
  if (Array.isArray(coords)) {
    return coords.map(c => reducePrecision(c, precision));
  }
  return coords;
}

/**
 * Count total points in coordinate arrays
 */
function countPoints(coords) {
  if (!Array.isArray(coords)) return 0;
  if (coords.length === 2 && typeof coords[0] === 'number') return 1;
  return coords.reduce((sum, c) => sum + countPoints(c), 0);
}

// Run optimization
optimizeGeoJSON().catch(console.error);