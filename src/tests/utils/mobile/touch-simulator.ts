/**
 * Touch Event Testing Infrastructure
 * Provides utilities for simulating touch gestures in tests
 */

export interface TouchOptions {
  identifier: number;
  clientX: number;
  clientY: number;
  pageX?: number;
  pageY?: number;
  screenX?: number;
  screenY?: number;
  target?: EventTarget;
}

export interface SwipeOptions {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration?: number;
  steps?: number;
}

export interface PinchOptions {
  centerX: number;
  centerY: number;
  startDistance: number;
  endDistance: number;
  duration?: number;
  steps?: number;
}

/**
 * Creates a TouchList from an array of Touch objects
 */
function createTouchList(touches: Touch[]): TouchList {
  const touchList = {
    length: touches.length,
    item: (index: number) => touches[index] ?? null,
    [Symbol.iterator]: function* () {
      for (const touch of touches) yield touch;
    }
  };
  // Add indexed access
  touches.forEach((touch, index) => {
    (touchList as any)[index] = touch;
  });
  return touchList as unknown as TouchList;
}

/**
 * TouchSimulator - Utility class for simulating touch events in tests
 */
export class TouchSimulator {
  private touchCounter = 0;

  /**
   * Creates a Touch object with specified properties
   */
  createTouch(options: TouchOptions): Touch {
    const {
      identifier,
      clientX,
      clientY,
      pageX = clientX,
      pageY = clientY,
      screenX = clientX,
      screenY = clientY,
      target = document.body
    } = options;

    return {
      identifier,
      target,
      clientX,
      clientY,
      pageX,
      pageY,
      screenX,
      screenY,
      radiusX: 10,
      radiusY: 10,
      rotationAngle: 0,
      force: 1
    } as Touch;
  }

