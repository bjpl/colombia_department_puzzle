/**
 * London School TDD Tests for usePinchZoom Hook
 *
 * Test-driven development following London School (mockist) approach:
 * - Mock all collaborators (touch events, calculations)
 * - Focus on behavior verification (how objects interact)
 * - Outside-in development (start with acceptance tests)
 *
 * @module usePinchZoom.test
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePinchZoom, type PinchZoomCallbacks } from '../../hooks/usePinchZoom';

/**
 * Mock PointerEvent factory for multi-touch testing
 */
function createMockPointerEvent(
  type: string,
  options: {
    pointerId: number;
    clientX: number;
    clientY: number;
    pointerType?: string;
    isPrimary?: boolean;
  }
): React.PointerEvent {
  const event = {
    type,
    pointerId: options.pointerId,
    clientX: options.clientX,
    clientY: options.clientY,
    pointerType: options.pointerType || 'touch',
    isPrimary: options.isPrimary ?? true,
    target: document.createElement('div'),
    currentTarget: document.createElement('div'),
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    nativeEvent: new Event(type),
    bubbles: true,
    cancelable: true,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: true,
    timeStamp: Date.now(),
    button: 0,
    buttons: 0,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    getModifierState: vi.fn(),
    movementX: 0,
    movementY: 0,
    relatedTarget: null,
    screenX: options.clientX,
    screenY: options.clientY,
    pageX: options.clientX,
    pageY: options.clientY,
    detail: 0,
    view: window,
    width: 1,
    height: 1,
    pressure: 0.5,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    isPersistent: false,
    isDefaultPrevented: () => false,
    isPropagationStopped: () => false,
    persist: vi.fn()
  } as unknown as React.PointerEvent;

  // Add setPointerCapture/releasePointerCapture to target
  (event.target as any).setPointerCapture = vi.fn();
  (event.target as any).releasePointerCapture = vi.fn();

  return event;
}

/**
 * Calculate expected distance between two points
 */
function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate expected center point between two touches
 */
function calculateCenter(x1: number, y1: number, x2: number, y2: number): { x: number; y: number } {
  return {
    x: (x1 + x2) / 2,
    y: (y1 + y2) / 2
  };
}

