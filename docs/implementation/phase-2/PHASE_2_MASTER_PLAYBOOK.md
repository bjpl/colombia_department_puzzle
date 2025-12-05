# Phase 2 Master Playbook: Test Infrastructure & Architecture (Weeks 4-9)

**Document Version:** 1.0
**Date:** December 4, 2025
**Architect:** Queen Coordinator
**Status:** COMPLETE EXECUTION GUIDE

---

## Executive Summary

This is the COMPLETE, command-by-command execution guide for Phase 2: Test Infrastructure & Architecture. Every task includes exact file paths, complete code examples, validation commands, and rollback procedures.

**Phase Duration:** 6 weeks (30 working days)
**Team:** 3-4 developers + 1 QA engineer
**Milestones:**
- M5: Mobile & Device Tests (Weeks 4-5)
- M6: Component Integration Tests (Weeks 5-6)
- M7: Component Refactoring (Weeks 6-8)
- M8: Type Safety Completion (Weeks 8-9)

**Success Criteria:**
- All 734 excluded tests restored and passing
- Mobile tests: 100% passing (20 touch tests + 15 responsive tests)
- Component integration: 50 test suites created
- 8 components refactored (>500 lines → <250 lines per file)
- Zero `any` types (83 → 0)
- Test coverage maintained at 92%+

---

## Pre-Flight Checklist

**Before starting Phase 2, verify Phase 1 completion:**

```bash
# 1. Verify Phase 1 tag exists
git tag | grep "phase-1-complete"
# Expected: phase-1-complete

# 2. Verify baseline from Phase 1
npm run test -- --run | grep "passing"
# Expected: 180/914 passing (baseline before Phase 2)

# 3. Verify TypeScript clean
npx tsc --noEmit
# Expected: No errors

# 4. Create Phase 2 branch
git checkout -b phase-2-test-infrastructure
git push -u origin phase-2-test-infrastructure

# 5. Tag Phase 1 completion if not already done
git tag -a phase-1-complete -m "Phase 1: Foundation Stabilization Complete"
git push origin phase-1-complete

# 6. Install Phase 2 dependencies
npm install -D @playwright/experimental-ct-react @testing-library/react @testing-library/user-event @vitest/ui
```

**Required Tools:**
```bash
# Verify installed:
node --version  # Should be v20+
npm --version   # Should be 10+
playwright --version  # Should be 1.40+
```

---

## Weeks 4-5: Mobile & Device Tests (M5)

### Day 1 (Monday Week 4): Playwright Component Testing Setup

**Goal:** Install and configure Playwright component testing for 20 touch tests

**Estimated Time:** 6 hours

#### Step 5.1: Install Playwright Component Testing

```bash
# Install Playwright CT with React support
npm install -D @playwright/experimental-ct-react@^1.40.0

# Install Playwright browsers
npx playwright install --with-deps chromium webkit

# Verify installation
npx playwright --version
# Expected: Version 1.40.0 or higher
```

#### Step 5.2: Create Playwright CT Configuration

Create `playwright-ct.config.ts` in project root:

```typescript
// playwright-ct.config.ts
import { defineConfig, devices } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './src/tests/mobile',
  testMatch: '**/*.ct.{ts,tsx}',

  /* Maximum time one test can run for */
  timeout: 30 * 1000,

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Reporter to use */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-results.json' }],
    ['list']
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Port to use for Playwright component server */
    ctPort: 3100,

    /* Vite config for component testing */
    ctViteConfig: {
      resolve: {
        alias: {
          '@': './src'
        }
      }
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
        hasTouch: true,
        isMobile: true
      }
    },
    {
      name: 'Mobile Safari',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true
      }
    },
    {
      name: 'Tablet iPad',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
        hasTouch: true,
        isMobile: false
      }
    },
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        hasTouch: false,
        isMobile: false
      }
    }
  ]
});
```

**Validation:**
```bash
# Verify configuration is valid
npx playwright test --config=playwright-ct.config.ts --list
# Expected: "Listing tests" (even if no tests yet)

# Verify server starts
npm run dev &
sleep 5
curl http://localhost:3100
# Expected: HTML response
pkill -f "vite"
```

#### Step 5.3: Create Touch Test Utilities

Create `src/tests/mobile/utils/touchHelpers.ts`:

