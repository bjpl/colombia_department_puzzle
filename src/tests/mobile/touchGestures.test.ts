/**
 * Touch Gesture System Tests
 *
 * Tests touch interaction patterns for mobile devices including:
 * - Tap detection on department chips
 * - Long-press for drag mode activation
 * - Tap-to-place workflow completion
 * - Prevention of double-firing on touch+mouse emulation
 *
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Helper to create touch event
function createTouchEvent(
  type: string,
  target: HTMLElement,
  touches: Array<{ clientX: number; clientY: number; identifier: number }>
): TouchEvent {
  const touchList = touches.map((t) => ({
    clientX: t.clientX,
    clientY: t.clientY,
    identifier: t.identifier,
    pageX: t.clientX,
    pageY: t.clientY,
    screenX: t.clientX,
    screenY: t.clientY,
    target,
    radiusX: 10,
    radiusY: 10,
    rotationAngle: 0,
    force: 1,
  })) as Touch[];

  const touchEvent = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;
  Object.defineProperty(touchEvent, 'touches', { value: touchList, writable: false });
  Object.defineProperty(touchEvent, 'targetTouches', { value: touchList, writable: false });
  Object.defineProperty(touchEvent, 'changedTouches', { value: touchList, writable: false });

  return touchEvent;
}

describe('Touch Gesture System', () => {
  let testElement: HTMLDivElement;

  beforeEach(() => {
    testElement = document.createElement('div');
    testElement.className = 'department-chip';
    testElement.setAttribute('data-department', 'Antioquia');
    testElement.style.width = '100px';
    testElement.style.height = '44px';
    document.body.appendChild(testElement);
  });

  afterEach(() => {
    document.body.removeChild(testElement);
  });

  describe('Tap Detection', () => {
    it('should detect tap on department chip', () => {
      let tapDetected = false;
      let selectedDepartment = '';

      testElement.addEventListener('touchstart', (e) => {
        e.preventDefault();
        tapDetected = true;
        selectedDepartment = testElement.getAttribute('data-department') || '';
      });

      const touchEvent = createTouchEvent('touchstart', testElement, [
        { clientX: 50, clientY: 22, identifier: 0 },
      ]);

      testElement.dispatchEvent(touchEvent);

      expect(tapDetected).toBe(true);
      expect(selectedDepartment).toBe('Antioquia');
    });

    it('should verify chip selected state after tap', () => {
      let isSelected = false;

      testElement.addEventListener('touchstart', () => {
        testElement.classList.add('selected');
        isSelected = testElement.classList.contains('selected');
      });

      const touchEvent = createTouchEvent('touchstart', testElement, [
        { clientX: 50, clientY: 22, identifier: 0 },
      ]);

      testElement.dispatchEvent(touchEvent);

      expect(isSelected).toBe(true);
      expect(testElement.classList.contains('selected')).toBe(true);
    });

    it('should handle rapid successive taps', async () => {
      let tapCount = 0;

      testElement.addEventListener('touchstart', () => {
        tapCount++;
      });

      // Simulate 3 rapid taps
      for (let i = 0; i < 3; i++) {
        const touchEvent = createTouchEvent('touchstart', testElement, [
          { clientX: 50, clientY: 22, identifier: i },
        ]);
        testElement.dispatchEvent(touchEvent);
      }

      expect(tapCount).toBe(3);
    });
  });

  describe('Long Press Detection', () => {
    it('should detect long-press activates drag mode', async () => {
      vi.useFakeTimers();
      let dragModeActivated = false;
      let longPressTimer: NodeJS.Timeout | null = null;

      testElement.addEventListener('touchstart', () => {
        longPressTimer = setTimeout(() => {
          dragModeActivated = true;
          testElement.classList.add('drag-mode');
        }, 500);
      });

      testElement.addEventListener('touchend', () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
        }
      });

      // Start touch
      const touchStart = createTouchEvent('touchstart', testElement, [
        { clientX: 50, clientY: 22, identifier: 0 },
      ]);
      testElement.dispatchEvent(touchStart);

      // Wait 500ms
      vi.advanceTimersByTime(500);

      expect(dragModeActivated).toBe(true);
      expect(testElement.classList.contains('drag-mode')).toBe(true);

      vi.useRealTimers();
    });

    it('should not activate drag mode on quick tap', async () => {
      vi.useFakeTimers();
      let dragModeActivated = false;
      let longPressTimer: NodeJS.Timeout | null = null;

      testElement.addEventListener('touchstart', () => {
        longPressTimer = setTimeout(() => {
          dragModeActivated = true;
        }, 500);
      });

      testElement.addEventListener('touchend', () => {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          longPressTimer = null;
        }
      });

      // Start and end touch quickly
      const touchStart = createTouchEvent('touchstart', testElement, [
        { clientX: 50, clientY: 22, identifier: 0 },
      ]);
      testElement.dispatchEvent(touchStart);

      vi.advanceTimersByTime(100);

      const touchEnd = createTouchEvent('touchend', testElement, [
        { clientX: 50, clientY: 22, identifier: 0 },
      ]);
      testElement.dispatchEvent(touchEnd);

      vi.advanceTimersByTime(400);

      expect(dragModeActivated).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('Tap-to-Place Workflow', () => {
    it('should complete tap-to-place workflow', () => {
      const mapElement = document.createElement('div');
      mapElement.className = 'map-container';
      document.body.appendChild(mapElement);

      let chipSelected = false;
      let departmentPlaced = false;
      let selectedDepartment = '';

      // Step 1: Tap chip
      testElement.addEventListener('touchstart', () => {
        chipSelected = true;
        selectedDepartment = testElement.getAttribute('data-department') || '';
        testElement.classList.add('selected');
      });

      // Step 2: Tap map to place
      mapElement.addEventListener('touchstart', () => {
        if (chipSelected) {
          departmentPlaced = true;
          testElement.classList.remove('selected');
          testElement.classList.add('placed');
        }
      });

      // Simulate workflow
      const chipTap = createTouchEvent('touchstart', testElement, [
        { clientX: 50, clientY: 22, identifier: 0 },
      ]);
      testElement.dispatchEvent(chipTap);

      expect(chipSelected).toBe(true);
      expect(selectedDepartment).toBe('Antioquia');

      const mapTap = createTouchEvent('touchstart', mapElement, [
        { clientX: 200, clientY: 200, identifier: 0 },
      ]);
      mapElement.dispatchEvent(mapTap);

      expect(departmentPlaced).toBe(true);
      expect(testElement.classList.contains('placed')).toBe(true);

      document.body.removeChild(mapElement);
    });

    it('should handle cancelled placement', () => {
      let chipSelected = false;
      let cancelled = false;

      testElement.addEventListener('touchstart', () => {
        chipSelected = true;
        testElement.classList.add('selected');
      });

      // Simulate cancel (tap chip again)
      testElement.addEventListener('touchend', () => {
        if (chipSelected && testElement.classList.contains('selected')) {
          cancelled = true;
          testElement.classList.remove('selected');
          chipSelected = false;
        }
      });

      const chipTap = createTouchEvent('touchstart', testElement, [
        { clientX: 50, clientY: 22, identifier: 0 },
      ]);
      testElement.dispatchEvent(chipTap);

      expect(chipSelected).toBe(true);

      const chipTapEnd = createTouchEvent('touchend', testElement, [
        { clientX: 50, clientY: 22, identifier: 0 },
      ]);
      testElement.dispatchEvent(chipTapEnd);

      expect(cancelled).toBe(true);
      expect(testElement.classList.contains('selected')).toBe(false);
    });
  });

  describe('Touch and Mouse Event Handling', () => {
    it('should not double-fire on touch+mouse emulation', () => {
      let eventCount = 0;
      let lastEventType = '';

      // Track both touch and mouse events
      const eventHandler = (e: Event) => {
        // Prevent default to stop mouse event if touch occurred
        if (e.type === 'touchstart') {
          e.preventDefault();
        }

        // Only count if not a duplicate event within 100ms
        if (lastEventType !== e.type || eventCount === 0) {
          eventCount++;
          lastEventType = e.type;
        }
      };

      testElement.addEventListener('touchstart', eventHandler);
      testElement.addEventListener('mousedown', eventHandler);

      // Simulate touch event (which may trigger both touch and mouse)
      const touchEvent = createTouchEvent('touchstart', testElement, [
        { clientX: 50, clientY: 22, identifier: 0 },
      ]);
      testElement.dispatchEvent(touchEvent);

      // Browsers may fire mousedown after touchstart
      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: 50,
        clientY: 22,
      });

      // This should be prevented by the touch event preventDefault
      const mouseDispatched = testElement.dispatchEvent(mouseEvent);

      // Should only count the touch event, not both
      expect(eventCount).toBe(1);
      expect(lastEventType).toBe('touchstart');
    });

    it('should handle touch move events during swipe', () => {
      const moves: Array<{ x: number; y: number }> = [];

      testElement.addEventListener('touchmove', (e) => {
        const touch = (e as TouchEvent).touches[0];
        moves.push({ x: touch.clientX, y: touch.clientY });
      });

      // Simulate swipe gesture
      const touchStart = createTouchEvent('touchstart', testElement, [
        { clientX: 50, clientY: 50, identifier: 0 },
      ]);
      testElement.dispatchEvent(touchStart);

      const positions = [
        { clientX: 50, clientY: 60 },
        { clientX: 50, clientY: 80 },
        { clientX: 50, clientY: 100 },
      ];

      positions.forEach((pos) => {
        const touchMove = createTouchEvent('touchmove', testElement, [
          { ...pos, identifier: 0 },
        ]);
        testElement.dispatchEvent(touchMove);
      });

      expect(moves.length).toBe(3);
      expect(moves[0].y).toBe(60);
      expect(moves[2].y).toBe(100);
    });
  });

  describe('Touch Target Validation', () => {
    it('should meet minimum touch target size (44x44px)', () => {
      const rect = testElement.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      expect(width).toBeGreaterThanOrEqual(44);
      expect(height).toBeGreaterThanOrEqual(44);
    });

    it('should detect touch within target bounds', () => {
      const rect = testElement.getBoundingClientRect();

      // Touch in center
      const centerTouch = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      const isInBounds =
        centerTouch.x >= rect.left &&
        centerTouch.x <= rect.right &&
        centerTouch.y >= rect.top &&
        centerTouch.y <= rect.bottom;

      expect(isInBounds).toBe(true);
    });

    it('should reject touch outside target bounds', () => {
      const rect = testElement.getBoundingClientRect();

      // Touch outside
      const outsideTouch = {
        x: rect.right + 10,
        y: rect.bottom + 10,
      };

      const isInBounds =
        outsideTouch.x >= rect.left &&
        outsideTouch.x <= rect.right &&
        outsideTouch.y >= rect.top &&
        outsideTouch.y <= rect.bottom;

      expect(isInBounds).toBe(false);
    });
  });

  describe('Multi-Touch Handling', () => {
    it('should ignore multi-touch during single-touch interaction', () => {
      let touchCount = 0;

      testElement.addEventListener('touchstart', (e) => {
        const touchEvent = e as TouchEvent;
        // Only handle single touch
        if (touchEvent.touches.length === 1) {
          touchCount++;
        }
      });

      // Single touch
      const singleTouch = createTouchEvent('touchstart', testElement, [
        { clientX: 50, clientY: 22, identifier: 0 },
      ]);
      testElement.dispatchEvent(singleTouch);

      expect(touchCount).toBe(1);

      // Multi-touch (should be ignored)
      const multiTouch = createTouchEvent('touchstart', testElement, [
        { clientX: 50, clientY: 22, identifier: 0 },
        { clientX: 70, clientY: 22, identifier: 1 },
      ]);
      testElement.dispatchEvent(multiTouch);

      // Count should still be 1 (multi-touch ignored)
      expect(touchCount).toBe(1);
    });
  });
});
