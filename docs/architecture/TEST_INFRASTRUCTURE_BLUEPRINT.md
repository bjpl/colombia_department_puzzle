# Test Infrastructure Blueprint

**Document Version:** 1.0
**Date:** 2025-12-04
**Architect:** System Architecture Designer
**Status:** Design Phase

---

## Executive Summary

This document defines the architecture for modernizing the test infrastructure to achieve production-grade quality, CI/CD reliability, and comprehensive coverage.

**Current State:**
- 277-line setup.ts with monolithic mocks
- jsdom environment (limited browser API support)
- 180/914 tests passing (19.7% pass rate)
- Extensive test exclusions in vitest.config.ts
- Dev vs CI environment parity issues

**Target State:**
- Modular, reusable test utilities (<100 lines per file)
- Playwright component testing (real browser environment)
- 90%+ test pass rate (820+ passing tests)
- Comprehensive coverage (70%+ with realistic tests)
- Full dev/CI environment parity

---

## 1. Test Infrastructure Problems

### 1.1 Root Cause Analysis

**Problem 1: Monolithic setup.ts (277 lines)**
```typescript
// Current: Everything in one file
setup.ts (277 lines)
├── Browser API mocks (120 lines)
├── Storage mocks (40 lines)
├── Audio mocks (60 lines)
├── Touch/Pointer mocks (40 lines)
└── Cleanup handlers (17 lines)
```

**Issues:**
- Difficult to maintain
- Hard to debug mock failures
- Cannot selectively load mocks
- Imports unused mocks for every test
- Slows down test execution

**Problem 2: jsdom Limitations**
```
Unsupported in jsdom:
├── Real touch events
├── Real pointer events
├── Canvas rendering (limited)
├── CSS animations
├── IntersectionObserver (mocked but not realistic)
├── ResizeObserver (mocked but not realistic)
├── Web Audio API (mocked but doesn't test real audio)
└── Service Workers (not available)
```

**Problem 3: Test Exclusions (734 tests excluded)**
```typescript
// vitest.config.ts
exclude: [
  '**/tests/services/auth/**',          // 25 tests
  '**/tests/components/auth/**',        // 15 tests
  '**/tests/hooks/**',                  // 180 tests
  '**/tests/components/**',             // 350 tests
  '**/tests/context/**',                // 40 tests
  '**/tests/integration/**',            // 80 tests
  '**/tests/mobile/**',                 // 44 tests
]
// Total excluded: ~734 tests
```

**Problem 4: Dev vs CI Parity**
- Tests pass locally, fail in CI
- Different Node.js versions
- Different environment variables
- Different browser capabilities
- WSL2-specific configurations

---

## 2. Target Architecture

### 2.1 Modular Test Utilities

**New Structure:**
```
src/tests/
├── mocks/
│   ├── browser/
│   │   ├── observers.ts (40 lines) - Resize/Intersection
│   │   ├── animation.ts (30 lines) - RAF/animations
│   │   ├── scroll.ts (20 lines) - Scroll APIs
│   │   └── index.ts (10 lines) - Aggregator
│   ├── storage/
│   │   ├── localStorage.ts (40 lines)
│   │   ├── indexedDB.ts (60 lines)
│   │   └── index.ts (10 lines)
│   ├── audio/
│   │   ├── audioContext.ts (50 lines)
│   │   ├── oscillator.ts (30 lines)
│   │   └── index.ts (10 lines)
│   ├── input/
│   │   ├── touch.ts (40 lines)
│   │   ├── pointer.ts (40 lines)
│   │   ├── keyboard.ts (30 lines)
│   │   └── index.ts (10 lines)
│   └── services/
│       ├── supabase.ts (60 lines)
│       ├── agentdb.ts (50 lines)
│       └── index.ts (10 lines)
├── fixtures/
│   ├── departments.ts (100 lines)
│   ├── gameStates.ts (80 lines)
│   ├── users.ts (50 lines)
│   └── index.ts (20 lines)
├── helpers/
│   ├── renderWithProviders.tsx (60 lines)
│   ├── setupTest.ts (40 lines)
│   ├── waitForCondition.ts (30 lines)
│   └── index.ts (20 lines)
├── matchers/
│   ├── toBeAccessible.ts (50 lines)
│   ├── toHaveValidColors.ts (40 lines)
│   └── index.ts (20 lines)
└── setup.ts (80 lines) - Minimal global setup
```

