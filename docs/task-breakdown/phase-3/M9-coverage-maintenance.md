# M9: Coverage Maintenance & Monitoring - Granular Task Breakdown

**Milestone:** Maintain 97%+ coverage with automated monitoring
**Total Effort:** 14 hours
**Total Tasks:** 35 tasks
**Risk Level:** Low
**Dependencies:** Phase 2 complete

---

## Task M9.1: Configure Coverage Thresholds

**Estimated Effort:** 1h
**Risk Level:** Low
**Assignable To:** cicd-engineer

**Input State:**
- Coverage reporting exists
- No enforced thresholds
- No coverage gates

**Action Steps:**
1. Update `vitest.config.ts`:
   ```typescript
   export default defineConfig({
     test: {
       coverage: {
         provider: 'v8',
         reporter: ['text', 'html', 'lcov', 'json-summary'],
         all: true,
         include: ['src/**/*.{ts,tsx}'],
         exclude: [
           'src/**/*.d.ts',
           'src/**/*.stories.tsx',
           'src/**/*.test.{ts,tsx}',
           'src/tests/**',
           'src/vite-env.d.ts'
         ],
         thresholds: {
           lines: 97,
           functions: 95,
           branches: 90,
           statements: 97,
           autoUpdate: false // Prevent accidental threshold lowering
         }
       }
     }
   });
   ```
2. Create coverage script:
   ```json
   {
     "scripts": {
       "test:coverage": "vitest run --coverage",
       "test:coverage:watch": "vitest watch --coverage",
       "test:coverage:ui": "vitest --coverage --ui",
       "coverage:check": "vitest run --coverage && node scripts/check-coverage.js"
     }
   }
   ```
3. Add coverage badge to README
4. Test enforcement

**Output State:**
- Coverage thresholds enforced
- Automated checks configured
- Badge displayed

**Validation Command:**
```bash
npm run coverage:check
# Should fail if below thresholds
```

**Dependencies:**
- M8.45 (Phase 2 complete)

**Rollback Procedure:**
```bash
git checkout vitest.config.ts package.json
```

**Success Criteria:**
- [ ] Thresholds: 97/95/90/97
- [ ] Tests fail below threshold
- [ ] Badge added
- [ ] Scripts working

---

## Task M9.2: Create Coverage Report Generator

**Estimated Effort:** 1.5h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- Basic coverage reports exist
- No custom analysis
- No trend tracking

**Action Steps:**
1. Create `scripts/check-coverage.js`:
   ```javascript
   #!/usr/bin/env node
   import fs from 'fs/promises';
   import path from 'path';

   async function checkCoverage() {
     const summaryPath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');

     try {
       const data = await fs.readFile(summaryPath, 'utf-8');
       const summary = JSON.parse(data);
       const total = summary.total;

       const results = {
         lines: total.lines.pct,
         functions: total.functions.pct,
         branches: total.branches.pct,
         statements: total.statements.pct
       };

       const thresholds = {
         lines: 97,
         functions: 95,
         branches: 90,
         statements: 97
       };

       let failed = false;
       const report = [];

       for (const [key, value] of Object.entries(results)) {
         const threshold = thresholds[key];
         const pass = value >= threshold;

         if (!pass) failed = true;

         report.push({
           metric: key,
           coverage: value.toFixed(2),
           threshold,
           status: pass ? '✓' : '✗'
         });
       }

       console.table(report);

       if (failed) {
         console.error('\n❌ Coverage check failed!');
         process.exit(1);
       }

       console.log('\n✅ Coverage check passed!');

       // Save historical data
       await saveHistoricalData(results);

     } catch (error) {
       console.error('Error reading coverage summary:', error);
       process.exit(1);
     }
   }

   async function saveHistoricalData(results) {
     const historyPath = path.join(process.cwd(), 'coverage', 'history.json');
     let history = [];

     try {
       const existing = await fs.readFile(historyPath, 'utf-8');
       history = JSON.parse(existing);
     } catch {
       // File doesn't exist yet
     }

     history.push({
       timestamp: new Date().toISOString(),
       ...results
     });

     // Keep last 100 entries
     if (history.length > 100) {
       history = history.slice(-100);
     }

     await fs.writeFile(historyPath, JSON.stringify(history, null, 2));
   }

   checkCoverage();
   ```
