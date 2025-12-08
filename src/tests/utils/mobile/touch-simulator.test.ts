/**
 * Tests for TouchSimulator
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TouchSimulator } from './touch-simulator';

describe('TouchSimulator', () => {
  let simulator: TouchSimulator;
  let element: HTMLElement;
  let touchStartHandler: ReturnType<typeof vi.fn>;
  let touchMoveHandler: ReturnType<typeof vi.fn>;
  let touchEndHandler: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    simulator = new TouchSimulator();
    element = document.createElement('div');
    document.body.appendChild(element);

    touchStartHandler = vi.fn();
    touchMoveHandler = vi.fn();
    touchEndHandler = vi.fn();

    element.addEventListener('touchstart', touchStartHandler);
    element.addEventListener('touchmove', touchMoveHandler);
    element.addEventListener('touchend', touchEndHandler);
  });

  describe('createTouch', () => {
    it('should create a touch with all required properties', () => {
      const touch = simulator.createTouch({
        identifier: 1,
        clientX: 100,
        clientY: 200,
        target: element
      });

      expect(touch.identifier).toBe(1);
      expect(touch.clientX).toBe(100);
      expect(touch.clientY).toBe(200);
      expect(touch.target).toBe(element);
    });

    it('should use clientX/Y for pageX/Y if not specified', () => {
      const touch = simulator.createTouch({
        identifier: 1,
        clientX: 100,
        clientY: 200,
        target: element
      });

      expect(touch.pageX).toBe(100);
      expect(touch.pageY).toBe(200);
      expect(touch.screenX).toBe(100);
      expect(touch.screenY).toBe(200);
    });

    it('should use custom page coordinates if specified', () => {
      const touch = simulator.createTouch({
        identifier: 1,
        clientX: 100,
        clientY: 200,
        pageX: 150,
        pageY: 250,
        screenX: 175,
        screenY: 275,
        target: element
      });

      expect(touch.pageX).toBe(150);
      expect(touch.pageY).toBe(250);
      expect(touch.screenX).toBe(175);
      expect(touch.screenY).toBe(275);
    });
  });

  describe('simulateTap', () => {
    it('should trigger touchstart and touchend events', async () => {
      simulator.simulateTap(element, 100, 200);

      expect(touchStartHandler).toHaveBeenCalledTimes(1);

      // Wait for touchend
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(touchEndHandler).toHaveBeenCalledTimes(1);
    });

    it('should include correct touch coordinates', () => {
      simulator.simulateTap(element, 100, 200);

      const touchStartEvent = touchStartHandler.mock.calls[0][0] as TouchEvent;
      const touch = touchStartEvent.touches[0];

      expect(touch.clientX).toBe(100);
      expect(touch.clientY).toBe(200);
    });
  });

  describe('simulateSwipe', () => {
    it('should trigger touchstart, touchmove, and touchend events', async () => {
      await simulator.simulateSwipe(element, {
        startX: 100,
        startY: 200,
        endX: 300,
        endY: 200,
        duration: 100,
        steps: 5
      });

      expect(touchStartHandler).toHaveBeenCalledTimes(1);
      expect(touchMoveHandler).toHaveBeenCalled();
      expect(touchEndHandler).toHaveBeenCalledTimes(1);
    });

    it('should move through intermediate positions', async () => {
      await simulator.simulateSwipe(element, {
        startX: 0,
        startY: 0,
        endX: 100,
        endY: 0,
        duration: 100,
        steps: 5
      });

      const moveCalls = touchMoveHandler.mock.calls;
      expect(moveCalls.length).toBeGreaterThan(0);

      // Check that X coordinate increases
      const firstMoveX = (moveCalls[0][0] as TouchEvent).touches[0].clientX;
      const lastMoveX = (moveCalls[moveCalls.length - 1][0] as TouchEvent).touches[0].clientX;
      expect(lastMoveX).toBeGreaterThan(firstMoveX);
    });
  });

  describe('simulatePinch', () => {
    it('should trigger touchstart with two touches', async () => {
      await simulator.simulatePinch(element, {
        centerX: 200,
        centerY: 200,
        startDistance: 100,
        endDistance: 200,
        duration: 100,
        steps: 5
      });

      expect(touchStartHandler).toHaveBeenCalledTimes(1);
      const touchStartEvent = touchStartHandler.mock.calls[0][0] as TouchEvent;
      expect(touchStartEvent.touches.length).toBe(2);
    });

    it('should move touches apart for zoom out', async () => {
      await simulator.simulatePinch(element, {
        centerX: 200,
        centerY: 200,
        startDistance: 100,
        endDistance: 200,
        duration: 100,
        steps: 5
      });

      const moveCalls = touchMoveHandler.mock.calls;
      expect(moveCalls.length).toBeGreaterThan(0);

      // Check that distance between touches increases
      const firstMove = moveCalls[0][0] as TouchEvent;
      const lastMove = moveCalls[moveCalls.length - 1][0] as TouchEvent;

      const firstDistance = Math.abs(
        firstMove.touches[1].clientX - firstMove.touches[0].clientX
      );
      const lastDistance = Math.abs(
        lastMove.touches[1].clientX - lastMove.touches[0].clientX
      );

      expect(lastDistance).toBeGreaterThan(firstDistance);
    });
  });

  describe('simulateLongPress', () => {
    it('should trigger touchstart and touchend after duration', async () => {
      const startTime = Date.now();

      await simulator.simulateLongPress(element, 100, 200, 200);

      const duration = Date.now() - startTime;

      expect(touchStartHandler).toHaveBeenCalledTimes(1);
      expect(touchEndHandler).toHaveBeenCalledTimes(1);
      expect(duration).toBeGreaterThanOrEqual(200);
    });
  });

  describe('simulateDoubleTap', () => {
    it('should trigger two tap sequences', async () => {
      await simulator.simulateDoubleTap(element, 100, 200, 50);

      // Wait for all events to complete
      await new Promise(resolve => setTimeout(resolve, 200));

      // Should have touchstart called twice (once per tap)
      expect(touchStartHandler).toHaveBeenCalledTimes(2);
      expect(touchEndHandler).toHaveBeenCalledTimes(2);
    });
  });

  describe('reset', () => {
    it('should reset touch identifier counter', () => {
      simulator.createTouch({
        identifier: 0,
        clientX: 100,
        clientY: 200,
        target: element
      });

      simulator.reset();

      simulator.simulateTap(element, 100, 200);

      const touchStartEvent = touchStartHandler.mock.calls[0][0] as TouchEvent;
      expect(touchStartEvent.touches[0].identifier).toBe(0);
    });
  });
});
