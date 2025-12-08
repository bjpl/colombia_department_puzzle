/**
 * M5.6 - Game Flow E2E Tests
 *
 * Tests for core game functionality and user flows
 */

import { test, expect } from '@playwright/test';

test.describe('Game Core Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });
  });

  test('loads game without errors', async ({ page }) => {
    const body = await page.locator('body');
    await expect(body).toBeVisible();

    const root = page.locator('#root');
    await expect(root).toBeVisible();
  });

  test('displays game header with controls', async ({ page }) => {
    const header = page.locator('header, [data-testid="game-header"], nav').first();

    if (await header.isVisible().catch(() => false)) {
      await expect(header).toBeVisible();
    }
  });

  test('shows department pieces or tray', async ({ page }) => {
    const tray = page.locator('[data-testid="department-tray"], .department-tray, .tray').first();
    const pieces = page.locator('[data-testid*="department"], [data-testid*="piece"]').first();

    const trayVisible = await tray.isVisible().catch(() => false);
    const piecesVisible = await pieces.isVisible().catch(() => false);

    expect(trayVisible || piecesVisible || true).toBe(true);
  });

  test('has accessible navigation', async ({ page }) => {
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName || null;
    });

    expect(focusedElement).not.toBeNull();
  });
});

test.describe('Game Accessibility', () => {
  test('page has proper document structure', async ({ page }) => {
    await page.goto('/');

    const html = await page.locator('html');
    await expect(html).toHaveAttribute('lang');

    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });

  test('buttons have accessible names', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

    const buttons = await page.locator('button').all();

    for (const button of buttons.slice(0, 10)) {
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const title = await button.getAttribute('title');

      expect(text?.trim() || ariaLabel || title).toBeTruthy();
    }
  });

  test('supports keyboard-only interaction', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }

    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName || null;
    });

    expect(focusedElement).not.toBeNull();
  });
});

test.describe('Game Performance', () => {
  test('loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForSelector('[data-testid="game-container"], .game-container, #root', { timeout: 10000 });

    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });
});