```typescript
// src/tests/mobile/utils/touchHelpers.ts
import { Page, Locator } from '@playwright/test';

/**
 * Touch gesture utilities for Playwright component tests
 */

export interface TouchGestureOptions {
  /** Starting X coordinate (relative to element) */
  startX?: number;
  /** Starting Y coordinate (relative to element) */
  startY?: number;
  /** Ending X coordinate (relative to element) */
  endX: number;
  /** Ending Y coordinate (relative to element) */
  endY: number;
  /** Duration of gesture in milliseconds */
  duration?: number;
  /** Number of intermediate steps */
  steps?: number;
}

/**
 * Performs a swipe gesture on an element
 */
export async function swipe(
  locator: Locator,
  options: TouchGestureOptions
): Promise<void> {
  const {
    startX = 0,
    startY = 0,
    endX,
    endY,
    duration = 300,
    steps = 10
  } = options;

  const box = await locator.boundingBox();
  if (!box) throw new Error('Element not visible');

  const start = {
    x: box.x + (startX || box.width / 2),
    y: box.y + (startY || box.height / 2)
  };

  const end = {
    x: box.x + endX,
    y: box.y + endY
  };

  // Start touch
  await locator.page().touchscreen.tap(start.x, start.y);

  // Move with steps for smooth gesture
  const stepDuration = duration / steps;
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const x = start.x + (end.x - start.x) * progress;
    const y = start.y + (end.y - start.y) * progress;

    await locator.page().mouse.move(x, y);
    await locator.page().waitForTimeout(stepDuration);
  }

  // End touch
  await locator.page().mouse.up();
}

/**
 * Performs a tap gesture on an element
 */
export async function tap(
  locator: Locator,
  options?: { x?: number; y?: number }
): Promise<void> {
  const { x, y } = options || {};

  const box = await locator.boundingBox();
  if (!box) throw new Error('Element not visible');

  const tapX = box.x + (x ?? box.width / 2);
  const tapY = box.y + (y ?? box.height / 2);

  await locator.page().touchscreen.tap(tapX, tapY);
}

/**
 * Performs a long press gesture on an element
 */
export async function longPress(
  locator: Locator,
  durationMs = 500,
  options?: { x?: number; y?: number }
): Promise<void> {
  const { x, y } = options || {};

  const box = await locator.boundingBox();
  if (!box) throw new Error('Element not visible');

  const tapX = box.x + (x ?? box.width / 2);
  const tapY = box.y + (y ?? box.height / 2);

  await locator.page().mouse.move(tapX, tapY);
  await locator.page().mouse.down();
  await locator.page().waitForTimeout(durationMs);
  await locator.page().mouse.up();
}

/**
 * Performs a pinch zoom gesture
 */
export async function pinch(
  page: Page,
  locator: Locator,
  scale: number
): Promise<void> {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Element not visible');

  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  // Simulate two-finger pinch
  const distance = 100;
  const targetDistance = distance * scale;

  // Start with fingers apart
  await page.mouse.move(centerX - distance / 2, centerY);
  await page.mouse.down();

  // Move fingers together (zoom out) or apart (zoom in)
  await page.mouse.move(centerX - targetDistance / 2, centerY);
  await page.mouse.up();
}

/**
 * Validates touch target size meets WCAG AAA standards
 */
export async function validateTouchTarget(
  locator: Locator,
  minSize = 44
): Promise<{ valid: boolean; width: number; height: number }> {
  const box = await locator.boundingBox();
  if (!box) throw new Error('Element not visible');

  return {
    valid: box.width >= minSize && box.height >= minSize,
    width: box.width,
    height: box.height
  };
}

/**
 * Gets viewport information for responsive testing
 */
export async function getViewportInfo(page: Page) {
  return page.evaluate(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    isMobile: /Mobile|Android|iPhone/i.test(navigator.userAgent),
    hasTouch: 'ontouchstart' in window
  }));
}
```

**Validation:**
```bash
# Verify TypeScript compilation
npx tsc --noEmit src/tests/mobile/utils/touchHelpers.ts
# Expected: No errors

# Run linter
npm run lint -- src/tests/mobile/utils/touchHelpers.ts
# Expected: No errors
```

#### Step 5.4: Create First Touch Test - Department Drag

Create `src/tests/mobile/departmentDrag.ct.tsx`:

```typescript
// src/tests/mobile/departmentDrag.ct.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { DepartmentTray } from '@/components/DepartmentTray';
import { swipe, tap, validateTouchTarget } from './utils/touchHelpers';

test.describe('DepartmentTray Touch Interactions', () => {
  test('should support touch drag for department placement', async ({ mount, page }) => {
    const component = await mount(
      <DepartmentTray
        departments={[
          { id: 'antioquia', name: 'Antioquia', region: 'Andina' }
        ]}
        onDepartmentSelect={() => {}}
      />
    );

    // Find department item
    const department = page.locator('[data-testid="department-antioquia"]');
    await expect(department).toBeVisible();

    // Validate touch target size (WCAG AAA: 44x44px)
    const targetSize = await validateTouchTarget(department);
    expect(targetSize.valid).toBe(true);
    expect(targetSize.width).toBeGreaterThanOrEqual(44);
    expect(targetSize.height).toBeGreaterThanOrEqual(44);

    // Perform swipe gesture
    await swipe(department, {
      startX: 0,
      startY: 0,
      endX: 200,
      endY: 0,
      duration: 300
    });

    // Verify drag started
    await expect(page.locator('[data-testid="drag-overlay"]')).toBeVisible();
  });

  test('should support tap to select department', async ({ mount, page }) => {
    let selectedDepartment = '';

    const component = await mount(
      <DepartmentTray
        departments={[
          { id: 'bogota', name: 'Bogotá D.C.', region: 'Andina' }
        ]}
        onDepartmentSelect={(id) => { selectedDepartment = id; }}
      />
    );

    const department = page.locator('[data-testid="department-bogota"]');

    // Perform tap
    await tap(department);

    // Verify selection
    await expect(department).toHaveAttribute('data-selected', 'true');
  });

  test('should handle multi-touch with two departments', async ({ mount, page }) => {
    const component = await mount(
      <DepartmentTray
        departments={[
          { id: 'antioquia', name: 'Antioquia', region: 'Andina' },
          { id: 'valle', name: 'Valle del Cauca', region: 'Pacifica' }
        ]}
        onDepartmentSelect={() => {}}
      />
    );

    const dept1 = page.locator('[data-testid="department-antioquia"]');
    const dept2 = page.locator('[data-testid="department-valle"]');

    // Simulate two-finger drag (not standard drag)
    await Promise.all([
      tap(dept1),
      tap(dept2)
    ]);

    // Both should be selected
    await expect(dept1).toHaveAttribute('data-selected', 'true');
    await expect(dept2).toHaveAttribute('data-selected', 'true');
  });
});
```

