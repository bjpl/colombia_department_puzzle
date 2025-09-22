#!/usr/bin/env node

/**
 * Accessibility Validation Script for Colombia Puzzle Game
 *
 * This script manually calculates contrast ratios and validates WCAG compliance
 * for all color modes in the game.
 *
 * Usage: node scripts/validate-accessibility.js
 */

// Color data extracted from the TypeScript files
const MODERN_REGION_COLORS = {
  'Andina': '#059669',
  'Caribe': '#0EA5E9',
  'Pacífico': '#7C3AED',
  'Orinoquía': '#F97316',
  'Amazonía': '#14B8A6',
  'Insular': '#06B6D4'
};

const ACCESSIBLE_REGION_COLORS = {
  'Andina': '#0D5F3A',
  'Caribe': '#0056B3',
  'Pacífica': '#5B21B6',
  'Orinoquía': '#B45309',
  'Amazonía': '#047857',
  'Insular': '#0E7490'
};

const HIGH_CONTRAST_COLORS = {
  'Andina': '#000000',
  'Caribe': '#0000FF',
  'Pacífica': '#800080',
  'Orinoquía': '#FF8C00',
  'Amazonía': '#008000',
  'Insular': '#008B8B'
};

const COLORBLIND_PALETTES = {
  protanopia: {
    'Andina': '#0066CC',
    'Caribe': '#4B9BFF',
    'Pacífica': '#FFB000',
    'Orinoquía': '#FF6B35',
    'Amazonía': '#785EF0',
    'Insular': '#DC267F'
  },
  deuteranopia: {
    'Andina': '#0066CC',
    'Caribe': '#4B9BFF',
    'Pacífica': '#FFB000',
    'Orinoquía': '#FE6100',
    'Amazonía': '#785EF0',
    'Insular': '#DC267F'
  },
  tritanopia: {
    'Andina': '#CC0000',
    'Caribe': '#009900',
    'Pacífica': '#FF6666',
    'Orinoquía': '#66CC00',
    'Amazonía': '#006600',
    'Insular': '#990033'
  },
  monochrome: {
    'Andina': '#1A1A1A',
    'Caribe': '#404040',
    'Pacífica': '#666666',
    'Orinoquía': '#8C8C8C',
    'Amazonía': '#B3B3B3',
    'Insular': '#D9D9D9'
  }
};

// WCAG Standards
const WCAG_AA_NORMAL = 4.5;
const WCAG_AAA_NORMAL = 7.0;
const WCAG_AA_LARGE = 3.0;
const WCAG_AAA_LARGE = 4.5;

