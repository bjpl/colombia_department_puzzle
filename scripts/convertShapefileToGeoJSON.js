const shapefile = require('shapefile');
const fs = require('fs');
const path = require('path');

async function convertShapefileToGeoJSON() {
  try {
    console.log('Converting shapefile to GeoJSON...');

    const shapefilePath = path.join(__dirname, '../public/data/geo/col_admbnda_adm1_mgn_20200416');
    const outputPath = path.join(__dirname, '../public/data/colombia-departments.json');

    const source = await shapefile.open(shapefilePath + '.shp', shapefilePath + '.dbf', {
      encoding: 'utf-8'
    });

    const features = [];
    let result = await source.read();

    while (!result.done) {
      if (result.value) {
        // Process each department feature
        const feature = result.value;

        // Simplify the property names for easier use
        const simplifiedFeature = {
          type: 'Feature',
          properties: {
            id: feature.properties.ADM1_PCODE || feature.properties.admin1Pcod,
            name: feature.properties.ADM1_ES || feature.properties.admin1Name_,
            nameEn: feature.properties.ADM1_EN || feature.properties.admin1Na_1,
            code: feature.properties.ADM1_PCODE || feature.properties.admin1Pcod,
            country: 'Colombia',
            validFrom: feature.properties.validOn || feature.properties.validFrom,
            validTo: feature.properties.validTo
          },
          geometry: feature.geometry
        };

        features.push(simplifiedFeature);
        console.log(`Processed: ${simplifiedFeature.properties.name}`);
      }

      result = await source.read();
    }

    // Create GeoJSON FeatureCollection
    const geoJSON = {
      type: 'FeatureCollection',
      features: features
    };

    // Save to file
    fs.writeFileSync(outputPath, JSON.stringify(geoJSON, null, 2));
    console.log(`✅ GeoJSON saved to ${outputPath}`);
    console.log(`Total departments processed: ${features.length}`);

    // Also create a simplified version for web performance
    const simplifiedPath = path.join(__dirname, '../public/data/colombia-departments-simplified.json');

    // Reduce coordinate precision for smaller file size
    const simplifiedGeoJSON = JSON.parse(JSON.stringify(geoJSON));
    simplifiedGeoJSON.features.forEach(feature => {
      if (feature.geometry && feature.geometry.coordinates) {
        feature.geometry.coordinates = simplifyCoordinates(feature.geometry.coordinates);
      }
    });

    fs.writeFileSync(simplifiedPath, JSON.stringify(simplifiedGeoJSON));
    console.log(`✅ Simplified GeoJSON saved to ${simplifiedPath}`);

    // Print department names for verification
    console.log('\nDepartments found:');
    features.forEach((f, i) => {
      console.log(`${i + 1}. ${f.properties.name} (${f.properties.nameEn})`);
    });

  } catch (error) {
    console.error('Error converting shapefile:', error);
  }
}

// Helper function to reduce coordinate precision
function simplifyCoordinates(coords, precision = 5) {
  if (typeof coords === 'number') {
    return Math.round(coords * Math.pow(10, precision)) / Math.pow(10, precision);
  }
  if (Array.isArray(coords)) {
    return coords.map(c => simplifyCoordinates(c, precision));
  }
  return coords;
}

// Run the conversion
convertShapefileToGeoJSON();