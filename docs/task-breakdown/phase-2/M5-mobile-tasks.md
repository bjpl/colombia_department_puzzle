# M5: Mobile & Device Tests - Granular Task Breakdown

**Milestone:** Comprehensive mobile test coverage
**Total Effort:** 14 hours
**Total Tasks:** 35 tasks
**Risk Level:** Medium-High
**Dependencies:** Phase 1 complete

---

## Task M5.1: Create Touch Event Testing Infrastructure

**Estimated Effort:** 2h
**Risk Level:** Medium
**Assignable To:** mobile-dev

**Input State:**
- Touch events mocked in setup.ts
- No mobile-specific test utilities
- No gesture simulation helpers

**Action Steps:**
1. Create `src/tests/utils/mobile/touch-simulator.ts`:
   ```typescript
   export interface TouchOptions {
     identifier: number;
     clientX: number;
     clientY: number;
     pageX?: number;
     pageY?: number;
     screenX?: number;
     screenY?: number;
     target?: Element;
   }

   export class TouchSimulator {
     private activeTouches: Map<number, Touch> = new Map();

     createTouch(options: TouchOptions): Touch {
       return {
         identifier: options.identifier,
         clientX: options.clientX,
         clientY: options.clientY,
         pageX: options.pageX ?? options.clientX,
         pageY: options.pageY ?? options.clientY,
         screenX: options.screenX ?? options.clientX,
         screenY: options.screenY ?? options.clientY,
         target: options.target ?? document.body,
         radiusX: 10,
         radiusY: 10,
         rotationAngle: 0,
         force: 1
       } as Touch;
     }

     simulateTap(element: Element, x: number, y: number) {
       const touch = this.createTouch({ identifier: 1, clientX: x, clientY: y, target: element });

       const touchStart = new TouchEvent('touchstart', {
         touches: createTouchList([touch]),
         targetTouches: createTouchList([touch]),
         changedTouches: createTouchList([touch]),
         bubbles: true,
         cancelable: true
       });

       const touchEnd = new TouchEvent('touchend', {
         touches: createTouchList([]),
         targetTouches: createTouchList([]),
         changedTouches: createTouchList([touch]),
         bubbles: true,
         cancelable: true
       });

       element.dispatchEvent(touchStart);
       setTimeout(() => element.dispatchEvent(touchEnd), 0);
     }

     simulateSwipe(
       element: Element,
       startX: number,
       startY: number,
       endX: number,
       endY: number,
       duration: number = 300
     ) {
       const touch = this.createTouch({
         identifier: 1,
         clientX: startX,
         clientY: startY,
         target: element
       });

       // Touchstart
       element.dispatchEvent(new TouchEvent('touchstart', {
         touches: createTouchList([touch]),
         changedTouches: createTouchList([touch])
       }));

       // Simulate movement
       const steps = Math.ceil(duration / 16); // 60fps
       const deltaX = (endX - startX) / steps;
       const deltaY = (endY - startY) / steps;

       for (let i = 0; i < steps; i++) {
         const moveTouch = this.createTouch({
           identifier: 1,
           clientX: startX + deltaX * i,
           clientY: startY + deltaY * i,
           target: element
         });

         element.dispatchEvent(new TouchEvent('touchmove', {
           touches: createTouchList([moveTouch]),
           changedTouches: createTouchList([moveTouch])
         }));
       }

       // Touchend
       const endTouch = this.createTouch({
         identifier: 1,
         clientX: endX,
         clientY: endY,
         target: element
       });

       element.dispatchEvent(new TouchEvent('touchend', {
         touches: createTouchList([]),
         changedTouches: createTouchList([endTouch])
       }));
     }

     simulatePinch(element: Element, startDistance: number, endDistance: number) {
       const centerX = element.getBoundingClientRect().width / 2;
       const centerY = element.getBoundingClientRect().height / 2;

       const touch1Start = this.createTouch({
         identifier: 1,
         clientX: centerX - startDistance / 2,
         clientY: centerY,
         target: element
       });

       const touch2Start = this.createTouch({
         identifier: 2,
         clientX: centerX + startDistance / 2,
         clientY: centerY,
         target: element
       });

       // Start pinch
       element.dispatchEvent(new TouchEvent('touchstart', {
         touches: createTouchList([touch1Start, touch2Start]),
         changedTouches: createTouchList([touch1Start, touch2Start])
       }));

       // Move to end position
       const touch1End = this.createTouch({
         identifier: 1,
         clientX: centerX - endDistance / 2,
         clientY: centerY,
         target: element
       });

       const touch2End = this.createTouch({
         identifier: 2,
         clientX: centerX + endDistance / 2,
         clientY: centerY,
         target: element
       });

       element.dispatchEvent(new TouchEvent('touchmove', {
         touches: createTouchList([touch1End, touch2End]),
         changedTouches: createTouchList([touch1End, touch2End])
       }));

       // End pinch
       element.dispatchEvent(new TouchEvent('touchend', {
         touches: createTouchList([]),
         changedTouches: createTouchList([touch1End, touch2End])
       }));
     }
   }
   ```
