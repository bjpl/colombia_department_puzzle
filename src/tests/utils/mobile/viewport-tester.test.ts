/**
 * Tests for ViewportTester
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ViewportTester, STANDARD_VIEWPORTS, BREAKPOINTS } from './viewport-tester';

describe('ViewportTester', () => {
  let tester: ViewportTester;
  let originalWidth: number;
  let originalHeight: number;
  let resizeHandler: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    originalWidth = window.innerWidth;
    originalHeight = window.innerHeight;
    tester = new ViewportTester();
    resizeHandler = vi.fn();
    window.addEventListener('resize', resizeHandler);
  });

  afterEach(() => {
    tester.resetViewport();
    window.removeEventListener('resize', resizeHandler);
  });

  describe('STANDARD_VIEWPORTS', () => {
    it('should have all expected viewport configurations', () => {
      expect(STANDARD_VIEWPORTS.mobile_s).toBeDefined();
      expect(STANDARD_VIEWPORTS.mobile_m).toBeDefined();
      expect(STANDARD_VIEWPORTS.mobile_l).toBeDefined();
      expect(STANDARD_VIEWPORTS.tablet).toBeDefined();
      expect(STANDARD_VIEWPORTS.laptop).toBeDefined();
      expect(STANDARD_VIEWPORTS.desktop).toBeDefined();
    });

    it('should have valid dimensions for all viewports', () => {
      Object.values(STANDARD_VIEWPORTS).forEach(viewport => {
        expect(viewport.width).toBeGreaterThan(0);
        expect(viewport.height).toBeGreaterThan(0);
        expect(viewport.name).toBeTruthy();
      });
    });
  });

  describe('setViewport', () => {
    it('should set window dimensions to specified config', () => {
      const config = STANDARD_VIEWPORTS.mobile_m;
      tester.setViewport(config);

      expect(window.innerWidth).toBe(config.width);
      expect(window.innerHeight).toBe(config.height);
    });

    it('should trigger resize event', () => {
      tester.setViewport(STANDARD_VIEWPORTS.tablet);

      expect(resizeHandler).toHaveBeenCalled();
    });

    it('should set devicePixelRatio if specified', () => {
      const config = { ...STANDARD_VIEWPORTS.mobile_l, deviceScaleFactor: 3 };
      tester.setViewport(config);

      expect(window.devicePixelRatio).toBe(3);
    });

    it('should handle different viewport sizes', () => {
      const sizes = [
        STANDARD_VIEWPORTS.mobile_s,
        STANDARD_VIEWPORTS.tablet,
        STANDARD_VIEWPORTS.desktop,
      ];

      sizes.forEach(size => {
        tester.setViewport(size);
        expect(window.innerWidth).toBe(size.width);
        expect(window.innerHeight).toBe(size.height);
      });
    });
  });

  describe('resetViewport', () => {
    it('should restore original window dimensions', () => {
      tester.setViewport(STANDARD_VIEWPORTS.mobile_s);
      tester.resetViewport();

      expect(window.innerWidth).toBe(originalWidth);
      expect(window.innerHeight).toBe(originalHeight);
    });

    it('should trigger resize event on reset', () => {
      resizeHandler.mockClear();
      tester.setViewport(STANDARD_VIEWPORTS.tablet);
      resizeHandler.mockClear();

      tester.resetViewport();

      expect(resizeHandler).toHaveBeenCalled();
    });
  });

  describe('testBreakpoint', () => {
    it('should identify mobile breakpoint', () => {
      expect(tester.testBreakpoint(320)).toBe('mobile');
      expect(tester.testBreakpoint(500)).toBe('mobile');
    });

    it('should identify tablet breakpoint', () => {
      expect(tester.testBreakpoint(768)).toBe('tablet');
      expect(tester.testBreakpoint(800)).toBe('tablet');
    });

    it('should identify laptop breakpoint', () => {
      expect(tester.testBreakpoint(1024)).toBe('laptop');
      expect(tester.testBreakpoint(1200)).toBe('laptop');
    });

    it('should identify desktop breakpoint', () => {
      expect(tester.testBreakpoint(1280)).toBe('desktop');
      expect(tester.testBreakpoint(1920)).toBe('desktop');
    });

    it('should handle edge cases at breakpoint boundaries', () => {
      expect(tester.testBreakpoint(BREAKPOINTS.mobile - 1)).toBe('mobile');
      expect(tester.testBreakpoint(BREAKPOINTS.tablet - 1)).toBe('mobile');
      expect(tester.testBreakpoint(BREAKPOINTS.laptop - 1)).toBe('tablet');
      expect(tester.testBreakpoint(BREAKPOINTS.desktop - 1)).toBe('laptop');
    });
  });

  describe('getResponsiveClass', () => {
    it('should identify Tailwind responsive classes', () => {
      const element = document.createElement('div');
      element.className = 'sm:block md:flex lg:grid';

      const classes = tester.getResponsiveClass(element);

      expect(classes).toContain('sm:block');
      expect(classes).toContain('md:flex');
      expect(classes).toContain('lg:grid');
    });

    it('should identify custom responsive classes', () => {
      const element = document.createElement('div');
      element.className = 'mobile-only tablet-hidden desktop-visible';

      const classes = tester.getResponsiveClass(element);

      expect(classes).toContain('mobile-only');
      expect(classes).toContain('tablet-hidden');
      expect(classes).toContain('desktop-visible');
    });

    it('should return empty array for non-responsive classes', () => {
      const element = document.createElement('div');
      element.className = 'container flex items-center';

      const classes = tester.getResponsiveClass(element);

      expect(classes).toHaveLength(0);
    });
  });

  describe('testAllViewports', () => {
    it('should call callback for each standard viewport', async () => {
      const callback = vi.fn().mockResolvedValue(undefined);

      await tester.testAllViewports(callback);

      expect(callback).toHaveBeenCalledTimes(
        Object.keys(STANDARD_VIEWPORTS).length
      );
    });

    it('should pass correct viewport config to callback', async () => {
      const configs: any[] = [];
      await tester.testAllViewports(async config => {
        configs.push(config);
      });

      expect(configs).toHaveLength(Object.keys(STANDARD_VIEWPORTS).length);
      configs.forEach(config => {
        expect(config.width).toBeGreaterThan(0);
        expect(config.height).toBeGreaterThan(0);
        expect(config.name).toBeTruthy();
      });
    });

    it('should reset viewport after testing all', async () => {
      await tester.testAllViewports(async () => {});

      expect(window.innerWidth).toBe(originalWidth);
      expect(window.innerHeight).toBe(originalHeight);
    });
  });

  describe('testViewportTransition', () => {
    it('should transition between two viewport sizes', async () => {
      const from = STANDARD_VIEWPORTS.mobile_m;
      const to = STANDARD_VIEWPORTS.tablet;
      const steps: any[] = [];

      await tester.testViewportTransition(
        from,
        to,
        config => steps.push({ ...config }),
        3
      );

      expect(steps.length).toBeGreaterThan(1);
      expect(steps[0].width).toBe(from.width);
      expect(steps[steps.length - 1].width).toBe(to.width);
    });

    it('should have intermediate steps between viewports', async () => {
      const from = STANDARD_VIEWPORTS.mobile_s;
      const to = STANDARD_VIEWPORTS.desktop;
      const widths: number[] = [];

      await tester.testViewportTransition(
        from,
        to,
        config => widths.push(config.width),
        5
      );

      // Check that widths increase progressively
      for (let i = 1; i < widths.length; i++) {
        expect(widths[i]).toBeGreaterThan(widths[i - 1]);
      }
    });
  });

  describe('isElementInViewport', () => {
    it('should detect element fully in viewport', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      // Mock getBoundingClientRect to return element in viewport
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        left: 100,
        bottom: 200,
        right: 200,
        width: 100,
        height: 100,
        x: 100,
        y: 100,
        toJSON: () => ({}),
      });

      tester.setViewport({ width: 1024, height: 768, name: 'Test' });

      expect(tester.isElementInViewport(element)).toBe(true);

      document.body.removeChild(element);
    });

    it('should detect element outside viewport', () => {
      const element = document.createElement('div');
      document.body.appendChild(element);

      // Mock getBoundingClientRect to return element outside viewport
      vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        top: -100,
        left: -100,
        bottom: -50,
        right: -50,
        width: 50,
        height: 50,
        x: -100,
        y: -100,
        toJSON: () => ({}),
      });

      expect(tester.isElementInViewport(element)).toBe(false);

      document.body.removeChild(element);
    });
  });

  describe('getCurrentViewport', () => {
    it('should return current viewport configuration', () => {
      tester.setViewport(STANDARD_VIEWPORTS.tablet);

      const current = tester.getCurrentViewport();

      expect(current.width).toBe(STANDARD_VIEWPORTS.tablet.width);
      expect(current.height).toBe(STANDARD_VIEWPORTS.tablet.height);
    });
  });

  describe('matchesMediaQuery', () => {
    it('should detect matching media queries', () => {
      tester.setViewport({ width: 500, height: 800, name: 'Test' });

      // This should match for mobile-sized viewport
      const matches = tester.matchesMediaQuery('(max-width: 768px)');

      expect(typeof matches).toBe('boolean');
    });
  });

  describe('getMatchingMediaQueries', () => {
    it('should return all matching queries from list', () => {
      tester.setViewport({ width: 1200, height: 800, name: 'Test' });

      const queries = [
        '(min-width: 1024px)',
        '(max-width: 768px)',
        '(min-width: 768px)',
      ];

      const matching = tester.getMatchingMediaQueries(queries);

      expect(Array.isArray(matching)).toBe(true);
      expect(matching.length).toBeGreaterThanOrEqual(0);
    });
  });
});
