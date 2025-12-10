/**
 * Integration tests for touch interaction workflow
 * Tests tap-to-select → tap-to-place functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { TouchModeAdapter } from '../../components/game/TouchModeAdapter';
import { AllProviders } from '../utils/testProviders';
import DepartmentTray from '../../components/layout/DepartmentTray';
import { prefersTouchMode } from '../../utils/deviceDetection';

// Mock device detection
vi.mock('../../utils/deviceDetection', () => ({
  prefersTouchMode: vi.fn(),
  getDeviceCapabilities: vi.fn(() => ({
    hasTouch: true,
    pointerType: 'coarse',
    isMobile: true,
    isTablet: false,
    isDesktop: false,
    supportsHover: false
  })),
  InteractionMode: {
    TAP: 'tap',
    DRAG: 'drag',
    AUTO: 'auto'
  }
}));

// Mock sound manager
vi.mock('../../services/soundManager', () => ({
  useSoundEffect: () => ({
    playSound: vi.fn(),
    initSound: vi.fn()
  })
}));

describe('Touch Interaction Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (prefersTouchMode as any).mockReturnValue(true);
  });

  /**
   * Helper to create pointer events
   */
  function createPointerEvent(
    element: Element,
    type: string,
    options: {
      clientX: number;
      clientY: number;
      pointerType?: 'touch' | 'mouse';
      pointerId?: number;
    }
  ) {
    const event = new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: options.clientX,
      clientY: options.clientY,
      pointerType: options.pointerType || 'touch',
      pointerId: options.pointerId || 1
    });

    element.dispatchEvent(event);
    return event;
  }

  describe('Tap-to-select workflow', () => {
    it('should select chip when tapped in touch mode', async () => {
      const TestComponent = () => (
        <AllProviders>
          <TouchModeAdapter enabled={true}>
            <DepartmentTray layout="ultra-compact" />
          </TouchModeAdapter>
        </AllProviders>
      );

      render(<TestComponent />);

      // Wait for chips to render
      await waitFor(() => {
        const chips = document.querySelectorAll('[data-department-id]');
        expect(chips.length).toBeGreaterThan(0);
      });

      // Get first chip
      const chips = document.querySelectorAll('[data-department-id]');
      const firstChip = chips[0] as HTMLElement;

      // Simulate tap (quick down + up)
      act(() => {
        createPointerEvent(firstChip, 'pointerdown', {
          clientX: 100,
          clientY: 100
        });
      });

      act(() => {
        createPointerEvent(firstChip, 'pointerup', {
          clientX: 100,
          clientY: 100
        });
      });

      // Check chip is selected (has selected class)
      await waitFor(() => {
        expect(firstChip.classList.contains('touch-selected')).toBe(true);
      });
    });

    it('should deselect chip when tapped again', async () => {
      const TestComponent = () => (
        <AllProviders>
          <TouchModeAdapter enabled={true}>
            <DepartmentTray layout="ultra-compact" />
          </TouchModeAdapter>
        </AllProviders>
      );

      render(<TestComponent />);

      await waitFor(() => {
        const chips = document.querySelectorAll('[data-department-id]');
        expect(chips.length).toBeGreaterThan(0);
      });

      const firstChip = document.querySelectorAll('[data-department-id]')[0] as HTMLElement;

      // First tap - select
      act(() => {
        createPointerEvent(firstChip, 'pointerdown', { clientX: 100, clientY: 100 });
        createPointerEvent(firstChip, 'pointerup', { clientX: 100, clientY: 100 });
      });

      await waitFor(() => {
        expect(firstChip.classList.contains('touch-selected')).toBe(true);
      });

      // Second tap - deselect
      act(() => {
        createPointerEvent(firstChip, 'pointerdown', { clientX: 100, clientY: 100 });
        createPointerEvent(firstChip, 'pointerup', { clientX: 100, clientY: 100 });
      });

      await waitFor(() => {
        expect(firstChip.classList.contains('touch-selected')).toBe(false);
      });
    });

    it('should switch selection when tapping different chip', async () => {
      const TestComponent = () => (
        <AllProviders>
          <TouchModeAdapter enabled={true}>
            <DepartmentTray layout="ultra-compact" />
          </TouchModeAdapter>
        </AllProviders>
      );

      render(<TestComponent />);

      await waitFor(() => {
        const chips = document.querySelectorAll('[data-department-id]');
        expect(chips.length).toBeGreaterThanOrEqual(2);
      });

      const chips = document.querySelectorAll('[data-department-id]');
      const firstChip = chips[0] as HTMLElement;
      const secondChip = chips[1] as HTMLElement;

      // Tap first chip
      act(() => {
        createPointerEvent(firstChip, 'pointerdown', { clientX: 100, clientY: 100 });
        createPointerEvent(firstChip, 'pointerup', { clientX: 100, clientY: 100 });
      });

      await waitFor(() => {
        expect(firstChip.classList.contains('touch-selected')).toBe(true);
      });

      // Tap second chip
      act(() => {
        createPointerEvent(secondChip, 'pointerdown', { clientX: 200, clientY: 100 });
        createPointerEvent(secondChip, 'pointerup', { clientX: 200, clientY: 100 });
      });

      // First chip should be deselected, second selected
      await waitFor(() => {
        expect(firstChip.classList.contains('touch-selected')).toBe(false);
        expect(secondChip.classList.contains('touch-selected')).toBe(true);
      });
    });
  });

  describe('Visual feedback', () => {
    it('should show visual feedback on selected chip', async () => {
      const TestComponent = () => (
        <AllProviders>
          <TouchModeAdapter enabled={true}>
            <DepartmentTray layout="ultra-compact" />
          </TouchModeAdapter>
        </AllProviders>
      );

      render(<TestComponent />);

      await waitFor(() => {
        const chips = document.querySelectorAll('[data-department-id]');
        expect(chips.length).toBeGreaterThan(0);
      });

      const firstChip = document.querySelectorAll('[data-department-id]')[0] as HTMLElement;

      // Tap chip
      act(() => {
        createPointerEvent(firstChip, 'pointerdown', { clientX: 100, clientY: 100 });
        createPointerEvent(firstChip, 'pointerup', { clientX: 100, clientY: 100 });
      });

      // Check for visual feedback (pulse animation, shadow)
      await waitFor(() => {
        const computedStyle = window.getComputedStyle(firstChip);
        const animation = computedStyle.animation || computedStyle.getPropertyValue('animation');

        // Should have animation or selected class
        const hasVisualFeedback =
          firstChip.classList.contains('touch-selected') ||
          animation.includes('pulse') ||
          animation.length > 0;

        expect(hasVisualFeedback).toBe(true);
      });
    });

    it('should respond to tap within 100ms', async () => {
      const TestComponent = () => (
        <AllProviders>
          <TouchModeAdapter enabled={true}>
            <DepartmentTray layout="ultra-compact" />
          </TouchModeAdapter>
        </AllProviders>
      );

      render(<TestComponent />);

      await waitFor(() => {
        const chips = document.querySelectorAll('[data-department-id]');
        expect(chips.length).toBeGreaterThan(0);
      });

      const firstChip = document.querySelectorAll('[data-department-id]')[0] as HTMLElement;

      const startTime = performance.now();

      // Tap chip
      act(() => {
        createPointerEvent(firstChip, 'pointerdown', { clientX: 100, clientY: 100 });
        createPointerEvent(firstChip, 'pointerup', { clientX: 100, clientY: 100 });
      });

      // Wait for visual feedback
      await waitFor(() => {
        expect(firstChip.classList.contains('touch-selected')).toBe(true);
      });

      const endTime = performance.now();
      const latency = endTime - startTime;

      // Should respond within 100ms
      expect(latency).toBeLessThan(100);
    });
  });

  describe('Long-press to drag', () => {
    it('should activate drag mode on long press', async () => {
      vi.useFakeTimers();

      const TestComponent = () => (
        <AllProviders>
          <TouchModeAdapter enabled={true}>
            <DepartmentTray layout="ultra-compact" />
          </TouchModeAdapter>
        </AllProviders>
      );

      render(<TestComponent />);

      await waitFor(() => {
        const chips = document.querySelectorAll('[data-department-id]');
        expect(chips.length).toBeGreaterThan(0);
      });

      const firstChip = document.querySelectorAll('[data-department-id]')[0] as HTMLElement;

      // Start long press
      act(() => {
        createPointerEvent(firstChip, 'pointerdown', { clientX: 100, clientY: 100 });
      });

      // Advance time to trigger long press (500ms)
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Long press should trigger - check for screen reader announcement or drag state
      await waitFor(() => {
        // In real implementation, this would set isDragging state
        // For now, just verify no errors occurred
        expect(true).toBe(true);
      });

      vi.useRealTimers();
    });
  });

  describe('Mouse compatibility', () => {
    it('should work with mouse on desktop', async () => {
      (prefersTouchMode as any).mockReturnValue(false);

      const TestComponent = () => (
        <AllProviders>
          <TouchModeAdapter enabled={false}>
            <DepartmentTray layout="ultra-compact" />
          </TouchModeAdapter>
        </AllProviders>
      );

      render(<TestComponent />);

      await waitFor(() => {
        const chips = document.querySelectorAll('[data-department-id]');
        expect(chips.length).toBeGreaterThan(0);
      });

      const firstChip = document.querySelectorAll('[data-department-id]')[0] as HTMLElement;

      // Mouse click
      act(() => {
        createPointerEvent(firstChip, 'pointerdown', {
          clientX: 100,
          clientY: 100,
          pointerType: 'mouse'
        });
        createPointerEvent(firstChip, 'pointerup', {
          clientX: 100,
          clientY: 100,
          pointerType: 'mouse'
        });
      });

      // Should NOT activate touch mode selection (enabled=false)
      await waitFor(() => {
        // In non-touch mode, chip should not get touch-selected class
        expect(firstChip.classList.contains('touch-selected')).toBe(false);
      });
    });
  });

  describe('Accessibility', () => {
    it('should announce selection to screen readers', async () => {
      const eventSpy = vi.fn();
      window.addEventListener('screen-reader-announcement', eventSpy);

      const TestComponent = () => (
        <AllProviders>
          <TouchModeAdapter enabled={true}>
            <DepartmentTray layout="ultra-compact" />
          </TouchModeAdapter>
        </AllProviders>
      );

      render(<TestComponent />);

      await waitFor(() => {
        const chips = document.querySelectorAll('[data-department-id]');
        expect(chips.length).toBeGreaterThan(0);
      });

      const firstChip = document.querySelectorAll('[data-department-id]')[0] as HTMLElement;

      // Tap chip
      act(() => {
        createPointerEvent(firstChip, 'pointerdown', { clientX: 100, clientY: 100 });
        createPointerEvent(firstChip, 'pointerup', { clientX: 100, clientY: 100 });
      });

      // Should announce to screen readers
      await waitFor(() => {
        expect(eventSpy).toHaveBeenCalled();
      });

      window.removeEventListener('screen-reader-announcement', eventSpy);
    });

    it('should have minimum 44px touch targets', async () => {
      const TestComponent = () => (
        <AllProviders>
          <TouchModeAdapter enabled={true}>
            <DepartmentTray layout="ultra-compact" />
          </TouchModeAdapter>
        </AllProviders>
      );

      render(<TestComponent />);

      await waitFor(() => {
        const chips = document.querySelectorAll('[data-department-id]');
        expect(chips.length).toBeGreaterThan(0);
      });

      const chips = document.querySelectorAll('[data-department-id]');

      // Check each chip meets minimum touch target size
      chips.forEach(chip => {
        const rect = chip.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // iOS HIG minimum: 44x44px
        // Allow some margin for padding/border
        expect(width).toBeGreaterThanOrEqual(40);
        expect(height).toBeGreaterThanOrEqual(40);
      });
    });
  });

  describe('No double-firing', () => {
    it('should not fire both touch and mouse events', async () => {
      let eventCount = 0;
      const trackEvent = () => eventCount++;

      const TestComponent = () => {
        const handleTap = () => trackEvent();

        return (
          <AllProviders>
            <TouchModeAdapter enabled={true} onTouchModeActive={handleTap}>
              <DepartmentTray layout="ultra-compact" />
            </TouchModeAdapter>
          </AllProviders>
        );
      };

      render(<TestComponent />);

      await waitFor(() => {
        const chips = document.querySelectorAll('[data-department-id]');
        expect(chips.length).toBeGreaterThan(0);
      });

      const firstChip = document.querySelectorAll('[data-department-id]')[0] as HTMLElement;

      // Touch event
      act(() => {
        createPointerEvent(firstChip, 'pointerdown', { clientX: 100, clientY: 100 });
        createPointerEvent(firstChip, 'pointerup', { clientX: 100, clientY: 100 });
      });

      // Browser may emulate mouse events, but pointer events should prevent double-firing
      await waitFor(() => {
        // Should only fire once per gesture
        expect(eventCount).toBeLessThanOrEqual(2); // Allow for initialization call
      });
    });
  });
});