2. Add gesture helpers
3. Export from index

**Output State:**
- File: `src/tests/utils/mobile/touch-simulator.ts`
- Complete gesture simulation API
- Reusable across mobile tests

**Validation Command:**
```bash
npm run typecheck
npm test -- src/tests/utils/mobile/ --run
```

**Dependencies:**
- M1.4 (TouchListMock available)

**Rollback Procedure:**
```bash
rm -rf src/tests/utils/mobile/
```

**Success Criteria:**
- [ ] TouchSimulator class complete
- [ ] Tap, swipe, pinch gestures work
- [ ] Tests use simulator
- [ ] TypeScript types correct

---

## Task M5.2: Test Touch Target Sizes (WCAG AAA)

**Estimated Effort:** 1h
**Risk Level:** Low
**Assignable To:** tester

**Input State:**
- Touch simulator created
- No touch target validation
- WCAG AAA requires 44x44px minimum

**Action Steps:**
1. Create `src/tests/mobile/touch-targets.test.tsx`
2. Test all interactive elements:
   ```typescript
   import { render } from '@testing-library/react';
   import { axe } from '@axe-core/playwright';

   describe('Touch Target Sizes (WCAG AAA)', () => {
     it('should have 44x44px minimum for all buttons', () => {
       const { container } = render(<GameBoard />);
       const buttons = container.querySelectorAll('button');

       buttons.forEach(button => {
         const rect = button.getBoundingClientRect();
         expect(rect.width).toBeGreaterThanOrEqual(44);
         expect(rect.height).toBeGreaterThanOrEqual(44);
       });
     });

     it('should have adequate spacing between touch targets', () => {
       const { container } = render(<PuzzleGrid />);
       const targets = container.querySelectorAll('[role="button"], button, a');

       const rects = Array.from(targets).map(t => t.getBoundingClientRect());

       for (let i = 0; i < rects.length - 1; i++) {
         for (let j = i + 1; j < rects.length; j++) {
           const distance = calculateDistance(rects[i], rects[j]);
           expect(distance).toBeGreaterThanOrEqual(8); // 8px spacing
         }
       }
     });
   });

   function calculateDistance(rect1: DOMRect, rect2: DOMRect): number {
     const centerX1 = rect1.left + rect1.width / 2;
     const centerY1 = rect1.top + rect1.height / 2;
     const centerX2 = rect2.left + rect2.width / 2;
     const centerY2 = rect2.top + rect2.height / 2;

     return Math.sqrt((centerX2 - centerX1) ** 2 + (centerY2 - centerY1) ** 2);
   }
   ```

**Output State:**
- File: `src/tests/mobile/touch-targets.test.tsx`
- WCAG AAA compliance verified
- All touch targets validated

**Validation Command:**
```bash
npm test -- src/tests/mobile/touch-targets.test.tsx --run
```

**Dependencies:**
- M5.1 (touch utilities)

**Rollback Procedure:**
```bash
rm src/tests/mobile/touch-targets.test.tsx
```

**Success Criteria:**
- [ ] All buttons ≥ 44x44px
- [ ] Adequate spacing verified
- [ ] WCAG AAA compliant

---

## Task M5.3: Test Drag-and-Drop on Touch Devices

**Estimated Effort:** 2h
**Risk Level:** High
**Assignable To:** mobile-dev

**Input State:**
- Touch simulator available
- Drag-and-drop uses @dnd-kit
- No mobile drag tests