2. Create coverage trend analyzer
3. Generate visual reports
4. Add to CI

**Output State:**
- Coverage checker script
- Historical tracking
- Trend analysis
- CI integration

**Validation Command:**
```bash
npm run coverage:check
node scripts/check-coverage.js
```

**Dependencies:**
- M9.1 (thresholds configured)

**Rollback Procedure:**
```bash
rm scripts/check-coverage.js
```

**Success Criteria:**
- [ ] Script runs successfully
- [ ] Historical data saved
- [ ] Trends calculated
- [ ] CI integration works

---

## Task M9.3: Add Uncovered Code Detection

**Estimated Effort:** 1.5h
**Risk Level:** Low
**Assignable To:** coder

**Input State:**
- Coverage reports show percentages
- No line-by-line analysis
- Manual inspection required

**Action Steps:**
1. Create `scripts/find-uncovered.js`:
   ```javascript
   #!/usr/bin/env node
   import fs from 'fs/promises';
   import path from 'path';

   async function findUncovered() {
     const coveragePath = path.join(process.cwd(), 'coverage', 'coverage-final.json');

     const data = await fs.readFile(coveragePath, 'utf-8');
     const coverage = JSON.parse(data);

     const uncovered = [];

     for (const [file, fileCoverage] of Object.entries(coverage)) {
       const relativePath = file.replace(process.cwd(), '.');

       // Find uncovered lines
       const uncoveredLines = [];
       for (const [line, count] of Object.entries(fileCoverage.s)) {
         if (count === 0) {
           uncoveredLines.push(fileCoverage.statementMap[line].start.line);
         }
       }

       if (uncoveredLines.length > 0) {
         uncovered.push({
           file: relativePath,
           lines: uncoveredLines.sort((a, b) => a - b),
           totalLines: Object.keys(fileCoverage.s).length,
           coveredLines: Object.values(fileCoverage.s).filter(c => c > 0).length,
           percentage: ((Object.values(fileCoverage.s).filter(c => c > 0).length /
                        Object.keys(fileCoverage.s).length) * 100).toFixed(2)
         });
       }
     }

     // Sort by most uncovered
     uncovered.sort((a, b) => a.lines.length - b.lines.length);

     console.log('\n📊 Files with Uncovered Lines:\n');

     uncovered.forEach(item => {
       console.log(`\n${item.file}`);
       console.log(`  Coverage: ${item.percentage}%`);
       console.log(`  Uncovered lines: ${item.lines.join(', ')}`);
     });

     if (uncovered.length === 0) {
       console.log('✅ All lines are covered!');
     }

     // Generate tasks for uncovered code
     await generateCoverageTasks(uncovered);
   }

   async function generateCoverageTasks(uncovered) {
     const tasks = uncovered.map(item => ({
       file: item.file,
       lines: item.lines,
       priority: item.lines.length > 10 ? 'high' : 'medium',
       estimatedEffort: `${Math.ceil(item.lines.length / 10) * 0.5}h`
     }));

     await fs.writeFile(
       'docs/coverage-tasks.json',
       JSON.stringify(tasks, null, 2)
     );

     console.log(`\n📝 Generated ${tasks.length} coverage tasks in docs/coverage-tasks.json`);
   }

   findUncovered();
   ```
2. Add to pre-commit hook
3. Create IDE integration
4. Generate actionable tasks

**Output State:**
- Uncovered line detection
- Automated task generation
- Pre-commit integration

