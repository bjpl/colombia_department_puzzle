# CI/CD Pipeline Design

**Document Version:** 1.0
**Date:** 2025-12-04
**Architect:** System Architecture Designer
**Status:** Design Phase

---

## Executive Summary

This document defines the production-grade CI/CD pipeline architecture to ensure reliable builds, comprehensive testing, and safe deployments.

**Current State:**
- Basic GitHub Actions workflows (ci.yml, test.yml)
- No environment parity (dev/CI differences)
- Test exclusions break coverage
- No deployment automation
- No rollback strategy

**Target State:**
- Unified CI/CD pipeline with clear stages
- Full environment parity (Docker-based)
- All tests enabled (914/914 passing)
- Automated deployments with approval gates
- Zero-downtime deployments with instant rollback

---

## 1. Current Pipeline Analysis

### 1.1 Existing Workflows

**ci.yml (Current):**
```yaml
jobs:
  lint-and-typecheck: ✓ (Good)
  test: ⚠️ (Only 180/914 tests)
  e2e: ⚠️ (Not running mobile tests)
  build: ✓ (Good)
```

**Problems:**
- Tests run in unreliable jsdom environment
- No mobile E2E coverage
- No visual regression testing
- No performance budgets enforced
- No security scanning
- Build artifacts not validated

### 1.2 Root Causes

**Issue 1: Environment Inconsistency**
```
Developer Machine:
├── Windows/WSL2
├── Node.js 20.x (varies)
├── npm 10.x (varies)
└── Local mocks work differently

CI Environment:
├── Ubuntu latest
├── Node.js 20.x (specific version)
├── npm (comes with Node)
└── Different browser API availability
```

**Issue 2: Test Categorization**
```
Current: All tests in one job
├── Unit tests (fast, should be separate)
├── Component tests (medium, should be separate)
├── Integration tests (slow, should be separate)
└── E2E tests (slowest, should be separate)

Result: Slow feedback, hard to debug failures
```

**Issue 3: No Deployment Pipeline**
```
Current: Manual deployment
├── Run `npm run build` locally
├── Copy to hosting manually
├── No validation
├── No rollback plan
└── No staging environment
```

---

## 2. Target Pipeline Architecture

### 2.1 Pipeline Stages

```
Stage 1: VALIDATE (Fast - 2 min)
├── Code formatting (Prettier)
├── Linting (ESLint)
├── Type checking (TypeScript)
└── Dependency audit (npm audit)

Stage 2: TEST-UNIT (Fast - 3 min)
├── Unit tests (utils, services)
├── Coverage collection
└── Fail if <70% coverage

Stage 3: TEST-COMPONENT (Medium - 5 min)
├── Component tests (Playwright CT)
├── Visual regression tests
└── Accessibility tests

Stage 4: TEST-INTEGRATION (Slow - 8 min)
├── Integration tests (Playwright CT)
├── Game flow tests
└── Auth flow tests

Stage 5: TEST-E2E (Slowest - 10 min)
├── Critical user flows (Playwright)
├── Mobile device testing
├── Cross-browser testing (Chromium, Firefox, WebKit)
└── Performance budgets

Stage 6: BUILD (Fast - 2 min)
├── Production build
├── Bundle analysis
├── Size limits enforcement
└── Asset optimization

Stage 7: SECURITY (Medium - 4 min)
├── Dependency scanning (Snyk/npm audit)
├── SAST (Static Application Security Testing)
├── License compliance
└── Secret detection

Stage 8: DEPLOY-STAGING (Fast - 1 min)
├── Deploy to staging environment
├── Smoke tests
└── Manual approval gate

Stage 9: DEPLOY-PRODUCTION (Fast - 1 min)
├── Deploy to production
├── Health checks
└── Automatic rollback on failure

Total Pipeline Time: ~35 minutes (with parallelization: ~15 minutes)
```

### 2.2 Parallel Execution Strategy