**Action Steps:**
1. Create `src/tests/mobile/drag-and-drop.test.tsx`
2. Test touch-based dragging:
   ```typescript
   import { TouchSimulator } from '../utils/mobile/touch-simulator';

   describe('Mobile Drag and Drop', () => {
     let touchSim: TouchSimulator;

     beforeEach(() => {
       touchSim = new TouchSimulator();
     });

     it('should drag department piece with touch', async () => {
       const { getByTestId } = render(<GameBoard />);
       const piece = getByTestId('department-piece-antioquia');
       const target = getByTestId('puzzle-slot-antioquia');

       const pieceRect = piece.getBoundingClientRect();
       const targetRect = target.getBoundingClientRect();

       touchSim.simulateSwipe(
         piece,
         pieceRect.left + 10,
         pieceRect.top + 10,
         targetRect.left + 22,
         targetRect.top + 22,
         500
       );

       await waitFor(() => {
         expect(target).toHaveClass('piece-placed');
       });
     });

     it('should show drag preview on touch', () => {
       const { getByTestId } = render(<GameBoard />);
       const piece = getByTestId('department-piece-antioquia');

       const touch = touchSim.createTouch({
         identifier: 1,
         clientX: 100,
         clientY: 100,
         target: piece
       });

       piece.dispatchEvent(new TouchEvent('touchstart', {
         touches: createTouchList([touch]),
         changedTouches: createTouchList([touch])
       }));

       expect(document.querySelector('.drag-preview')).toBeInTheDocument();
     });
   });
   ```
3. Test long-press activation
4. Test drag cancellation

**Output State:**
- File: `src/tests/mobile/drag-and-drop.test.tsx` with 5+ tests
- Mobile drag fully tested
- Edge cases covered

**Validation Command:**
```bash
npm test -- src/tests/mobile/drag-and-drop.test.tsx --run
```

**Dependencies:**
- M5.1 (touch simulator)

**Rollback Procedure:**
```bash
rm src/tests/mobile/drag-and-drop.test.tsx
```

**Success Criteria:**
- [ ] 5+ drag tests pass
- [ ] Touch drag works
- [ ] Preview shown
- [ ] Cancellation handled

---

## Tasks M5.4 - M5.35 (Condensed)

**M5.4: Viewport Responsiveness Tests (1.5h)** - Test 320px to 2560px
**M5.5: Orientation Change Tests (1h)** - Portrait/landscape transitions
**M5.6: Safe Area Insets Tests (1h)** - Notch/camera cutout handling
**M5.7: Virtual Keyboard Tests (1.5h)** - Input field visibility
**M5.8: Scroll Behavior Tests (1h)** - Bounce, momentum scrolling
**M5.9: Pinch-to-Zoom Tests (1h)** - Map/puzzle zoom functionality
**M5.10: Device Pixel Ratio Tests (0.5h)** - Retina/high-DPI displays
**M5.11: PWA Manifest Tests (1h)** - Install prompt, icons
**M5.12: Service Worker Tests (2h)** - Offline caching strategy
**M5.13: Offline Mode Tests (1.5h)** - Full offline gameplay
**M5.14: Network Transition Tests (1h)** - Online/offline switches
**M5.15: Touch Feedback Tests (0.5h)** - Haptic/visual feedback
**M5.16: Multi-Touch Gesture Tests (1.5h)** - Two-finger gestures
**M5.17: Accessibility on Mobile (1h)** - Screen reader support
**M5.18: Performance on Low-End Devices (2h)** - CPU/memory constraints
**M5.19: Battery Usage Tests (1h)** - Power consumption optimization
**M5.20: Camera/Sensor Tests (1h)** - Device orientation API
**M5.21-M5.35: Device Matrix Tests** - iOS, Android, tablets (14 tasks, 10h total)

---

## M5 Summary

**Total Tasks:** 35
**Total Effort:** 14 hours
**Critical Path:** M5.1 → M5.3 → M5.12 → M5.13 (7.5h)

**Device Testing Matrix:**
- iOS Safari (iPhone 12, 13, 14, 15)
- Android Chrome (Pixel, Samsung, OnePlus)
- Tablets (iPad, Android tablets)
- Foldables (Galaxy Fold, Surface Duo)

**Success Metrics:**
- Mobile test coverage: 0% → 95%
- WCAG AAA compliance: 100%
- PWA score: 100/100
- Offline functionality: Complete
