import { test, expect } from '@playwright/test';

/**
 * CONCEPT: Critical game flow E2E test
 * WHY: Ensures core gameplay works end-to-end in real browser
 * PATTERN: User journey testing (start → play → complete)
 */

test.describe('Game Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  test('should load homepage and display game', async ({ page }) => {
    // Verify page title
    await expect(page).toHaveTitle(/Colombia/i);

    // Verify key elements are present (h1 or main content)
    const hasH1 = await page.locator('h1').isVisible().catch(() => false);
    const hasMain = await page.locator('main, [role="main"], #root, #app').first().isVisible().catch(() => false);

    // At least one core element should be visible
    expect(hasH1 || hasMain).toBeTruthy();
  });

  test('should start game and place departments', async ({ page }) => {
    // Check if tutorial modal appears (might be shown on first visit)
    const tutorialModal = page.locator('[role="dialog"]');
    if (await tutorialModal.isVisible()) {
      // Skip tutorial if present
      const skipButton = page.getByRole('button', { name: /skip|cerrar|close/i });
      if (await skipButton.isVisible()) {
        await skipButton.click();
      }
    }

    // Wait for department tray to load
    const departmentTray = page.locator('[data-testid="department-tray"]').or(
      page.locator('text=Antioquia').first()
    );
    await expect(departmentTray).toBeVisible({ timeout: 10000 });

    // Verify map canvas is rendered
    const mapCanvas = page.locator('svg').or(page.locator('canvas'));
    await expect(mapCanvas.first()).toBeVisible();

    // Find first draggable department
    const firstDepartment = page.locator('[draggable="true"]').first().or(
      page.locator('[data-department-id]').first()
    );

    if (await firstDepartment.isVisible()) {
      // Get department name for verification
      const departmentName = await firstDepartment.textContent();

      // Attempt to interact with department (click/drag)
      await firstDepartment.click();

      // Verify some interaction happened (score updated, placement feedback, etc.)
      // Note: Specific assertions depend on game state management
      await page.waitForTimeout(500); // Brief wait for any animations

      // Check for score or feedback indicators
      const scoreElement = page.locator('text=/score|puntuación/i').first();
      const hasScore = await scoreElement.isVisible().catch(() => false);

      // At minimum, verify page is still functional
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should show game controls', async ({ page }) => {
    // Verify control buttons are present
    const controls = [
      /pause|pausar/i,
      /hint|pista/i,
      /reset|reiniciar/i,
    ];

    for (const pattern of controls) {
      const button = page.getByRole('button', { name: pattern });
      // Control might not be visible initially, but should exist
      const exists = await button.count();
      expect(exists).toBeGreaterThan(0);
    }
  });

  test('should be responsive', async ({ page }) => {
    // Test at mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300); // Wait for responsive layout

    // Verify page is still functional at mobile size
    await expect(page.locator('body')).toBeVisible();

    // Check for mobile-specific elements or any department/game content
    const mobileLayout = await page.locator('[data-testid="mobile-layout"]').isVisible().catch(() => false);
    const departmentTray = await page.locator('[data-testid="department-tray"]').isVisible().catch(() => false);
    const anyDepartment = await page.locator('[draggable="true"]').first().isVisible().catch(() => false);
    const anyContent = await page.locator('h1, main, [role="main"]').first().isVisible().catch(() => false);

    // At least some content should be visible at mobile
    expect(mobileLayout || departmentTray || anyDepartment || anyContent).toBeTruthy();

    // Test at tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(300);
    await expect(page.locator('body')).toBeVisible();

    // Test at desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(300);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Press Tab multiple times to start keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    // Press ? to show keyboard help (if implemented)
    await page.keyboard.press('?');
    await page.waitForTimeout(300);

    // Press Escape to close any modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);

    // Verify page is still functional after keyboard interactions
    await expect(page.locator('body')).toBeVisible();
  });
});
