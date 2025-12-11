/**
 * London School TDD Tests for SVG Path Touch Interactivity
 *
 * Outside-in approach testing behavior through mocked collaborators:
 * - SVG DOM APIs (SVGPathElement, SVGGraphicsElement, SVGPoint)
 * - Touch events and coordinate transformations
 * - Path hit testing with isPointInFill
 *
 * @module useSVGTouchInteraction.test
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSVGTouchInteraction } from '../../hooks/useSVGTouchInteraction';
import type { SVGTouchInteractionCallbacks } from '../../hooks/useSVGTouchInteraction';

/**
 * Mock SVG DOM APIs
 */
interface MockSVGPoint {
  x: number;
  y: number;
  matrixTransform: ReturnType<typeof vi.fn>;
}

interface MockDOMMatrix {
  inverse: ReturnType<typeof vi.fn>;
}

interface MockSVGGraphicsElement {
  getScreenCTM: ReturnType<typeof vi.fn>;
  getBoundingClientRect: ReturnType<typeof vi.fn>;
}

interface MockSVGPathElement extends MockSVGGraphicsElement {
  isPointInFill: ReturnType<typeof vi.fn>;
  isPointInStroke: ReturnType<typeof vi.fn>;
}

interface MockSVGSVGElement extends MockSVGGraphicsElement {
  createSVGPoint: ReturnType<typeof vi.fn>;
}

/**
 * Creates a mock SVGPoint with coordinate transformation
 */
function createMockSVGPoint(x: number = 0, y: number = 0): MockSVGPoint {
  return {
    x,
    y,
    matrixTransform: vi.fn((matrix: MockDOMMatrix) => {
      // Simple identity transform for basic tests
      return createMockSVGPoint(x, y);
    })
  };
}

/**
 * Creates a mock DOMMatrix for coordinate transformations
 */
function createMockDOMMatrix(): MockDOMMatrix {
  return {
    inverse: vi.fn(() => createMockDOMMatrix())
  };
}

/**
 * Creates a mock SVG root element
 */
function createMockSVGElement(): MockSVGSVGElement {
  return {
    createSVGPoint: vi.fn(() => createMockSVGPoint()),
    getScreenCTM: vi.fn(() => createMockDOMMatrix()),
    getBoundingClientRect: vi.fn(() => ({
      left: 0,
      top: 0,
      right: 800,
      bottom: 600,
      width: 800,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => ({})
    }))
  };
}

/**
 * Creates a mock SVGPathElement with hit testing
 */
function createMockSVGPath(isInPath: boolean = true): MockSVGPathElement {
  return {
    isPointInFill: vi.fn(() => isInPath),
    isPointInStroke: vi.fn(() => false),
    getScreenCTM: vi.fn(() => createMockDOMMatrix()),
    getBoundingClientRect: vi.fn(() => ({
      left: 100,
      top: 100,
      right: 300,
      bottom: 300,
      width: 200,
      height: 200,
      x: 100,
      y: 100,
      toJSON: () => ({})
    }))
  };
}

/**
 * Creates a mock PointerEvent for touch interactions
 */
function createMockPointerEvent(
  type: string,
  clientX: number,
  clientY: number,
  target: unknown,
  options: Partial<PointerEvent> = {}
): React.PointerEvent {
  return {
    type,
    clientX,
    clientY,
    target,
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
    ...options
  } as unknown as React.PointerEvent;
}