```
           ┌─────────────┐
           │   VALIDATE  │ (2 min)
           └──────┬──────┘
                  │
         ┌────────┴─────────┐
         │                  │
    ┌────▼────┐      ┌─────▼──────┐
    │ TEST-   │      │ TEST-      │
    │ UNIT    │      │ COMPONENT  │
    │ (3 min) │      │ (5 min)    │
    └────┬────┘      └─────┬──────┘
         │                 │
         └────────┬────────┘
                  │
         ┌────────▼─────────┐
         │                  │
    ┌────▼────────┐  ┌─────▼──────┐
    │ TEST-       │  │ BUILD      │
    │ INTEGRATION │  │ (2 min)    │
    │ (8 min)     │  └─────┬──────┘
    └────┬────────┘        │
         │                 │
         └────────┬────────┘
                  │
           ┌──────▼───────┐
           │  TEST-E2E    │ (10 min)
           │  (parallel:  │
           │   3 browsers)│
           └──────┬───────┘
                  │
           ┌──────▼───────┐
           │   SECURITY   │ (4 min)
           └──────┬───────┘
                  │
           ┌──────▼───────┐
           │   DEPLOY-    │ (1 min)
           │   STAGING    │
           └──────┬───────┘
                  │
           ┌──────▼───────┐
           │   Manual     │
           │   Approval   │
           └──────┬───────┘
                  │
           ┌──────▼───────┐
           │   DEPLOY-    │ (1 min)
           │  PRODUCTION  │
           └──────────────┘

Total Time: 15 minutes (parallelized)
```

---

## 3. Detailed Stage Definitions

### 3.1 Stage 1: VALIDATE

**Objective:** Fast feedback on code quality issues

```yaml
# .github/workflows/validate.yml
name: Validate

on:
  pull_request:
  push:
    branches: [main, develop]

jobs:
  validate:
    runs-on: ubuntu-latest
    timeout-minutes: 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.0' # Pinned version
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --prefer-offline

      - name: Check formatting
        run: npx prettier --check "src/**/*.{ts,tsx,js,jsx,json,css}"

      - name: Lint code
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Audit dependencies
        run: npm audit --audit-level=high

      - name: Check bundle size limits
        run: |
          cat > size-limits.json << EOF
          {
            "main.js": "150kb",
            "vendor.js": "300kb",
            "total": "450kb"
          }
          EOF
          npx size-limit
```

**Success Criteria:**
- Zero formatting errors
- Zero linting errors
- Zero type errors
- No high/critical vulnerabilities
- Bundle sizes within limits

---

### 3.2 Stage 2: TEST-UNIT

**Objective:** Fast unit tests with high coverage

```yaml
# .github/workflows/test-unit.yml
name: Unit Tests

on:
  workflow_run:
    workflows: ["Validate"]
    types: [completed]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    timeout-minutes: 10

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.0'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --prefer-offline

      - name: Run unit tests
        run: npm run test:unit -- --run --reporter=verbose
        env:
          CI: true

      - name: Check coverage thresholds
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 70" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 70% threshold"
            exit 1
          fi

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          fail_ci_if_error: true

      - name: Comment PR with coverage
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          lcov-file: ./coverage/lcov.info
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

**Success Criteria:**
- All unit tests pass (100%)
- Coverage ≥ 70%
- Execution time < 5 minutes

---

### 3.3 Stage 3: TEST-COMPONENT

**Objective:** Component tests in real browser

```yaml
# .github/workflows/test-component.yml
name: Component Tests

on:
  workflow_run:
    workflows: ["Validate"]
    types: [completed]

jobs:
  component-tests:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    timeout-minutes: 15

    container:
      image: mcr.microsoft.com/playwright:v1.40.0-jammy

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.0'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --prefer-offline

      - name: Run component tests
        run: npx playwright test --project=chromium --grep @component
        env:
          CI: true

      - name: Visual regression tests
        run: npx playwright test --project=chromium --grep @visual
        env:
          CI: true

      - name: Accessibility tests
        run: npx playwright test --project=chromium --grep @a11y
        env:
          CI: true

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report-component
          path: playwright-report/
          retention-days: 30

      - name: Upload visual diffs
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: visual-diffs
          path: test-results/
          retention-days: 7
