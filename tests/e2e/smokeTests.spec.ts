import { test, expect } from '@playwright/test';

/**
 * Smoke Tests - Critical App Health
 *
 * CONCEPT: Fast tests that verify app doesn't crash
 * WHY: Catch catastrophic failures quickly
 * PATTERN: Minimal interaction, maximum coverage
 *
 * COVERAGE: This tests:
 * - App loads
 * - No console errors
 * - Critical elements render
 * - Basic interactions work
 */

test.describe('Smoke Tests', () => {
  test('app should load without errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify no critical errors
    const hasCriticalErrors = errors.some(e =>
      !e.includes('DevTools') && // Ignore DevTools warnings
      !e.includes('Download') && // Ignore download warnings
      !e.includes('deprecated') // Ignore deprecation warnings
    );

    expect(hasCriticalErrors).toBe(false);
  });

  test('should render all critical UI elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify map area exists
    const map = page.locator('svg').or(page.locator('canvas')).or(page.locator('[data-testid="map"]'));
    await expect(map.first()).toBeVisible({ timeout: 5000 });

    // Verify department tray exists
    const departments = page.locator('[data-department-id]');
    await expect(departments.first()).toBeVisible({ timeout: 5000 });

    // Verify score display
    await expect(page.getByText(/score/i).or(page.getByText(/puntos/i))).toBeVisible();
  });

  test('should respond to user interactions without crashing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try various interactions
    await page.keyboard.press('Tab');
    await page.waitForTimeout(100);

    await page.keyboard.press('?'); // Help
    await page.waitForTimeout(100);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);

    // Click somewhere on the page
    await page.click('body');
    await page.waitForTimeout(100);

    // Verify app is still responsive
    await expect(page.locator('body')).toBeVisible();
  });

  test('should work on different viewport sizes', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await expect(page.locator('body')).toBeVisible();

    // Mobile (should show mobile banner)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await expect(page.locator('body')).toBeVisible();
  });

  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should load in under 10 seconds (generous)
    expect(loadTime).toBeLessThan(10000);
  });
});
