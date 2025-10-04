import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * Keyboard Manager Service Tests
 *
 * CONCEPT: Tests for keyboard shortcut management
 * WHY: Ensures keyboard accessibility works correctly
 * PATTERN: Event-driven testing with custom event dispatch
 */

// Note: keyboardManager is exported as a singleton instance
import { keyboardManager } from '../../services/keyboardManager';

describe('keyboardManager Service', () => {
  let eventListeners: Map<string, Function>;

  beforeEach(() => {
    eventListeners = new Map();

    // Mock addEventListener to capture listeners
    vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      eventListeners.set(event, handler as Function);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should export a singleton instance', () => {
      expect(keyboardManager).toBeDefined();
      expect(typeof keyboardManager.getShortcuts).toBe('function');
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('should have navigation shortcuts', () => {
      const shortcuts = keyboardManager.getShortcuts();
      const navShortcuts = shortcuts.filter((s: any) => s.category === 'navigation');

      expect(navShortcuts.length).toBeGreaterThan(0);
      expect(navShortcuts.some((s: any) => s.key === 'Tab')).toBe(true);
      expect(navShortcuts.some((s: any) => s.key === 'Enter')).toBe(true);
      expect(navShortcuts.some((s: any) => s.key === 'Escape')).toBe(true);
    });

    it('should have game control shortcuts', () => {
      const shortcuts = keyboardManager.getShortcuts();
      const gameShortcuts = shortcuts.filter((s: any) => s.category === 'game');

      expect(gameShortcuts.some((s: any) => s.action === 'pause')).toBe(true);
      expect(gameShortcuts.some((s: any) => s.action === 'restart')).toBe(true);
      expect(gameShortcuts.some((s: any) => s.action === 'hint')).toBe(true);
    });

    it('should have accessibility shortcuts', () => {
      const shortcuts = keyboardManager.getShortcuts();
      const a11yShortcuts = shortcuts.filter((s: any) => s.category === 'accessibility');

      expect(a11yShortcuts.length).toBeGreaterThan(0);
    });

    it('should have arrow key movement shortcuts', () => {
      const shortcuts = keyboardManager.getShortcuts();

      expect(shortcuts.some((s: any) => s.key === 'ArrowUp')).toBe(true);
      expect(shortcuts.some((s: any) => s.key === 'ArrowDown')).toBe(true);
      expect(shortcuts.some((s: any) => s.key === 'ArrowLeft')).toBe(true);
      expect(shortcuts.some((s: any) => s.key === 'ArrowRight')).toBe(true);
    });

    it('should have region quick access shortcuts (1-6)', () => {
      const shortcuts = keyboardManager.getShortcuts();

      for (let i = 1; i <= 6; i++) {
        expect(shortcuts.some((s: any) => s.key === i.toString() && s.action === `region-${i}`)).toBe(true);
      }
    });
  });

  describe('Shortcut Matching', () => {
    it('should match shortcuts with modifier keys', () => {
      const shortcuts = keyboardManager.getShortcuts();
      const shiftTab = shortcuts.find((s: any) => s.key === 'Tab' && s.shiftKey);

      expect(shiftTab).toBeDefined();
      expect(shiftTab?.action).toBe('navigate-backward');
    });

    it('should match shortcuts by key', () => {
      const shortcuts = keyboardManager.getShortcuts();

      // Test various key matches
      const enterShortcut = shortcuts.find((s: any) => s.key === 'Enter');
      expect(enterShortcut).toBeDefined();
      expect(enterShortcut?.action).toBe('select');

      const escapeShortcut = shortcuts.find((s: any) => s.key === 'Escape');
      expect(escapeShortcut).toBeDefined();
      expect(escapeShortcut?.action).toBe('cancel');
    });
  });

  describe('Shortcut Retrieval', () => {
    it('should get shortcuts by category', () => {
      const gameShortcuts = keyboardManager.getShortcutsByCategory('game');
      expect(gameShortcuts.every((s: any) => s.category === 'game')).toBe(true);

      const navShortcuts = keyboardManager.getShortcutsByCategory('navigation');
      expect(navShortcuts.every((s: any) => s.category === 'navigation')).toBe(true);
    });

    it('should get all shortcuts', () => {
      const allShortcuts = keyboardManager.getShortcuts();
      expect(allShortcuts.length).toBeGreaterThan(20); // We have many shortcuts
    });
  });
});