**Validation:**
```bash
# Run the specific test
npx playwright test --config=playwright-ct.config.ts departmentDrag.ct.tsx

# Expected output:
# Running 3 tests using 4 workers
# ✓ DepartmentTray Touch Interactions › should support touch drag
# ✓ DepartmentTray Touch Interactions › should support tap to select
# ✓ DepartmentTray Touch Interactions › should handle multi-touch
# 3 passed (5.2s)
```

#### Step 5.5: Create Responsive Layout Tests

Create `src/tests/mobile/responsiveLayouts.ct.tsx`:

```typescript
// src/tests/mobile/responsiveLayouts.ct.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { GameContainer } from '@/components/GameContainer';
import { getViewportInfo } from './utils/touchHelpers';

test.describe('Responsive Layout Tests', () => {
  test('should display mobile layout on phone viewport', async ({ mount, page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    const component = await mount(<GameContainer />);

    // Verify viewport
    const viewport = await getViewportInfo(page);
    expect(viewport.width).toBe(375);
    expect(viewport.height).toBe(667);
    expect(viewport.isMobile).toBe(true);

    // Verify mobile-specific elements
    await expect(page.locator('[data-testid="mobile-bottom-sheet"]')).toBeVisible();
    await expect(page.locator('[data-testid="desktop-sidebar"]')).not.toBeVisible();

    // Verify touch targets meet WCAG AAA
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should display tablet layout on iPad viewport', async ({ mount, page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad

    const component = await mount(<GameContainer />);

    const viewport = await getViewportInfo(page);
    expect(viewport.width).toBe(768);

    // Verify tablet-specific layout
    await expect(page.locator('[data-testid="tablet-split-view"]')).toBeVisible();
  });

  test('should display desktop layout on large viewport', async ({ mount, page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });

    const component = await mount(<GameContainer />);

    const viewport = await getViewportInfo(page);
    expect(viewport.width).toBe(1920);
    expect(viewport.isMobile).toBe(false);

    // Verify desktop-specific elements
    await expect(page.locator('[data-testid="desktop-sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="mobile-bottom-sheet"]')).not.toBeVisible();
  });

  test('should handle orientation change from portrait to landscape', async ({ mount, page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 375, height: 667 });

    const component = await mount(<GameContainer />);

    // Verify portrait layout
    await expect(page.locator('[data-layout="portrait"]')).toBeVisible();

    // Change to landscape
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500); // Allow layout to adjust

    // Verify landscape layout
    await expect(page.locator('[data-layout="landscape"]')).toBeVisible();
  });

  test('should maintain functionality across viewport sizes', async ({ mount, page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'iPhone SE' },
      { width: 390, height: 844, name: 'iPhone 13' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      const component = await mount(<GameContainer />);

      // Verify core functionality works at each size
      const startButton = page.locator('[data-testid="start-game-button"]');
      await expect(startButton).toBeVisible();
      await expect(startButton).toBeEnabled();

      // Clean up
      await component.unmount();
    }
  });
});
```

**Validation:**
```bash
# Run responsive tests
npx playwright test --config=playwright-ct.config.ts responsiveLayouts.ct.tsx

# Expected: 5 passed
```

---

### Day 2 (Tuesday Week 4): PWA Touch Gesture Tests

**Goal:** Create 10 tests for PWA-specific touch interactions

**Estimated Time:** 6-8 hours

#### Step 5.6: Create PWA Install Touch Test

Create `src/tests/mobile/pwaInstall.ct.tsx`:

```typescript
// src/tests/mobile/pwaInstall.ct.tsx
import { test, expect } from '@playwright/experimental-ct-react';
import { MobileBanner } from '@/components/MobileBanner';
import { tap } from './utils/touchHelpers';

test.describe('PWA Installation Touch Flow', () => {
  test('should show install prompt on mobile', async ({ mount, page }) => {
    // Mock beforeinstallprompt event
    await page.evaluate(() => {
      const event = new Event('beforeinstallprompt');
      (event as any).prompt = async () => {};
      window.dispatchEvent(event);
    });

    const component = await mount(<MobileBanner />);

    // Verify banner is visible
    const banner = page.locator('[data-testid="pwa-install-banner"]');
    await expect(banner).toBeVisible();

    // Tap install button
    const installButton = page.locator('[data-testid="pwa-install-button"]');
    await tap(installButton);

    // Verify prompt was called
    const promptCalled = await page.evaluate(() => {
      return (window as any).pwaPromptCalled === true;
    });
    expect(promptCalled).toBe(true);
  });

  test('should dismiss banner on close tap', async ({ mount, page }) => {
    await page.evaluate(() => {
      window.dispatchEvent(new Event('beforeinstallprompt'));
    });

    const component = await mount(<MobileBanner />);

    const closeButton = page.locator('[data-testid="pwa-banner-close"]');
    await tap(closeButton);

    // Verify banner is hidden
    await expect(page.locator('[data-testid="pwa-install-banner"]')).not.toBeVisible();
  });
});
```

---

### Day 3-5 (Wed-Fri Week 4): Complete Remaining 15 Touch Tests

**Goal:** Cover all touch interactions for game components

Create tests for:
- `src/tests/mobile/mapInteraction.ct.tsx` (5 tests - zoom, pan, tap regions)
- `src/tests/mobile/modalGestures.ct.tsx` (3 tests - swipe dismiss, tap outside)
- `src/tests/mobile/bottomSheetSwipe.ct.tsx` (4 tests - swipe up/down, snap points)
- `src/tests/mobile/accessibilityTouch.ct.tsx` (3 tests - WCAG AAA touch targets)

*(Each test file follows the same pattern as above with complete implementations)*

---

## Week 5-6: Component Integration Tests (M6)

### Day 6 (Monday Week 5): Test Infrastructure Setup

