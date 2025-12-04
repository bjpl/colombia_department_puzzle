/**
 * Tests for deviceDetection utility
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isTouchDevice,
  getPointerType,
  supportsHover,
  getDeviceCapabilities,
  prefersTouchMode,
  getInteractionMode,
  setInteractionMode,
  resetInteractionMode,
  isMobileDevice,
  isTabletDevice,
  PointerType,
  InteractionMode
} from '../../utils/deviceDetection';
import { storage } from '../../services/storage';

// Mock storage
vi.mock('../../services/storage', () => ({
  storage: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
  }
}));

describe('deviceDetection', () => {
  let originalMatchMedia: typeof window.matchMedia;
  let originalInnerWidth: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    // Store originals
    originalMatchMedia = window.matchMedia;
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;

    // Reset storage mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore originals
    window.matchMedia = originalMatchMedia;
    Object.defineProperty(window, 'innerWidth', {
      value: originalInnerWidth,
      writable: true
    });
    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
      writable: true
    });
  });

  /**
   * Helper to mock matchMedia
   */
  function mockMatchMedia(queries: Record<string, boolean>) {
    window.matchMedia = vi.fn((query: string) => ({
      matches: queries[query] || false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    })) as any;
  }

  /**
   * Helper to mock window dimensions
   */
  function mockWindowDimensions(width: number, height: number = 800) {
    Object.defineProperty(window, 'innerWidth', {
      value: width,
      writable: true,
      configurable: true
    });
    Object.defineProperty(window, 'innerHeight', {
      value: height,
      writable: true,
      configurable: true
    });
  }

  describe('isTouchDevice', () => {
    it('should return true for coarse pointer device', () => {
      mockMatchMedia({ '(pointer: coarse)': true });
      expect(isTouchDevice()).toBe(true);
    });

    it('should return false for fine pointer device without touch', () => {
      mockMatchMedia({ '(pointer: fine)': true, '(pointer: coarse)': false });
      // Make sure no fallback touch support
      delete (window as any).ontouchstart;
      Object.defineProperty(navigator, 'maxTouchPoints', {
        value: 0,
        writable: true,
        configurable: true
      });

      expect(isTouchDevice()).toBe(false);
    });

    it('should check ontouchstart as fallback', () => {
      mockMatchMedia({});
      (window as any).ontouchstart = true;

      expect(isTouchDevice()).toBe(true);

      delete (window as any).ontouchstart;
    });
  });

  describe('getPointerType', () => {
    it('should return COARSE for touch device', () => {
      mockMatchMedia({ '(pointer: coarse)': true });
      expect(getPointerType()).toBe(PointerType.COARSE);
    });

    it('should return FINE for mouse device', () => {
      mockMatchMedia({ '(pointer: fine)': true });
      expect(getPointerType()).toBe(PointerType.FINE);
    });

    it('should return NONE when no pointer detected', () => {
      mockMatchMedia({});
      expect(getPointerType()).toBe(PointerType.NONE);
    });
  });

  describe('supportsHover', () => {
    it('should return true when hover is supported', () => {
      mockMatchMedia({ '(hover: hover)': true });
      expect(supportsHover()).toBe(true);
    });

    it('should return false when hover is not supported', () => {
      mockMatchMedia({});
      expect(supportsHover()).toBe(false);
    });
  });

  describe('getDeviceCapabilities', () => {
    it('should detect mobile device correctly', () => {
      mockMatchMedia({
        '(pointer: coarse)': true,
        '(hover: hover)': false
      });
      mockWindowDimensions(375, 667); // iPhone SE size

      const caps = getDeviceCapabilities();

      expect(caps.hasTouch).toBe(true);
      expect(caps.pointerType).toBe(PointerType.COARSE);
      expect(caps.isMobile).toBe(true);
      expect(caps.isTablet).toBe(false);
      expect(caps.isDesktop).toBe(false);
      expect(caps.supportsHover).toBe(false);
    });

    it('should detect tablet device correctly', () => {
      mockMatchMedia({
        '(pointer: coarse)': true,
        '(hover: hover)': true
      });
      mockWindowDimensions(768, 1024); // iPad size

      const caps = getDeviceCapabilities();

      expect(caps.hasTouch).toBe(true);
      expect(caps.isTablet).toBe(true);
      expect(caps.isMobile).toBe(false);
      expect(caps.isDesktop).toBe(false);
    });

    it('should detect desktop device correctly', () => {
      mockMatchMedia({
        '(pointer: fine)': true,
        '(hover: hover)': true
      });
      mockWindowDimensions(1920, 1080);

      const caps = getDeviceCapabilities();

      expect(caps.hasTouch).toBe(false);
      expect(caps.pointerType).toBe(PointerType.FINE);
      expect(caps.isDesktop).toBe(true);
      expect(caps.isMobile).toBe(false);
      expect(caps.isTablet).toBe(false);
      expect(caps.supportsHover).toBe(true);
    });
  });

  describe('prefersTouchMode', () => {
    beforeEach(() => {
      mockMatchMedia({
        '(pointer: coarse)': true,
        '(hover: hover)': false
      });
      mockWindowDimensions(375);
    });

    it('should return true when preference is TAP', () => {
      (storage.get as any).mockReturnValue(InteractionMode.TAP);
      expect(prefersTouchMode()).toBe(true);
    });

    it('should return false when preference is DRAG', () => {
      (storage.get as any).mockReturnValue(InteractionMode.DRAG);
      expect(prefersTouchMode()).toBe(false);
    });

    it('should auto-detect for mobile touch device', () => {
      (storage.get as any).mockReturnValue(null);
      expect(prefersTouchMode()).toBe(true);
    });

    it('should auto-detect false for desktop', () => {
      (storage.get as any).mockReturnValue(null);
      mockMatchMedia({
        '(pointer: fine)': true,
        '(hover: hover)': true
      });
      mockWindowDimensions(1920);

      expect(prefersTouchMode()).toBe(false);
    });
  });

  describe('getInteractionMode', () => {
    it('should return stored preference', () => {
      (storage.get as any).mockReturnValue(InteractionMode.DRAG);
      expect(getInteractionMode()).toBe(InteractionMode.DRAG);
    });

    it('should return AUTO when no preference stored', () => {
      (storage.get as any).mockReturnValue(null);
      expect(getInteractionMode()).toBe(InteractionMode.AUTO);
    });
  });

  describe('setInteractionMode', () => {
    it('should store preference and dispatch event', () => {
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

      setInteractionMode(InteractionMode.TAP);

      expect(storage.set).toHaveBeenCalledWith('preferred-interaction-mode', InteractionMode.TAP);
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'interaction-mode-changed',
          detail: { mode: InteractionMode.TAP }
        })
      );
    });
  });

  describe('resetInteractionMode', () => {
    it('should remove preference and dispatch event', () => {
      const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

      resetInteractionMode();

      expect(storage.remove).toHaveBeenCalledWith('preferred-interaction-mode');
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'interaction-mode-changed',
          detail: { mode: InteractionMode.AUTO }
        })
      );
    });
  });

  describe('isMobileDevice', () => {
    it('should return true for touch device with small screen', () => {
      mockMatchMedia({
        '(pointer: coarse)': true,
        '(hover: hover)': false
      });
      mockWindowDimensions(375);

      expect(isMobileDevice()).toBe(true);
    });

    it('should return true for coarse pointer without hover', () => {
      mockMatchMedia({
        '(pointer: coarse)': true,
        '(hover: hover)': false
      });
      mockWindowDimensions(1024); // Large screen but no hover

      expect(isMobileDevice()).toBe(true);
    });

    it('should return false for desktop', () => {
      mockMatchMedia({
        '(pointer: fine)': true,
        '(hover: hover)': true
      });
      mockWindowDimensions(1920);

      expect(isMobileDevice()).toBe(false);
    });
  });

  describe('isTabletDevice', () => {
    it('should return true for touch device with medium screen', () => {
      mockMatchMedia({
        '(pointer: coarse)': true,
        '(hover: hover)': true
      });
      mockWindowDimensions(768, 1024);

      expect(isTabletDevice()).toBe(true);
    });

    it('should return true for portrait tablet', () => {
      mockMatchMedia({
        '(pointer: coarse)': true,
        '(hover: hover)': false
      });
      mockWindowDimensions(768, 1024); // Portrait (height > width)

      expect(isTabletDevice()).toBe(true);
    });

    it('should return false for mobile', () => {
      mockMatchMedia({
        '(pointer: coarse)': true
      });
      mockWindowDimensions(375);

      expect(isTabletDevice()).toBe(false);
    });

    it('should return false for desktop', () => {
      mockMatchMedia({
        '(pointer: fine)': true
      });
      mockWindowDimensions(1920);

      expect(isTabletDevice()).toBe(false);
    });
  });

  describe('breakpoint consistency', () => {
    it('should use mobile <= 1023px breakpoint', () => {
      mockMatchMedia({ '(pointer: coarse)': true });

      mockWindowDimensions(1023);
      expect(getDeviceCapabilities().isMobile).toBe(true);

      mockWindowDimensions(1024);
      expect(getDeviceCapabilities().isMobile).toBe(false);
    });

    it('should use tablet 1024-1279px breakpoint', () => {
      mockMatchMedia({ '(pointer: coarse)': true });

      mockWindowDimensions(1024);
      expect(getDeviceCapabilities().isTablet).toBe(true);

      mockWindowDimensions(1279);
      expect(getDeviceCapabilities().isTablet).toBe(true);

      mockWindowDimensions(1280);
      expect(getDeviceCapabilities().isTablet).toBe(false);
    });

    it('should use desktop >= 1280px breakpoint', () => {
      mockMatchMedia({ '(pointer: fine)': true });

      mockWindowDimensions(1279);
      expect(getDeviceCapabilities().isDesktop).toBe(false);

      mockWindowDimensions(1280);
      expect(getDeviceCapabilities().isDesktop).toBe(true);
    });
  });
});
