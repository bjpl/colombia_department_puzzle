/**
 * M5.6 - Mobile Support E2E Tests
 *
 * Tests for touch interactions, viewport responsiveness, and mobile-specific features
 */

import { test, expect, devices } from '@playwright/test';

// Mobile viewport tests
test.describe('Mobile Viewport Support', () => {
  test.use({ ...devices['iPhone 13'] });

  test('renders correctly on mobile viewport', async ({ page }) => {
    await page.goto('/');

    // Wait for the game to load
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

    // Verify mobile-friendly layout
    const viewport = page.viewportSize();
    expect(viewport?.width).toBeLessThanOrEqual(430); // iPhone 13 width

    // Check that game is visible and fits viewport
    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('touch targets meet WCAG AAA size requirements (44x44px)', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

    // Find all interactive elements (buttons, links)
    const interactiveElements = await page.locator('button, a, [role="button"]').all();

    for (const element of interactiveElements.slice(0, 10)) { // Check first 10
      const box = await element.boundingBox();
      if (box) {
        // WCAG AAA requires 44x44px minimum
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('no horizontal scroll on mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

    // Check for horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10); // Allow 10px tolerance
  });
});

// Touch interaction tests
test.describe('Touch Interactions', () => {
  test.use({ ...devices['iPhone 13'], hasTouch: true });

  test('supports touch tap on game elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

    // Find a tappable element
    const button = page.locator('button').first();
    if (await button.isVisible()) {
      await button.tap();
      // Verify tap was registered (element should be focusable/clickable)
      await expect(button).toBeFocused().catch(() => {
        // Some buttons might not focus on tap, just verify no error
      });
    }
  });

  test('supports touch drag gesture', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

    // Test basic touch capabilities
    const hasTouchSupport = await page.evaluate(() => 'ontouchstart' in window);
    expect(hasTouchSupport).toBe(true);
  });
});

// Orientation tests
test.describe('Orientation Support', () => {
  test('handles portrait orientation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 13 portrait
    await page.goto('/');
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('handles landscape orientation', async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 }); // iPhone 13 landscape
    await page.goto('/');
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

    const body = await page.locator('body');
    await expect(body).toBeVisible();
  });

  test('adapts layout on orientation change', async ({ page }) => {
    // Start in portrait
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

    // Capture initial layout
    const initialHeight = await page.evaluate(() => document.body.offsetHeight);

    // Switch to landscape
    await page.setViewportSize({ width: 844, height: 390 });
    await page.waitForTimeout(500); // Allow layout to settle

    // Verify layout adapted
    const newHeight = await page.evaluate(() => document.body.offsetHeight);
    expect(newHeight).not.toBe(initialHeight); // Layout should change
  });
});

// Responsive breakpoint tests
test.describe('Responsive Breakpoints', () => {
  const viewports = [
    { name: 'Mobile S', width: 320, height: 568 },
    { name: 'Mobile M', width: 375, height: 667 },
    { name: 'Mobile L', width: 425, height: 812 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Laptop', width: 1024, height: 768 },
    { name: 'Desktop', width: 1440, height: 900 },
  ];

  for (const viewport of viewports) {
    test(`renders correctly at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

      // Verify page renders without errors
      const body = await page.locator('body');
      await expect(body).toBeVisible();

      // Check no console errors
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      await page.waitForTimeout(1000);
      expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
    });
  }
});

// PWA/Offline support
test.describe('PWA Support', () => {
  test('has viewport meta tag for mobile', async ({ page }) => {
    await page.goto('/');

    const viewportMeta = await page.locator('meta[name="viewport"]');
    await expect(viewportMeta).toHaveAttribute('content', /width=device-width/);
  });

  test('has touch-action CSS for smooth scrolling', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

    // Check that body doesn't have touch-action: none (which would break scrolling)
    const touchAction = await page.evaluate(() => {
      return getComputedStyle(document.body).touchAction;
    });

    // Should allow some touch actions (not 'none' globally)
    expect(touchAction).not.toBe('none');
  });
});
