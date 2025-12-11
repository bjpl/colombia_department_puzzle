/**
 * Pinch-to-Zoom Hook
 *
 * Provides native two-finger pinch gesture detection for zooming.
 * Integrates with existing touch gesture system using Pointer Events API.
 *
 * Features:
 * - Two-finger pinch detection
 * - Scale calculation from finger distance
 * - Center point tracking for zoom origin
 * - Min/max zoom limits (default 0.5x to 3x)
 * - Smooth zoom interpolation
 * - Momentum/inertia support
 * - Gesture cancellation handling
 *
 * @module usePinchZoom
 */

import { useCallback, useRef, useState, useEffect } from 'react';

/**
 * Pinch zoom configuration
 */
export interface PinchZoomConfig {
  minScale?: number;          // Minimum zoom scale (default: 0.5)
  maxScale?: number;          // Maximum zoom scale (default: 3.0)
  smoothing?: boolean;        // Enable smooth interpolation (default: true)
  smoothingFactor?: number;   // Interpolation factor 0-1 (default: 0.2)
  enableMomentum?: boolean;   // Enable momentum after release (default: false)
  momentumDecay?: number;     // Momentum decay factor 0-1 (default: 0.95)
  throttleMs?: number;        // Throttle move events (default: 0)
}

/**
 * Pinch event data
 */
export interface PinchEvent {
  scale: number;              // Current zoom scale
  deltaScale: number;         // Scale change from start
  currentDistance: number;    // Current distance between fingers
  initialDistance: number;    // Starting distance between fingers
  centerX: number;            // Center point X (zoom origin)
  centerY: number;            // Center point Y (zoom origin)
  originX: number;            // Zoom origin X (alias for centerX)
  originY: number;            // Zoom origin Y (alias for centerY)
  velocity?: number;          // Scale change velocity (per ms)
  smoothedScale?: number;     // Smoothed scale value
  timestamp: number;          // Event timestamp
  duration: number;           // Gesture duration (ms)
}

/**
 * Pinch end event data
 */
export interface PinchEndEvent extends PinchEvent {
  finalScale: number;         // Final zoom scale
  momentum?: number;          // Momentum value
  finalVelocity?: number;     // Final velocity at release
}

/**
 * Pinch cancel event data
 */
export interface PinchCancelEvent extends PinchEvent {
  reason: string;             // Cancellation reason
}

/**
 * Momentum update event data
 */
export interface MomentumUpdateEvent {
  momentum: number;           // Current momentum value
  scale: number;              // Current scale from momentum
  timestamp: number;          // Update timestamp
}

/**
 * Pinch gesture callbacks
 */
export interface PinchZoomCallbacks {
  onPinchStart?: (event: PinchEvent) => void;
  onPinchMove?: (event: PinchEvent) => void;
  onPinchEnd?: (event: PinchEndEvent) => void;
  onPinchCancel?: (event: PinchCancelEvent) => void;
  onMomentumUpdate?: (event: MomentumUpdateEvent) => void;
}

/**
 * Gesture state
 */
export interface PinchGestureState {
  isActive: boolean;          // Is pinch gesture active
  activePointers: number;     // Number of active pointers
  currentScale: number;       // Current zoom scale
}

/**
 * Pointer tracking data
 */
interface PointerData {
  id: number;
  x: number;
  y: number;
  type: string;
}

/**
 * Internal pinch state
 */
interface PinchState {
  isActive: boolean;
  pointers: Map<number, PointerData>;
  initialDistance: number;
  currentDistance: number;
  scale: number;
  smoothedScale: number;
  centerX: number;
  centerY: number;
  startTime: number;
  lastMoveTime: number;
  lastScale: number;
  velocity: number;
  lastThrottleTime: number;
}

/**
 * Hook return value
 */
export interface UsePinchZoomReturn {
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
  };
  gestureState: PinchGestureState;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<PinchZoomConfig> = {
  minScale: 0.5,
  maxScale: 3.0,
  smoothing: true,
  smoothingFactor: 0.2,
  enableMomentum: false,
  momentumDecay: 0.95,
  throttleMs: 0
};

/**
 * Calculate distance between two points
 */
function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calculate center point between two pointers
 */
function calculateCenter(pointer1: PointerData, pointer2: PointerData): { x: number; y: number } {
  return {
    x: (pointer1.x + pointer2.x) / 2,
    y: (pointer1.y + pointer2.y) / 2
  };
}

/**
 * Clamp value between min and max
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation
 */
function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

