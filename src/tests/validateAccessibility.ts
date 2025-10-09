// WCAG AAA Accessibility Validation Script
import { COLORBLIND_PALETTES, getContrastRatio } from '../design-system/themes/regions';

const WHITE = '#FFFFFF';
const REQUIRED_RATIO = 7.0; // WCAG AAA standard

interface ValidationResult {
  mode: string;
  region: string;
  color: string;
  ratio: number;
  passes: boolean;
}

function validateAllColors(): { results: ValidationResult[]; summary: string } {
  const results: ValidationResult[] = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  // Test each color mode
  Object.entries(COLORBLIND_PALETTES).forEach(([mode, palette]) => {
    console.log(`\n🔍 Testing ${mode} mode:`);

    Object.entries(palette).forEach(([region, color]) => {
      const ratio = getContrastRatio(color, WHITE);
      const passes = ratio >= REQUIRED_RATIO;

      totalTests++;
      if (passes) {
        passedTests++;
        console.log(`  ✅ ${region}: ${color} - Ratio: ${ratio.toFixed(2)} (PASS)`);
      } else {
        failedTests++;
        console.log(`  ❌ ${region}: ${color} - Ratio: ${ratio.toFixed(2)} (FAIL)`);
      }

      results.push({
        mode,
        region,
        color,
        ratio,
        passes
      });
    });
  });

  const passRate = ((passedTests / totalTests) * 100).toFixed(1);

  const summary = `
📊 WCAG AAA Validation Summary
================================
Total Tests: ${totalTests}
Passed: ${passedTests} (${passRate}%)
Failed: ${failedTests}
${failedTests === 0 ? '🎉 All colors meet WCAG AAA standards!' : '⚠️ Some colors need adjustment'}
`;

  return { results, summary };
}

// Run validation when script is executed
console.log('🚀 Running WCAG AAA Accessibility Validation...');
const { results, summary } = validateAllColors();
console.log(summary);

// Group failed tests for easier debugging
const failedTests = results.filter(r => !r.passes);
if (failedTests.length > 0) {
  console.log('\n⚠️ Failed Tests:');
  failedTests.forEach(test => {
    console.log(`  ${test.mode} - ${test.region}: ${test.color} (Ratio: ${test.ratio.toFixed(2)})`);
  });
}

export { validateAllColors };