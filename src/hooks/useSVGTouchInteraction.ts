/**
 * SVG Path Touch Interaction Hook
 *
 * Provides touch/pointer interaction detection for SVG path elements with:
 * - Coordinate transformation (screen to SVG space)
 * - Path hit testing using isPointInFill
 * - Visual feedback (highlight/unhighlight)
 * - Multi-touch handling
 * - Support for viewBox and transforms
 *
 * @module useSVGTouchInteraction
 */

import { useCallback, useRef, useState } from 'react';

/**
 * Touch interaction configuration
 */
const TOUCH_CONFIG = {
  TAP_MAX_DURATION: 300,      // Max time for tap (ms)
  TAP_MAX_MOVEMENT: 10,        // Max movement for tap (px)
  HIT_TOLERANCE_DEFAULT: 0     // Default hit test tolerance (px)
} as const;

/**
 * SVG touch event data
 */
export interface SVGTouchEvent {
  path: SVGPathElement;
  svgX: number;
  svgY: number;
  screenX: number;
  screenY: number;
  deltaX?: number;
  deltaY?: number;
  duration?: number;
}

/**
 * Interaction callbacks
 */
export interface SVGTouchInteractionCallbacks {
  onPathTap?: (event: SVGTouchEvent) => void;
  onPathTouchStart?: (event: SVGTouchEvent) => void;
  onPathTouchMove?: (event: SVGTouchEvent) => void;
  onPathTouchEnd?: (event: SVGTouchEvent) => void;
  onPathHighlight?: (path: SVGPathElement) => void;
  onPathUnhighlight?: (path: SVGPathElement) => void;
}

/**
 * Hook configuration options
 */
export interface SVGTouchInteractionOptions {
  hitTolerance?: number;
}

/**
 * Touch state
 */
interface TouchState {
  isActive: boolean;
  targetPath: SVGPathElement | null;
  highlightedPath: SVGPathElement | null;
  startX: number;
  startY: number;
  startSvgX: number;
  startSvgY: number;
  startTime: number;
  pointerId: number | null;
}

/**
 * Hook return value
 */
export interface UseSVGTouchInteractionReturn {
  handlers: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
  };
  touchState: {
    isActive: boolean;
    targetPath: SVGPathElement | null;
    highlightedPath: SVGPathElement | null;
  };
}

/**
 * Converts screen coordinates to SVG coordinates
 */
function screenToSVGPoint(
  svgRoot: SVGSVGElement,
  screenX: number,
  screenY: number
): SVGPoint | null {
  const ctm = svgRoot.getScreenCTM();
  if (!ctm) {
    return null;
  }

  const point = svgRoot.createSVGPoint();
  point.x = screenX;
  point.y = screenY;

  return point.matrixTransform(ctm.inverse());
}

/**
 * Tests if a point is inside a path with optional tolerance
 */