```

**Success Criteria:**
- All component tests pass
- No visual regressions
- Zero accessibility violations (WCAG AAA)

---

### 3.4 Stage 4: TEST-INTEGRATION

**Objective:** Integration tests for complex workflows

```yaml
# .github/workflows/test-integration.yml
name: Integration Tests

on:
  workflow_run:
    workflows: ["Unit Tests", "Component Tests"]
    types: [completed]

jobs:
  integration-tests:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    timeout-minutes: 20

    container:
      image: mcr.microsoft.com/playwright:v1.40.0-jammy

    strategy:
      matrix:
        shard: [1, 2, 3, 4]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.0'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --prefer-offline

      - name: Run integration tests (shard ${{ matrix.shard }}/4)
        run: |
          npx playwright test \
            --project=chromium \
            --grep @integration \
            --shard=${{ matrix.shard }}/4
        env:
          CI: true

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: integration-results-${{ matrix.shard }}
          path: test-results/
          retention-days: 7
```

**Success Criteria:**
- All integration tests pass
- All shards complete successfully
- No flaky tests

---

### 3.5 Stage 5: TEST-E2E

**Objective:** End-to-end tests across browsers and devices

```yaml
# .github/workflows/test-e2e.yml
name: E2E Tests

on:
  workflow_run:
    workflows: ["Integration Tests"]
    types: [completed]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    timeout-minutes: 30

    strategy:
      fail-fast: false
      matrix:
        browser: [chromium, firefox, webkit]
        device: [desktop, mobile]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.0'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --prefer-offline

      - name: Install Playwright browsers
        run: npx playwright install --with-deps ${{ matrix.browser }}

      - name: Build application
        run: npm run build

      - name: Start preview server
        run: npm run preview &
        env:
          PORT: 4173

      - name: Wait for server
        run: npx wait-on http://localhost:4173 -t 30000

      - name: Run E2E tests
        run: |
          if [ "${{ matrix.device }}" = "mobile" ]; then
            npx playwright test --project="${{ matrix.browser }}-mobile" tests/e2e
          else
            npx playwright test --project=${{ matrix.browser }} tests/e2e
          fi
        env:
          CI: true
          BASE_URL: http://localhost:4173

      - name: Performance budgets
        if: matrix.browser == 'chromium' && matrix.device == 'desktop'
        run: |
          npx lighthouse http://localhost:4173 \
            --output=json \
            --output-path=./lighthouse-report.json \
            --budget-path=./lighthouse-budget.json \
            --chrome-flags="--headless --no-sandbox"

      - name: Upload Lighthouse report
        uses: actions/upload-artifact@v4
        if: matrix.browser == 'chromium' && matrix.device == 'desktop'
        with:
          name: lighthouse-report
          path: lighthouse-report.json
          retention-days: 30

      - name: Upload E2E report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: e2e-report-${{ matrix.browser }}-${{ matrix.device }}
          path: playwright-report/
          retention-days: 30
```

**Success Criteria:**
- All E2E tests pass across all browsers
- Mobile tests pass on emulated devices
- Performance budgets met (Lighthouse score ≥ 90)

---

### 3.6 Stage 6: BUILD

**Objective:** Production-ready build artifacts

```yaml
# .github/workflows/build.yml
name: Build

on:
  workflow_run:
    workflows: ["Unit Tests"]
    types: [completed]