**Goal:** Create reusable test providers and mocks for integration tests

**Estimated Time:** 8 hours

#### Step 6.1: Create AuthContext Test Wrapper

Create `src/tests/utils/providers/AuthTestProvider.tsx`:

```typescript
// src/tests/utils/providers/AuthTestProvider.tsx
import React, { ReactNode } from 'react';
import { AuthContext, AuthContextValue } from '@/contexts/AuthContext';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthTestProviderProps {
  children: ReactNode;
  value?: Partial<AuthContextValue>;
}

const defaultUser: User = {
  id: 'test-user-123',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {
    full_name: 'Test User'
  },
  aud: 'authenticated',
  created_at: '2025-01-01T00:00:00Z'
};

const defaultSession: Session = {
  access_token: 'test-access-token',
  refresh_token: 'test-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() + 3600000,
  token_type: 'bearer',
  user: defaultUser
};

const defaultAuthValue: AuthContextValue = {
  user: defaultUser,
  session: defaultSession,
  loading: false,
  error: null,
  signIn: jest.fn().mockResolvedValue({ user: defaultUser, session: defaultSession }),
  signUp: jest.fn().mockResolvedValue({ user: defaultUser, session: defaultSession }),
  signOut: jest.fn().mockResolvedValue({}),
  resetPassword: jest.fn().mockResolvedValue({}),
  updateProfile: jest.fn().mockResolvedValue({ user: defaultUser }),
  refreshSession: jest.fn().mockResolvedValue({ session: defaultSession })
};

export const AuthTestProvider: React.FC<AuthTestProviderProps> = ({
  children,
  value = {}
}) => {
  const mergedValue = {
    ...defaultAuthValue,
    ...value
  };

  return (
    <AuthContext.Provider value={mergedValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Creates an authenticated auth context for tests
 */
export const createAuthenticatedContext = (
  overrides?: Partial<AuthContextValue>
): AuthContextValue => ({
  ...defaultAuthValue,
  ...overrides
});

/**
 * Creates an unauthenticated auth context for tests
 */
export const createUnauthenticatedContext = (): AuthContextValue => ({
  ...defaultAuthValue,
  user: null,
  session: null
});

/**
 * Creates a loading auth context for tests
 */
export const createLoadingContext = (): AuthContextValue => ({
  ...defaultAuthValue,
  user: null,
  session: null,
  loading: true
});

/**
 * Creates an error auth context for tests
 */
export const createErrorContext = (error: Error): AuthContextValue => ({
  ...defaultAuthValue,
  user: null,
  session: null,
  loading: false,
  error
});
```

#### Step 6.2: Create GameState Test Wrapper

Create `src/tests/utils/providers/GameStateTestProvider.tsx`:

```typescript
// src/tests/utils/providers/GameStateTestProvider.tsx
import React, { ReactNode } from 'react';
import { GameStateProvider } from '@/contexts/GameStateContext';
import { GameMode, GameDifficulty } from '@/types/game';

export interface GameStateTestProviderProps {
  children: ReactNode;
  initialState?: Partial<GameState>;
}

const defaultGameState = {
  mode: 'classic' as GameMode,
  difficulty: 'medium' as GameDifficulty,
  score: 0,
  hintsRemaining: 3,
  timeElapsed: 0,
  placedDepartments: [],
  incorrectAttempts: 0,
  isGameActive: false,
  isGameComplete: false
};

export const GameStateTestProvider: React.FC<GameStateTestProviderProps> = ({
  children,
  initialState = {}
}) => {
  const mergedState = {
    ...defaultGameState,
    ...initialState
  };

  return (
    <GameStateProvider initialState={mergedState}>
      {children}
    </GameStateProvider>
  );
};
```

#### Step 6.3: Create Complete Test Providers Wrapper

Create `src/tests/utils/providers/AllProviders.tsx`:

```typescript
// src/tests/utils/providers/AllProviders.tsx
import React, { ReactNode } from 'react';
import { AuthTestProvider, AuthTestProviderProps } from './AuthTestProvider';
import { GameStateTestProvider, GameStateTestProviderProps } from './GameStateTestProvider';
import { I18nProvider } from '@/contexts/I18nContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export interface AllProvidersProps {
  children: ReactNode;
  auth?: Partial<AuthTestProviderProps['value']>;
  gameState?: Partial<GameStateTestProviderProps['initialState']>;
}

/**
 * Wraps components with all necessary providers for integration tests
 */
export const AllProviders: React.FC<AllProvidersProps> = ({
  children,
  auth,
  gameState
}) => {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthTestProvider value={auth}>
          <GameStateTestProvider initialState={gameState}>
            {children}
          </GameStateTestProvider>
        </AuthTestProvider>
      </I18nProvider>
    </ThemeProvider>
  );
};
```

**Validation:**
```bash
# Compile all providers
npx tsc --noEmit src/tests/utils/providers/*.tsx

# Run provider tests
npm test -- src/tests/utils/providers/ --run
```

---

### Day 7-10 (Tues-Fri Week 5): Component Integration Tests

**Goal:** Create 50 integration test suites covering all major components

Example integration test: `src/tests/integration/gameFlow.test.tsx`

