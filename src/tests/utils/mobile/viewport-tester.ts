/**
 * Viewport Testing Infrastructure
 * Provides utilities for testing responsive behavior across different viewport sizes
 */

export interface ViewportConfig {
  width: number;
  height: number;
  name: string;
  deviceScaleFactor?: number;
}

export const STANDARD_VIEWPORTS: Record<string, ViewportConfig> = {
  mobile_s: { width: 320, height: 568, name: 'Mobile S', deviceScaleFactor: 2 },
  mobile_m: { width: 375, height: 667, name: 'Mobile M', deviceScaleFactor: 2 },
  mobile_l: { width: 425, height: 812, name: 'Mobile L', deviceScaleFactor: 3 },
  tablet: { width: 768, height: 1024, name: 'Tablet', deviceScaleFactor: 2 },
  laptop: { width: 1024, height: 768, name: 'Laptop', deviceScaleFactor: 1 },
  desktop: { width: 1440, height: 900, name: 'Desktop', deviceScaleFactor: 1 },
};

export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
} as const;

/**
 * ViewportTester - Utility class for testing responsive design behavior
 */
export class ViewportTester {
  private originalWidth: number;
  private originalHeight: number;
  private originalDevicePixelRatio: number;

  constructor() {
    this.originalWidth = window.innerWidth;
    this.originalHeight = window.innerHeight;
    this.originalDevicePixelRatio = window.devicePixelRatio;
  }

  /**
   * Sets the viewport to a specific configuration
   */
  setViewport(config: ViewportConfig): void {
    // Update window dimensions using Object.defineProperty
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: config.width,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: config.height,
    });

    if (config.deviceScaleFactor !== undefined) {
      Object.defineProperty(window, 'devicePixelRatio', {
        writable: true,
        configurable: true,
        value: config.deviceScaleFactor,
      });
    }

    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
  }

  /**
   * Resets the viewport to original dimensions
   */
  resetViewport(): void {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: this.originalWidth,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: this.originalHeight,
    });

    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: this.originalDevicePixelRatio,
    });

    window.dispatchEvent(new Event('resize'));
  }

  /**
   * Determines which breakpoint a given width falls into
   */
  testBreakpoint(width: number): string {
    if (width < BREAKPOINTS.mobile) return 'mobile';
    if (width < BREAKPOINTS.tablet) return 'mobile';
    if (width < BREAKPOINTS.laptop) return 'tablet';
    if (width < BREAKPOINTS.desktop) return 'laptop';
    return 'desktop';
  }

  /**
   * Gets responsive CSS classes that would be applied to an element
   */
  getResponsiveClass(element: Element): string[] {
    const classList = Array.from(element.classList);
    const responsiveClasses = classList.filter(
      cls =>
        cls.includes('mobile') ||
        cls.includes('tablet') ||
        cls.includes('desktop') ||
        cls.includes('sm:') ||
        cls.includes('md:') ||
        cls.includes('lg:') ||
        cls.includes('xl:')
    );
    return responsiveClasses;
  }

  /**
   * Tests a callback function across all standard viewports
   */
  async testAllViewports(
    callback: (config: ViewportConfig) => Promise<void>
  ): Promise<void> {
    const viewports = Object.values(STANDARD_VIEWPORTS);

    for (const viewport of viewports) {
      this.setViewport(viewport);
      await callback(viewport);
    }

    this.resetViewport();
  }

  /**
   * Tests viewport transition from one size to another
   */
  async testViewportTransition(
    from: ViewportConfig,
    to: ViewportConfig,
    callback: (current: ViewportConfig) => void,
    steps = 5
  ): Promise<void> {
    this.setViewport(from);
    callback(from);

    const widthDelta = (to.width - from.width) / steps;
    const heightDelta = (to.height - from.height) / steps;

    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));

      const currentConfig: ViewportConfig = {
        width: Math.round(from.width + widthDelta * i),
        height: Math.round(from.height + heightDelta * i),
        name: `Transition ${i}/${steps}`,
      };

      this.setViewport(currentConfig);
      callback(currentConfig);
    }
  }

  /**
   * Checks if an element is visible in the current viewport
   */
  isElementInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }

  /**
   * Gets the current viewport configuration
   */
  getCurrentViewport(): ViewportConfig {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      name: 'Current',
      deviceScaleFactor: window.devicePixelRatio,
    };
  }

  /**
   * Tests media query matching for current viewport
   */
  matchesMediaQuery(query: string): boolean {
    return window.matchMedia(query).matches;
  }

  /**
   * Gets all matching media queries from a list
   */
  getMatchingMediaQueries(queries: string[]): string[] {
    return queries.filter(query => this.matchesMediaQuery(query));
  }
}

/**
 * Default singleton instance for convenience
 */
export const viewportTester = new ViewportTester();