jobs:
  build:
    runs-on: ubuntu-latest
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
    timeout-minutes: 10

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.0'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --prefer-offline

      - name: Build production
        run: npm run build
        env:
          NODE_ENV: production

      - name: Analyze bundle
        run: |
          npx vite-bundle-visualizer --template treemap
          npx vite-bundle-visualizer --template sunburst

      - name: Check bundle sizes
        run: |
          MAIN_SIZE=$(du -k dist/assets/index-*.js | cut -f1)
          VENDOR_SIZE=$(du -k dist/assets/vendor-*.js | cut -f1)
          TOTAL_SIZE=$(du -sk dist | cut -f1)

          echo "Main bundle: ${MAIN_SIZE}KB"
          echo "Vendor bundle: ${VENDOR_SIZE}KB"
          echo "Total size: ${TOTAL_SIZE}KB"

          if [ $MAIN_SIZE -gt 150 ]; then
            echo "Main bundle exceeds 150KB limit"
            exit 1
          fi

          if [ $VENDOR_SIZE -gt 300 ]; then
            echo "Vendor bundle exceeds 300KB limit"
            exit 1
          fi

          if [ $TOTAL_SIZE -gt 450 ]; then
            echo "Total size exceeds 450KB limit"
            exit 1
          fi

      - name: Validate build artifacts
        run: |
          # Check for required files
          test -f dist/index.html || exit 1
          test -f dist/manifest.webmanifest || exit 1
          test -f dist/sw.js || exit 1

          # Check for source maps
          find dist/assets -name "*.js.map" | wc -l | grep -q "^0$" && exit 1

          # Check for correct MIME types
          file dist/assets/*.js | grep -q "JavaScript" || exit 1

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7

      - name: Upload bundle analysis
        uses: actions/upload-artifact@v4
        with:
          name: bundle-analysis
          path: |
            stats.html
            treemap.html
          retention-days: 30
```

**Success Criteria:**
- Build succeeds
- Bundle sizes within limits
- All required files present
- Source maps generated

---

### 3.7 Stage 7: SECURITY

**Objective:** Security scanning and compliance

```yaml
# .github/workflows/security.yml
name: Security

on:
  workflow_run:
    workflows: ["Build"]
    types: [completed]
  schedule:
    - cron: '0 0 * * 0' # Weekly on Sundays

jobs:
  security-scan:
    runs-on: ubuntu-latest
    timeout-minutes: 15

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.0'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci --prefer-offline

      - name: Dependency audit
        run: |
          npm audit --audit-level=moderate --json > audit-report.json
          cat audit-report.json | jq '.metadata'

      - name: Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: SAST (Static Analysis)
        run: |
          npx eslint src --ext .ts,.tsx \
            --plugin security \
            --rule 'security/detect-object-injection: error'

      - name: Secret detection
        run: |
          npx secretlint "**/*"

      - name: License compliance
        run: |
          npx license-checker --onlyAllow 'MIT;Apache-2.0;BSD-2-Clause;BSD-3-Clause;ISC' \
            --json > license-report.json

      - name: Upload security reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: security-reports
          path: |
            audit-report.json
            license-report.json
          retention-days: 90

      - name: Create security issue
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Security scan failed',
              body: 'Security vulnerabilities detected. Check workflow run for details.',
              labels: ['security', 'high-priority']
            })
```

**Success Criteria:**
- No high/critical vulnerabilities
- All licenses compliant
- No secrets in code
- SAST passes

---

### 3.8 Stage 8: DEPLOY-STAGING

**Objective:** Deploy to staging for validation

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy Staging

on:
  workflow_run:
    workflows: ["E2E Tests", "Security"]
    types: [completed]
    branches: [develop]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    if: |
      github.event.workflow_run.conclusion == 'success' &&
      github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.colombia-puzzle.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./dist
          alias-domains: staging.colombia-puzzle.com

      - name: Run smoke tests
        run: |
          npx playwright test tests/smoke \
            --config=playwright.config.staging.ts
        env:
          BASE_URL: https://staging.colombia-puzzle.com

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Staging deployment completed'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

**Success Criteria:**
- Deployment succeeds
- Smoke tests pass
- Staging environment accessible

---

### 3.9 Stage 9: DEPLOY-PRODUCTION

**Objective:** Zero-downtime production deployment

```yaml
# .github/workflows/deploy-production.yml
name: Deploy Production

on:
  workflow_run:
    workflows: ["Deploy Staging"]
    types: [completed]
    branches: [main]

