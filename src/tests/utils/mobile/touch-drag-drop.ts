/**
 * Touch Drag-and-Drop Test Utilities
 *
 * Provides comprehensive utilities for testing touch-based drag-and-drop
 * interactions with @dnd-kit/core. Supports async event simulation with
 * configurable timing and tracking.
 */

export interface DragDropOptions {
  /** Duration of the drag in milliseconds */
  duration?: number;
  /** Number of intermediate move events */
  steps?: number;
  /** Delay before starting drag (for long-press detection) */
  startDelay?: number;
  /** Whether to use getBoundingClientRect for positioning (default: true) */
  useClientRect?: boolean;
}

export interface DragDropResult {
  success: boolean;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  events: string[];
}

export interface Position {
  x: number;
  y: number;
}

/**
 * Default options for drag-drop simulation
 */
const DEFAULT_OPTIONS: Required<DragDropOptions> = {
  duration: 300,
  steps: 5,
  startDelay: 100,
  useClientRect: true,
};

/**
 * Create a touch-like object with all required properties
 */
function createTouch(
  element: Element,
  position: Position,
  identifier: number = 0
): Touch {
  return {
    identifier,
    target: element,
    clientX: position.x,
    clientY: position.y,
    screenX: position.x,
    screenY: position.y,
    pageX: position.x,
    pageY: position.y,
    radiusX: 10,
    radiusY: 10,
    rotationAngle: 0,
    force: 1,
  } as Touch;
}

/**
 * Utility to create a touch event
 * Works with both real browsers and jsdom test environment
 */
function createTouchEvent(
  type: string,
  element: Element,
  position: Position,
  identifier: number = 0
): TouchEvent {
  const touch = createTouch(element, position, identifier);

  // Create touch arrays
  const activeTouches = type === 'touchend' || type === 'touchcancel' ? [] : [touch];
  const changedTouches = [touch];

  try {
    // Try standard TouchEvent constructor
    const touchEvent = new TouchEvent(type, {
      bubbles: true,
      cancelable: true,
      touches: activeTouches as unknown as Touch[],
      targetTouches: activeTouches as unknown as Touch[],
      changedTouches: changedTouches as unknown as Touch[],
      view: window,
    });
    return touchEvent;
  } catch (error) {
    // Fallback for test environments that don't support TouchEvent
    const event = new Event(type, {
      bubbles: true,
      cancelable: true,
    });

    // Manually add touch properties
    Object.defineProperty(event, 'touches', {
      value: activeTouches,
      writable: false,
    });
    Object.defineProperty(event, 'targetTouches', {
      value: activeTouches,
      writable: false,
    });
    Object.defineProperty(event, 'changedTouches', {
      value: changedTouches,
      writable: false,
    });

    return event as TouchEvent;
  }
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Interpolate between two positions
 */
function interpolatePosition(
  start: Position,
  end: Position,
  progress: number
): Position {
  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress,
  };
}

/**
 * Touch Drag-and-Drop Simulator
 *
 * Provides methods to simulate complete touch drag-drop sequences
 * with realistic timing and event generation.
 */
export class TouchDragDropSimulator {
  private eventLog: string[] = [];