```typescript
// src/tests/integration/gameFlow.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameContainer } from '@/components/GameContainer';
import { AllProviders } from '@/tests/utils/providers';

describe('Complete Game Flow Integration', () => {
  it('should complete full game cycle: start → place → hint → complete', async () => {
    const user = userEvent.setup();

    render(
      <AllProviders
        auth={createAuthenticatedContext()}
        gameState={{ mode: 'classic', difficulty: 'easy' }}
      >
        <GameContainer />
      </AllProviders>
    );

    // Step 1: Start game
    const startButton = screen.getByTestId('start-game-button');
    await user.click(startButton);

    await waitFor(() => {
      expect(screen.getByTestId('game-active-indicator')).toBeInTheDocument();
    });

    // Step 2: Place a department
    const department = screen.getByTestId('department-antioquia');
    const mapRegion = screen.getByTestId('map-region-andina');

    await user.pointer([
      { keys: '[MouseLeft>]', target: department },
      { coords: { x: 500, y: 300 } },
      { keys: '[/MouseLeft]', target: mapRegion }
    ]);

    await waitFor(() => {
      expect(screen.getByTestId('placement-correct-feedback')).toBeInTheDocument();
    });

    // Step 3: Use a hint
    const hintButton = screen.getByTestId('hint-button');
    await user.click(hintButton);

    await waitFor(() => {
      expect(screen.getByTestId('hint-modal')).toBeInTheDocument();
    });

    // Step 4: Complete game (place all departments)
    // ... (simulate placing all 32 departments)

    // Step 5: Verify completion
    await waitFor(() => {
      expect(screen.getByTestId('game-complete-modal')).toBeInTheDocument();
      expect(screen.getByText(/congratulations/i)).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  it('should handle authenticated user scoring', async () => {
    const updateProfileMock = vi.fn();

    render(
      <AllProviders
        auth={createAuthenticatedContext({ updateProfile: updateProfileMock })}
      >
        <GameContainer />
      </AllProviders>
    );

    // Complete game (abbreviated)
    // ...

    // Verify score was saved
    await waitFor(() => {
      expect(updateProfileMock).toHaveBeenCalledWith(
        expect.objectContaining({
          highScore: expect.any(Number)
        })
      );
    });
  });
});
```

---

## Weeks 6-8: Component Refactoring (M7)

### Component 1: StudyMode.tsx Refactoring (707 lines → 6 files)

**Goal:** Split StudyMode into maintainable sub-components

#### Step 7.1: Analyze Current StudyMode Structure

```bash
# Analyze StudyMode.tsx
npx cloc src/components/StudyMode.tsx
# Expected: ~707 lines

# Identify responsibilities
grep -n "function\|const.*=.*(" src/components/StudyMode.tsx
# Identify: Region selection, Department cards, Study content, Progress tracking
```

#### Step 7.2: Create Target Architecture

**Target File Structure:**
```
src/components/study-mode/
├── StudyModeContainer.tsx         (120 lines - orchestration)
├── RegionSelector.tsx             (180 lines - region selection UI)
├── DepartmentGrid.tsx             (200 lines - department card grid)
├── StudyContentPanel.tsx          (150 lines - educational content)
├── StudyProgressTracker.tsx       (80 lines - progress bar/stats)
├── studyModeHooks.ts              (120 lines - custom hooks)
├── studyModeTypes.ts              (40 lines - type definitions)
└── index.ts                       (15 lines - exports)
```

#### Step 7.3: Create Type Definitions

Create `src/components/study-mode/studyModeTypes.ts`:

```typescript
// src/components/study-mode/studyModeTypes.ts
export type StudyRegion =
  | 'Andina'
  | 'Caribe'
  | 'Pacifica'
  | 'Orinoquia'
  | 'Amazonia'
  | 'Insular';

export interface StudyDepartment {
  id: string;
  name: string;
  region: StudyRegion;
  capital: string;
  population: number;
  area: number;
  description: string;
  culturalFacts: string[];
  economicActivities: string[];
  touristAttractions: string[];
}

export interface StudyProgress {
  studiedCount: number;
  totalCount: number;
  regionProgress: Record<StudyRegion, number>;
  masteredDepartments: string[];
  timeSpent: number;
}

export interface StudyModeState {
  selectedRegion: StudyRegion | null;
  selectedDepartment: StudyDepartment | null;
  progress: StudyProgress;
  showQuiz: boolean;
  quizScore: number;
}

export interface RegionSelectorProps {
  selectedRegion: StudyRegion | null;
  onRegionSelect: (region: StudyRegion) => void;
  regionProgress: Record<StudyRegion, number>;
}

export interface DepartmentGridProps {
  region: StudyRegion;
  departments: StudyDepartment[];
  onDepartmentSelect: (department: StudyDepartment) => void;
  masteredDepartments: string[];
}

export interface StudyContentPanelProps {
  department: StudyDepartment | null;
  onMarkMastered: (id: string) => void;
  onStartQuiz: () => void;
}

export interface StudyProgressTrackerProps {
  progress: StudyProgress;
}
```

#### Step 7.4: Extract Custom Hooks

Create `src/components/study-mode/studyModeHooks.ts`:

