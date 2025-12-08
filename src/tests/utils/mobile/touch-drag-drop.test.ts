/**
 * Touch Drag-and-Drop Test Utilities - Unit Tests
 *
 * Tests the TouchDragDropSimulator with mocked DOM elements
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  TouchDragDropSimulator,
  touchDragDropSimulator,
  simulateDragDrop,
  dragToPosition,
  simulateCancelledDrag,
} from './touch-drag-drop';

/**
 * Create a mock element with getBoundingClientRect
 */
function createMockElement(rect: DOMRect): HTMLDivElement {
  const element = document.createElement('div');
  element.getBoundingClientRect = vi.fn(() => rect);

  // Mock dispatchEvent to track calls
  const originalDispatch = element.dispatchEvent.bind(element);
  element.dispatchEvent = vi.fn((event: Event) => {
    return originalDispatch(event);
  });

  return element;
}

/**
 * Create a mock DOMRect
 */
function createMockRect(
  left: number,
  top: number,
  width: number,
  height: number
): DOMRect {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  };
}

describe('TouchDragDropSimulator', () => {
  let simulator: TouchDragDropSimulator;
  let sourceElement: HTMLDivElement;
  let targetElement: HTMLDivElement;

  beforeEach(() => {
    vi.useFakeTimers();
    simulator = new TouchDragDropSimulator();
    sourceElement = createMockElement(createMockRect(0, 0, 100, 50));
    targetElement = createMockElement(createMockRect(200, 100, 100, 50));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getElementCenter', () => {
    it('calculates correct center position', () => {
      const center = simulator.getElementCenter(sourceElement);
      expect(center.x).toBe(50);
      expect(center.y).toBe(25);
    });

    it('handles element at different position', () => {
      const center = simulator.getElementCenter(targetElement);
      expect(center.x).toBe(250);
      expect(center.y).toBe(125);
    });
  });

  describe('simulateDragDrop', () => {
    it('dispatches touchstart, touchmove, and touchend events', async () => {
      const promise = simulator.simulateDragDrop(sourceElement, targetElement, {
        duration: 10,
        steps: 2,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.success).toBe(true);
      expect(sourceElement.dispatchEvent).toHaveBeenCalled();
      expect(targetElement.dispatchEvent).toHaveBeenCalled();

      const events = result.events;
      expect(events.some((e) => e.includes('Dispatched touchstart'))).toBe(true);
      expect(events.some((e) => e.includes('Dispatched touchend'))).toBe(true);
    });

    it('records correct start and end positions', async () => {
      const promise = simulator.simulateDragDrop(sourceElement, targetElement, {
        duration: 10,
        steps: 1,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.startPosition.x).toBe(50);
      expect(result.startPosition.y).toBe(25);
      expect(result.endPosition.x).toBe(250);
      expect(result.endPosition.y).toBe(125);
    });

    it('includes start delay when specified', async () => {
      const promise = simulator.simulateDragDrop(sourceElement, targetElement, {
        duration: 10,
        steps: 2,
        startDelay: 15,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.success).toBe(true);
      const events = result.events;
      expect(events.some((e) => e.includes('Delaying 15ms'))).toBe(true);
    });

    it('logs all events correctly', async () => {
      const promise = simulator.simulateDragDrop(sourceElement, targetElement, {
        duration: 10,
        steps: 3,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      const events = result.events;
      expect(events[0]).toContain('Starting drag-drop sequence');
      expect(events.some((e) => e.includes('Source:'))).toBe(true);
      expect(events.some((e) => e.includes('Target:'))).toBe(true);
      expect(events.some((e) => e.includes('Dispatched touchstart'))).toBe(true);
      expect(events.some((e) => e.includes('touchmove'))).toBe(true);
      expect(events.some((e) => e.includes('Dispatched touchend'))).toBe(true);
    });
  });

  describe('dragToPosition', () => {
    it('drags to specified coordinates', async () => {
      const targetX = 300;
      const targetY = 200;

      const promise = simulator.dragToPosition(sourceElement, targetX, targetY, {
        duration: 10,
        steps: 2,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.endPosition.x).toBe(targetX);
      expect(result.endPosition.y).toBe(targetY);
    });

    it('dispatches events on source element', async () => {
      const promise = simulator.dragToPosition(sourceElement, 300, 200, {
        duration: 5,
        steps: 1,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      await promise;

      expect(sourceElement.dispatchEvent).toHaveBeenCalled();
      const calls = (sourceElement.dispatchEvent as any).mock.calls;
      expect(calls.length).toBeGreaterThan(0);
    });

    it('logs position correctly', async () => {
      const promise = simulator.dragToPosition(sourceElement, 300, 200, {
        duration: 5,
        steps: 2,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      const events = result.events;
      expect(events.some((e) => e.includes('Starting drag to position'))).toBe(true);
      expect(events.some((e) => e.includes('Target: 300,200'))).toBe(true);
    });
  });

  describe('simulateCancelledDrag', () => {
    it('dispatches touchcancel instead of touchend', async () => {
      const promise = simulator.simulateCancelledDrag(sourceElement, {
        duration: 10,
        steps: 3,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.success).toBe(true);

      const events = result.events;
      expect(events.some((e) => e.includes('Dispatched touchcancel'))).toBe(true);
      expect(events.some((e) => e.includes('Starting cancelled drag'))).toBe(true);
    });

    it('drags to invalid position', async () => {
      const promise = simulator.simulateCancelledDrag(sourceElement, {
        duration: 5,
        steps: 2,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.endPosition.x).toBeGreaterThan(result.startPosition.x);
      expect(result.endPosition.y).toBeGreaterThan(result.startPosition.y);

      const events = result.events;
      expect(events.some((e) => e.includes('Invalid target'))).toBe(true);
    });
  });

  describe('simulateMultiTouchDrag', () => {
    it('dispatches multiple touchstart events', async () => {
      const promise = simulator.simulateMultiTouchDrag(sourceElement, {
        duration: 10,
        steps: 2,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.success).toBe(true);

      const events = result.events;
      expect(events.some((e) => e.includes('first touchstart'))).toBe(true);
      expect(events.some((e) => e.includes('second touchstart'))).toBe(true);
      expect(events.some((e) => e.includes('multi-touch'))).toBe(true);
    });

    it('attempts move after multi-touch', async () => {
      const promise = simulator.simulateMultiTouchDrag(sourceElement, {
        duration: 5,
        steps: 1,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      const events = result.events;
      expect(events.some((e) => e.includes('Attempted touchmove with multi-touch'))).toBe(true);
    });
  });

  describe('convenience functions', () => {
    it('simulateDragDrop convenience function works', async () => {
      const promise = simulateDragDrop(sourceElement, targetElement, {
        duration: 5,
        steps: 1,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.events.length).toBeGreaterThan(0);
    });

    it('dragToPosition convenience function works', async () => {
      const promise = dragToPosition(sourceElement, 100, 100, {
        duration: 5,
        steps: 1,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.endPosition.x).toBe(100);
      expect(result.endPosition.y).toBe(100);
    });

    it('simulateCancelledDrag convenience function works', async () => {
      const promise = simulateCancelledDrag(sourceElement, {
        duration: 5,
        steps: 1,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.success).toBe(true);
      expect(result.events.some((e) => e.includes('touchcancel'))).toBe(true);
    });
  });

  describe('singleton instance', () => {
    it('touchDragDropSimulator is available', () => {
      expect(touchDragDropSimulator).toBeInstanceOf(TouchDragDropSimulator);
    });

    it('singleton maintains event log across calls', async () => {
      const promise1 = touchDragDropSimulator.simulateDragDrop(sourceElement, targetElement, {
        duration: 5,
        steps: 1,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      await promise1;

      const log1 = touchDragDropSimulator.getEventLog();
      expect(log1.length).toBeGreaterThan(0);

      const promise2 = touchDragDropSimulator.dragToPosition(sourceElement, 100, 100, {
        duration: 5,
        steps: 1,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      await promise2;

      const log2 = touchDragDropSimulator.getEventLog();
      expect(log2.length).toBeGreaterThan(0);
      expect(log2).not.toEqual(log1);
    });
  });

  describe('error handling', () => {
    it('handles errors gracefully', async () => {
      const errorElement = createMockElement(createMockRect(0, 0, 100, 50));
      errorElement.dispatchEvent = vi.fn(() => {
        throw new Error('Dispatch failed');
      });

      const promise = simulator.simulateDragDrop(errorElement, targetElement, {
        duration: 5,
        steps: 1,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result.success).toBe(false);
      expect(result.events.some((e) => e.includes('Error:'))).toBe(true);
    });
  });

  describe('event interpolation', () => {
    it('creates smooth path between positions', async () => {
      const promise = simulator.simulateDragDrop(sourceElement, targetElement, {
        duration: 10,
        steps: 5,
        startDelay: 0,
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      const moveEvents = result.events.filter((e) => e.includes('touchmove') && e.includes('at'));
      expect(moveEvents.length).toBeGreaterThan(0);

      moveEvents.forEach((event) => {
        const match = event.match(/at (\d+),(\d+)/);
        if (match) {
          const x = parseInt(match[1], 10);
          const y = parseInt(match[2], 10);

          expect(x).toBeGreaterThanOrEqual(50);
          expect(x).toBeLessThanOrEqual(250);

          expect(y).toBeGreaterThanOrEqual(25);
          expect(y).toBeLessThanOrEqual(125);
        }
      });
    });
  });
});