// Utility functions
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function sRGBToLinear(channel) {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function calculateLuminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const r = sRGBToLinear(rgb.r);
  const g = sRGBToLinear(rgb.g);
  const b = sRGBToLinear(rgb.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function calculateContrast(color1, color2) {
  const lum1 = calculateLuminance(color1);
  const lum2 = calculateLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

function getWCAGLevel(ratio) {
  if (ratio >= WCAG_AAA_NORMAL) return 'AAA';
  if (ratio >= WCAG_AA_NORMAL) return 'AA';
  if (ratio >= WCAG_AA_LARGE) return 'AA Large';
  return 'FAIL';
}

function analyzeColorSet(colorSet, name, background = '#FFFFFF') {
  console.log(`\n🎨 ${name} Analysis`);
  console.log('=' .repeat(50));

  const results = [];
  let totalColors = 0;
  let aaPass = 0;
  let aaaPass = 0;

  Object.entries(colorSet).forEach(([region, color]) => {
    const ratio = calculateContrast(color, background);
    const level = getWCAGLevel(ratio);

    const result = {
      region,
      color,
      ratio: ratio.toFixed(2),
      level,
      passAA: ratio >= WCAG_AA_NORMAL,
      passAAA: ratio >= WCAG_AAA_NORMAL
    };

    results.push(result);
    totalColors++;
    if (result.passAA) aaPass++;
    if (result.passAAA) aaaPass++;

    const icon = result.passAA ? '✅' : '❌';
    const warning = ratio < WCAG_AA_NORMAL && ratio >= WCAG_AA_LARGE ? ' ⚠️ (Large text only)' : '';

    console.log(`${icon} ${region.padEnd(12)} ${color} (${result.ratio}:1) - ${level}${warning}`);
  });

  console.log(`\n📊 Summary: ${aaPass}/${totalColors} pass AA (${(aaPass/totalColors*100).toFixed(1)}%), ${aaaPass}/${totalColors} pass AAA (${(aaaPass/totalColors*100).toFixed(1)}%)`);

  return {
    name,
    results,
    aaPassRate: (aaPass / totalColors * 100).toFixed(1),
    aaaPassRate: (aaaPass / totalColors * 100).toFixed(1),
    totalColors,
    aaPass,
    aaaPass
  };
}

function calculateColorDistinctions(palette) {
  const colors = Object.values(palette);
  const pairs = [];

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      const contrast = calculateContrast(colors[i], colors[j]);
      pairs.push({
        color1: colors[i],
        color2: colors[j],
        contrast: contrast.toFixed(2)
      });
    }
  }

  return pairs.sort((a, b) => parseFloat(a.contrast) - parseFloat(b.contrast));
}

function findProblematicPairs(palette, threshold = 1.5) {
  const distinctions = calculateColorDistinctions(palette);
  return distinctions.filter(pair => parseFloat(pair.contrast) < threshold);
}

// Main analysis
function runFullAnalysis() {
  console.log('🔍 COLOMBIA PUZZLE GAME - ACCESSIBILITY ANALYSIS');
  console.log('================================================');
  console.log('WCAG 2.1 Compliance Check\n');

  const results = [];

  // Analyze all color modes
  results.push(analyzeColorSet(MODERN_REGION_COLORS, 'Modern Colors (Default)'));
  results.push(analyzeColorSet(ACCESSIBLE_REGION_COLORS, 'Accessible Colors'));
  results.push(analyzeColorSet(HIGH_CONTRAST_COLORS, 'High Contrast Mode'));

  // Analyze colorblind modes
  Object.entries(COLORBLIND_PALETTES).forEach(([mode, palette]) => {
    const modeName = mode.charAt(0).toUpperCase() + mode.slice(1);
    results.push(analyzeColorSet(palette, `${modeName} Mode`));
  });

  // Overall summary
  console.log('\n\n🎯 OVERALL ACCESSIBILITY REPORT');
  console.log('=====================================');

  let totalAA = 0;
  let totalAAA = 0;
  let totalColors = 0;

  results.forEach(result => {
    totalAA += parseInt(result.aaPass);
    totalAAA += parseInt(result.aaaPass);
    totalColors += parseInt(result.totalColors);

    const status = result.aaPassRate === '100.0' ? '✅' : result.aaPassRate >= '80.0' ? '⚠️' : '❌';
    console.log(`${status} ${result.name}: ${result.aaPassRate}% AA, ${result.aaaPassRate}% AAA`);
  });

  console.log(`\n📈 Global Stats:`);
  console.log(`   Total colors: ${totalColors}`);
  console.log(`   AA compliance: ${totalAA}/${totalColors} (${(totalAA/totalColors*100).toFixed(1)}%)`);
  console.log(`   AAA compliance: ${totalAAA}/${totalColors} (${(totalAAA/totalColors*100).toFixed(1)}%)`);

  // Color distinction analysis
  console.log('\n\n🔍 COLOR DISTINCTION ANALYSIS');
  console.log('===============================');

  Object.entries(COLORBLIND_PALETTES).forEach(([mode, palette]) => {
    const problematic = findProblematicPairs(palette);
    const modeName = mode.charAt(0).toUpperCase() + mode.slice(1);

    if (problematic.length > 0) {
      console.log(`\n⚠️  ${modeName} - Potential Issues:`);
      problematic.forEach(pair => {
        console.log(`   ${pair.color1} vs ${pair.color2}: ${pair.contrast}:1 (too similar)`);
      });
    } else {
      console.log(`\n✅ ${modeName} - All colors sufficiently distinct`);
    }
  });

  // Critical recommendations
  console.log('\n\n🚨 CRITICAL FIXES NEEDED');
  console.log('=========================');

  const criticalIssues = [];

  results.forEach(result => {
    result.results.forEach(color => {
      if (!color.passAA) {
        criticalIssues.push({
          mode: result.name,
          region: color.region,
          color: color.color,
          ratio: color.ratio,
          required: WCAG_AA_NORMAL.toFixed(1)
        });
      }
    });
  });

  if (criticalIssues.length > 0) {
    criticalIssues.forEach(issue => {
      console.log(`❌ ${issue.mode} - ${issue.region}: ${issue.color}`);
      console.log(`   Current: ${issue.ratio}:1, Required: ${issue.required}:1`);
    });
  } else {
    console.log('✅ No critical accessibility issues found!');
  }

  console.log('\n🎉 Analysis Complete!');
  console.log('Check the detailed report above for specific recommendations.');
}

// Run the analysis
if (require.main === module) {
  runFullAnalysis();
}

module.exports = {
  calculateContrast,
  calculateLuminance,
  getWCAGLevel,
  analyzeColorSet,
  runFullAnalysis
};