describe('useSVGTouchInteraction - London School TDD', () => {
  let mockSvgRoot: MockSVGSVGElement;
  let mockPath: MockSVGPathElement;
  let callbacks: SVGTouchInteractionCallbacks;

  beforeEach(() => {
    mockSvgRoot = createMockSVGElement();
    mockPath = createMockSVGPath(true);
    callbacks = {
      onPathTap: vi.fn(),
      onPathTouchStart: vi.fn(),
      onPathTouchMove: vi.fn(),
      onPathTouchEnd: vi.fn(),
      onPathHighlight: vi.fn(),
      onPathUnhighlight: vi.fn()
    };

    // Setup DOM method mocks
    vi.spyOn(document, 'elementFromPoint').mockReturnValue(mockPath as unknown as Element);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Contract Test: Hook returns proper handler structure
   */
  describe('Hook Contract', () => {
    it('should return pointer event handlers', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      expect(result.current.handlers).toBeDefined();
      expect(result.current.handlers.onPointerDown).toBeTypeOf('function');
      expect(result.current.handlers.onPointerMove).toBeTypeOf('function');
      expect(result.current.handlers.onPointerUp).toBeTypeOf('function');
      expect(result.current.handlers.onPointerCancel).toBeTypeOf('function');
    });

    it('should return touch state', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      expect(result.current.touchState).toBeDefined();
      expect(result.current.touchState).toHaveProperty('isActive');
      expect(result.current.touchState).toHaveProperty('targetPath');
      expect(result.current.touchState).toHaveProperty('highlightedPath');
    });
  });

  /**
   * Behavior Test: Coordinate transformation from screen to SVG space
   */
  describe('Coordinate Transformation', () => {
    it('should transform screen coordinates to SVG space using CTM', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const mockPoint = createMockSVGPoint(150, 150);
      const transformedPoint = createMockSVGPoint(75, 75); // Simulated transformation
      mockPoint.matrixTransform = vi.fn(() => transformedPoint);
      mockSvgRoot.createSVGPoint.mockReturnValue(mockPoint);

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      // Verify collaboration: createSVGPoint -> getScreenCTM -> inverse -> matrixTransform
      expect(mockSvgRoot.createSVGPoint).toHaveBeenCalled();
      expect(mockSvgRoot.getScreenCTM).toHaveBeenCalled();
    });

    it('should handle viewBox transformations correctly', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const mockMatrix = createMockDOMMatrix();
      const inverseMatrix = createMockDOMMatrix();
      mockMatrix.inverse.mockReturnValue(inverseMatrix);
      mockSvgRoot.getScreenCTM.mockReturnValue(mockMatrix);

      const pointerDown = createMockPointerEvent('pointerdown', 200, 200, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      expect(mockMatrix.inverse).toHaveBeenCalled();
    });

    it('should handle null CTM gracefully', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      mockSvgRoot.getScreenCTM.mockReturnValue(null);

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      // Should not crash, but also not trigger callbacks
      expect(callbacks.onPathTouchStart).not.toHaveBeenCalled();
    });
  });

  /**
   * Behavior Test: Path hit testing with isPointInFill
   */
  describe('Path Hit Testing', () => {
    it('should use isPointInFill to detect if touch is inside path', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const mockPoint = createMockSVGPoint(150, 150);
      mockSvgRoot.createSVGPoint.mockReturnValue(mockPoint);
      mockPath.isPointInFill.mockReturnValue(true);

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      expect(mockPath.isPointInFill).toHaveBeenCalledWith(mockPoint);
      expect(callbacks.onPathTouchStart).toHaveBeenCalled();
    });

    it('should not trigger callbacks when touch is outside path', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      mockPath.isPointInFill.mockReturnValue(false);

      const pointerDown = createMockPointerEvent('pointerdown', 50, 50, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      expect(callbacks.onPathTouchStart).not.toHaveBeenCalled();
    });

    it('should support hit testing with tolerance for small paths', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(
          mockSvgRoot as unknown as SVGSVGElement,
          callbacks,
          { hitTolerance: 5 }
        )
      );

      // First check at exact point fails
      mockPath.isPointInFill.mockReturnValueOnce(false);
      // Tolerance checks succeed
      mockPath.isPointInFill.mockReturnValueOnce(true);

      const pointerDown = createMockPointerEvent('pointerdown', 100, 100, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      // Should have called isPointInFill multiple times for tolerance
      expect(mockPath.isPointInFill.mock.calls.length).toBeGreaterThan(1);
      expect(callbacks.onPathTouchStart).toHaveBeenCalled();
    });
  });

  /**
   * Behavior Test: Touch event sequence (start -> move -> end)
   */
  describe('Touch Event Sequence', () => {
    it('should trigger onPathTouchStart when touch begins on path', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      expect(callbacks.onPathTouchStart).toHaveBeenCalledWith(
        expect.objectContaining({
          path: mockPath,
          svgX: expect.any(Number),
          svgY: expect.any(Number),
          screenX: 150,
          screenY: 150
        })
      );
    });

    it('should trigger onPathTouchMove during touch movement', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);
      const pointerMove = createMockPointerEvent('pointermove', 160, 160, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
        result.current.handlers.onPointerMove(pointerMove);
      });

      expect(callbacks.onPathTouchMove).toHaveBeenCalledWith(
        expect.objectContaining({
          path: mockPath,
          deltaX: expect.any(Number),
          deltaY: expect.any(Number)
        })
      );
    });

    it('should trigger onPathTouchEnd when touch completes', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);
      const pointerUp = createMockPointerEvent('pointerup', 150, 150, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
        result.current.handlers.onPointerUp(pointerUp);
      });

      expect(callbacks.onPathTouchEnd).toHaveBeenCalledWith(
        expect.objectContaining({
          path: mockPath,
          duration: expect.any(Number)
        })
      );
    });

    it('should trigger onPathTap for quick tap gesture', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);
      const pointerUp = createMockPointerEvent('pointerup', 150, 150, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      // Wait minimal time (simulating quick tap)
      act(() => {
        result.current.handlers.onPointerUp(pointerUp);
      });

      expect(callbacks.onPathTap).toHaveBeenCalledWith(
        expect.objectContaining({
          path: mockPath
        })
      );
    });

    it('should not trigger onPathTap if touch moved too much', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);
      const pointerMove = createMockPointerEvent('pointermove', 200, 200, mockPath);
      const pointerUp = createMockPointerEvent('pointerup', 200, 200, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
        result.current.handlers.onPointerMove(pointerMove);
        result.current.handlers.onPointerUp(pointerUp);
      });

      expect(callbacks.onPathTap).not.toHaveBeenCalled();
    });
  });

  /**
   * Behavior Test: Visual feedback (highlight/unhighlight)
   */
  describe('Visual Feedback', () => {
    it('should highlight path on touch start', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      expect(callbacks.onPathHighlight).toHaveBeenCalledWith(mockPath);
      expect(result.current.touchState.highlightedPath).toBe(mockPath);
    });

    it('should unhighlight path on touch end', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);
      const pointerUp = createMockPointerEvent('pointerup', 150, 150, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
        result.current.handlers.onPointerUp(pointerUp);
      });

      expect(callbacks.onPathUnhighlight).toHaveBeenCalledWith(mockPath);
      expect(result.current.touchState.highlightedPath).toBeNull();
    });

    it('should unhighlight on cancel event', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);
      const pointerCancel = createMockPointerEvent('pointercancel', 150, 150, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
        result.current.handlers.onPointerCancel(pointerCancel);
      });

      expect(callbacks.onPathUnhighlight).toHaveBeenCalledWith(mockPath);
    });
  });

  /**
   * Behavior Test: Multi-touch handling
   */
  describe('Multi-Touch Scenarios', () => {
    it('should ignore secondary touches when primary touch is active', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown1 = createMockPointerEvent('pointerdown', 150, 150, mockPath, {
        pointerId: 1,
        isPrimary: true
      });

      const pointerDown2 = createMockPointerEvent('pointerdown', 200, 200, mockPath, {
        pointerId: 2,
        isPrimary: false
      });

      act(() => {
        result.current.handlers.onPointerDown(pointerDown1);
        result.current.handlers.onPointerDown(pointerDown2);
      });

      // Should only process first touch
      expect(callbacks.onPathTouchStart).toHaveBeenCalledTimes(1);
    });

    it('should only process events from the active pointer', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath, {
        pointerId: 1
      });

      const wrongPointerMove = createMockPointerEvent('pointermove', 160, 160, mockPath, {
        pointerId: 2
      });

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
        result.current.handlers.onPointerMove(wrongPointerMove);
      });

      expect(callbacks.onPathTouchMove).not.toHaveBeenCalled();
    });

    it('should allow new touch after previous touch completes', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown1 = createMockPointerEvent('pointerdown', 150, 150, mockPath, {
        pointerId: 1
      });
      const pointerUp1 = createMockPointerEvent('pointerup', 150, 150, mockPath, {
        pointerId: 1
      });

      const pointerDown2 = createMockPointerEvent('pointerdown', 200, 200, mockPath, {
        pointerId: 2
      });

      act(() => {
        result.current.handlers.onPointerDown(pointerDown1);
        result.current.handlers.onPointerUp(pointerUp1);
        result.current.handlers.onPointerDown(pointerDown2);
      });

      expect(callbacks.onPathTouchStart).toHaveBeenCalledTimes(2);
    });
  });

  /**
   * Behavior Test: Transformed SVG elements (viewBox, transforms)
   */
  describe('SVG Transformations', () => {
    it('should handle SVG with viewBox attribute', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      // Mock a viewBox transformation (e.g., viewBox="0 0 400 300" on 800x600 viewport)
      const scaleMatrix = createMockDOMMatrix();
      const inverseMatrix = createMockDOMMatrix();
      scaleMatrix.inverse.mockReturnValue(inverseMatrix);
      mockSvgRoot.getScreenCTM.mockReturnValue(scaleMatrix);

      const transformedPoint = createMockSVGPoint(75, 75); // Scaled coordinates
      const mockPoint = createMockSVGPoint(150, 150);
      mockPoint.matrixTransform = vi.fn(() => transformedPoint);
      mockSvgRoot.createSVGPoint.mockReturnValue(mockPoint);

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      expect(scaleMatrix.inverse).toHaveBeenCalled();
      expect(mockPoint.matrixTransform).toHaveBeenCalledWith(inverseMatrix);
    });

    it('should handle nested SVG groups with transforms', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      // Mock nested transform (e.g., <g transform="translate(50, 50)">)
      const groupMatrix = createMockDOMMatrix();
      mockPath.getScreenCTM.mockReturnValue(groupMatrix);

      const pointerDown = createMockPointerEvent('pointerdown', 200, 200, mockPath);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      // Should still work with nested transforms
      expect(mockSvgRoot.getScreenCTM).toHaveBeenCalled();
    });
  });

  /**
   * Behavior Test: Non-path elements (should ignore)
   */
  describe('Element Type Filtering', () => {
    it('should ignore touch on non-path SVG elements', () => {
      const mockRect = {
        ...createMockSVGPath(),
        tagName: 'rect'
      };

      vi.spyOn(document, 'elementFromPoint').mockReturnValue(mockRect as unknown as Element);

      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockRect);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      expect(callbacks.onPathTouchStart).not.toHaveBeenCalled();
    });

    it('should only process SVGPathElement targets', () => {
      const mockCircle = {
        ...createMockSVGPath(),
        tagName: 'circle'
      };

      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockCircle);

      act(() => {
        result.current.handlers.onPointerDown(pointerDown);
      });

      expect(result.current.touchState.targetPath).toBeNull();
    });
  });

  /**
   * Behavior Test: State management
   */
  describe('Touch State Management', () => {
    it('should maintain isActive state during touch sequence', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      expect(result.current.touchState.isActive).toBe(false);

      act(() => {
        const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);
        result.current.handlers.onPointerDown(pointerDown);
      });

      expect(result.current.touchState.isActive).toBe(true);

      act(() => {
        const pointerUp = createMockPointerEvent('pointerup', 150, 150, mockPath);
        result.current.handlers.onPointerUp(pointerUp);
      });

      expect(result.current.touchState.isActive).toBe(false);
    });

    it('should track targetPath during interaction', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      expect(result.current.touchState.targetPath).toBeNull();

      act(() => {
        const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);
        result.current.handlers.onPointerDown(pointerDown);
      });

      expect(result.current.touchState.targetPath).toBe(mockPath);
    });

    it('should reset state after touch completes', () => {
      const { result } = renderHook(() =>
        useSVGTouchInteraction(mockSvgRoot as unknown as SVGSVGElement, callbacks)
      );

      act(() => {
        const pointerDown = createMockPointerEvent('pointerdown', 150, 150, mockPath);
        const pointerUp = createMockPointerEvent('pointerup', 150, 150, mockPath);
        result.current.handlers.onPointerDown(pointerDown);
        result.current.handlers.onPointerUp(pointerUp);
      });

      expect(result.current.touchState.isActive).toBe(false);
      expect(result.current.touchState.targetPath).toBeNull();
      expect(result.current.touchState.highlightedPath).toBeNull();
    });
  });
});
