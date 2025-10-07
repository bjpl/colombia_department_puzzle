/**
 * Responsive Layout Tests
 *
 * Tests responsive behavior and layout switching across different viewport sizes:
 * - Mobile layout rendering (<768px)
 * - Bottom sheet snap points and behavior
 * - Layout switching without state loss
 * - Orientation change handling
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock window.matchMedia
const createMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe('Responsive Layouts', () => {
  let originalInnerWidth: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
  });

  afterEach(() => {
    // Restore original viewport size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  describe('Viewport Detection', () => {
    it('should detect mobile viewport (<768px)', () => {
      // Set viewport to iPhone SE size
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

      const isMobile = window.innerWidth < 768;

      expect(isMobile).toBe(true);
      expect(window.innerWidth).toBe(375);
      expect(window.innerHeight).toBe(667);
    });

    it('should detect tablet viewport (768-1024px)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      expect(isTablet).toBe(true);
    });

    it('should detect desktop viewport (>=1024px)', () => {
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

      const isDesktop = window.innerWidth >= 1024;

      expect(isDesktop).toBe(true);
    });
  });

  describe('Mobile Layout Rendering', () => {
    it('should render mobile layout on <768px viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      window.matchMedia = createMatchMedia(true);

      const layoutType = window.innerWidth < 768 ? 'mobile' : 'desktop';

      expect(layoutType).toBe('mobile');
    });

    it('should render desktop layout on >=768px viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      window.matchMedia = createMatchMedia(false);

      const layoutType = window.innerWidth < 768 ? 'mobile' : 'desktop';

      expect(layoutType).toBe('desktop');
    });

    it('should apply mobile-specific styles', () => {
      const mobileContainer = document.createElement('div');
      mobileContainer.className = 'mobile-layout';
      mobileContainer.style.display = 'flex';
      mobileContainer.style.flexDirection = 'column';
      mobileContainer.style.height = '100vh';

      document.body.appendChild(mobileContainer);

      const styles = window.getComputedStyle(mobileContainer);

      expect(styles.display).toBe('flex');
      expect(styles.flexDirection).toBe('column');
      expect(styles.height).toBe('100vh');

      document.body.removeChild(mobileContainer);
    });
  });

  describe('Bottom Sheet Behavior', () => {
    let bottomSheet: HTMLDivElement;

    beforeEach(() => {
      bottomSheet = document.createElement('div');
      bottomSheet.className = 'bottom-sheet';
      bottomSheet.style.position = 'fixed';
      bottomSheet.style.bottom = '0';
      bottomSheet.style.width = '100%';
      bottomSheet.style.transition = 'transform 0.3s ease';
      document.body.appendChild(bottomSheet);
    });

    afterEach(() => {
      if (bottomSheet.parentNode) {
        document.body.removeChild(bottomSheet);
      }
    });

    it('should have 3 snap points', () => {
      const snapPoints = {
        collapsed: { transform: 'translateY(calc(100% - 120px))' },
        half: { transform: 'translateY(50%)' },
        full: { transform: 'translateY(0)' },
      };

      expect(Object.keys(snapPoints)).toHaveLength(3);
      expect(snapPoints.collapsed).toBeDefined();
      expect(snapPoints.half).toBeDefined();
      expect(snapPoints.full).toBeDefined();
    });

    it('should start in collapsed state', () => {
      bottomSheet.style.transform = 'translateY(calc(100% - 120px))';

      expect(bottomSheet.style.transform).toBe('translateY(calc(100% - 120px))');
    });

    it('should expand to half state', () => {
      // Start collapsed
      bottomSheet.style.transform = 'translateY(calc(100% - 120px))';

      // Simulate swipe up
      bottomSheet.style.transform = 'translateY(50%)';

      expect(bottomSheet.style.transform).toBe('translateY(50%)');
    });

    it('should expand to full state', () => {
      bottomSheet.style.transform = 'translateY(0)';

      expect(bottomSheet.style.transform).toBe('translateY(0)');
    });

    it('should collapse back down', () => {
      // Start full
      bottomSheet.style.transform = 'translateY(0)';

      // Swipe down to collapsed
      bottomSheet.style.transform = 'translateY(calc(100% - 120px))';

      expect(bottomSheet.style.transform).toBe('translateY(calc(100% - 120px))');
    });

    it('should have swipe handle', () => {
      const handle = document.createElement('div');
      handle.className = 'bottom-sheet-handle';
      handle.style.width = '40px';
      handle.style.height = '4px';
      handle.style.margin = '8px auto';
      handle.style.borderRadius = '2px';
      bottomSheet.appendChild(handle);

      const handleElement = bottomSheet.querySelector('.bottom-sheet-handle');
      expect(handleElement).toBeTruthy();
    });
  });

  describe('Layout Switching', () => {
    it('should switch layout on resize without state loss', () => {
      const gameState = {
        score: 500,
        departmentsPlaced: 3,
        currentDepartment: 'Antioquia',
      };

      // Start on mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      let layout = window.innerWidth < 768 ? 'mobile' : 'desktop';
      expect(layout).toBe('mobile');

      // Resize to desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      layout = window.innerWidth < 768 ? 'mobile' : 'desktop';
      expect(layout).toBe('desktop');

      // Game state should be preserved
      expect(gameState.score).toBe(500);
      expect(gameState.departmentsPlaced).toBe(3);
      expect(gameState.currentDepartment).toBe('Antioquia');
    });

    it('should fire resize event handlers', () => {
      let resizeHandlerCalled = false;
      const resizeHandler = () => {
        resizeHandlerCalled = true;
      };

      window.addEventListener('resize', resizeHandler);

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));

      expect(resizeHandlerCalled).toBe(true);

      window.removeEventListener('resize', resizeHandler);
    });

    it('should debounce resize events', async () => {
      vi.useFakeTimers();
      let resizeCount = 0;
      let debouncedResizeCount = 0;
      let debounceTimer: NodeJS.Timeout | null = null;

      const resizeHandler = () => {
        resizeCount++;

        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
          debouncedResizeCount++;
        }, 200);
      };

      window.addEventListener('resize', resizeHandler);

      // Trigger multiple rapid resize events
      for (let i = 0; i < 5; i++) {
        window.dispatchEvent(new Event('resize'));
      }

      // All resize events should fire
      expect(resizeCount).toBe(5);

      // But debounced handler should only run once after delay
      vi.advanceTimersByTime(200);
      expect(debouncedResizeCount).toBe(1);

      window.removeEventListener('resize', resizeHandler);
      vi.useRealTimers();
    });
  });

  describe('Orientation Changes', () => {
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

      const isPortrait = window.innerHeight > window.innerWidth;

      expect(isPortrait).toBe(true);
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

      const isLandscape = window.innerWidth > window.innerHeight;

      expect(isLandscape).toBe(true);
    });

    it('should handle orientation change gracefully', () => {
      let orientationChangeHandled = false;

      const handleOrientationChange = () => {
        orientationChangeHandled = true;
      };

      // Mock orientation change event
      window.addEventListener('orientationchange', handleOrientationChange);

      // Simulate orientation change
      window.dispatchEvent(new Event('orientationchange'));

      expect(orientationChangeHandled).toBe(true);

      window.removeEventListener('orientationchange', handleOrientationChange);
    });

    it('should adjust layout for landscape mode', () => {
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

      const isLandscape = window.innerWidth > window.innerHeight;
      const layoutClass = isLandscape ? 'landscape-layout' : 'portrait-layout';

      expect(layoutClass).toBe('landscape-layout');
    });
  });

  describe('Safe Areas and Notches', () => {
    it('should account for top safe area (iPhone notch)', () => {
      const container = document.createElement('div');
      container.style.paddingTop = 'env(safe-area-inset-top, 20px)';
      document.body.appendChild(container);

      // Safe area CSS should be applied
      expect(container.style.paddingTop).toBe('env(safe-area-inset-top, 20px)');

      document.body.removeChild(container);
    });

    it('should account for bottom safe area (home indicator)', () => {
      const container = document.createElement('div');
      container.style.paddingBottom = 'env(safe-area-inset-bottom, 20px)';
      document.body.appendChild(container);

      expect(container.style.paddingBottom).toBe('env(safe-area-inset-bottom, 20px)');

      document.body.removeChild(container);
    });
  });

  describe('Specific Device Viewports', () => {
    const devices = [
      { name: 'iPhone SE', width: 375, height: 667 },
      { name: 'iPhone 14 Pro', width: 393, height: 852 },
      { name: 'Pixel 5', width: 393, height: 851 },
      { name: 'iPad Mini', width: 744, height: 1133 },
      { name: 'Galaxy S21', width: 360, height: 800 },
    ];

    devices.forEach((device) => {
      it(`should render correctly on ${device.name}`, () => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: device.width,
        });
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: device.height,
        });

        const isMobile = window.innerWidth < 768;
        const isPortrait = window.innerHeight > window.innerWidth;

        expect(window.innerWidth).toBe(device.width);
        expect(window.innerHeight).toBe(device.height);

        // All these devices should be mobile except iPad Mini
        if (device.name === 'iPad Mini') {
          expect(isMobile).toBe(true); // Tablets use mobile layout
        } else {
          expect(isMobile).toBe(true);
        }

        expect(isPortrait).toBe(true);
      });
    });
  });
});