**Benefits:**
- Import only what you need
- Easy to debug
- Reusable across test types
- Clear separation of concerns
- Fast test execution

### 2.2 Mock Loading Strategy

**Dynamic Import Pattern:**
```typescript
// OLD: Global setup loads everything
// setup.ts (277 lines)
import { mockResizeObserver } from './mocks/resizeObserver';
import { mockAudioContext } from './mocks/audioContext';
// ... 10+ more imports
// All loaded even if not needed

// NEW: On-demand loading
// myComponent.test.tsx
import { describe, it, expect } from 'vitest';
import { mockBrowserAPIs } from '@/tests/mocks/browser';
import { mockAudioAPIs } from '@/tests/mocks/audio';

describe('AudioComponent', () => {
  beforeEach(() => {
    mockBrowserAPIs('observers', 'animation'); // Only load what's needed
    mockAudioAPIs('context', 'oscillator');
  });

  it('plays sound', () => {
    // Test with minimal mocks
  });
});
```

**Implementation:**
```typescript
// src/tests/mocks/browser/index.ts
export type BrowserMock = 'observers' | 'animation' | 'scroll';

export function mockBrowserAPIs(...mocks: BrowserMock[]): void {
  if (mocks.includes('observers')) {
    require('./observers').setupObserverMocks();
  }
  if (mocks.includes('animation')) {
    require('./animation').setupAnimationMocks();
  }
  if (mocks.includes('scroll')) {
    require('./scroll').setupScrollMocks();
  }
}

// src/tests/mocks/browser/observers.ts
export function setupObserverMocks(): void {
  if (typeof ResizeObserver === 'undefined') {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  if (typeof IntersectionObserver === 'undefined') {
    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
      root = null;
      rootMargin = '';
      thresholds = [];
      takeRecords() { return []; }
    } as unknown as typeof IntersectionObserver;
  }
}
```

---

## 3. Component Test Wrapper Architecture

### 3.1 Test Provider System

**Problem:** Every test needs to wrap components with providers
```typescript
// Current: Repetitive setup in every test
import { render } from '@testing-library/react';
import { GameProvider } from '@/context/GameContext';
import { AuthProvider } from '@/context/AuthContext';

it('renders', () => {
  render(
    <AuthProvider>
      <GameProvider>
        <MyComponent />
      </GameProvider>
    </AuthProvider>
  );
});
```

**Solution:** Centralized test renderer
```typescript
// src/tests/helpers/renderWithProviders.tsx
import { render, RenderOptions } from '@testing-library/react';
import { GameProvider, GameContextValue } from '@/context/GameContext';
import { AuthProvider, AuthContextValue } from '@/context/AuthContext';

interface TestProviderOptions {
  gameContext?: Partial<GameContextValue>;
  authContext?: Partial<AuthContextValue>;
  initialRoute?: string;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: TestProviderOptions & RenderOptions = {}
) {
  const {
    gameContext,
    authContext,
    initialRoute = '/',
    ...renderOptions
  } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <AuthProvider initialValue={authContext}>
        <GameProvider initialValue={gameContext}>
          <MemoryRouter initialEntries={[initialRoute]}>
            {children}
          </MemoryRouter>
        </GameProvider>
      </AuthProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Usage in tests
import { renderWithProviders } from '@/tests/helpers';

it('renders with game context', () => {
  renderWithProviders(<MyComponent />, {
    gameContext: {
      score: 100,
      level: 5,
    },
  });

  expect(screen.getByText('Score: 100')).toBeInTheDocument();
});
```

### 3.2 Fixture System