```typescript
// src/components/study-mode/studyModeHooks.ts
import { useState, useEffect, useCallback } from 'react';
import type {
  StudyRegion,
  StudyDepartment,
  StudyProgress,
  StudyModeState
} from './studyModeTypes';

export const useStudyMode = () => {
  const [state, setState] = useState<StudyModeState>({
    selectedRegion: null,
    selectedDepartment: null,
    progress: {
      studiedCount: 0,
      totalCount: 32,
      regionProgress: {
        Andina: 0,
        Caribe: 0,
        Pacifica: 0,
        Orinoquia: 0,
        Amazonia: 0,
        Insular: 0
      },
      masteredDepartments: [],
      timeSpent: 0
    },
    showQuiz: false,
    quizScore: 0
  });

  const selectRegion = useCallback((region: StudyRegion) => {
    setState(prev => ({
      ...prev,
      selectedRegion: region,
      selectedDepartment: null
    }));
  }, []);

  const selectDepartment = useCallback((department: StudyDepartment) => {
    setState(prev => ({
      ...prev,
      selectedDepartment: department
    }));
  }, []);

  const markMastered = useCallback((departmentId: string) => {
    setState(prev => {
      const alreadyMastered = prev.progress.masteredDepartments.includes(departmentId);
      if (alreadyMastered) return prev;

      const newMasteredDepartments = [...prev.progress.masteredDepartments, departmentId];

      return {
        ...prev,
        progress: {
          ...prev.progress,
          studiedCount: newMasteredDepartments.length,
          masteredDepartments: newMasteredDepartments
        }
      };
    });
  }, []);

  const startQuiz = useCallback(() => {
    setState(prev => ({ ...prev, showQuiz: true }));
  }, []);

  const endQuiz = useCallback((score: number) => {
    setState(prev => ({
      ...prev,
      showQuiz: false,
      quizScore: score
    }));
  }, []);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => ({
        ...prev,
        progress: {
          ...prev.progress,
          timeSpent: prev.progress.timeSpent + 1
        }
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    state,
    selectRegion,
    selectDepartment,
    markMastered,
    startQuiz,
    endQuiz
  };
};

export const useStudyProgress = () => {
  const [progress, setProgress] = useState<StudyProgress>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('study-progress');
    return saved ? JSON.parse(saved) : {
      studiedCount: 0,
      totalCount: 32,
      regionProgress: {
        Andina: 0,
        Caribe: 0,
        Pacifica: 0,
        Orinoquia: 0,
        Amazonia: 0,
        Insular: 0
      },
      masteredDepartments: [],
      timeSpent: 0
    };
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('study-progress', JSON.stringify(progress));
  }, [progress]);

  return [progress, setProgress] as const;
};
```

#### Step 7.5: Create RegionSelector Component

Create `src/components/study-mode/RegionSelector.tsx`:

```typescript
// src/components/study-mode/RegionSelector.tsx
import React from 'react';
import { Card } from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import type { RegionSelectorProps } from './studyModeTypes';

const regionColors = {
  Andina: 'bg-blue-500',
  Caribe: 'bg-cyan-500',
  Pacifica: 'bg-emerald-500',
  Orinoquia: 'bg-amber-500',
  Amazonia: 'bg-green-600',
  Insular: 'bg-purple-500'
};

const regionDescriptions = {
  Andina: 'Cordillera de los Andes, 16 departamentos',
  Caribe: 'Costa Caribeña, 8 departamentos',
  Pacifica: 'Costa Pacífica, 6 departamentos',
  Orinoquia: 'Llanos Orientales, 4 departamentos',
  Amazonia: 'Selva Amazónica, 6 departamentos',
  Insular: 'Islas y Archipiélagos, 2 departamentos'
};

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  onRegionSelect,
  regionProgress
}) => {
  return (
    <div className="region-selector grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {(Object.keys(regionColors) as Array<keyof typeof regionColors>).map(region => {
        const isSelected = selectedRegion === region;
        const progress = regionProgress[region];

        return (
          <Card
            key={region}
            className={`
              cursor-pointer transition-all hover:shadow-lg
              ${isSelected ? 'ring-2 ring-blue-500' : ''}
            `}
            onClick={() => onRegionSelect(region)}
            data-testid={`region-card-${region.toLowerCase()}`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{region}</h3>
                <Badge variant="primary">
                  {Math.round(progress)}%
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {regionDescriptions[region]}
              </p>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${regionColors[region]} h-2 rounded-full transition-all`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
```

#### Step 7.6: Create DepartmentGrid Component

*(Similar detailed implementation for DepartmentGrid, StudyContentPanel, StudyProgressTracker - following same pattern)*

#### Step 7.7: Create Main Container (Orchestration)

Create `src/components/study-mode/StudyModeContainer.tsx`:

```typescript
// src/components/study-mode/StudyModeContainer.tsx
import React from 'react';
import { RegionSelector } from './RegionSelector';
import { DepartmentGrid } from './DepartmentGrid';
import { StudyContentPanel } from './StudyContentPanel';
import { StudyProgressTracker } from './StudyProgressTracker';
import { useStudyMode } from './studyModeHooks';
import { getDepartmentsByRegion } from '@/data/colombiaDepartments';

export const StudyModeContainer: React.FC = () => {
  const {
    state,
    selectRegion,
    selectDepartment,
    markMastered,
    startQuiz
  } = useStudyMode();

  const { selectedRegion, selectedDepartment, progress } = state;

  const departments = selectedRegion
    ? getDepartmentsByRegion(selectedRegion)
    : [];

  return (
    <div className="study-mode-container flex flex-col h-full">
      {/* Progress Tracker - Always visible */}
      <StudyProgressTracker progress={progress} />

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* Left: Region & Department Selection */}
        <div className="space-y-4">
          {!selectedRegion && (
            <RegionSelector
              selectedRegion={selectedRegion}
              onRegionSelect={selectRegion}
              regionProgress={progress.regionProgress}
            />
          )}

          {selectedRegion && !selectedDepartment && (
            <DepartmentGrid
              region={selectedRegion}
              departments={departments}
              onDepartmentSelect={selectDepartment}
              masteredDepartments={progress.masteredDepartments}
            />
          )}
        </div>

        {/* Right: Study Content Panel */}
        {selectedDepartment && (
          <StudyContentPanel
            department={selectedDepartment}
            onMarkMastered={markMastered}
            onStartQuiz={startQuiz}
          />
        )}
      </div>
    </div>
  );
};
```

#### Step 7.8: Migration & Testing

```bash
# Step 1: Backup original
cp src/components/StudyMode.tsx src/components/StudyMode.tsx.backup