jobs:
  deploy-production:
    runs-on: ubuntu-latest
    if: |
      github.event.workflow_run.conclusion == 'success' &&
      github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://colombia-puzzle.com

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/

      - name: Backup current production
        run: |
          # Store current deployment ID for rollback
          CURRENT_DEPLOYMENT=$(vercel ls --token ${{ secrets.VERCEL_TOKEN }} | head -1)
          echo "ROLLBACK_DEPLOYMENT=$CURRENT_DEPLOYMENT" >> $GITHUB_ENV

      - name: Deploy to Vercel (Production)
        id: deploy
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./dist

      - name: Health checks
        run: |
          # Wait for deployment
          sleep 30

          # Check main page
          curl -f https://colombia-puzzle.com || exit 1

          # Check API health
          curl -f https://colombia-puzzle.com/api/health || exit 1

          # Check PWA manifest
          curl -f https://colombia-puzzle.com/manifest.webmanifest || exit 1

      - name: Synthetic monitoring
        run: |
          npx playwright test tests/smoke \
            --config=playwright.config.production.ts
        env:
          BASE_URL: https://colombia-puzzle.com

      - name: Rollback on failure
        if: failure()
        run: |
          vercel rollback ${{ env.ROLLBACK_DEPLOYMENT }} \
            --token ${{ secrets.VERCEL_TOKEN }}

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: |
            Production deployment ${{ job.status }}
            URL: https://colombia-puzzle.com
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

      - name: Create release
        if: success()
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ github.run_number }}
          release_name: Release v${{ github.run_number }}
          body: |
            Automated production deployment
            Deployment URL: ${{ steps.deploy.outputs.preview-url }}
          draft: false
          prerelease: false
```

**Success Criteria:**
- Deployment succeeds
- Health checks pass
- Synthetic monitoring passes
- No rollback triggered

---

## 4. Environment Parity Implementation

### 4.1 Docker-based Development

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - VITE_API_URL=http://localhost:3000

  test:
    build:
      context: .
      dockerfile: Dockerfile.test
    command: npm test
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CI=true
      - NODE_ENV=test
```

**Dockerfile.dev:**
```dockerfile
FROM node:20.11.0-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

**Dockerfile.test:**
```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "test", "--", "--run"]
```

### 4.2 Environment Configuration

**config/environments.ts:**
```typescript
export const environments = {
  development: {
    apiUrl: 'http://localhost:3000',
    enableDebug: true,
    enableMocks: true,
    logLevel: 'debug',
  },
  staging: {
    apiUrl: 'https://api-staging.colombia-puzzle.com',
    enableDebug: true,
    enableMocks: false,
    logLevel: 'info',
  },
  production: {
    apiUrl: 'https://api.colombia-puzzle.com',
    enableDebug: false,
    enableMocks: false,
    logLevel: 'error',
  },
  test: {
    apiUrl: 'http://localhost:3000',
    enableDebug: false,
    enableMocks: true,
    logLevel: 'silent',
  },
} as const;

export function getEnvironment() {
  const env = import.meta.env.MODE || 'development';
  return environments[env as keyof typeof environments];
}
```

---

## 5. Deployment Strategy

### 5.1 Blue-Green Deployment

```
Production Traffic:
┌─────────────┐
│   Router    │
└──────┬──────┘
       │
       ├──────────┐
       │          │
   ┌───▼───┐  ┌──▼────┐
   │ Blue  │  │ Green │
   │ (old) │  │ (new) │
   └───────┘  └───────┘
       │          │
       │          ├─ Deploy new version
       │          ├─ Run smoke tests
       │          ├─ Gradual traffic shift (10% -> 50% -> 100%)
       │          └─ Monitor metrics
       │
       └─ Keep old version for instant rollback
```

**Implementation:**
```yaml
# Gradual traffic shift
- name: Deploy new version (green)
  run: vercel deploy --prod

- name: Shift 10% traffic to green
  run: vercel alias set green-deploy.vercel.app colombia-puzzle.com --weight 10

