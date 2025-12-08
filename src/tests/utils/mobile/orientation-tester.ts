/**
 * Orientation Testing Infrastructure
 * Provides utilities for testing orientation changes and responsive behavior
 */

export type Orientation = 'portrait' | 'landscape';

export interface OrientationConfig {
  orientation: Orientation;
  width: number;
  height: number;
}

/**
 * OrientationTester - Utility class for testing device orientation behavior
 */
export class OrientationTester {
  private originalWidth: number;
  private originalHeight: number;
  private currentOrientation: Orientation;

  constructor() {
    this.originalWidth = window.innerWidth;
    this.originalHeight = window.innerHeight;
    this.currentOrientation = this.getOrientation();
  }

  /**
   * Simulates an orientation change
   */
  simulateOrientationChange(orientation: Orientation): void {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    // Determine if we need to swap dimensions
    const currentIsPortrait = currentWidth < currentHeight;
    const targetIsPortrait = orientation === 'portrait';

    if (currentIsPortrait !== targetIsPortrait) {
      this.swapDimensions();
    }

    this.currentOrientation = orientation;

    // Dispatch orientationchange event
    window.dispatchEvent(new Event('orientationchange'));

    // Also dispatch resize event as orientation changes trigger resize
    window.dispatchEvent(new Event('resize'));
  }

  /**
   * Gets the current orientation based on window dimensions
   */
  getOrientation(): Orientation {
    return window.innerWidth < window.innerHeight ? 'portrait' : 'landscape';
  }

  /**
   * Swaps the window width and height dimensions
   */
  swapDimensions(): void {
    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: currentHeight,
    });

    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: currentWidth,
    });
  }

  /**
   * Tests transition from one orientation to another
   */
  async testOrientationTransition(
    from: Orientation,
    to: Orientation,
    callback: () => void
  ): Promise<void> {
    // Set initial orientation
    this.simulateOrientationChange(from);
    await new Promise(resolve => setTimeout(resolve, 50));

    // Trigger callback before transition
    callback();

    // Change to target orientation
    this.simulateOrientationChange(to);
    await new Promise(resolve => setTimeout(resolve, 50));

    // Trigger callback after transition
    callback();
  }

  /**
   * Tests orientation lock behavior
   */
  simulateOrientationLock(orientation: Orientation): void {
    this.simulateOrientationChange(orientation);

    // Mock screen.orientation if available
    if ('screen' in window && 'orientation' in window.screen) {
      Object.defineProperty(window.screen.orientation, 'type', {
        writable: true,
        configurable: true,
        value: orientation === 'portrait' ? 'portrait-primary' : 'landscape-primary',
      });

      Object.defineProperty(window.screen.orientation, 'angle', {
        writable: true,
        configurable: true,
        value: orientation === 'portrait' ? 0 : 90,
      });
    }
  }

  /**
   * Gets the orientation angle (0, 90, 180, 270)
   */
  getOrientationAngle(): number {
    if ('screen' in window && 'orientation' in window.screen) {
      return window.screen.orientation.angle;
    }
    return this.currentOrientation === 'portrait' ? 0 : 90;
  }

  /**
   * Checks if device supports orientation API
   */
  supportsOrientationAPI(): boolean {
    return (
      'screen' in window &&
      'orientation' in window.screen &&
      'type' in window.screen.orientation
    );
  }

  /**
   * Resets orientation to original state
   */
  resetOrientation(): void {
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

    this.currentOrientation = this.getOrientation();

    window.dispatchEvent(new Event('resize'));
  }

  /**
   * Tests all orientations with a callback
   */
  async testAllOrientations(
    callback: (orientation: Orientation) => Promise<void>
  ): Promise<void> {
    const orientations: Orientation[] = ['portrait', 'landscape'];

    for (const orientation of orientations) {
      this.simulateOrientationChange(orientation);
      await callback(orientation);
    }

    this.resetOrientation();
  }

  /**
   * Gets the aspect ratio of current orientation
   */
  getAspectRatio(): number {
    return window.innerWidth / window.innerHeight;
  }

  /**
   * Checks if current orientation is portrait
   */
  isPortrait(): boolean {
    return this.getOrientation() === 'portrait';
  }

  /**
   * Checks if current orientation is landscape
   */
  isLandscape(): boolean {
    return this.getOrientation() === 'landscape';
  }

  /**
   * Simulates rotation animation (fires events during rotation)
   */
  async simulateRotation(
    from: Orientation,
    to: Orientation,
    duration = 300
  ): Promise<void> {
    this.simulateOrientationChange(from);
    await new Promise(resolve => setTimeout(resolve, duration / 2));

    // Midpoint of rotation
    window.dispatchEvent(new Event('resize'));
    await new Promise(resolve => setTimeout(resolve, duration / 2));

    this.simulateOrientationChange(to);
  }
}

/**
 * Default singleton instance for convenience
 */
export const orientationTester = new OrientationTester();