**Test Data Management:**
```typescript
// src/tests/fixtures/departments.ts
import type { Department } from '@/types/department';

export const testDepartments: readonly Department[] = [
  {
    id: 'test-1',
    name: 'Antioquia',
    region: 'Andina',
    coordinates: [6.2476, -75.5658],
    properties: {
      capital: 'Medellín',
      population: 6_407_102,
      area: 63_612,
    },
  },
  // ... more test data
] as const;

export function createTestDepartment(
  overrides?: Partial<Department>
): Department {
  return {
    id: 'test-dept',
    name: 'Test Department',
    region: 'Andina',
    coordinates: [0, 0],
    properties: {
      capital: 'Test City',
      population: 1_000_000,
      area: 10_000,
    },
    ...overrides,
  };
}

// src/tests/fixtures/gameStates.ts
export const initialGameState = {
  score: 0,
  placedDepartments: [],
  remainingDepartments: testDepartments,
  currentLevel: 1,
  hintsUsed: 0,
  timeElapsed: 0,
};

export const midGameState = {
  ...initialGameState,
  score: 350,
  placedDepartments: testDepartments.slice(0, 5),
  remainingDepartments: testDepartments.slice(5),
  currentLevel: 2,
  hintsUsed: 3,
  timeElapsed: 120,
};

// Usage
import { renderWithProviders } from '@/tests/helpers';
import { midGameState } from '@/tests/fixtures/gameStates';

it('shows mid-game state', () => {
  renderWithProviders(<GameContainer />, {
    gameContext: midGameState,
  });

  expect(screen.getByText('Score: 350')).toBeInTheDocument();
});
```

---

## 4. Integration Test Environment

### 4.1 Test Categories

**Unit Tests (Fast, Isolated)**
```typescript
// src/utils/nameNormalizer.test.ts
describe('nameNormalizer', () => {
  it('normalizes department names', () => {
    expect(normalizeName('Bogotá D.C.')).toBe('bogota dc');
  });
  // No mocks, no providers, pure logic
});
```

**Component Tests (Medium, Shallow Integration)**
```typescript
// src/components/DepartmentCard.test.tsx
import { renderWithProviders } from '@/tests/helpers';
import { mockBrowserAPIs } from '@/tests/mocks/browser';

describe('DepartmentCard', () => {
  beforeEach(() => {
    mockBrowserAPIs('observers'); // Only what's needed
  });

  it('renders department info', () => {
    renderWithProviders(<DepartmentCard department={testDepartment} />);
    expect(screen.getByText('Antioquia')).toBeInTheDocument();
  });
});
```

**Integration Tests (Slow, Full System)**
```typescript
// src/tests/integration/gameFlow.test.tsx
import { renderWithProviders } from '@/tests/helpers';
import { mockBrowserAPIs } from '@/tests/mocks/browser';
import { mockAudioAPIs } from '@/tests/mocks/audio';

describe('Complete Game Flow', () => {
  beforeEach(() => {
    mockBrowserAPIs('observers', 'animation', 'scroll');
    mockAudioAPIs('context');
  });

  it('completes a full game', async () => {
    const { user } = renderWithProviders(<App />);

    // Start game
    await user.click(screen.getByRole('button', { name: /start game/i }));

    // Place departments
    for (const dept of testDepartments.slice(0, 5)) {
      const deptEl = screen.getByText(dept.name);
      const targetEl = screen.getByLabelText(`Place ${dept.name}`);
      await user.dragAndDrop(deptEl, targetEl);
    }

    // Check completion
    expect(screen.getByText(/congratulations/i)).toBeInTheDocument();
  });
});
```

**E2E Tests (Slowest, Real Browser)**
```typescript
// tests/e2e/gameplay.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test('user can complete a game', async ({ page }) => {
  await page.goto('http://localhost:3000');

  // Real browser, real interactions
  await page.click('text=Start Game');
  await page.dragAndDrop('[data-testid="dept-antioquia"]', '[data-testid="map-target"]');

  await expect(page.locator('text=Correct!')).toBeVisible();
});
```

### 4.2 Test Configuration Matrix

