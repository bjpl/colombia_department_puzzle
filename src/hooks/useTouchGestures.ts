/**
 * Touch Gesture Detection Hook
 *
 * Provides gesture recognition for touch, mouse, and pen inputs using Pointer Events API.
 * Detects: tap, long-press, swipe, drag with proper touch cancellation handling.
 *
 * @module useTouchGestures
 */

import { useCallback, useRef, useState } from 'react';

/**
 * Gesture configuration constants
 */
const GESTURE_CONFIG = {
  TAP_MAX_DURATION: 300,        // Max time for tap (ms)
  TAP_MAX_MOVEMENT: 10,          // Max movement for tap (px)
  LONG_PRESS_DURATION: 500,     // Time to trigger long press (ms)
  LONG_PRESS_MAX_MOVEMENT: 10,  // Max movement during long press (px)
  SWIPE_MIN_DISTANCE: 30,       // Min distance for swipe (px)
  SWIPE_MAX_DURATION: 500,      // Max time for swipe (ms)
  DRAG_START_THRESHOLD: 5       // Movement to start drag (px)
} as const;

/**
 * Input method types
 */
export enum InputMethod {
  TOUCH = 'touch',
  MOUSE = 'mouse',
  PEN = 'pen',
  UNKNOWN = 'unknown'
}

/**
 * Gesture types
 */
export enum GestureType {
  TAP = 'tap',
  LONG_PRESS = 'long-press',
  SWIPE = 'swipe',
  DRAG = 'drag',
  NONE = 'none'
}

/**
 * Gesture event data
 */
export interface GestureEvent {
  type: GestureType;
  inputMethod: InputMethod;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  duration: number;
  target: EventTarget | null;
}

/**
 * Gesture callbacks
 */
export interface GestureCallbacks {
  onTap?: (event: GestureEvent) => void;
  onLongPress?: (event: GestureEvent) => void;
  onSwipe?: (event: GestureEvent) => void;
  onDragStart?: (event: GestureEvent) => void;
  onDragMove?: (event: GestureEvent) => void;
  onDragEnd?: (event: GestureEvent) => void;
  onCancel?: (event: GestureEvent) => void;
}

/**
 * Gesture state interface
 */
interface GestureState {
  isActive: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
  inputMethod: InputMethod;
  pointerId: number | null;
  target: EventTarget | null;
  longPressTimer: NodeJS.Timeout | null;
  isDragging: boolean;
}

/**
 * Hook return value
 */
export interface UseTouchGesturesReturn {
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
  };
  gestureState: {
    isActive: boolean;
    currentGesture: GestureType;
    inputMethod: InputMethod;
  };
}

/**
 * Determines input method from pointer event
 */
function getInputMethod(event: React.PointerEvent): InputMethod {
  switch (event.pointerType) {
    case 'touch':
      return InputMethod.TOUCH;
    case 'mouse':
      return InputMethod.MOUSE;
    case 'pen':
      return InputMethod.PEN;
    default:
      return InputMethod.UNKNOWN;
  }
}

/**
 * Creates a gesture event from current state
 */
function createGestureEvent(
  type: GestureType,
  state: GestureState,
  currentX: number,
  currentY: number
): GestureEvent {
  const now = Date.now();
  return {
    type,
    inputMethod: state.inputMethod,
    startX: state.startX,
    startY: state.startY,
    currentX,
    currentY,
    deltaX: currentX - state.startX,
    deltaY: currentY - state.startY,
    duration: now - state.startTime,
    target: state.target
  };
}

/**
 * Touch gesture detection hook
 *
 * @param callbacks - Gesture event callbacks
 * @returns Pointer event handlers and gesture state
 *
 * @example
 * ```tsx
 * const { handlers, gestureState } = useTouchGestures({
 *   onTap: (e) => console.log('Tapped!'),
 *   onLongPress: (e) => console.log('Long pressed!'),
 *   onDragStart: (e) => console.log('Drag started!')
 * });
 *
 * return <div {...handlers}>Gestures enabled</div>;
 * ```
 */