  /**
   * Get the center coordinates of an element
   */
  getElementCenter(element: Element): Position {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  /**
   * Log an event for debugging
   */
  private logEvent(event: string): void {
    this.eventLog.push(event);
  }

  /**
   * Clear the event log
   */
  private clearLog(): void {
    this.eventLog = [];
  }

  /**
   * Get a copy of the current event log
   */
  getEventLog(): string[] {
    return [...this.eventLog];
  }

  /**
   * Simulate a complete drag-drop sequence from source to target
   *
   * @param source - The element to drag
   * @param target - The element to drop onto
   * @param options - Configuration options
   * @returns Result containing success status, positions, and events
   */
  async simulateDragDrop(
    source: Element,
    target: Element,
    options?: DragDropOptions
  ): Promise<DragDropResult> {
    this.clearLog();
    const opts = { ...DEFAULT_OPTIONS, ...options };

    const startPosition = this.getElementCenter(source);
    const endPosition = this.getElementCenter(target);

    this.logEvent('Starting drag-drop sequence');
    this.logEvent(`Source: ${startPosition.x},${startPosition.y}`);
    this.logEvent(`Target: ${endPosition.x},${endPosition.y}`);

    try {
      // 1. Start delay (for long-press detection)
      if (opts.startDelay > 0) {
        this.logEvent(`Delaying ${opts.startDelay}ms before start`);
        await sleep(opts.startDelay);
      }

      // 2. Touch start
      const touchStartEvent = createTouchEvent('touchstart', source, startPosition);
      source.dispatchEvent(touchStartEvent);
      this.logEvent('Dispatched touchstart');

      // 3. Initial move to "activate" the drag
      await sleep(50);
      const initialMove = interpolatePosition(startPosition, endPosition, 0.1);
      const initialMoveEvent = createTouchEvent('touchmove', source, initialMove);
      source.dispatchEvent(initialMoveEvent);
      this.logEvent('Dispatched initial touchmove');

      // 4. Intermediate moves
      const stepDuration = opts.duration / opts.steps;
      for (let i = 1; i <= opts.steps; i++) {
        await sleep(stepDuration);
        const progress = i / opts.steps;
        const currentPosition = interpolatePosition(startPosition, endPosition, progress);

        const touchMoveEvent = createTouchEvent('touchmove', source, currentPosition);
        source.dispatchEvent(touchMoveEvent);
        this.logEvent(`Dispatched touchmove ${i}/${opts.steps} at ${currentPosition.x.toFixed(0)},${currentPosition.y.toFixed(0)}`);
      }

      // 5. Touch end at target
      const touchEndEvent = createTouchEvent('touchend', target, endPosition);
      target.dispatchEvent(touchEndEvent);
      this.logEvent('Dispatched touchend at target');

      return {
        success: true,
        startPosition,
        endPosition,
        events: this.getEventLog(),
      };
    } catch (error) {
      this.logEvent(`Error: ${error instanceof Error ? error.message : String(error)}`);
      return {
        success: false,
        startPosition,
        endPosition,
        events: this.getEventLog(),
      };
    }
  }

  /**
   * Simulate dragging to a specific position (not necessarily a target element)
   *
   * @param element - The element to drag
   * @param targetX - Target X coordinate
   * @param targetY - Target Y coordinate
   * @param options - Configuration options
   * @returns Result containing success status, positions, and events
   */
  async dragToPosition(
    element: Element,
    targetX: number,
    targetY: number,
    options?: DragDropOptions
  ): Promise<DragDropResult> {
    this.clearLog();
    const opts = { ...DEFAULT_OPTIONS, ...options };

    const startPosition = this.getElementCenter(element);
    const endPosition = { x: targetX, y: targetY };

    this.logEvent('Starting drag to position');
    this.logEvent(`Start: ${startPosition.x},${startPosition.y}`);
    this.logEvent(`Target: ${endPosition.x},${endPosition.y}`);

    try {
      // 1. Start delay
      if (opts.startDelay > 0) {
        await sleep(opts.startDelay);
      }

      // 2. Touch start
      const touchStartEvent = createTouchEvent('touchstart', element, startPosition);
      element.dispatchEvent(touchStartEvent);
      this.logEvent('Dispatched touchstart');

      // 3. Initial move
      await sleep(50);
      const initialMove = interpolatePosition(startPosition, endPosition, 0.1);
      const initialMoveEvent = createTouchEvent('touchmove', element, initialMove);
      element.dispatchEvent(initialMoveEvent);
      this.logEvent('Dispatched initial touchmove');

      // 4. Intermediate moves
      const stepDuration = opts.duration / opts.steps;
      for (let i = 1; i <= opts.steps; i++) {
        await sleep(stepDuration);
        const progress = i / opts.steps;
        const currentPosition = interpolatePosition(startPosition, endPosition, progress);

        const touchMoveEvent = createTouchEvent('touchmove', element, currentPosition);
        element.dispatchEvent(touchMoveEvent);
        this.logEvent(`Dispatched touchmove ${i}/${opts.steps}`);
      }

      // 5. Touch end at final position
      const touchEndEvent = createTouchEvent('touchend', element, endPosition);
      element.dispatchEvent(touchEndEvent);
      this.logEvent('Dispatched touchend');

      return {
        success: true,
        startPosition,
        endPosition,
        events: this.getEventLog(),
      };
    } catch (error) {
      this.logEvent(`Error: ${error instanceof Error ? error.message : String(error)}`);
      return {
        success: false,
        startPosition,
        endPosition,
        events: this.getEventLog(),
      };
    }
  }

  /**
   * Simulate a cancelled drag (drop outside valid area or interrupted)
   *
   * @param element - The element to drag
   * @param options - Configuration options
   * @returns Result containing success status, positions, and events
   */
  async simulateCancelledDrag(
    element: Element,
    options?: DragDropOptions
  ): Promise<DragDropResult> {
    this.clearLog();
    const opts = { ...DEFAULT_OPTIONS, ...options };

    const startPosition = this.getElementCenter(element);
    // Drag to an invalid position (far outside the element)
    const endPosition = {
      x: startPosition.x + 200,
      y: startPosition.y + 200,
    };

    this.logEvent('Starting cancelled drag');
    this.logEvent(`Start: ${startPosition.x},${startPosition.y}`);
    this.logEvent(`Invalid target: ${endPosition.x},${endPosition.y}`);

    try {
      // 1. Start delay
      if (opts.startDelay > 0) {
        await sleep(opts.startDelay);
      }

      // 2. Touch start
      const touchStartEvent = createTouchEvent('touchstart', element, startPosition);
      element.dispatchEvent(touchStartEvent);
      this.logEvent('Dispatched touchstart');

      // 3. Initial move
      await sleep(50);
      const initialMove = interpolatePosition(startPosition, endPosition, 0.1);
      const initialMoveEvent = createTouchEvent('touchmove', element, initialMove);
      element.dispatchEvent(initialMoveEvent);
      this.logEvent('Dispatched initial touchmove');

      // 4. Few intermediate moves
      const stepDuration = opts.duration / 3; // Shorter cancelled drag
      for (let i = 1; i <= 3; i++) {
        await sleep(stepDuration);
        const progress = i / 3;
        const currentPosition = interpolatePosition(startPosition, endPosition, progress);

        const touchMoveEvent = createTouchEvent('touchmove', element, currentPosition);
        element.dispatchEvent(touchMoveEvent);
        this.logEvent(`Dispatched touchmove ${i}/3`);
      }

      // 5. Touch cancel (instead of touchend)
      const touchCancelEvent = createTouchEvent('touchcancel', element, endPosition);
      element.dispatchEvent(touchCancelEvent);
      this.logEvent('Dispatched touchcancel');

      return {
        success: true, // Successfully simulated a cancel
        startPosition,
        endPosition,
        events: this.getEventLog(),
      };
    } catch (error) {
      this.logEvent(`Error: ${error instanceof Error ? error.message : String(error)}`);
      return {
        success: false,
        startPosition,
        endPosition,
        events: this.getEventLog(),
      };
    }
  }

  /**
   * Simulate a multi-touch drag (for testing touch rejection)
   *
   * @param element - The element to drag
   * @param options - Configuration options
   * @returns Result indicating if multi-touch was properly handled
   */
  async simulateMultiTouchDrag(
    element: Element,
    options?: DragDropOptions
  ): Promise<DragDropResult> {
    this.clearLog();
    // Merge options with defaults (currently unused but reserved for future enhancements)
    const _opts = { ...DEFAULT_OPTIONS, ...options };
    void _opts; // Mark as intentionally unused

    const startPosition = this.getElementCenter(element);
    const endPosition = {
      x: startPosition.x + 100,
      y: startPosition.y + 100,
    };

    this.logEvent('Starting multi-touch drag test');

    try {
      // 1. First touch
      const touch1Start = createTouchEvent('touchstart', element, startPosition, 0);
      element.dispatchEvent(touch1Start);
      this.logEvent('Dispatched first touchstart');

      await sleep(50);

      // 2. Second touch (should invalidate drag)
      const secondTouchPos = { x: startPosition.x + 50, y: startPosition.y + 50 };
      const touch2Start = createTouchEvent('touchstart', element, secondTouchPos, 1);
      element.dispatchEvent(touch2Start);
      this.logEvent('Dispatched second touchstart (multi-touch)');

      await sleep(100);

      // 3. Try to continue dragging (should be blocked)
      const moveEvent = createTouchEvent('touchmove', element, endPosition, 0);
      element.dispatchEvent(moveEvent);
      this.logEvent('Attempted touchmove with multi-touch');

      // 4. Release
      const touchEnd = createTouchEvent('touchend', element, endPosition, 0);
      element.dispatchEvent(touchEnd);
      this.logEvent('Dispatched touchend');

      return {
        success: true,
        startPosition,
        endPosition,
        events: this.getEventLog(),
      };
    } catch (error) {
      this.logEvent(`Error: ${error instanceof Error ? error.message : String(error)}`);
      return {
        success: false,
        startPosition,
        endPosition,
        events: this.getEventLog(),
      };
    }
  }
}

/**
 * Create a singleton instance for ease of use
 */
export const touchDragDropSimulator = new TouchDragDropSimulator();

/**
 * Convenience function for quick drag-drop simulation
 */
export async function simulateDragDrop(
  source: Element,
  target: Element,
  options?: DragDropOptions
): Promise<DragDropResult> {
  return touchDragDropSimulator.simulateDragDrop(source, target, options);
}

/**
 * Convenience function for dragging to a position
 */
export async function dragToPosition(
  element: Element,
  targetX: number,
  targetY: number,
  options?: DragDropOptions
): Promise<DragDropResult> {
  return touchDragDropSimulator.dragToPosition(element, targetX, targetY, options);
}

/**
 * Convenience function for simulating a cancelled drag
 */
export async function simulateCancelledDrag(
  element: Element,
  options?: DragDropOptions
): Promise<DragDropResult> {
  return touchDragDropSimulator.simulateCancelledDrag(element, options);
}