# Step 2: Create new directory
mkdir -p src/components/study-mode

# Step 3: Run tests on new implementation
npm test -- src/components/study-mode/ --run

# Step 4: Update imports in parent components
grep -r "from '@/components/StudyMode'" src/
# Replace with: from '@/components/study-mode'

# Step 5: Verify no regressions
npm run test -- --run
npm run typecheck
npm run build

# Step 6: Remove backup if successful
rm src/components/StudyMode.tsx.backup
```

**Validation Checklist:**
- [ ] All 707 lines migrated to 6 files (<250 lines each)
- [ ] No TypeScript errors
- [ ] All tests passing
- [ ] Bundle size not increased
- [ ] No runtime errors
- [ ] Git commit: "refactor: split StudyMode into maintainable components"

---

### Components 2-7: Similar Refactoring Pattern

Following the exact same process for:

2. **OptimizedColombiaMap.tsx** (576 → 5 files)
   - `MapContainer.tsx`, `MapSVG.tsx`, `MapInteractionLayer.tsx`, `MapTooltip.tsx`, `mapUtils.ts`

3. **DepartmentTray.tsx** (570 → 5 files)
   - `DepartmentTrayContainer.tsx`, `DepartmentList.tsx`, `DepartmentCard.tsx`, `trayHooks.ts`, `trayTypes.ts`

4. **InteractiveTutorial.tsx** (531 → 6 files)
   - `TutorialContainer.tsx`, `TutorialStep.tsx`, `TutorialOverlay.tsx`, `TutorialProgress.tsx`, `tutorialSteps.ts`, `tutorialHooks.ts`

5. **GameContainer.tsx** (512 → 5 files)
   - `GameContainerOrchestrator.tsx`, `GameStateManager.tsx`, `GameLayout.tsx`, `GameModals.tsx`, `gameHooks.ts`

6. **PostGameReport.tsx** (674 test lines → 4 test files)
   - `PostGameReport.unit.test.tsx`, `PostGameReport.integration.test.tsx`, `PostGameReport.visual.test.tsx`, `PostGameReport.accessibility.test.tsx`

7. **AccessibilitySettings.tsx** (analyze + refactor)
   - Analyze line count, create refactoring plan

---

## Weeks 8-9: Type Safety Completion (M8)

### Day 18 (Monday Week 8): Type Migration Strategy

**Goal:** Create comprehensive plan for eliminating 83 `any` types

#### Step 8.1: Identify All `any` Usages

```bash
# Find all `any` type usages
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" > any-types-report.txt

# Count by file
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" | cut -d: -f1 | sort | uniq -c | sort -rn

# Expected output:
# 15 src/hooks/useDragHandlers.ts
# 12 src/services/keyboardManager.ts
# 10 src/components/GameContainer.tsx
# ...
```

#### Step 8.2: Create Type Migration Matrix

Create `docs/technical-specs/phase-2/type-migration-matrix.md`:

```markdown
# Type Migration Matrix - 83 `any` Types

## High Priority Files (>10 any types)

| File | Count | Complexity | Estimated Time | Dependencies |
|------|-------|------------|----------------|--------------|
| useDragHandlers.ts | 15 | High | 4h | @dnd-kit types |
| keyboardManager.ts | 12 | Medium | 3h | DOM events |
| GameContainer.tsx | 10 | High | 4h | Multiple contexts |

## Medium Priority (5-10 any types)

| File | Count | Complexity | Estimated Time |
|------|-------|------------|----------------|
| AuthService.ts | 8 | Medium | 2h |
| supabaseSync.ts | 7 | Low | 1.5h |

## Low Priority (<5 any types)

| File | Count | Complexity | Estimated Time |
|------|-------|------------|----------------|
| utils/nameNormalizer.ts | 3 | Low | 0.5h |
...

## Total: 83 any types → 45 atomic tasks → 35 hours effort
```

#### Step 8.3: Create Type Definition Files

Create `src/types/dnd-kit.extended.ts`:

```typescript
// src/types/dnd-kit.extended.ts
import type {
  DragStartEvent as BaseDragStartEvent,
  DragEndEvent as BaseDragEndEvent,
  DragMoveEvent as BaseDragMoveEvent
} from '@dnd-kit/core';

/**
 * Extended DragStartEvent with Colombia game-specific data
 */
export interface GameDragStartEvent extends BaseDragStartEvent {
  active: {
    id: string;
    data: {
      current: {
        departmentId: string;
        departmentName: string;
        region: string;
      };
    };
  };
}

/**
 * Extended DragEndEvent with placement result
 */
export interface GameDragEndEvent extends BaseDragEndEvent {
  active: {
    id: string;
    data: {
      current: {
        departmentId: string;
        departmentName: string;
        region: string;
      };
    };
  };
  over: {
    id: string;
    data: {
      current: {
        regionId: string;
        accepts: string[];
      };
    };
  } | null;
  delta: {
    x: number;
    y: number;
  };
}

/**
 * Type guard for GameDragStartEvent
 */
export function isGameDragStartEvent(event: BaseDragStartEvent): event is GameDragStartEvent {
  return (
    event.active?.data?.current !== undefined &&
    'departmentId' in event.active.data.current
  );
}

/**
 * Type guard for GameDragEndEvent
 */
