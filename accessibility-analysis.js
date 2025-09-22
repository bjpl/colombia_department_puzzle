// Accessibility Analysis Script for Colombia Puzzle Game
// Analyzes contrast ratios and color accessibility

const {
  ACCESSIBLE_REGION_COLORS,
  COLORBLIND_PALETTES,
  HIGH_CONTRAST_COLORS,
  getContrastRatio
} = require('./src/constants/accessibleColors.ts');

const { MODERN_REGION_COLORS } = require('./src/constants/modernAccessibleColors.ts');

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Calculate relative luminance
function getLuminance(rgb) {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function calculateContrast(color1, color2) {
  const lum1 = getLuminance(hexToRgb(color1));
  const lum2 = getLuminance(hexToRgb(color2));
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Analyze all color modes
function analyzeAccessibility() {
  const results = {
    normal: analyzeColors(MODERN_REGION_COLORS, 'Normal Mode'),
    accessible: analyzeColors(ACCESSIBLE_REGION_COLORS, 'Accessible Mode'),
    highContrast: analyzeHighContrastColors(),
    colorblindModes: {}
  };

  // Analyze colorblind modes
  Object.keys(COLORBLIND_PALETTES).forEach(mode => {
    if (mode !== 'normal') {
      results.colorblindModes[mode] = analyzeColorblindPalette(mode);
    }
  });

  return results;
}

function analyzeColors(colorSet, modeName) {
  console.log(`\n=== ${modeName} Analysis ===`);
  const whiteBackground = '#FFFFFF';
  const blackText = '#000000';
  const results = [];

  Object.entries(colorSet).forEach(([region, colors]) => {
    const primaryColor = typeof colors === 'string' ? colors : colors.primary;
    const textColor = typeof colors === 'object' ? colors.text : '#FFFFFF';

    // Test against white background
    const contrastWithWhite = calculateContrast(primaryColor, whiteBackground);
    const textContrast = calculateContrast(textColor, primaryColor);

    const result = {
      region,
      primaryColor,
      textColor,
      contrastWithWhite: contrastWithWhite.toFixed(2),
      textContrast: textContrast.toFixed(2),
      passesWCAG_AA: contrastWithWhite >= 4.5,
      passesWCAG_AAA: contrastWithWhite >= 7,
      textPassesWCAG: textContrast >= 4.5
    };

    results.push(result);

    console.log(`${region}:`);
    console.log(`  Primary: ${primaryColor} (${result.contrastWithWhite}:1 vs white)`);
    console.log(`  Text: ${textColor} (${result.textContrast}:1 vs primary)`);
    console.log(`  WCAG AA: ${result.passesWCAG_AA ? '✅' : '❌'}`);
    console.log(`  WCAG AAA: ${result.passesWCAG_AAA ? '✅' : '❌'}`);
    console.log(`  Text Readable: ${result.textPassesWCAG ? '✅' : '❌'}`);
  });

  return results;
}

function analyzeHighContrastColors() {
  console.log(`\n=== High Contrast Mode Analysis ===`);
  const whiteBackground = '#FFFFFF';
  const results = [];

  Object.entries(HIGH_CONTRAST_COLORS.regions).forEach(([region, color]) => {
    const contrastWithWhite = calculateContrast(color, whiteBackground);

    const result = {
      region,
      color,
      contrastWithWhite: contrastWithWhite.toFixed(2),
      passesWCAG_AA: contrastWithWhite >= 4.5,
      passesWCAG_AAA: contrastWithWhite >= 7
    };

    results.push(result);

    console.log(`${region}: ${color} (${result.contrastWithWhite}:1)`);
    console.log(`  WCAG AA: ${result.passesWCAG_AA ? '✅' : '❌'}`);
    console.log(`  WCAG AAA: ${result.passesWCAG_AAA ? '✅' : '❌'}`);
  });

  return results;
}

function analyzeColorblindPalette(mode) {
  console.log(`\n=== ${mode.charAt(0).toUpperCase() + mode.slice(1)} Mode Analysis ===`);
  const palette = COLORBLIND_PALETTES[mode];
  const whiteBackground = '#FFFFFF';
  const results = [];

  Object.entries(palette).forEach(([region, color]) => {
    if (region === 'default') return;

    const contrastWithWhite = calculateContrast(color, whiteBackground);

    const result = {
      region,
      color,
      contrastWithWhite: contrastWithWhite.toFixed(2),
      passesWCAG_AA: contrastWithWhite >= 4.5,
      passesWCAG_AAA: contrastWithWhite >= 7
    };

    results.push(result);

    console.log(`${region}: ${color} (${result.contrastWithWhite}:1)`);
    console.log(`  WCAG AA: ${result.passesWCAG_AA ? '✅' : '❌'}`);
    console.log(`  WCAG AAA: ${result.passesWCAG_AAA ? '✅' : '❌'}`);
  });

  return results;
}

// Run analysis
try {
  const analysis = analyzeAccessibility();

  console.log('\n🎯 SUMMARY REPORT:');

  // Count failures
  let totalFailures = 0;
  let totalColors = 0;

  Object.values(analysis).forEach(modeResults => {
    if (Array.isArray(modeResults)) {
      modeResults.forEach(result => {
        totalColors++;
        if (!result.passesWCAG_AA) totalFailures++;
      });
    } else if (typeof modeResults === 'object') {
      Object.values(modeResults).forEach(results => {
        results.forEach(result => {
          totalColors++;
          if (!result.passesWCAG_AA) totalFailures++;
        });
      });
    }
  });

  console.log(`Total colors analyzed: ${totalColors}`);
  console.log(`WCAG AA failures: ${totalFailures}`);
  console.log(`Success rate: ${((totalColors - totalFailures) / totalColors * 100).toFixed(1)}%`);

} catch (error) {
  console.error('Analysis failed:', error.message);
  console.log('Running simplified analysis...');

  // Simplified analysis with hardcoded values
  const modernColors = {
    'Andina': '#059669',
    'Caribe': '#0EA5E9',
    'Pacífico': '#7C3AED',
    'Orinoquía': '#F97316',
    'Amazonía': '#14B8A6',
    'Insular': '#06B6D4'
  };

  console.log('\n=== Modern Colors Contrast Analysis ===');
  Object.entries(modernColors).forEach(([region, color]) => {
    const contrast = calculateContrast(color, '#FFFFFF');
    console.log(`${region}: ${color} - ${contrast.toFixed(2)}:1 ${contrast >= 4.5 ? '✅' : '❌'}`);
  });
}