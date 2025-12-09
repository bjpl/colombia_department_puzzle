# Phase 1 - M1: TypeScript Stability - Complete Fixes

**Target:** Fix all 5 TypeScript errors in `src/tests/setup.ts`

**Current Errors:**
1. Line 6: `isCI` declared but never used
2. Line 43: `requestAnimationFrame` return type mismatch
3. Lines 198-200: TouchList conversion errors (3 instances)

---

## Fix 1: Remove Unused Variable (Line 6)

**File:** `src/tests/setup.ts`

**Current Code:**
```typescript
// Line 6
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
```

**Fixed Code:**
```typescript
// Remove the line entirely, or prefix with underscore if needed for future use
const _isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
```

**Alternative:** If the variable is genuinely unused, delete the line entirely.

---

## Fix 2: requestAnimationFrame Return Type (Line 43)

**File:** `src/tests/setup.ts`

**Current Code:**
```typescript
// Line 43
window.requestAnimationFrame = (cb: FrameRequestCallback) =>
  setTimeout(cb, 0) as unknown as number;
```

**Error:**
```
Type '(cb: FrameRequestCallback) => NodeJS.Timeout' is not assignable to type
'(callback: FrameRequestCallback) => number'.
Type 'Timeout' is not assignable to type 'number'.
```

**Fixed Code:**
```typescript
// Line 43 - Cast setTimeout result to number
window.requestAnimationFrame = ((cb: FrameRequestCallback): number => {
  const timeoutId = setTimeout(cb, 0);
  return timeoutId as unknown as number;
}) as typeof window.requestAnimationFrame;
```

**Explanation:** TypeScript expects `requestAnimationFrame` to return a number (the frame ID), but Node.js `setTimeout` returns a `Timeout` object. We need explicit casting to satisfy the type checker.

---

## Fix 3-5: TouchList Conversion Errors (Lines 198-200)

**File:** `src/tests/setup.ts`

**Current Code:**
```typescript
// Lines 198-200
touches: (event.touches || []) as TouchList,
targetTouches: (event.targetTouches || []) as TouchList,
changedTouches: (event.changedTouches || []) as TouchList,
```

**Error:**
```
Conversion of type 'Touch[] | undefined' to type 'TouchList' may be a mistake
because neither type sufficiently overlaps with the other.
Property 'item' is missing in type 'Touch[]' but required in type 'TouchList'.
```

**Root Cause:** `TouchList` is an interface with an `item()` method, but plain arrays don't have this method. We need to create a proper TouchList-like object.

**Fixed Code:**

```typescript
// Helper function (add at top of file, after imports)
function createTouchList(touches: Touch[] = []): TouchList {
  const touchList = {
    length: touches.length,
    item(index: number): Touch | null {
      return touches[index] ?? null;
    },
    *[Symbol.iterator]() {
      yield* touches;
    },
  };

  // Add array-like indexing
  touches.forEach((touch, index) => {
    (touchList as any)[index] = touch;
  });

  return touchList as TouchList;
}

// Lines 198-200 - Use helper function
touches: createTouchList(event.touches || []),
targetTouches: createTouchList(event.targetTouches || []),
changedTouches: createTouchList(event.changedTouches || []),
```

**Alternative Simpler Fix (if full TouchList compatibility not needed):**

```typescript
// Lines 198-200 - Explicit conversion through unknown
touches: (event.touches || []) as unknown as TouchList,
targetTouches: (event.targetTouches || []) as unknown as TouchList,
changedTouches: (event.changedTouches || []) as unknown as TouchList,
```

---

## Complete Fixed File Section

**File:** `src/tests/setup.ts` (Lines 1-210 with all fixes)

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, vi } from 'vitest';

// Remove unused variable or prefix with underscore
// const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

// Helper function for TouchList creation
function createTouchList(touches: Touch[] = []): TouchList {
  const touchList = {
    length: touches.length,
    item(index: number): Touch | null {
      return touches[index] ?? null;
    },
    *[Symbol.iterator]() {
      yield* touches;
    },
  };

  // Add array-like indexing
  touches.forEach((touch, index) => {
    (touchList as any)[index] = touch;
  });

  return touchList as TouchList;
}

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
});

// Global browser API mocks
beforeAll(() => {
  // RequestAnimationFrame mock - FIXED
  window.requestAnimationFrame = ((cb: FrameRequestCallback): number => {
    const timeoutId = setTimeout(cb, 0);
    return timeoutId as unknown as number;
  }) as typeof window.requestAnimationFrame;

  window.cancelAnimationFrame = (id: number) => {
    clearTimeout(id as unknown as NodeJS.Timeout);
  };

  // ... rest of setup code ...

  // Touch event mock - FIXED (around line 190-210)
  class MockTouchEvent extends Event implements TouchEvent {
    readonly touches: TouchList;
    readonly targetTouches: TouchList;
    readonly changedTouches: TouchList;
    readonly altKey: boolean;
    readonly ctrlKey: boolean;
    readonly metaKey: boolean;
    readonly shiftKey: boolean;

    constructor(type: string, init?: TouchEventInit) {
      super(type, init);
      // FIXED: Use helper function for proper TouchList conversion
      this.touches = createTouchList(init?.touches as Touch[] || []);
      this.targetTouches = createTouchList(init?.targetTouches as Touch[] || []);
      this.changedTouches = createTouchList(init?.changedTouches as Touch[] || []);
      this.altKey = init?.altKey ?? false;
      this.ctrlKey = init?.ctrlKey ?? false;
      this.metaKey = init?.metaKey ?? false;
      this.shiftKey = init?.shiftKey ?? false;
    }
  }

  (global as any).TouchEvent = MockTouchEvent;
  (window as any).TouchEvent = MockTouchEvent;
});
```

---

## Validation Commands

**Check TypeScript errors:**
```bash
npm run typecheck
```

**Expected Output:**
```
> colombia-departments-puzzle@1.0.0 typecheck
> tsc --noEmit

# No errors should be displayed
```

**Run tests to ensure mocks still work:**
```bash
npm test -- src/tests/setup.ts
npm test -- src/tests/components/BottomSheet.test.tsx  # Uses touch events
```

---

## Implementation Checklist

- [ ] Fix 1: Remove or prefix `isCI` variable (line 6)
- [ ] Fix 2: Add explicit casting for `requestAnimationFrame` (line 43)
- [ ] Fix 3-5: Implement `createTouchList` helper function
- [ ] Fix 3-5: Update TouchEvent constructor to use helper (lines 198-200)
- [ ] Run `npm run typecheck` to verify all errors resolved
- [ ] Run `npm test` to ensure no test regressions
- [ ] Commit changes with message: "fix: resolve 5 TypeScript errors in test setup"

---

## Related Files

- **Modified:** `src/tests/setup.ts`
- **Test coverage:** No change (fixes are type-level only)
- **Breaking changes:** None

---

**Estimated Time:** 15 minutes
**Complexity:** Low
**Risk:** Very Low (type fixes only, no runtime changes)