```typescript
// vitest.config.ts - Reorganized
export default defineConfig({
  test: {
    // Unit tests (fast)
    include: [
      'src/utils/**/*.test.ts',
      'src/services/**/*.test.ts',
      'src/hooks/**/*.test.ts',
    ],
    exclude: [
      'src/tests/integration/**',
      'src/tests/e2e/**',
    ],
    environment: 'node', // No DOM needed
    globals: true,
    setupFiles: ['./src/tests/setup.unit.ts'], // Minimal setup
  },
});

// vitest.config.component.ts - Component tests
export default defineConfig({
  test: {
    include: [
      'src/components/**/*.test.tsx',
    ],
    environment: 'jsdom', // DOM needed
    setupFiles: ['./src/tests/setup.component.ts'], // Browser mocks
  },
});

// vitest.config.integration.ts - Integration tests
export default defineConfig({
  test: {
    include: [
      'src/tests/integration/**/*.test.tsx',
    ],
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.integration.ts'], // Full mocks
    testTimeout: 30000, // Longer timeout
  },
});
```

---

## 5. Migration from jsdom to Playwright Component Testing

### 5.1 Why Playwright Component Testing?

**jsdom Limitations:**
- Mock-based testing (not realistic)
- No real browser rendering
- Limited CSS support
- No real touch/pointer events
- No visual rendering bugs caught

**Playwright Benefits:**
- Real browser (Chromium/Firefox/WebKit)
- Real rendering engine
- Real touch/pointer events
- Visual regression testing
- Debugging tools (trace viewer)
- Consistent across dev/CI

### 5.2 Migration Strategy

**Phase 1: Parallel Testing (Weeks 1-2)**
```
Keep jsdom tests running
Add Playwright for critical components
Compare results
Identify gaps
```

**Phase 2: Component Migration (Weeks 3-6)**
```
Week 3: Game components (GameContainer, MapCanvas)
Week 4: Input components (DepartmentTray, drag/drop)
Week 5: Modal components (HintModal, tutorials)
Week 6: Mobile components (touch interactions)
```

**Phase 3: Integration Migration (Weeks 7-8)**
```
Week 7: Game flow integration tests
Week 8: Auth flow integration tests
```

**Phase 4: Deprecation (Week 9)**
```
Remove jsdom for component tests
Keep jsdom for unit tests (utils, services)
Full Playwright for component/integration
```

### 5.3 Playwright Component Test Example

**Setup:**
```typescript
// playwright-ct.config.ts
import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './src/components',
  testMatch: '**/*.ct.tsx', // Component tests
  use: {
    ctPort: 3100,
    ctViteConfig: {
      // Your Vite config
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['iPhone 13'] },
    },
  ],
});
```

**Component Test:**
```typescript
// src/components/DepartmentTray.ct.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import DepartmentTray from './DepartmentTray';
import { GameProvider } from '@/context/GameContext';

test('renders departments', async ({ mount }) => {
  const component = await mount(
    <GameProvider>
      <DepartmentTray />
    </GameProvider>
  );

  // Real browser assertions
  await expect(component.getByText('Antioquia')).toBeVisible();

  // Real interactions
  await component.getByText('Antioquia').click();
  await expect(component).toHaveScreenshot(); // Visual regression
});

test('supports touch drag', async ({ mount, page }) => {
  const component = await mount(
    <GameProvider>
      <DepartmentTray />
    </GameProvider>
  );

  // Real touch events
  const dept = component.getByText('Antioquia');
  await dept.dispatchEvent('touchstart', { touches: [{ clientX: 100, clientY: 100 }] });
  await page.mouse.move(200, 200);
  await dept.dispatchEvent('touchend');

  await expect(component).toHaveScreenshot('after-drag.png');
});
```

---

## 6. E2E Test Coverage Strategy

### 6.1 Critical User Flows

**Flow 1: New User Onboarding**
```typescript
// tests/e2e/onboarding.spec.ts
test('new user completes tutorial', async ({ page }) => {
  await page.goto('/');

  // Tutorial appears for first-time user
  await expect(page.locator('[data-testid="tutorial-modal"]')).toBeVisible();

  // Step through tutorial
  await page.click('text=Next');
  await page.click('text=Next');
  await page.click('text=Next');
  await page.click('text=Start Playing');

  // Tutorial dismissed, game starts
  await expect(page.locator('[data-testid="game-container"]')).toBeVisible();
});
```