/**
 * Pinch-to-zoom gesture detection hook
 *
 * @param callbacks - Pinch gesture callbacks
 * @param config - Configuration options
 * @returns Pointer event handlers and gesture state
 *
 * @example
 * ```tsx
 * const { handlers, gestureState } = usePinchZoom({
 *   onPinchStart: (e) => console.log('Pinch started at', e.scale),
 *   onPinchMove: (e) => setZoom(e.scale),
 *   onPinchEnd: (e) => console.log('Final scale:', e.finalScale)
 * }, {
 *   minScale: 0.5,
 *   maxScale: 3.0
 * });
 *
 * return <div {...handlers}>Pinch to zoom</div>;
 * ```
 */
export function usePinchZoom(
  callbacks: PinchZoomCallbacks = {},
  config: PinchZoomConfig = {}
): UsePinchZoomReturn {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const [gestureState, setGestureState] = useState<PinchGestureState>({
    isActive: false,
    activePointers: 0,
    currentScale: 1.0
  });

  const stateRef = useRef<PinchState>({
    isActive: false,
    pointers: new Map(),
    initialDistance: 0,
    currentDistance: 0,
    scale: 1.0,
    smoothedScale: 1.0,
    centerX: 0,
    centerY: 0,
    startTime: 0,
    lastMoveTime: 0,
    lastScale: 1.0,
    velocity: 0,
    lastThrottleTime: 0
  });

  const momentumTimerRef = useRef<number | null>(null);

  /**
   * Create pinch event from current state
   */
  const createPinchEvent = useCallback((additionalData?: Partial<PinchEvent>): PinchEvent => {
    const state = stateRef.current;
    const now = Date.now();

    return {
      scale: state.scale,
      deltaScale: state.scale - 1.0,
      currentDistance: state.currentDistance,
      initialDistance: state.initialDistance,
      centerX: state.centerX,
      centerY: state.centerY,
      originX: state.centerX,
      originY: state.centerY,
      velocity: state.velocity,
      smoothedScale: state.smoothedScale,
      timestamp: now,
      duration: now - state.startTime,
      ...additionalData
    };
  }, []);

  /**
   * Update pinch scale from pointer positions
   */
  const updatePinchScale = useCallback(() => {
    const state = stateRef.current;
    const pointers = Array.from(state.pointers.values());

    if (pointers.length !== 2) return;

    const [p1, p2] = pointers;
    const currentDistance = calculateDistance(p1.x, p1.y, p2.x, p2.y);
    const center = calculateCenter(p1, p2);

    state.currentDistance = currentDistance;
    state.centerX = center.x;
    state.centerY = center.y;

    // Calculate raw scale (handle zero initial distance)
    let rawScale = 1.0;
    if (state.initialDistance > 0) {
      rawScale = currentDistance / state.initialDistance;
    }

    // Clamp scale to limits
    const clampedScale = clamp(rawScale, cfg.minScale, cfg.maxScale);

    // Calculate velocity
    const now = Date.now();
    const timeDelta = now - state.lastMoveTime;
    if (timeDelta > 0) {
      state.velocity = (clampedScale - state.lastScale) / timeDelta;
    }

    state.lastScale = clampedScale;
    state.lastMoveTime = now;

    // Apply smoothing
    if (cfg.smoothing) {
      state.smoothedScale = lerp(state.smoothedScale, clampedScale, cfg.smoothingFactor);
      state.scale = state.smoothedScale;
    } else {
      state.scale = clampedScale;
      state.smoothedScale = clampedScale;
    }

    setGestureState({
      isActive: true,
      activePointers: state.pointers.size,
      currentScale: state.scale
    });
  }, [cfg.minScale, cfg.maxScale, cfg.smoothing, cfg.smoothingFactor]);

  /**
   * Start pinch gesture
   */
  const startPinch = useCallback(() => {
    const state = stateRef.current;
    const pointers = Array.from(state.pointers.values());

    if (pointers.length !== 2) return;

    const [p1, p2] = pointers;
    const distance = calculateDistance(p1.x, p1.y, p2.x, p2.y);
    const center = calculateCenter(p1, p2);

    const now = Date.now();
    state.isActive = true;
    state.initialDistance = distance;
    state.currentDistance = distance;
    state.scale = 1.0;
    state.smoothedScale = 1.0;
    state.centerX = center.x;
    state.centerY = center.y;
    state.startTime = now;
    state.lastMoveTime = now;
    state.lastScale = 1.0;
    state.velocity = 0;

    setGestureState({
      isActive: true,
      activePointers: 2,
      currentScale: 1.0
    });

    const event = createPinchEvent();
    callbacks.onPinchStart?.(event);
  }, [callbacks, createPinchEvent]);

  /**
   * End pinch gesture
   */
  const endPinch = useCallback(() => {
    const state = stateRef.current;

    if (!state.isActive) return;

    const event: PinchEndEvent = {
      ...createPinchEvent(),
      finalScale: state.scale,
      momentum: cfg.enableMomentum ? state.velocity : undefined,
      finalVelocity: state.velocity
    };

    callbacks.onPinchEnd?.(event);

    // Start momentum if enabled
    if (cfg.enableMomentum && Math.abs(state.velocity) > 0.0001) {
      let momentum = state.velocity;
      const baseScale = state.scale;

      const animate = () => {
        momentum *= cfg.momentumDecay;

        if (Math.abs(momentum) < 0.0001) {
          momentumTimerRef.current = null;
          return;
        }

        const newScale = clamp(baseScale + momentum, cfg.minScale, cfg.maxScale);

        callbacks.onMomentumUpdate?.({
          momentum,
          scale: newScale,
          timestamp: Date.now()
        });

        momentumTimerRef.current = requestAnimationFrame(animate);
      };

      momentumTimerRef.current = requestAnimationFrame(animate);
    }

    // Reset state
    state.isActive = false;
    state.pointers.clear();
    state.initialDistance = 0;
    state.currentDistance = 0;
    state.scale = 1.0;
    state.smoothedScale = 1.0;
    state.velocity = 0;

    setGestureState({
      isActive: false,
      activePointers: 0,
      currentScale: 1.0
    });
  }, [callbacks, cfg.enableMomentum, cfg.momentumDecay, cfg.minScale, cfg.maxScale, createPinchEvent]);

  /**
   * Cancel pinch gesture
   */
  const cancelPinch = useCallback((reason: string) => {
    const state = stateRef.current;

    if (!state.isActive) return;

    const event: PinchCancelEvent = {
      ...createPinchEvent(),
      reason
    };

    callbacks.onPinchCancel?.(event);

    // Reset state
    state.isActive = false;
    state.pointers.clear();
    state.initialDistance = 0;
    state.currentDistance = 0;
    state.scale = 1.0;
    state.smoothedScale = 1.0;
    state.velocity = 0;

    setGestureState({
      isActive: false,
      activePointers: 0,
      currentScale: 1.0
    });
  }, [callbacks, createPinchEvent]);

  /**
   * Handle pointer down
   */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const state = stateRef.current;

    // Only handle touch events
    if (e.pointerType !== 'touch') return;

    // Ignore more than 2 fingers
    if (state.pointers.size >= 2) return;

    // Add pointer
    state.pointers.set(e.pointerId, {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      type: e.pointerType
    });

    // Capture pointer
    (e.target as Element).setPointerCapture?.(e.pointerId);

    // Start pinch when second finger touches
    if (state.pointers.size === 2) {
      startPinch();
    }
  }, [startPinch]);

  /**
   * Handle pointer move
   */
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const state = stateRef.current;

    // Only handle tracked pointers
    if (!state.pointers.has(e.pointerId)) return;

    // Only handle touch events during active gesture
    if (e.pointerType !== 'touch' && state.isActive) return;

    // Update pointer position
    state.pointers.set(e.pointerId, {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      type: e.pointerType
    });

    // Only process if pinch is active
    if (!state.isActive || state.pointers.size !== 2) return;

    // Throttle if configured
    if (cfg.throttleMs > 0) {
      const now = Date.now();
      if (now - state.lastThrottleTime < cfg.throttleMs) {
        return;
      }
      state.lastThrottleTime = now;
    }

    // Update scale
    updatePinchScale();

    // Trigger callback
    const event = createPinchEvent();
    callbacks.onPinchMove?.(event);
  }, [callbacks, cfg.throttleMs, createPinchEvent, updatePinchScale]);

  /**
   * Handle pointer up
   */
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const state = stateRef.current;

    // Only handle tracked pointers
    if (!state.pointers.has(e.pointerId)) return;

    // Release pointer capture
    (e.target as Element).releasePointerCapture?.(e.pointerId);

    // Remove pointer
    state.pointers.delete(e.pointerId);

    // If pinch was active and a finger lifted
    if (state.isActive) {
      if (state.pointers.size === 0) {
        // Both fingers lifted - end gesture
        endPinch();
      } else {
        // One finger lifted during pinch - cancel
        cancelPinch('pointer-cancelled');
      }
    }
  }, [endPinch, cancelPinch]);

  /**
   * Handle pointer cancel
   */
  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    const state = stateRef.current;

    // Only handle tracked pointers
    if (!state.pointers.has(e.pointerId)) return;

    // Release pointer capture
    (e.target as Element).releasePointerCapture?.(e.pointerId);

    // Remove pointer
    state.pointers.delete(e.pointerId);

    // Cancel active pinch
    if (state.isActive) {
      cancelPinch('pointer-cancelled');
    }
  }, [cancelPinch]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (momentumTimerRef.current !== null) {
        cancelAnimationFrame(momentumTimerRef.current);
        momentumTimerRef.current = null;
      }
    };
  }, []);

  return {
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel
    },
    gestureState
  };
}