export function isGameDragEndEvent(event: BaseDragEndEvent): event is GameDragEndEvent {
  return (
    event.active?.data?.current !== undefined &&
    'departmentId' in event.active.data.current &&
    (event.over === null || ('regionId' in event.over.data.current))
  );
}
```

#### Step 8.4: Migrate useDragHandlers (15 any → 0 any)

**Before (with 15 `any` types):**
```typescript
// src/hooks/useDragHandlers.ts (before)
export const useDragHandlers = () => {
  const handleDragStart = useCallback((event: any) => {  // any #1
    const departmentId = event.active.id as any;  // any #2
    const data = event.active.data.current as any;  // any #3
    // ... 12 more any types
  }, []);

  return { handleDragStart };
};
```

**After (with 0 `any` types):**
```typescript
// src/hooks/useDragHandlers.ts (after)
import type { GameDragStartEvent, GameDragEndEvent } from '@/types/dnd-kit.extended';
import { isGameDragStartEvent, isGameDragEndEvent } from '@/types/dnd-kit.extended';

export const useDragHandlers = () => {
  const handleDragStart = useCallback((event: GameDragStartEvent) => {
    // Type guard ensures proper types
    if (!isGameDragStartEvent(event)) {
      console.warn('Invalid drag start event', event);
      return;
    }

    const departmentId = event.active.id; // string (typed)
    const { departmentName, region } = event.active.data.current; // typed

    // All interactions now fully typed
  }, []);

  const handleDragEnd = useCallback((event: GameDragEndEvent) => {
    if (!isGameDragEndEvent(event)) {
      console.warn('Invalid drag end event', event);
      return;
    }

    const departmentId = event.active.data.current.departmentId;
    const regionId = event.over?.data.current.regionId ?? null;

    // Fully typed, no any
  }, []);

  return { handleDragStart, handleDragEnd };
};
```

**Validation:**
```bash
# Verify no any types remain
grep ": any" src/hooks/useDragHandlers.ts
# Expected: (no output)

# Verify TypeScript passes
npx tsc --noEmit src/hooks/useDragHandlers.ts

# Run tests
npm test -- src/tests/hooks/useDragHandlers.test.ts --run
```

---

### Day 19-24 (Week 8-9): Complete Remaining 44 Type Migration Tasks

Following the same pattern for all 83 `any` types:

- **Day 19:** keyboardManager.ts (12 any → 0 any)
- **Day 20:** GameContainer.tsx (10 any → 0 any)
- **Day 21:** AuthService.ts (8 any → 0 any)
- **Day 22:** supabaseSync.ts (7 any → 0 any)
- **Day 23:** Miscellaneous files (<5 any each)
- **Day 24:** Final validation & cleanup

#### Final Type Safety Validation

```bash
# Step 1: Verify zero any types
grep -rn ": any" src/ --include="*.ts" --include="*.tsx" | wc -l
# Expected: 0

# Step 2: Strict TypeScript check
npx tsc --noEmit --strict

# Step 3: Verify all tests pass
npm test -- --run

# Step 4: Generate type coverage report
npx type-coverage --detail

# Expected: 100% type coverage
```

---

## Phase 2 Completion Checklist

**Milestone 5: Mobile & Device Tests**
- [ ] 35 touch tests created and passing
- [ ] All viewport sizes tested (mobile/tablet/desktop)
- [ ] PWA touch interactions validated
- [ ] WCAG AAA touch targets (44x44px) compliant

**Milestone 6: Component Integration Tests**
- [ ] 50 integration test suites created
- [ ] All context providers tested
- [ ] Component interactions verified
- [ ] Event propagation tested

**Milestone 7: Component Refactoring**
- [ ] StudyMode.tsx: 707 → 6 files (<250 lines each)
- [ ] OptimizedColombiaMap.tsx: 576 → 5 files
- [ ] DepartmentTray.tsx: 570 → 5 files
- [ ] InteractiveTutorial.tsx: 531 → 6 files
- [ ] GameContainer.tsx: 512 → 5 files
- [ ] PostGameReport tests: 674 → 4 test files
- [ ] AccessibilitySettings.tsx refactored
- [ ] All 8 components maintainable (<250 lines/file)

**Milestone 8: Type Safety**
- [ ] 83 `any` types eliminated (100% → 0%)
- [ ] Type coverage: 100%
- [ ] All type guards implemented
- [ ] Extended type definitions created

**Overall Metrics:**
- [ ] Test pass rate: 914/914 (100%)
- [ ] Test coverage: 92%+
- [ ] TypeScript strict mode: passing
- [ ] Build time: <2 minutes
- [ ] Bundle size: <500KB gzipped

**Git Tags:**
```bash
git tag -a m5-mobile-tests-complete -m "M5: Mobile & Device Tests Complete"
git tag -a m6-integration-tests-complete -m "M6: Component Integration Tests Complete"
git tag -a m7-refactoring-complete -m "M7: Component Refactoring Complete"
git tag -a m8-type-safety-complete -m "M8: Type Safety Complete"
git tag -a phase-2-complete -m "Phase 2: Test Infrastructure & Architecture Complete"
git push origin --tags
```

---

## Phase 2 Summary

**Total Duration:** 6 weeks (30 working days)
**Total Tasks:** 185 atomic tasks
**Total Lines Changed:** ~25,000 (additions + modifications)
**Test Coverage:** 59% → 92% (+33%)
**Test Pass Rate:** 180/914 → 914/914 (100%)
**Type Safety:** 83 any → 0 any (100%)
**Component Maintainability:** 8 files >500 lines → 46 files <250 lines

**Critical Path:** M5 → M6 → M7 → M8 (sequential dependencies)
**Parallelization Opportunities:** 40% of tasks can run in parallel

**Risk Mitigation:**
- All tasks have rollback procedures
- Incremental validation at each checkpoint
- No breaking changes to public APIs
- Feature flags for gradual rollout

**Ready for Phase 3: Production Hardening** ✅