**Flow 2: Complete Game**
```typescript
test('user completes full game successfully', async ({ page }) => {
  await page.goto('/');
  await skipTutorial(page);

  // Place all departments correctly
  for (const dept of allDepartments) {
    await placeDepartment(page, dept.name, dept.correctLocation);
  }

  // See completion screen
  await expect(page.locator('text=Congratulations')).toBeVisible();
  await expect(page.locator('[data-testid="final-score"]')).toContainText(/Score:/);

  // Can play again
  await page.click('text=Play Again');
  await expect(page.locator('[data-testid="game-container"]')).toBeVisible();
});
```

**Flow 3: Hint Usage**
```typescript
test('user can use progressive hints', async ({ page }) => {
  await page.goto('/');
  await skipTutorial(page);

  // Click hint button
  await page.click('[aria-label="Get hint"]');

  // See level 1 hint
  await expect(page.locator('text=Hint Level 1')).toBeVisible();

  // Escalate hint
  await page.click('text=Need more help?');
  await expect(page.locator('text=Hint Level 2')).toBeVisible();

  // Close hint
  await page.click('[aria-label="Close hint"]');
  await expect(page.locator('[data-testid="hint-modal"]')).not.toBeVisible();
});
```

**Flow 4: Study Mode**
```typescript
test('user learns in study mode', async ({ page }) => {
  await page.goto('/');

  // Switch to study mode
  await page.click('text=Study Mode');

  // Filter by region
  await page.click('[data-testid="region-filter"]');
  await page.click('text=Caribe');

  // See only Caribe departments
  const depts = page.locator('[data-testid^="dept-card-"]');
  await expect(depts).toHaveCount(8); // Caribe has 8 departments

  // Click department for details
  await page.click('text=Atlántico');
  await expect(page.locator('text=Barranquilla')).toBeVisible(); // Capital
});
```

**Flow 5: Mobile Touch Interaction**
```typescript
test('mobile user completes game with touch', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile-only test');

  await page.goto('/');

  // Use touch gestures
  const dept = page.locator('[data-testid="dept-antioquia"]');
  await dept.tap();

  // Swipe to place
  await dept.dragTo(page.locator('[data-testid="map-target"]'));

  // See placement feedback
  await expect(page.locator('text=Correct!')).toBeVisible();
});
```

### 6.2 Coverage Matrix

| Flow | Priority | Frequency | Browsers | Devices |
|------|----------|-----------|----------|---------|
| Onboarding | Critical | Once per user | All | Desktop + Mobile |
| Complete Game | Critical | Every session | Chromium | Desktop |
| Hint Usage | High | 70% of games | Chromium | Desktop |
| Study Mode | High | 30% of users | Chromium | Desktop |
| Touch Interaction | Critical | Mobile users | Chromium | Mobile |
| Auth (Login/Signup) | High | New users | All | Desktop |
| Offline Play | Medium | 10% of users | Chromium | Desktop + Mobile |
| Accessibility | High | A11y users | Firefox | Desktop |

---

## 7. Environment Parity Solution

### 7.1 Problem Analysis

**Current Issues:**
- WSL2-specific configuration (`pool: 'forks'`)
- Different Node.js versions (local vs CI)
- Different environment variables
- Different mock availability

### 7.2 Solution: Environment Detection

