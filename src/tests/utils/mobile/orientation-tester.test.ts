/**
 * Tests for OrientationTester
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { OrientationTester, type Orientation } from './orientation-tester';

describe('OrientationTester', () => {
  let tester: OrientationTester;
  let originalWidth: number;
  let originalHeight: number;
  let orientationHandler: ReturnType<typeof vi.fn>;
  let resizeHandler: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    originalWidth = window.innerWidth;
    originalHeight = window.innerHeight;

    // Set initial dimensions to portrait
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });

    tester = new OrientationTester();
    orientationHandler = vi.fn();
    resizeHandler = vi.fn();

    window.addEventListener('orientationchange', orientationHandler);
    window.addEventListener('resize', resizeHandler);
  });

  afterEach(() => {
    tester.resetOrientation();
    window.removeEventListener('orientationchange', orientationHandler);
    window.removeEventListener('resize', resizeHandler);

    // Restore original dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalWidth,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalHeight,
    });
  });

  describe('getOrientation', () => {
    it('should detect portrait orientation', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });

      expect(tester.getOrientation()).toBe('portrait');
    });

    it('should detect landscape orientation', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 667,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 375,
      });

      expect(tester.getOrientation()).toBe('landscape');
    });

    it('should treat square as landscape', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 500,
      });

      expect(tester.getOrientation()).toBe('landscape');
    });
  });

  describe('simulateOrientationChange', () => {
    it('should change from portrait to landscape', () => {
      const initialWidth = window.innerWidth;
      const initialHeight = window.innerHeight;

      tester.simulateOrientationChange('landscape');

      expect(window.innerWidth).toBe(initialHeight);
      expect(window.innerHeight).toBe(initialWidth);
      expect(tester.getOrientation()).toBe('landscape');
    });

    it('should change from landscape to portrait', () => {
      // Start in landscape
      tester.simulateOrientationChange('landscape');

      const initialWidth = window.innerWidth;
      const initialHeight = window.innerHeight;

      tester.simulateOrientationChange('portrait');

      expect(window.innerWidth).toBe(initialHeight);
      expect(window.innerHeight).toBe(initialWidth);
      expect(tester.getOrientation()).toBe('portrait');
    });

    it('should trigger orientationchange event', () => {
      tester.simulateOrientationChange('landscape');

      expect(orientationHandler).toHaveBeenCalled();
    });

    it('should trigger resize event', () => {
      resizeHandler.mockClear();

      tester.simulateOrientationChange('landscape');

      expect(resizeHandler).toHaveBeenCalled();
    });

    it('should not swap dimensions if already in target orientation', () => {
      tester.simulateOrientationChange('portrait');

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Already in portrait, should not swap
      tester.simulateOrientationChange('portrait');

      expect(window.innerWidth).toBe(width);
      expect(window.innerHeight).toBe(height);
    });
  });

  describe('swapDimensions', () => {
    it('should swap width and height', () => {
      const initialWidth = window.innerWidth;
      const initialHeight = window.innerHeight;

      tester.swapDimensions();

      expect(window.innerWidth).toBe(initialHeight);
      expect(window.innerHeight).toBe(initialWidth);
    });
  });

  describe('testOrientationTransition', () => {
    it('should transition from portrait to landscape', async () => {
      const callback = vi.fn();

      await tester.testOrientationTransition('portrait', 'landscape', callback);

      expect(callback).toHaveBeenCalledTimes(2); // Once before, once after
      expect(tester.getOrientation()).toBe('landscape');
    });

    it('should transition from landscape to portrait', async () => {
      const callback = vi.fn();

      await tester.testOrientationTransition('landscape', 'portrait', callback);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(tester.getOrientation()).toBe('portrait');
    });

    it('should have delay between transitions', async () => {
      const timings: number[] = [];
      const callback = () => timings.push(Date.now());

      await tester.testOrientationTransition('portrait', 'landscape', callback);

      expect(timings.length).toBe(2);
      expect(timings[1] - timings[0]).toBeGreaterThanOrEqual(50);
    });
  });

  describe('getAspectRatio', () => {
    it('should calculate aspect ratio correctly', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920,
      });

      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1080,
      });

      const ratio = tester.getAspectRatio();

      expect(ratio).toBeCloseTo(16 / 9, 2);
    });

    it('should return different ratios for different orientations', () => {
      tester.simulateOrientationChange('portrait');
      const portraitRatio = tester.getAspectRatio();

      tester.simulateOrientationChange('landscape');
      const landscapeRatio = tester.getAspectRatio();

      expect(portraitRatio).not.toBe(landscapeRatio);
      expect(portraitRatio).toBeCloseTo(1 / landscapeRatio, 2);
    });
  });

  describe('isPortrait and isLandscape', () => {
    it('should correctly identify portrait', () => {
      tester.simulateOrientationChange('portrait');

      expect(tester.isPortrait()).toBe(true);
      expect(tester.isLandscape()).toBe(false);
    });

    it('should correctly identify landscape', () => {
      tester.simulateOrientationChange('landscape');

      expect(tester.isPortrait()).toBe(false);
      expect(tester.isLandscape()).toBe(true);
    });
  });

  describe('testAllOrientations', () => {
    it('should test both portrait and landscape', async () => {
      const orientations: Orientation[] = [];

      await tester.testAllOrientations(async orientation => {
        orientations.push(orientation);
      });

      expect(orientations).toContain('portrait');
      expect(orientations).toContain('landscape');
      expect(orientations.length).toBe(2);
    });

    it('should reset orientation after testing', async () => {
      await tester.testAllOrientations(async () => {});

      // Should be back to original state
      expect(window.innerWidth).toBe(375);
      expect(window.innerHeight).toBe(667);
    });
  });

  describe('simulateRotation', () => {
    it('should simulate rotation with timing', async () => {
      const startTime = Date.now();

      await tester.simulateRotation('portrait', 'landscape', 200);

      const duration = Date.now() - startTime;

      expect(duration).toBeGreaterThanOrEqual(200);
      expect(tester.getOrientation()).toBe('landscape');
    });

    it('should trigger events during rotation', async () => {
      resizeHandler.mockClear();

      await tester.simulateRotation('portrait', 'landscape', 100);

      // Should have multiple resize events
      expect(resizeHandler.mock.calls.length).toBeGreaterThan(1);
    });
  });

  describe('resetOrientation', () => {
    it('should restore original orientation', () => {
      tester.simulateOrientationChange('landscape');
      tester.resetOrientation();

      expect(window.innerWidth).toBe(375);
      expect(window.innerHeight).toBe(667);
    });

    it('should trigger resize event on reset', () => {
      resizeHandler.mockClear();

      tester.simulateOrientationChange('landscape');
      resizeHandler.mockClear();

      tester.resetOrientation();

      expect(resizeHandler).toHaveBeenCalled();
    });
  });

  describe('supportsOrientationAPI', () => {
    it('should check for orientation API support', () => {
      const supported = tester.supportsOrientationAPI();

      expect(typeof supported).toBe('boolean');
    });
  });

  describe('getOrientationAngle', () => {
    it('should return 0 for portrait', () => {
      tester.simulateOrientationChange('portrait');

      const angle = tester.getOrientationAngle();

      expect(angle).toBe(0);
    });

    it('should return 90 for landscape', () => {
      tester.simulateOrientationChange('landscape');

      const angle = tester.getOrientationAngle();

      expect(angle).toBe(90);
    });
  });
});