  /**
   * Simulates a single tap gesture
   */
  simulateTap(element: HTMLElement, x: number, y: number): void {
    const touchId = this.touchCounter++;

    const touch = this.createTouch({
      identifier: touchId,
      clientX: x,
      clientY: y,
      target: element
    });

    const touchList = createTouchList([touch]);

    // TouchStart
    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      touches: touchList as any,
      targetTouches: touchList as any,
      changedTouches: touchList as any
    });
    element.dispatchEvent(touchStartEvent);

    // TouchEnd (after brief delay)
    setTimeout(() => {
      const emptyList = createTouchList([]);
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        touches: emptyList as any,
        targetTouches: emptyList as any,
        changedTouches: touchList as any
      });
      element.dispatchEvent(touchEndEvent);
    }, 50);
  }

  /**
   * Simulates a swipe gesture with direction and duration
   */
  async simulateSwipe(
    element: HTMLElement,
    options: SwipeOptions
  ): Promise<void> {
    const {
      startX,
      startY,
      endX,
      endY,
      duration = 300,
      steps = 10
    } = options;

    const touchId = this.touchCounter++;
    const stepDuration = duration / steps;
    const deltaX = (endX - startX) / steps;
    const deltaY = (endY - startY) / steps;

    // TouchStart
    const startTouch = this.createTouch({
      identifier: touchId,
      clientX: startX,
      clientY: startY,
      target: element
    });

    const startTouchList = createTouchList([startTouch]);
    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      touches: startTouchList as any,
      targetTouches: startTouchList as any,
      changedTouches: startTouchList as any
    });
    element.dispatchEvent(touchStartEvent);

    // TouchMove steps
    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));

      const currentX = startX + deltaX * i;
      const currentY = startY + deltaY * i;

      const moveTouch = this.createTouch({
        identifier: touchId,
        clientX: currentX,
        clientY: currentY,
        target: element
      });

      const moveTouchList = createTouchList([moveTouch]);
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: moveTouchList as any,
        targetTouches: moveTouchList as any,
        changedTouches: moveTouchList as any
      });
      element.dispatchEvent(touchMoveEvent);
    }

    // TouchEnd
    const endTouch = this.createTouch({
      identifier: touchId,
      clientX: endX,
      clientY: endY,
      target: element
    });

    const emptyList = createTouchList([]);
    const endTouchList = createTouchList([endTouch]);
    const touchEndEvent = new TouchEvent('touchend', {
      bubbles: true,
      cancelable: true,
      touches: emptyList as any,
      targetTouches: emptyList as any,
      changedTouches: endTouchList as any
    });
    element.dispatchEvent(touchEndEvent);
  }

  /**
   * Simulates a two-finger pinch gesture
   */
  async simulatePinch(
    element: HTMLElement,
    options: PinchOptions
  ): Promise<void> {
    const {
      centerX,
      centerY,
      startDistance,
      endDistance,
      duration = 300,
      steps = 10
    } = options;

    const touchId1 = this.touchCounter++;
    const touchId2 = this.touchCounter++;
    const stepDuration = duration / steps;
    const distanceDelta = (endDistance - startDistance) / steps;

    // Calculate initial touch positions
    const halfStartDist = startDistance / 2;
    const touch1StartX = centerX - halfStartDist;
    const touch2StartX = centerX + halfStartDist;

    // TouchStart with two fingers
    const startTouches = [
      this.createTouch({
        identifier: touchId1,
        clientX: touch1StartX,
        clientY: centerY,
        target: element
      }),
      this.createTouch({
        identifier: touchId2,
        clientX: touch2StartX,
        clientY: centerY,
        target: element
      })
    ];

    const startTouchList = createTouchList(startTouches);
    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      touches: startTouchList as any,
      targetTouches: startTouchList as any,
      changedTouches: startTouchList as any
    });
    element.dispatchEvent(touchStartEvent);

    // TouchMove steps
    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));

      const currentDistance = startDistance + distanceDelta * i;
      const halfCurrentDist = currentDistance / 2;

      const moveTouches = [
        this.createTouch({
          identifier: touchId1,
          clientX: centerX - halfCurrentDist,
          clientY: centerY,
          target: element
        }),
        this.createTouch({
          identifier: touchId2,
          clientX: centerX + halfCurrentDist,
          clientY: centerY,
          target: element
        })
      ];

      const moveTouchList = createTouchList(moveTouches);
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: moveTouchList as any,
        targetTouches: moveTouchList as any,
        changedTouches: moveTouchList as any
      });
      element.dispatchEvent(touchMoveEvent);
    }

    // TouchEnd
    const halfEndDist = endDistance / 2;
    const endTouches = [
      this.createTouch({
        identifier: touchId1,
        clientX: centerX - halfEndDist,
        clientY: centerY,
        target: element
      }),
      this.createTouch({
        identifier: touchId2,
        clientX: centerX + halfEndDist,
        clientY: centerY,
        target: element
      })
    ];

    const emptyList = createTouchList([]);
    const endTouchList = createTouchList(endTouches);
    const touchEndEvent = new TouchEvent('touchend', {
      bubbles: true,
      cancelable: true,
      touches: emptyList as any,
      targetTouches: emptyList as any,
      changedTouches: endTouchList as any
    });
    element.dispatchEvent(touchEndEvent);
  }

  /**
   * Simulates a long press gesture
   */
  async simulateLongPress(
    element: HTMLElement,
    x: number,
    y: number,
    duration = 500
  ): Promise<void> {
    const touchId = this.touchCounter++;

    const touch = this.createTouch({
      identifier: touchId,
      clientX: x,
      clientY: y,
      target: element
    });

    const touchList = createTouchList([touch]);

    // TouchStart
    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      touches: touchList as any,
      targetTouches: touchList as any,
      changedTouches: touchList as any
    });
    element.dispatchEvent(touchStartEvent);

    // Wait for duration
    await new Promise(resolve => setTimeout(resolve, duration));

    // TouchEnd
    const emptyList = createTouchList([]);
    const touchEndEvent = new TouchEvent('touchend', {
      bubbles: true,
      cancelable: true,
      touches: emptyList as any,
      targetTouches: emptyList as any,
      changedTouches: touchList as any
    });
    element.dispatchEvent(touchEndEvent);
  }

  /**
   * Simulates a double tap gesture
   */
  async simulateDoubleTap(
    element: HTMLElement,
    x: number,
    y: number,
    delay = 100
  ): Promise<void> {
    // First tap
    this.simulateTap(element, x, y);

    // Wait between taps
    await new Promise(resolve => setTimeout(resolve, delay));

    // Second tap
    this.simulateTap(element, x, y);
  }

  /**
   * Resets the touch identifier counter
   */
  reset(): void {
    this.touchCounter = 0;
  }
}

/**
 * Default singleton instance for convenience
 */
export const touchSimulator = new TouchSimulator();