**Validation Command:**
```bash
npm run test:coverage
node scripts/find-uncovered.js
```

**Dependencies:**
- M9.2 (coverage reporting)

**Rollback Procedure:**
```bash
rm scripts/find-uncovered.js
```

**Success Criteria:**
- [ ] Uncovered lines identified
- [ ] Tasks auto-generated
- [ ] Pre-commit hook works
- [ ] IDE shows uncovered code

---

## Tasks M9.4 - M9.35 (Condensed)

**M9.4: Add Coverage Badges (0.5h)** - Shields.io integration
**M9.5: Create Coverage Dashboard (2h)** - HTML dashboard with charts
**M9.6: Set Up Coverage Webhooks (1h)** - Slack/Discord notifications
**M9.7: Add Coverage to PR Comments (1.5h)** - GitHub Actions comment
**M9.8: Create Coverage Diff Tool (1.5h)** - Before/after comparison
**M9.9: Add Coverage Visualization (2h)** - Sunburst chart, tree map
**M9.10: Configure Branch Coverage (1h)** - Branch-specific thresholds
**M9.11: Add Function Coverage Tracking (0.5h)** - Function-level detail
**M9.12: Implement Mutation Testing (3h)** - Stryker.js integration
**M9.13: Add Flaky Test Detection (1.5h)** - Test reliability tracking
**M9.14: Create Test Impact Analysis (2h)** - Which tests cover what
**M9.15: Add Performance Benchmarks (1.5h)** - Test execution time
**M9.16: Configure Parallel Test Execution (1h)** - Speed up CI
**M9.17: Add Test Retries (0.5h)** - Flaky test mitigation
**M9.18: Create Test Grouping (1h)** - Unit/integration/e2e
**M9.19: Add Test Tagging (0.5h)** - @slow, @critical tags
**M9.20: Implement Test Filtering (1h)** - Run specific test groups
**M9.21: Add Test Watch Mode (0.5h)** - Development workflow
**M9.22: Create Test Debugging Guide (1h)** - Documentation
**M9.23: Add Test Data Factories (1.5h)** - Fixture generation
**M9.24: Implement Snapshot Testing (1h)** - Component snapshots
**M9.25: Add Visual Regression Testing (2h)** - Percy/Chromatic
**M9.26: Create E2E Test Suite (3h)** - Playwright critical paths
**M9.27: Add Accessibility Testing (1.5h)** - axe-core integration
**M9.28: Implement Load Testing (2h)** - k6 or Artillery
**M9.29: Add Security Testing (2h)** - OWASP checks
**M9.30: Create Test Maintenance Guide (1.5h)** - Best practices
**M9.31: Add Test Metrics Dashboard (2h)** - Historical trends
**M9.32: Implement Code Quality Gates (1h)** - SonarQube/CodeClimate
**M9.33: Add Test Coverage for New Code (1h)** - Git diff coverage
**M9.34: Create Coverage Roadmap (1h)** - Path to 99%
**M9.35: M9 Milestone Integration Test (0.5h)** - Full validation

---

## M9 Summary

**Total Tasks:** 35
**Total Effort:** 14 hours
**Critical Path:** M9.1 → M9.2 → M9.3 → M9.35 (4.5h)

**Parallelizable Groups:**
- Group 1: M9.1 (sequential, 1h)
- Group 2 (after M9.1): M9.2, M9.3 (parallel, 1.5h)
- Group 3 (after Group 2): M9.4-M9.11 (parallel, 11.5h)
- Group 4 (after Group 3): M9.12-M9.24 (parallel, 20h)
- Group 5 (after Group 4): M9.25-M9.34 (parallel, 18h)
- Group 6: M9.35 (final, 0.5h)

**Success Metrics:**
- Coverage: 97%+ maintained
- Uncovered lines: <200
- Test execution: <3 minutes
- Mutation score: >80%
- Visual regression: 100%
- Zero flaky tests