```typescript
// src/tests/env.ts
export const TEST_ENV = {
  isCI: process.env.CI === 'true',
  isWSL: process.platform === 'linux' && process.env.WSL_DISTRO_NAME !== undefined,
  isWindows: process.platform === 'win32',
  isMac: process.platform === 'darwin',
  nodeVersion: process.version,
} as const;

export function getOptimalTestConfig() {
  if (TEST_ENV.isCI) {
    return {
      pool: 'forks', // CI uses forks for stability
      poolOptions: {
        forks: {
          singleFork: true,
        },
      },
      testTimeout: 15000, // CI is slower
    };
  }

  if (TEST_ENV.isWSL) {
    return {
      pool: 'forks', // WSL2 deadlock prevention
      poolOptions: {
        forks: {
          singleFork: false, // Faster locally
        },
      },
      testTimeout: 10000,
    };
  }

  return {
    pool: 'threads', // Fastest on native
    testTimeout: 5000,
  };
}

// vitest.config.ts
import { getOptimalTestConfig } from './src/tests/env';

export default defineConfig({
  test: {
    ...getOptimalTestConfig(),
    // Rest of config
  },
});
```

### 7.3 Docker-based CI

**Dockerfile.test:**
```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Run tests
CMD ["npm", "run", "test:ci"]
```

**GitHub Actions:**
```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.40.0-jammy

    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --run

      - name: Run component tests
        run: npx playwright test --project=chromium

      - name: Run E2E tests
        run: npx playwright test tests/e2e
```

**Benefits:**
- Same environment locally and CI
- Playwright pre-installed
- No WSL2-specific config needed
- Consistent results

---

## 8. Validation Criteria

### 8.1 Success Metrics

✅ **Test Organization:**
- All tests under 100 lines per file
- Clear test categories (unit/component/integration/e2e)
- No test exclusions (all 914 tests running)

✅ **Test Pass Rate:**
- 90%+ tests passing (820+/914)
- Zero flaky tests
- Consistent results across runs

✅ **Coverage:**
- 70%+ line coverage (realistic tests)
- 80%+ branch coverage for critical paths
- 100% coverage for core game logic

✅ **Performance:**
- Unit tests: <5s total
- Component tests: <30s total
- Integration tests: <2min total
- E2E tests: <5min total

✅ **Dev Experience:**
- Easy to write new tests
- Clear error messages
- Fast feedback loop
- Good documentation

### 8.2 Acceptance Criteria

```bash
# All must pass:

# 1. No test exclusions
cat vitest.config.ts | grep -q "exclude.*tests" && echo "FAIL" || echo "PASS"

# 2. High pass rate
npm test -- --run | grep -q "820.*914.*passed" || echo "FAIL"

# 3. Good coverage
npm run test:coverage | grep -q "70.*%" || echo "FAIL"

# 4. Fast execution
time npm test -- --run | grep -q "Time.*5s" || echo "FAIL"

# 5. CI parity
npm run test:ci && echo "PASS" || echo "FAIL"
```

---

## 9. Migration Timeline

### Week 1: Foundation
- Create modular mock structure
- Set up Playwright component testing
- Write test helpers (renderWithProviders)
- Configure environment detection

### Week 2: Unit Test Migration
- Fix excluded utils tests
- Fix excluded services tests
- Remove unnecessary mocks
- Achieve 100% pass rate for units

### Week 3-4: Component Test Migration
- Migrate GameContainer tests to Playwright
- Migrate HintModal tests
- Migrate DepartmentTray tests
- Migrate MapCanvas tests

### Week 5-6: Integration Test Migration
- Migrate game flow tests
- Migrate auth flow tests
- Create E2E coverage plan
- Write critical E2E tests

### Week 7: Mobile Test Migration
- Migrate touch tests to Playwright
- Set up mobile device emulation
- Test responsive layouts
- Visual regression testing

### Week 8: Cleanup & Documentation
- Remove old setup.ts
- Update test documentation
- Create test writing guide
- Performance optimization

---

## 10. Next Steps

**Immediate Actions:**
1. Review architecture with test lead
2. Set up Playwright in project
3. Create modular mock structure
4. Write migration runbook

**Required Approvals:**
- [ ] Test Lead (testing strategy)
- [ ] DevOps Lead (CI/CD integration)
- [ ] Queen Coordinator (resource allocation)

**Documentation:**
- [ ] Test writing guide
- [ ] Mock usage guide
- [ ] Playwright setup guide
- [ ] Troubleshooting guide

---

**End of Document**