export function useTouchGestures(callbacks: GestureCallbacks = {}): UseTouchGesturesReturn {
  const [currentGesture, setCurrentGesture] = useState<GestureType>(GestureType.NONE);

  const stateRef = useRef<GestureState>({
    isActive: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startTime: 0,
    inputMethod: InputMethod.UNKNOWN,
    pointerId: null,
    target: null,
    longPressTimer: null,
    isDragging: false
  });

  /**
   * Clears long press timer
   */
  const clearLongPressTimer = useCallback(() => {
    if (stateRef.current.longPressTimer) {
      clearTimeout(stateRef.current.longPressTimer);
      stateRef.current.longPressTimer = null;
    }
  }, []);

  /**
   * Resets gesture state
   */
  const resetState = useCallback(() => {
    clearLongPressTimer();
    stateRef.current = {
      isActive: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      startTime: 0,
      inputMethod: InputMethod.UNKNOWN,
      pointerId: null,
      target: null,
      longPressTimer: null,
      isDragging: false
    };
    setCurrentGesture(GestureType.NONE);
  }, [clearLongPressTimer]);

  /**
   * Handles pointer down event
   */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Ignore if already tracking a gesture
    if (stateRef.current.isActive) {
      return;
    }

    // Capture pointer for this element
    (e.target as Element).setPointerCapture?.(e.pointerId);

    const inputMethod = getInputMethod(e);
    const now = Date.now();

    stateRef.current = {
      isActive: true,
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
      startTime: now,
      inputMethod,
      pointerId: e.pointerId,
      target: e.target,
      longPressTimer: null,
      isDragging: false
    };

    // Start long press timer
    const timer = setTimeout(() => {
      const state = stateRef.current;
      const dx = state.currentX - state.startX;
      const dy = state.currentY - state.startY;
      const movement = Math.sqrt(dx * dx + dy * dy);

      // Only trigger long press if not moved much
      if (movement <= GESTURE_CONFIG.LONG_PRESS_MAX_MOVEMENT && state.isActive) {
        setCurrentGesture(GestureType.LONG_PRESS);
        const gestureEvent = createGestureEvent(
          GestureType.LONG_PRESS,
          state,
          state.currentX,
          state.currentY
        );
        callbacks.onLongPress?.(gestureEvent);
      }
    }, GESTURE_CONFIG.LONG_PRESS_DURATION);

    stateRef.current.longPressTimer = timer;
  }, [callbacks]);

  /**
   * Handles pointer move event
   */
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const state = stateRef.current;

    // Ignore if not active or wrong pointer
    if (!state.isActive || state.pointerId !== e.pointerId) {
      return;
    }

    state.currentX = e.clientX;
    state.currentY = e.clientY;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Cancel long press if moved too much
    if (distance > GESTURE_CONFIG.LONG_PRESS_MAX_MOVEMENT) {
      clearLongPressTimer();
    }

    // Start drag if threshold exceeded
    if (!state.isDragging && distance > GESTURE_CONFIG.DRAG_START_THRESHOLD) {
      state.isDragging = true;
      setCurrentGesture(GestureType.DRAG);

      const gestureEvent = createGestureEvent(
        GestureType.DRAG,
        state,
        e.clientX,
        e.clientY
      );
      callbacks.onDragStart?.(gestureEvent);
    }

    // Continue drag
    if (state.isDragging) {
      const gestureEvent = createGestureEvent(
        GestureType.DRAG,
        state,
        e.clientX,
        e.clientY
      );
      callbacks.onDragMove?.(gestureEvent);
    }
  }, [callbacks, clearLongPressTimer]);

  /**
   * Handles pointer up event
   */
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const state = stateRef.current;

    // Ignore if not active or wrong pointer
    if (!state.isActive || state.pointerId !== e.pointerId) {
      return;
    }

    // Release pointer capture
    (e.target as Element).releasePointerCapture?.(e.pointerId);

    clearLongPressTimer();

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const duration = Date.now() - state.startTime;

    // Determine gesture type
    if (state.isDragging) {
      // End drag
      const gestureEvent = createGestureEvent(
        GestureType.DRAG,
        state,
        e.clientX,
        e.clientY
      );
      callbacks.onDragEnd?.(gestureEvent);
    } else if (
      distance <= GESTURE_CONFIG.TAP_MAX_MOVEMENT &&
      duration <= GESTURE_CONFIG.TAP_MAX_DURATION
    ) {
      // Tap detected
      setCurrentGesture(GestureType.TAP);
      const gestureEvent = createGestureEvent(
        GestureType.TAP,
        state,
        e.clientX,
        e.clientY
      );
      callbacks.onTap?.(gestureEvent);
    } else if (
      distance >= GESTURE_CONFIG.SWIPE_MIN_DISTANCE &&
      duration <= GESTURE_CONFIG.SWIPE_MAX_DURATION
    ) {
      // Swipe detected
      setCurrentGesture(GestureType.SWIPE);
      const gestureEvent = createGestureEvent(
        GestureType.SWIPE,
        state,
        e.clientX,
        e.clientY
      );
      callbacks.onSwipe?.(gestureEvent);
    }

    resetState();
  }, [callbacks, clearLongPressTimer, resetState]);

  /**
   * Handles pointer cancel event
   */
  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    const state = stateRef.current;

    // Ignore if not active or wrong pointer
    if (!state.isActive || state.pointerId !== e.pointerId) {
      return;
    }

    // Release pointer capture
    (e.target as Element).releasePointerCapture?.(e.pointerId);

    const gestureEvent = createGestureEvent(
      currentGesture,
      state,
      state.currentX,
      state.currentY
    );
    callbacks.onCancel?.(gestureEvent);

    resetState();
  }, [callbacks, currentGesture, resetState]);

  return {
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel
    },
    gestureState: {
      isActive: stateRef.current.isActive,
      currentGesture,
      inputMethod: stateRef.current.inputMethod
    }
  };
}