- name: Monitor for 5 minutes
  run: |
    sleep 300
    ERROR_RATE=$(check_error_rate)
    if [ $ERROR_RATE -gt 1 ]; then
      echo "Error rate too high, rolling back"
      vercel alias set blue-deploy.vercel.app colombia-puzzle.com --weight 100
      exit 1
    fi

- name: Shift 50% traffic to green
  run: vercel alias set green-deploy.vercel.app colombia-puzzle.com --weight 50

- name: Monitor for 10 minutes
  run: sleep 600

- name: Shift 100% traffic to green
  run: vercel alias set green-deploy.vercel.app colombia-puzzle.com --weight 100

- name: Mark blue for decommission
  run: echo "blue-deploy.vercel.app" > rollback-target.txt
```

### 5.2 Canary Deployment

```
Users:
├── 95% → Stable version (v1.0)
└── 5% → Canary version (v1.1)

Monitoring:
├── Error rates
├── Performance metrics
├── User behavior
└── A/B test results

Decision:
├── If canary healthy → Promote to 100%
└── If canary unhealthy → Rollback canary
```

---

## 6. Monitoring & Observability

### 6.1 Deployment Metrics

```typescript
// src/lib/analytics.ts
export function trackDeployment(version: string) {
  analytics.track('deployment', {
    version,
    timestamp: Date.now(),
    environment: import.meta.env.MODE,
  });
}

// src/lib/monitoring.ts
export function monitorHealth() {
  const metrics = {
    uptime: performance.now(),
    memory: performance.memory?.usedJSHeapSize,
    errors: errorCount,
    version: import.meta.env.VITE_APP_VERSION,
  };

  sendToMonitoring(metrics);
}
```

### 6.2 Alerting Rules

```yaml
# monitoring/alerts.yml
alerts:
  - name: high_error_rate
    condition: error_rate > 1%
    severity: critical
    action: rollback

  - name: slow_response
    condition: p95_latency > 3s
    severity: warning
    action: notify

  - name: deployment_failed
    condition: health_check_failed
    severity: critical
    action: rollback

  - name: low_coverage
    condition: coverage < 70%
    severity: warning
    action: block_merge
```

---

## 7. Rollback Strategy

### 7.1 Instant Rollback

```bash
# Automatic rollback on health check failure
if ! curl -f https://colombia-puzzle.com/api/health; then
  echo "Health check failed, rolling back"
  vercel rollback $(cat rollback-target.txt)
  exit 1
fi
```

### 7.2 Manual Rollback

```bash
# Emergency rollback command
npm run rollback:production
# Or:
vercel rollback --prod
```

### 7.3 Database Migrations

```typescript
// migrations/rollback.ts
export async function rollback(version: string) {
  const migration = await getMigration(version);

  try {
    await migration.down();
    console.log(`Rolled back to ${version}`);
  } catch (error) {
    console.error('Rollback failed:', error);
    throw error;
  }
}
```

---

## 8. Timeline

**Week 1: Foundation**
- Set up Docker environment
- Create environment configs
- Implement build validation

**Week 2: Testing Pipeline**
- Set up Playwright in CI
- Create test categorization
- Implement parallel execution

**Week 3: Deployment Pipeline**
- Set up staging environment
- Implement blue-green deployment
- Add health checks

**Week 4: Monitoring & Rollback**
- Add deployment tracking
- Set up alerting
- Test rollback procedures

**Total: 4 weeks**

---

## 9. Success Metrics

✅ **Pipeline Reliability:**
- 95%+ success rate
- <15 min total pipeline time
- <1% flaky tests

✅ **Deployment Frequency:**
- Multiple deploys per day possible
- <5 min deployment time
- Zero-downtime deployments

✅ **Quality Gates:**
- 100% of tests passing
- 70%+ code coverage
- Zero high-severity security issues

✅ **Rollback Capability:**
- <1 min rollback time
- Tested monthly
- Documented procedures

---

**End of Document**
