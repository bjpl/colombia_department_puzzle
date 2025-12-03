/**
 * Tests for useTouchGestures hook
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTouchGestures, GestureType, InputMethod } from '../../hooks/useTouchGestures';

describe('useTouchGestures', () => {
  let callbacks: {
    onTap: ReturnType<typeof vi.fn>;
    onLongPress: ReturnType<typeof vi.fn>;
    onSwipe: ReturnType<typeof vi.fn>;
    onDragStart: ReturnType<typeof vi.fn>;
    onDragMove: ReturnType<typeof vi.fn>;
    onDragEnd: ReturnType<typeof vi.fn>;
    onCancel: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    callbacks = {
      onTap: vi.fn(),
      onLongPress: vi.fn(),
      onSwipe: vi.fn(),
      onDragStart: vi.fn(),
      onDragMove: vi.fn(),
      onDragEnd: vi.fn(),
      onCancel: vi.fn()
    };

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * Helper to create pointer events
   */
  function createPointerEvent(
    type: string,
    pointerType: 'touch' | 'mouse' | 'pen',
    clientX: number,
    clientY: number,
    pointerId = 1
  ): React.PointerEvent {
    const target = document.createElement('div');
    target.setPointerCapture = vi.fn();
    target.releasePointerCapture = vi.fn();

    return {
      type,
      pointerType,
      clientX,
      clientY,
      pointerId,
      target,
      preventDefault: vi.fn(),
      stopPropagation: vi.fn()
    } as any;
  }

  describe('initialization', () => {
    it('should initialize with inactive state', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      expect(result.current.gestureState.isActive).toBe(false);
      expect(result.current.gestureState.currentGesture).toBe(GestureType.NONE);
      expect(result.current.gestureState.inputMethod).toBe(InputMethod.UNKNOWN);
    });

    it('should provide all required handlers', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      expect(result.current.handlers.onPointerDown).toBeInstanceOf(Function);
      expect(result.current.handlers.onPointerMove).toBeInstanceOf(Function);
      expect(result.current.handlers.onPointerUp).toBeInstanceOf(Function);
      expect(result.current.handlers.onPointerCancel).toBeInstanceOf(Function);
    });
  });

  describe('tap gesture', () => {
    it('should detect tap gesture on touch device', async () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);
      const upEvent = createPointerEvent('pointerup', 'touch', 102, 102);

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
      });

      // Fast tap (< 300ms, < 10px movement)
      act(() => {
        vi.advanceTimersByTime(100);
        result.current.handlers.onPointerUp(upEvent);
      });

      expect(callbacks.onTap).toHaveBeenCalledTimes(1);
      expect(callbacks.onTap).toHaveBeenCalledWith(
        expect.objectContaining({
          type: GestureType.TAP,
          inputMethod: InputMethod.TOUCH,
          startX: 100,
          startY: 100,
          currentX: 102,
          currentY: 102
        })
      );
    });

    it('should detect tap gesture on mouse device', async () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'mouse', 100, 100);
      const upEvent = createPointerEvent('pointerup', 'mouse', 101, 101);

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        vi.advanceTimersByTime(50);
        result.current.handlers.onPointerUp(upEvent);
      });

      expect(callbacks.onTap).toHaveBeenCalledTimes(1);
      expect(callbacks.onTap.mock.calls[0][0].inputMethod).toBe(InputMethod.MOUSE);
    });

    it('should NOT detect tap if moved too far', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);
      const upEvent = createPointerEvent('pointerup', 'touch', 120, 120); // >10px

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        vi.advanceTimersByTime(100);
        result.current.handlers.onPointerUp(upEvent);
      });

      expect(callbacks.onTap).not.toHaveBeenCalled();
    });

    it('should NOT detect tap if held too long', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);
      const upEvent = createPointerEvent('pointerup', 'touch', 101, 101);

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        vi.advanceTimersByTime(400); // >300ms
        result.current.handlers.onPointerUp(upEvent);
      });

      expect(callbacks.onTap).not.toHaveBeenCalled();
    });
  });

  describe('long press gesture', () => {
    it('should detect long press after 500ms', async () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(callbacks.onLongPress).toHaveBeenCalledTimes(1);
      expect(callbacks.onLongPress).toHaveBeenCalledWith(
        expect.objectContaining({
          type: GestureType.LONG_PRESS,
          inputMethod: InputMethod.TOUCH
        })
      );
    });

    it('should cancel long press if moved too much', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);
      const moveEvent = createPointerEvent('pointermove', 'touch', 120, 120); // >10px

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        vi.advanceTimersByTime(200);
        result.current.handlers.onPointerMove(moveEvent);
        vi.advanceTimersByTime(300);
      });

      expect(callbacks.onLongPress).not.toHaveBeenCalled();
    });
  });

  describe('drag gesture', () => {
    it('should detect drag start after threshold movement', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);
      const moveEvent = createPointerEvent('pointermove', 'touch', 110, 110); // >5px

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        result.current.handlers.onPointerMove(moveEvent);
      });

      expect(callbacks.onDragStart).toHaveBeenCalledTimes(1);
      expect(result.current.gestureState.currentGesture).toBe(GestureType.DRAG);
    });

    it('should send drag move events during drag', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);
      const moveEvent1 = createPointerEvent('pointermove', 'touch', 110, 110);
      const moveEvent2 = createPointerEvent('pointermove', 'touch', 120, 120);

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        result.current.handlers.onPointerMove(moveEvent1);
        result.current.handlers.onPointerMove(moveEvent2);
      });

      expect(callbacks.onDragStart).toHaveBeenCalledTimes(1);
      expect(callbacks.onDragMove).toHaveBeenCalledTimes(2);
    });

    it('should send drag end event on pointer up', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);
      const moveEvent = createPointerEvent('pointermove', 'touch', 110, 110);
      const upEvent = createPointerEvent('pointerup', 'touch', 110, 110);

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        result.current.handlers.onPointerMove(moveEvent);
        result.current.handlers.onPointerUp(upEvent);
      });

      expect(callbacks.onDragEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe('swipe gesture', () => {
    it('should detect swipe with fast movement', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);
      const upEvent = createPointerEvent('pointerup', 'touch', 150, 100); // 50px in 200ms

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        vi.advanceTimersByTime(200);
        result.current.handlers.onPointerUp(upEvent);
      });

      expect(callbacks.onSwipe).toHaveBeenCalledTimes(1);
      expect(callbacks.onSwipe).toHaveBeenCalledWith(
        expect.objectContaining({
          type: GestureType.SWIPE,
          deltaX: 50,
          deltaY: 0
        })
      );
    });

    it('should NOT detect swipe if too slow', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);
      const upEvent = createPointerEvent('pointerup', 'touch', 150, 100);

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        vi.advanceTimersByTime(600); // >500ms
        result.current.handlers.onPointerUp(upEvent);
      });

      expect(callbacks.onSwipe).not.toHaveBeenCalled();
    });
  });

  describe('pointer capture', () => {
    it('should capture pointer on down', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
      });

      expect((downEvent.target as any).setPointerCapture).toHaveBeenCalledWith(1);
    });

    it('should release pointer on up', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);
      const upEvent = createPointerEvent('pointerup', 'touch', 100, 100);

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        result.current.handlers.onPointerUp(upEvent);
      });

      expect((upEvent.target as any).releasePointerCapture).toHaveBeenCalledWith(1);
    });

    it('should release pointer on cancel', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);
      const cancelEvent = createPointerEvent('pointercancel', 'touch', 100, 100);

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        result.current.handlers.onPointerCancel(cancelEvent);
      });

      expect(callbacks.onCancel).toHaveBeenCalledTimes(1);
      expect((cancelEvent.target as any).releasePointerCapture).toHaveBeenCalledWith(1);
    });
  });

  describe('multi-touch handling', () => {
    it('should ignore second pointer when one is active', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent1 = createPointerEvent('pointerdown', 'touch', 100, 100, 1);
      const downEvent2 = createPointerEvent('pointerdown', 'touch', 200, 200, 2);

      act(() => {
        result.current.handlers.onPointerDown(downEvent1);
        result.current.handlers.onPointerDown(downEvent2);
      });

      // Only first pointer should be captured
      expect((downEvent1.target as any).setPointerCapture).toHaveBeenCalledWith(1);
      expect((downEvent2.target as any).setPointerCapture).not.toHaveBeenCalled();
    });

    it('should ignore move events from wrong pointer', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100, 1);
      const moveEvent = createPointerEvent('pointermove', 'touch', 150, 150, 2); // Wrong ID

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        result.current.handlers.onPointerMove(moveEvent);
      });

      expect(callbacks.onDragStart).not.toHaveBeenCalled();
    });
  });

  describe('performance', () => {
    it('should handle rapid pointer events without lag', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);

      act(() => {
        result.current.handlers.onPointerDown(downEvent);

        // Simulate 60fps movement (16.67ms per frame)
        for (let i = 0; i < 60; i++) {
          const moveEvent = createPointerEvent('pointermove', 'touch', 100 + i, 100 + i);
          result.current.handlers.onPointerMove(moveEvent);
        }
      });

      // Should handle most move events (allowing for batching/throttling)
      expect(callbacks.onDragMove.mock.calls.length).toBeGreaterThanOrEqual(50);
      expect(callbacks.onDragMove.mock.calls.length).toBeLessThanOrEqual(60);
    });

    it('should respond to tap within 100ms', () => {
      const { result } = renderHook(() => useTouchGestures(callbacks));

      const downEvent = createPointerEvent('pointerdown', 'touch', 100, 100);
      const upEvent = createPointerEvent('pointerup', 'touch', 100, 100);

      const startTime = performance.now();

      act(() => {
        result.current.handlers.onPointerDown(downEvent);
        vi.advanceTimersByTime(50);
        result.current.handlers.onPointerUp(upEvent);
      });

      const endTime = performance.now();
      const latency = endTime - startTime;

      expect(callbacks.onTap).toHaveBeenCalled();
      expect(latency).toBeLessThan(100);
    });
  });
});