function isPointInPath(
  path: SVGPathElement,
  point: SVGPoint,
  tolerance: number = 0
): boolean {
  if (!point) {
    return false;
  }

  // Direct hit test
  if (path.isPointInFill(point)) {
    return true;
  }

  // If tolerance specified, test surrounding points
  if (tolerance > 0) {
    const offsets = [
      { x: tolerance, y: 0 },
      { x: -tolerance, y: 0 },
      { x: 0, y: tolerance },
      { x: 0, y: -tolerance },
      { x: tolerance, y: tolerance },
      { x: -tolerance, y: -tolerance },
      { x: tolerance, y: -tolerance },
      { x: -tolerance, y: tolerance }
    ];

    for (const offset of offsets) {
      const testPoint = point.matrixTransform(
        new DOMMatrix().translate(offset.x, offset.y)
      ) as unknown as SVGPoint;

      if (path.isPointInFill(testPoint)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Gets the path element from a touch target
 */
function getPathFromTarget(target: EventTarget | null): SVGPathElement | null {
  if (!target) {
    return null;
  }

  const element = target as Element;

  // Check if target is a path element
  if (element.tagName?.toLowerCase() === 'path') {
    return element as SVGPathElement;
  }

  // Could check parent elements here if needed
  return null;
}

/**
 * SVG path touch interaction hook
 *
 * @param svgRoot - The root SVG element
 * @param callbacks - Touch interaction callbacks
 * @param options - Configuration options
 * @returns Pointer event handlers and touch state
 *
 * @example
 * ```tsx
 * const { handlers, touchState } = useSVGTouchInteraction(svgRef.current, {
 *   onPathTap: (e) => console.log('Path tapped:', e.path),
 *   onPathHighlight: (path) => path.style.fill = 'yellow'
 * });
 *
 * return <svg ref={svgRef} {...handlers}>...</svg>;
 * ```
 */
export function useSVGTouchInteraction(
  svgRoot: SVGSVGElement | null,
  callbacks: SVGTouchInteractionCallbacks = {},
  options: SVGTouchInteractionOptions = {}
): UseSVGTouchInteractionReturn {
  const { hitTolerance = TOUCH_CONFIG.HIT_TOLERANCE_DEFAULT } = options;

  const [highlightedPath, setHighlightedPath] = useState<SVGPathElement | null>(null);

  const stateRef = useRef<TouchState>({
    isActive: false,
    targetPath: null,
    highlightedPath: null,
    startX: 0,
    startY: 0,
    startSvgX: 0,
    startSvgY: 0,
    startTime: 0,
    pointerId: null
  });

  /**
   * Resets touch state
   */
  const resetState = useCallback(() => {
    stateRef.current = {
      isActive: false,
      targetPath: null,
      highlightedPath: null,
      startX: 0,
      startY: 0,
      startSvgX: 0,
      startSvgY: 0,
      startTime: 0,
      pointerId: null
    };
  }, []);

  /**
   * Highlights a path
   */
  const highlightPath = useCallback((path: SVGPathElement | null) => {
    if (path) {
      setHighlightedPath(path);
      stateRef.current.highlightedPath = path;
      callbacks.onPathHighlight?.(path);
    }
  }, [callbacks]);

  /**
   * Unhighlights a path
   */
  const unhighlightPath = useCallback((path: SVGPathElement | null) => {
    if (path) {
      setHighlightedPath(null);
      stateRef.current.highlightedPath = null;
      callbacks.onPathUnhighlight?.(path);
    }
  }, [callbacks]);

  /**
   * Handles pointer down event
   */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Ignore if already active or no SVG root
    if (stateRef.current.isActive || !svgRoot) {
      return;
    }

    const path = getPathFromTarget(e.target);
    if (!path) {
      return;
    }

    // Transform screen to SVG coordinates
    const svgPoint = screenToSVGPoint(svgRoot, e.clientX, e.clientY);
    if (!svgPoint) {
      return;
    }

    // Test if point is in path
    if (!isPointInPath(path, svgPoint, hitTolerance)) {
      return;
    }

    // Capture pointer
    (e.target as Element).setPointerCapture?.(e.pointerId);

    const now = Date.now();
    stateRef.current = {
      isActive: true,
      targetPath: path,
      highlightedPath: null,
      startX: e.clientX,
      startY: e.clientY,
      startSvgX: svgPoint.x,
      startSvgY: svgPoint.y,
      startTime: now,
      pointerId: e.pointerId
    };

    // Highlight path
    highlightPath(path);

    // Trigger callback
    callbacks.onPathTouchStart?.({
      path,
      svgX: svgPoint.x,
      svgY: svgPoint.y,
      screenX: e.clientX,
      screenY: e.clientY
    });
  }, [svgRoot, hitTolerance, callbacks, highlightPath]);

  /**
   * Handles pointer move event
   */
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const state = stateRef.current;

    // Ignore if not active or wrong pointer
    if (!state.isActive || state.pointerId !== e.pointerId || !svgRoot) {
      return;
    }

    const path = state.targetPath;
    if (!path) {
      return;
    }

    // Transform screen to SVG coordinates
    const svgPoint = screenToSVGPoint(svgRoot, e.clientX, e.clientY);
    if (!svgPoint) {
      return;
    }

    const deltaX = e.clientX - state.startX;
    const deltaY = e.clientY - state.startY;

    // Trigger callback
    callbacks.onPathTouchMove?.({
      path,
      svgX: svgPoint.x,
      svgY: svgPoint.y,
      screenX: e.clientX,
      screenY: e.clientY,
      deltaX,
      deltaY
    });
  }, [svgRoot, callbacks]);

  /**
   * Handles pointer up event
   */
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const state = stateRef.current;

    // Ignore if not active or wrong pointer
    if (!state.isActive || state.pointerId !== e.pointerId) {
      return;
    }

    const path = state.targetPath;
    if (!path) {
      resetState();
      return;
    }

    // Release pointer capture
    (e.target as Element).releasePointerCapture?.(e.pointerId);

    // Calculate movement and duration
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const duration = Date.now() - state.startTime;

    // Transform screen to SVG coordinates
    const svgPoint = svgRoot ? screenToSVGPoint(svgRoot, e.clientX, e.clientY) : null;

    // Unhighlight path
    unhighlightPath(path);

    // Trigger end callback
    callbacks.onPathTouchEnd?.({
      path,
      svgX: svgPoint?.x ?? 0,
      svgY: svgPoint?.y ?? 0,
      screenX: e.clientX,
      screenY: e.clientY,
      deltaX: dx,
      deltaY: dy,
      duration
    });

    // Check for tap gesture
    if (
      distance <= TOUCH_CONFIG.TAP_MAX_MOVEMENT &&
      duration <= TOUCH_CONFIG.TAP_MAX_DURATION
    ) {
      callbacks.onPathTap?.({
        path,
        svgX: svgPoint?.x ?? state.startSvgX,
        svgY: svgPoint?.y ?? state.startSvgY,
        screenX: e.clientX,
        screenY: e.clientY
      });
    }

    resetState();
  }, [svgRoot, callbacks, resetState, unhighlightPath]);

  /**
   * Handles pointer cancel event
   */
  const handlePointerCancel = useCallback((e: React.PointerEvent) => {
    const state = stateRef.current;

    // Ignore if not active or wrong pointer
    if (!state.isActive || state.pointerId !== e.pointerId) {
      return;
    }

    const path = state.targetPath;

    // Release pointer capture
    (e.target as Element).releasePointerCapture?.(e.pointerId);

    // Unhighlight path
    if (path) {
      unhighlightPath(path);
    }

    resetState();
  }, [resetState, unhighlightPath]);

  return {
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel
    },
    touchState: {
      isActive: stateRef.current.isActive,
      targetPath: stateRef.current.targetPath,
      highlightedPath
    }
  };
}