describe('usePinchZoom - London School TDD', () => {
  let mockCallbacks: PinchZoomCallbacks;

  beforeEach(() => {
    // Mock all callbacks (London School: test interactions, not state)
    mockCallbacks = {
      onPinchStart: vi.fn(),
      onPinchMove: vi.fn(),
      onPinchEnd: vi.fn(),
      onPinchCancel: vi.fn()
    };

    // Mock timers for momentum/inertia testing
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Acceptance Tests - Outside-In TDD', () => {
    it('should detect and report complete pinch-to-zoom gesture', () => {
      // ACCEPTANCE: User pinches to zoom from 1x to 2x scale
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // First finger touches down at (100, 100)
      act(() => {
        const event1 = createMockPointerEvent('pointerdown', {
          pointerId: 1,
          clientX: 100,
          clientY: 100,
          isPrimary: true
        });
        result.current.handlers.onPointerDown(event1);
      });

      // Second finger touches down at (200, 100) - 100px apart
      act(() => {
        const event2 = createMockPointerEvent('pointerdown', {
          pointerId: 2,
          clientX: 200,
          clientY: 100,
          isPrimary: false
        });
        result.current.handlers.onPointerDown(event2);
      });

      // Verify pinch started
      expect(mockCallbacks.onPinchStart).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: 1.0,
          initialDistance: 100,
          centerX: 150,
          centerY: 100
        })
      );

      // Fingers spread apart to 200px distance (2x zoom)
      act(() => {
        const event1 = createMockPointerEvent('pointermove', {
          pointerId: 1,
          clientX: 50,
          clientY: 100,
          isPrimary: true
        });
        result.current.handlers.onPointerMove(event1);
      });

      act(() => {
        const event2 = createMockPointerEvent('pointermove', {
          pointerId: 2,
          clientX: 250,
          clientY: 100,
          isPrimary: false
        });
        result.current.handlers.onPointerMove(event2);
      });

      // Verify zoom scale calculation
      expect(mockCallbacks.onPinchMove).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: 2.0, // 200px / 100px = 2x
          currentDistance: 200,
          centerX: 150,
          centerY: 100,
          deltaScale: 1.0
        })
      );

      // Release both fingers
      act(() => {
        const event1 = createMockPointerEvent('pointerup', {
          pointerId: 1,
          clientX: 50,
          clientY: 100
        });
        result.current.handlers.onPointerUp(event1);
      });

      act(() => {
        const event2 = createMockPointerEvent('pointerup', {
          pointerId: 2,
          clientX: 250,
          clientY: 100
        });
        result.current.handlers.onPointerUp(event2);
      });

      // Verify pinch ended with final scale
      expect(mockCallbacks.onPinchEnd).toHaveBeenCalledWith(
        expect.objectContaining({
          finalScale: 2.0,
          duration: expect.any(Number)
        })
      );
    });
  });

  describe('Two-Finger Detection', () => {
    it('should NOT trigger pinch with single touch', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      act(() => {
        const event = createMockPointerEvent('pointerdown', {
          pointerId: 1,
          clientX: 100,
          clientY: 100
        });
        result.current.handlers.onPointerDown(event);
      });

      // Move single finger
      act(() => {
        const event = createMockPointerEvent('pointermove', {
          pointerId: 1,
          clientX: 150,
          clientY: 100
        });
        result.current.handlers.onPointerMove(event);
      });

      // Verify no pinch callbacks triggered
      expect(mockCallbacks.onPinchStart).not.toHaveBeenCalled();
      expect(mockCallbacks.onPinchMove).not.toHaveBeenCalled();
    });

    it('should detect pinch when second finger touches down', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // First finger
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', {
            pointerId: 1,
            clientX: 100,
            clientY: 100
          })
        );
      });

      // Second finger - pinch should start
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', {
            pointerId: 2,
            clientX: 200,
            clientY: 100
          })
        );
      });

      // Verify pinch started callback with correct initial state
      expect(mockCallbacks.onPinchStart).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onPinchStart).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: 1.0,
          initialDistance: expect.any(Number),
          centerX: expect.any(Number),
          centerY: expect.any(Number)
        })
      );
    });

    it('should ignore third and subsequent fingers', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Two fingers - valid pinch
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
      });

      vi.clearAllMocks();

      // Third finger - should be ignored
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 3, clientX: 150, clientY: 150 })
        );
      });

      // Verify no additional callbacks
      expect(mockCallbacks.onPinchStart).not.toHaveBeenCalled();
    });
  });

  describe('Scale Calculation', () => {
    it('should calculate zoom-in scale correctly (fingers spreading)', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Start: 100px apart
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
      });

      const initialDistance = calculateDistance(100, 100, 200, 100);
      expect(initialDistance).toBe(100);

      // Spread to 300px apart (3x zoom)
      act(() => {
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 1, clientX: 50, clientY: 100 })
        );
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 2, clientX: 350, clientY: 100 })
        );
      });

      const currentDistance = calculateDistance(50, 100, 350, 100);
      const expectedScale = currentDistance / initialDistance;

      expect(mockCallbacks.onPinchMove).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: expectedScale, // Should be ~3.0
          currentDistance
        })
      );
    });

    it('should calculate zoom-out scale correctly (fingers pinching)', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Start: 200px apart
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 50, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 250, clientY: 100 })
        );
      });

      // Pinch to 100px apart (0.5x zoom)
      act(() => {
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 2, clientX: 200, clientY: 100 })
        );
      });

      expect(mockCallbacks.onPinchMove).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: 0.5 // 100px / 200px = 0.5x
        })
      );
    });

    it('should calculate scale from diagonal pinch gestures', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Start: diagonal fingers
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 200 })
        );
      });

      const initialDistance = calculateDistance(100, 100, 200, 200);

      // Spread diagonally
      act(() => {
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 1, clientX: 50, clientY: 50 })
        );
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 2, clientX: 250, clientY: 250 })
        );
      });

      const currentDistance = calculateDistance(50, 50, 250, 250);
      const expectedScale = currentDistance / initialDistance;

      expect(mockCallbacks.onPinchMove).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: expect.closeTo(expectedScale, 2)
        })
      );
    });
  });

  describe('Center Point Tracking', () => {
    it('should calculate center point between two fingers', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 50 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 150 })
        );
      });

      const expectedCenter = calculateCenter(100, 50, 200, 150);

      expect(mockCallbacks.onPinchStart).toHaveBeenCalledWith(
        expect.objectContaining({
          centerX: expectedCenter.x, // 150
          centerY: expectedCenter.y  // 100
        })
      );
    });

    it('should update center point as fingers move', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Initial touch
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
      });

      // Move fingers (center should move)
      act(() => {
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 1, clientX: 150, clientY: 150 })
        );
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 2, clientX: 250, clientY: 150 })
        );
      });

      const newCenter = calculateCenter(150, 150, 250, 150);

      expect(mockCallbacks.onPinchMove).toHaveBeenCalledWith(
        expect.objectContaining({
          centerX: newCenter.x, // 200
          centerY: newCenter.y  // 150
        })
      );
    });

    it('should use center point as zoom origin', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 300, clientY: 100 })
        );
      });

      // Center should be (200, 100)
      expect(mockCallbacks.onPinchStart).toHaveBeenCalledWith(
        expect.objectContaining({
          centerX: 200,
          centerY: 100,
          originX: 200, // Zoom origin = center
          originY: 100
        })
      );
    });
  });

  describe('Zoom Limits', () => {
    it('should enforce default minimum zoom (0.5x)', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Start wide
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 0, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 400, clientY: 100 })
        );
      });

      // Pinch very tight (would be 0.1x without limits)
      act(() => {
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 1, clientX: 190, clientY: 100 })
        );
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 2, clientX: 210, clientY: 100 })
        );
      });

      // Should clamp to 0.5x minimum
      expect(mockCallbacks.onPinchMove).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: expect.closeTo(0.5, 0.01) // Clamped to min
        })
      );
    });

    it('should enforce default maximum zoom (3x)', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Start tight
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 195, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 205, clientY: 100 })
        );
      });

      // Spread very wide (would be 50x without limits)
      act(() => {
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 1, clientX: 0, clientY: 100 })
        );
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 2, clientX: 500, clientY: 100 })
        );
      });

      // Should clamp to 3x maximum
      expect(mockCallbacks.onPinchMove).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: expect.closeTo(3.0, 0.01) // Clamped to max
        })
      );
    });

    it('should accept custom zoom limits', () => {
      const { result } = renderHook(() =>
        usePinchZoom(mockCallbacks, {
          minScale: 1.0,
          maxScale: 5.0
        })
      );

      // Test custom minimum
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 0, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 400, clientY: 100 })
        );
      });

      act(() => {
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 1, clientX: 195, clientY: 100 })
        );
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 2, clientX: 205, clientY: 100 })
        );
      });

      expect(mockCallbacks.onPinchMove).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: expect.closeTo(1.0, 0.01) // Custom min
        })
      );
    });
  });

  describe('Smooth Zoom Interpolation', () => {
    it('should provide velocity data for smooth interpolation', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
      });

      // First move
      act(() => {
        vi.advanceTimersByTime(16); // ~60fps
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 1, clientX: 90, clientY: 100 })
        );
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 2, clientX: 210, clientY: 100 })
        );
      });

      // Second move - should calculate velocity
      act(() => {
        vi.advanceTimersByTime(16);
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 1, clientX: 80, clientY: 100 })
        );
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 2, clientX: 220, clientY: 100 })
        );
      });

      expect(mockCallbacks.onPinchMove).toHaveBeenCalledWith(
        expect.objectContaining({
          velocity: expect.any(Number), // Scale change per ms
          timestamp: expect.any(Number)
        })
      );
    });

    it('should smooth scale changes with interpolation', () => {
      const { result } = renderHook(() =>
        usePinchZoom(mockCallbacks, {
          smoothing: true,
          smoothingFactor: 0.2
        })
      );

      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
      });

      // Sudden scale jump
      act(() => {
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 1, clientX: 0, clientY: 100 })
        );
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 2, clientX: 400, clientY: 100 })
        );
      });

      // Smoothed scale should be interpolated, not instant
      expect(mockCallbacks.onPinchMove).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: expect.not.closeTo(4.0, 0.1), // Not instant jump to 4x
          smoothedScale: expect.any(Number)
        })
      );
    });
  });

  describe('Gesture Cancellation', () => {
    it('should handle pointer cancel during pinch', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Start pinch
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
      });

      // Cancel first pointer
      act(() => {
        result.current.handlers.onPointerCancel(
          createMockPointerEvent('pointercancel', { pointerId: 1, clientX: 100, clientY: 100 })
        );
      });

      // Verify cancel callback triggered
      expect(mockCallbacks.onPinchCancel).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'pointer-cancelled',
          scale: expect.any(Number)
        })
      );
    });

    it('should reset state after cancellation', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Start and cancel pinch
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
        result.current.handlers.onPointerCancel(
          createMockPointerEvent('pointercancel', { pointerId: 1, clientX: 100, clientY: 100 })
        );
      });

      // Verify state is reset
      expect(result.current.gestureState.isActive).toBe(false);
      expect(result.current.gestureState.activePointers).toBe(0);
    });

    it('should cancel pinch if one finger lifts unexpectedly', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
      });

      // Only one finger lifts (incomplete gesture)
      act(() => {
        result.current.handlers.onPointerUp(
          createMockPointerEvent('pointerup', { pointerId: 1, clientX: 100, clientY: 100 })
        );
      });

      // Should trigger cancel, not end
      expect(mockCallbacks.onPinchCancel).toHaveBeenCalled();
      expect(mockCallbacks.onPinchEnd).not.toHaveBeenCalled();
    });
  });

  describe('Momentum and Inertia', () => {
    it('should calculate momentum from final velocity', () => {
      const { result } = renderHook(() =>
        usePinchZoom(mockCallbacks, { enableMomentum: true })
      );

      // Start pinch
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
      });

      // Quick pinch with velocity
      act(() => {
        vi.advanceTimersByTime(50);
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 1, clientX: 50, clientY: 100 })
        );
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 2, clientX: 350, clientY: 100 })
        );
      });

      // Release with momentum
      act(() => {
        result.current.handlers.onPointerUp(
          createMockPointerEvent('pointerup', { pointerId: 1, clientX: 50, clientY: 100 })
        );
        result.current.handlers.onPointerUp(
          createMockPointerEvent('pointerup', { pointerId: 2, clientX: 350, clientY: 100 })
        );
      });

      expect(mockCallbacks.onPinchEnd).toHaveBeenCalledWith(
        expect.objectContaining({
          momentum: expect.any(Number),
          finalVelocity: expect.any(Number)
        })
      );
    });

    it('should apply momentum decay over time', () => {
      const onMomentumUpdate = vi.fn();
      const { result } = renderHook(() =>
        usePinchZoom(
          { ...mockCallbacks, onMomentumUpdate },
          {
            enableMomentum: true,
            momentumDecay: 0.95
          }
        )
      );

      // Create pinch with momentum
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
        vi.advanceTimersByTime(50);
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 1, clientX: 50, clientY: 100 })
        );
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', { pointerId: 2, clientX: 350, clientY: 100 })
        );
        result.current.handlers.onPointerUp(
          createMockPointerEvent('pointerup', { pointerId: 1, clientX: 50, clientY: 100 })
        );
        result.current.handlers.onPointerUp(
          createMockPointerEvent('pointerup', { pointerId: 2, clientX: 350, clientY: 100 })
        );
      });

      // Momentum should decay over animation frames
      act(() => {
        vi.advanceTimersByTime(16); // Frame 1
      });
      const momentum1 = onMomentumUpdate.mock.calls[0]?.[0]?.momentum || 0;

      act(() => {
        vi.advanceTimersByTime(16); // Frame 2
      });
      const momentum2 = onMomentumUpdate.mock.calls[1]?.[0]?.momentum || 0;

      // Second frame momentum should be less than first
      expect(momentum2).toBeLessThan(momentum1);
    });
  });

  describe('Integration with Touch Gesture System', () => {
    it('should expose pointer event handlers compatible with useTouchGestures', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Should have same handler interface as useTouchGestures
      expect(result.current.handlers).toHaveProperty('onPointerDown');
      expect(result.current.handlers).toHaveProperty('onPointerMove');
      expect(result.current.handlers).toHaveProperty('onPointerUp');
      expect(result.current.handlers).toHaveProperty('onPointerCancel');
    });

    it('should provide gesture state similar to useTouchGestures', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      expect(result.current.gestureState).toHaveProperty('isActive');
      expect(result.current.gestureState).toHaveProperty('activePointers');
      expect(result.current.gestureState).toHaveProperty('currentScale');
    });

    it('should support pointer capture like useTouchGestures', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      const event = createMockPointerEvent('pointerdown', {
        pointerId: 1,
        clientX: 100,
        clientY: 100
      });

      act(() => {
        result.current.handlers.onPointerDown(event);
      });

      // Verify pointer capture was called
      expect((event.target as any).setPointerCapture).toHaveBeenCalledWith(1);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle zero initial distance gracefully', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Both fingers at same point
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 100, clientY: 100 })
        );
      });

      // Should not divide by zero, default to 1.0 scale
      expect(mockCallbacks.onPinchStart).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: 1.0
        })
      );
    });

    it('should handle rapid pointer add/remove sequences', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Rapid sequence
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
        result.current.handlers.onPointerUp(
          createMockPointerEvent('pointerup', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 3, clientX: 150, clientY: 100 })
        );
      });

      // Should handle gracefully without crashes
      expect(result.current.gestureState.isActive).toBeDefined();
    });

    it('should ignore mouse events when touch is active', () => {
      const { result } = renderHook(() => usePinchZoom(mockCallbacks));

      // Touch pinch
      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', {
            pointerId: 1,
            clientX: 100,
            clientY: 100,
            pointerType: 'touch'
          })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', {
            pointerId: 2,
            clientX: 200,
            clientY: 100,
            pointerType: 'touch'
          })
        );
      });

      vi.clearAllMocks();

      // Mouse event during touch
      act(() => {
        result.current.handlers.onPointerMove(
          createMockPointerEvent('pointermove', {
            pointerId: 3,
            clientX: 150,
            clientY: 100,
            pointerType: 'mouse'
          })
        );
      });

      // Mouse should be ignored
      expect(mockCallbacks.onPinchMove).not.toHaveBeenCalled();
    });
  });

  describe('Performance and Optimization', () => {
    it('should throttle move events for performance', () => {
      const { result } = renderHook(() =>
        usePinchZoom(mockCallbacks, { throttleMs: 16 })
      );

      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
      });

      vi.clearAllMocks();

      // Rapid move events
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.handlers.onPointerMove(
            createMockPointerEvent('pointermove', { pointerId: 1, clientX: 100 + i, clientY: 100 })
          );
          result.current.handlers.onPointerMove(
            createMockPointerEvent('pointermove', { pointerId: 2, clientX: 200 + i, clientY: 100 })
          );
          vi.advanceTimersByTime(1); // 1ms between each
        }
      });

      // Should be throttled (fewer than 10 callbacks)
      expect(mockCallbacks.onPinchMove.mock.calls.length).toBeLessThan(10);
    });

    it('should cleanup timers on unmount', () => {
      const { result, unmount } = renderHook(() =>
        usePinchZoom(mockCallbacks, { enableMomentum: true })
      );

      act(() => {
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 1, clientX: 100, clientY: 100 })
        );
        result.current.handlers.onPointerDown(
          createMockPointerEvent('pointerdown', { pointerId: 2, clientX: 200, clientY: 100 })
        );
      });

      // Unmount during active gesture
      unmount();

      // Advance timers - should not crash
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // No additional callbacks after unmount
      const callCount = mockCallbacks.onPinchMove.mock.calls.length;
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(mockCallbacks.onPinchMove.mock.calls.length).toBe(callCount);
    });
  });
});
