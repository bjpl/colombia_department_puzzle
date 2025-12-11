/**
 * Smoke Tests for usePinchZoom Hook
 * Quick validation that basic functionality works
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePinchZoom } from '../../hooks/usePinchZoom';

function createPointerEvent(
  type: string,
  pointerId: number,
  x: number,
  y: number
): React.PointerEvent {
  return {
    type,
    pointerId,
    clientX: x,
    clientY: y,
    pointerType: 'touch',
    target: {
      setPointerCapture: vi.fn(),
      releasePointerCapture: vi.fn()
    }
  } as any;
}

describe('usePinchZoom - Smoke Tests', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => usePinchZoom());

    expect(result.current.gestureState.isActive).toBe(false);
    expect(result.current.gestureState.activePointers).toBe(0);
    expect(result.current.gestureState.currentScale).toBe(1.0);
    expect(result.current.handlers).toHaveProperty('onPointerDown');
    expect(result.current.handlers).toHaveProperty('onPointerMove');
    expect(result.current.handlers).toHaveProperty('onPointerUp');
    expect(result.current.handlers).toHaveProperty('onPointerCancel');
  });

  it('should detect two-finger pinch start', () => {
    const onPinchStart = vi.fn();
    const { result } = renderHook(() => usePinchZoom({ onPinchStart }));

    act(() => {
      result.current.handlers.onPointerDown(createPointerEvent('pointerdown', 1, 100, 100));
      result.current.handlers.onPointerDown(createPointerEvent('pointerdown', 2, 200, 100));
    });

    expect(onPinchStart).toHaveBeenCalledTimes(1);
    expect(result.current.gestureState.isActive).toBe(true);
    expect(result.current.gestureState.activePointers).toBe(2);
  });

  it('should calculate zoom scale on pinch move', () => {
    const onPinchMove = vi.fn();
    const { result } = renderHook(() => usePinchZoom({ onPinchMove }));

    act(() => {
      // Start: 100px apart
      result.current.handlers.onPointerDown(createPointerEvent('pointerdown', 1, 100, 100));
      result.current.handlers.onPointerDown(createPointerEvent('pointerdown', 2, 200, 100));
    });

    act(() => {
      // Spread to 200px apart (2x zoom)
      result.current.handlers.onPointerMove(createPointerEvent('pointermove', 1, 50, 100));
      result.current.handlers.onPointerMove(createPointerEvent('pointermove', 2, 250, 100));
    });

    expect(onPinchMove).toHaveBeenCalled();
    const lastCall = onPinchMove.mock.calls[onPinchMove.mock.calls.length - 1][0];
    expect(lastCall.scale).toBeGreaterThan(1.5); // Should be ~2.0
  });

  it('should end pinch when both fingers lift', () => {
    const onPinchEnd = vi.fn();
    const { result } = renderHook(() => usePinchZoom({ onPinchEnd }));

    act(() => {
      result.current.handlers.onPointerDown(createPointerEvent('pointerdown', 1, 100, 100));
      result.current.handlers.onPointerDown(createPointerEvent('pointerdown', 2, 200, 100));
      result.current.handlers.onPointerUp(createPointerEvent('pointerup', 1, 100, 100));
      result.current.handlers.onPointerUp(createPointerEvent('pointerup', 2, 200, 100));
    });

    expect(onPinchEnd).toHaveBeenCalledTimes(1);
    expect(result.current.gestureState.isActive).toBe(false);
  });

  it('should enforce min/max scale limits', () => {
    const onPinchMove = vi.fn();
    const { result } = renderHook(() =>
      usePinchZoom({ onPinchMove }, { minScale: 0.5, maxScale: 3.0 })
    );

    act(() => {
      result.current.handlers.onPointerDown(createPointerEvent('pointerdown', 1, 195, 100));
      result.current.handlers.onPointerDown(createPointerEvent('pointerdown', 2, 205, 100));
    });

    act(() => {
      // Try to zoom to 50x (should clamp to 3x)
      result.current.handlers.onPointerMove(createPointerEvent('pointermove', 1, 0, 100));
      result.current.handlers.onPointerMove(createPointerEvent('pointermove', 2, 500, 100));
    });

    const lastCall = onPinchMove.mock.calls[onPinchMove.mock.calls.length - 1][0];
    expect(lastCall.scale).toBeLessThanOrEqual(3.0);
  });
});
