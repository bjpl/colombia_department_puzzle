# Phase 1 Master Playbook: Foundation Stabilization (Weeks 1-3)

**Document Version:** 1.0
**Date:** December 4, 2025
**Architect:** Queen Coordinator
**Status:** COMPLETE EXECUTION GUIDE

---

## Executive Summary

This is the COMPLETE, command-by-command execution guide for Phase 1: Foundation Stabilization. Every task includes exact file paths, complete code examples, validation commands, and rollback procedures.

**Phase Duration:** 3 weeks (15 working days)
**Team:** 3-4 developers
**Milestones:**
- M1: TypeScript Migration (Week 1)
- M2: Auth Test Stabilization (Week 2)
- M3: Hook Test Restoration (Week 2)
- M4: React Warnings Elimination (Week 3)

**Success Criteria:**
- Zero TypeScript `any` types in event handlers (80 → 0)
- Auth tests 100% passing (25/25)
- Hook tests 100% passing (180/180)
- Zero React warnings in console
- All 914 tests passing

---

## Pre-Flight Checklist

**Before starting Phase 1, verify:**

```bash
# 1. Git status clean
cd "C:\Users\brand\Development\Project_Workspace\active-development\colombia_puzzle_game"
git status
# Should show only .claude-flow/metrics changes

# 2. Baseline test run
npm run test -- --run | tee test-baseline.txt
# Record: X/914 passing

# 3. TypeScript baseline
npx tsc --noEmit 2>&1 | tee typescript-baseline.txt
# Record: Y errors

# 4. React warnings baseline
npm run dev
# Open browser, check console
# Record: Z warnings

# 5. Create feature branch
git checkout -b phase-1-foundation-stabilization
git push -u origin phase-1-foundation-stabilization

# 6. Backup current state
git tag phase-0-baseline
git push origin phase-0-baseline
```

**Required Tools:**
```bash
# Verify installed:
node --version  # Should be v18+ or v20+
npm --version   # Should be 9+ or 10+
git --version   # Any recent version
```

---

## Week 1: TypeScript Migration (M1)

### Day 1 (Monday): Event Handler Type Definitions

**Goal:** Create comprehensive type definitions for all event handlers

**Estimated Time:** 6-8 hours

#### Step 1.1: Create Type Definitions File

```bash
# Create types directory if not exists
mkdir -p src/types/events
```

Create `src/types/events.ts`:

```typescript
// src/types/events.ts
import type {
  DragEndEvent,
  DragStartEvent,
  DragMoveEvent,
  DragCancelEvent,
  DragOverEvent
} from '@dnd-kit/core';
import type {
  TouchEvent as ReactTouchEvent,
  MouseEvent as ReactMouseEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  SyntheticEvent
} from 'react';

/**
 * Drag and Drop Event Types
 * Used by GameContainer, DepartmentTray, MapCanvas
 */
export interface DnDEventHandlers {
  onDragStart: (event: DragStartEvent) => void;
  onDragMove: (event: DragMoveEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: (event: DragCancelEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
}

/**
 * Touch Event Types
 * Used by mobile components (MobileGameLayout, BottomSheet, TouchFeedback)
 */
export interface TouchEventHandlers {
  onTouchStart: (event: ReactTouchEvent<HTMLElement>) => void;
  onTouchMove: (event: ReactTouchEvent<HTMLElement>) => void;
  onTouchEnd: (event: ReactTouchEvent<HTMLElement>) => void;
  onTouchCancel?: (event: ReactTouchEvent<HTMLElement>) => void;
}

/**
 * Pointer Event Types
 * Used by components supporting both mouse and touch
 */
export interface PointerEventHandlers {
  onPointerDown: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLElement>) => void;
  onPointerCancel?: (event: ReactPointerEvent<HTMLElement>) => void;
}

/**
 * Keyboard Event Types
 * Used by keyboard navigation components
 */
export interface KeyboardEventHandlers {
  onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => void;
  onKeyUp?: (event: ReactKeyboardEvent<HTMLElement>) => void;
  onKeyPress?: (event: ReactKeyboardEvent<HTMLElement>) => void;
}

/**
 * Mouse Event Types
 * Used by clickable components
 */
export interface MouseEventHandlers {
  onClick: (event: ReactMouseEvent<HTMLElement>) => void;
  onDoubleClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  onContextMenu?: (event: ReactMouseEvent<HTMLElement>) => void;
}

/**
 * Combined Event Handler Type
 * For components supporting multiple input methods
 */
export type InputEventHandlers = Partial<
  TouchEventHandlers &
  PointerEventHandlers &
  KeyboardEventHandlers &
  MouseEventHandlers
>;

/**
 * Custom Event Types
 * For internal event bus communication
 */
export interface PlacementFeedbackEvent extends CustomEvent {
  detail: {
    show: boolean;
    isCorrect: boolean;
    departmentName: string;
    position: { x: number; y: number };
  };
}

export interface HintRequestEvent extends CustomEvent {
  detail: {
    departmentId: string;
    level: number;
  };
}

export interface GameModeChangeEvent extends CustomEvent {
  detail: {
    previousMode: string;
    currentMode: string;
  };
}

/**
 * Type Guards
 * For runtime type checking
 */
export function isTouchEvent(
  event: SyntheticEvent
): event is ReactTouchEvent<HTMLElement> {
  return 'touches' in event.nativeEvent;
}

export function isPointerEvent(
  event: SyntheticEvent
): event is ReactPointerEvent<HTMLElement> {
  return 'pointerType' in event.nativeEvent;
}

export function isKeyboardEvent(
  event: SyntheticEvent
): event is ReactKeyboardEvent<HTMLElement> {
  return 'key' in event.nativeEvent;
}

/**
 * Utility Types
 * For extracting specific event properties
 */
export type TouchPosition = {
  clientX: number;
  clientY: number;
  screenX: number;
  screenY: number;
  pageX: number;
  pageY: number;
};

export type KeyCode = ReactKeyboardEvent<HTMLElement>['key'];
export type ModifierKeys = {
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
};
```

**Validation:**

```bash
# TypeScript should compile without errors
npx tsc src/types/events.ts --noEmit
# Expected: No errors

# Commit progress
git add src/types/events.ts
git commit -m "feat(types): add comprehensive event type definitions

- DnD event types from @dnd-kit/core
- Touch/Pointer/Keyboard event types from React
- Custom event types for internal event bus
- Type guards for runtime checking
- Utility types for event properties

Part of M1: TypeScript Migration (Phase 1, Day 1)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

#### Step 1.2: Apply Types to GameContainer.tsx

**Target:** Replace 15 `any` types in GameContainer component

**File:** `src/components/GameContainer.tsx`

**Changes:**

```typescript
// BEFORE (line ~120):
const handleDragEnd = (event: any) => {
  // implementation
};

// AFTER:
import type { DragEndEvent } from '@dnd-kit/core';
import type { KeyboardEventHandlers } from '@/types/events';

const handleDragEnd = (event: DragEndEvent): void => {
  // TypeScript now provides full autocomplete and type checking
  const { active, over } = event;

  if (!active || !over) return;

  const departmentId = active.id as string;
  const targetRegion = over.id as string;

  // ... rest of implementation
};
```

**Complete file edits** (identify all `any` types):

```bash
# Find all any types in GameContainer
grep -n "event: any" src/components/GameContainer.tsx

# Expected output (example):
# 120:  const handleDragEnd = (event: any) => {
# 145:  const handleKeyDown = (event: any) => {
# 210:  const handleTouch = (event: any) => {
```

**Edit each occurrence:**

```typescript
// Line 120: DnD handler
- const handleDragEnd = (event: any) => {
+ const handleDragEnd = (event: DragEndEvent): void => {

// Line 145: Keyboard handler
- const handleKeyDown = (event: any) => {
+ const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {

// Line 210: Touch handler
- const handleTouch = (event: any) => {
+ const handleTouch = (event: React.TouchEvent<HTMLElement>): void => {
```

**Validation:**

```bash
# TypeScript check
npx tsc --noEmit | grep GameContainer
# Expected: No errors related to GameContainer

# Run component tests
npm run test -- GameContainer.test.tsx
# Expected: All tests pass

# Commit
git add src/components/GameContainer.tsx
git commit -m "fix(GameContainer): replace any types with strict event types

Replaced 15 any type annotations with proper types:
- DragEndEvent from @dnd-kit/core
- KeyboardEvent from React
- TouchEvent from React

Part of M1: TypeScript Migration (Phase 1, Day 1)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Day 2 (Tuesday): DepartmentTray and MapCanvas Type Migration

**Goal:** Type all event handlers in DepartmentTray and MapCanvas

**Estimated Time:** 6-8 hours

#### Step 2.1: DepartmentTray.tsx

**File:** `src/components/DepartmentTray.tsx`

```bash
# Find any types
grep -n "event: any" src/components/DepartmentTray.tsx
```

**Apply types:**

```typescript
// Import types at top of file
import type { DragStartEvent } from '@dnd-kit/core';
import type { TouchEventHandlers } from '@/types/events';

// Replace event handlers
- const handleDepartmentDragStart = (event: any) => {
+ const handleDepartmentDragStart = (event: DragStartEvent): void => {
    const departmentId = event.active.id as string;
    // ... implementation
  };

// Touch handlers
- const handleTouchStart = (event: any, departmentId: string) => {
+ const handleTouchStart = (event: React.TouchEvent<HTMLButtonElement>, departmentId: string): void => {
    const touch = event.touches[0];
    // ... implementation
  };
```

**Validation:**

```bash
npx tsc --noEmit | grep DepartmentTray
npm run test -- DepartmentTray.test.tsx
git add src/components/DepartmentTray.tsx
git commit -m "fix(DepartmentTray): strict event types (12 any → 0)"
```

#### Step 2.2: MapCanvas.tsx

**File:** `src/components/MapCanvas.tsx`

```bash
grep -n "event: any" src/components/MapCanvas.tsx
```

**Apply types:**

```typescript
import type { MouseEvent, PointerEvent } from 'react';
import type { DragOverEvent } from '@dnd-kit/core';

- const handleMapClick = (event: any) => {
+ const handleMapClick = (event: MouseEvent<SVGElement>): void => {
    const point = event.nativeEvent.offsetX;
    // ... implementation
  };

- const handleDragOver = (event: any) => {
+ const handleDragOver = (event: DragOverEvent): void => {
    // ... implementation
  };
```

**Validation:**

```bash
npx tsc --noEmit | grep MapCanvas
npm run test -- MapCanvas.test.tsx
git add src/components/MapCanvas.tsx
git commit -m "fix(MapCanvas): strict event types (8 any → 0)"
```

---

### Day 3 (Wednesday): Mobile Component Type Migration

**Goal:** Type all mobile-specific components

**Estimated Time:** 6-8 hours

**Files:**
- `src/components/MobileGameLayout.tsx`
- `src/components/BottomSheet.tsx`
- `src/hooks/useTouchGestures.ts`

#### Step 3.1: MobileGameLayout.tsx

```typescript
import type { TouchEventHandlers, PointerEventHandlers } from '@/types/events';

interface MobileGameLayoutProps {
  touchHandlers: TouchEventHandlers;
  // ... other props
}

- const handleSwipe = (event: any) => {
+ const handleSwipe = (event: React.TouchEvent<HTMLDivElement>): void => {
    const touches = event.changedTouches;
    // ... implementation
  };
```

#### Step 3.2: useTouchGestures Hook

**File:** `src/hooks/useTouchGestures.ts`

```typescript
import { useState, useCallback } from 'react';
import type { TouchEvent as ReactTouchEvent } from 'react';
import type { TouchPosition } from '@/types/events';

interface GestureState {
  startPosition: TouchPosition | null;
  currentPosition: TouchPosition | null;
  isGesturing: boolean;
}

export function useTouchGestures() {
  const [state, setState] = useState<GestureState>({
    startPosition: null,
    currentPosition: null,
    isGesturing: false,
  });

  const handleTouchStart = useCallback(
    (event: ReactTouchEvent<HTMLElement>): void => {
      const touch = event.touches[0];
      setState({
        startPosition: {
          clientX: touch.clientX,
          clientY: touch.clientY,
          screenX: touch.screenX,
          screenY: touch.screenY,
          pageX: touch.pageX,
          pageY: touch.pageY,
        },
        currentPosition: null,
        isGesturing: true,
      });
    },
    []
  );

  // ... other handlers

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    state,
  };
}
```

**Validation:**

```bash
npx tsc --noEmit | grep "useTouchGestures\|MobileGameLayout\|BottomSheet"
npm run test -- --grep="mobile|touch"
git add src/components/MobileGameLayout.tsx src/components/BottomSheet.tsx src/hooks/useTouchGestures.ts
git commit -m "fix(mobile): strict event types for touch components (25 any → 0)"
```

---

### Day 4-5 (Thursday-Friday): Hook Type Migration & Testing

**Goal:** Complete hook type migration and run comprehensive tests

**Files to update:**
- `src/hooks/useDragHandlers.ts`
- `src/hooks/useModalOrchestration.ts`
- `src/hooks/useGameTimer.ts`

#### Complete Hook Migration Pattern

```typescript
// src/hooks/useDragHandlers.ts
import type { DragEndEvent, DragStartEvent, DragCancelEvent } from '@dnd-kit/core';

export function useDragHandlers() {
  const handleDragStart = useCallback(
    (event: DragStartEvent): void => {
      // Fully typed - autocomplete works!
      const { active } = event;
      console.log('Dragging:', active.id);
    },
    []
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent): void => {
      const { active, over } = event;
      if (!over) return;
      // Type-safe operations
    },
    []
  );

  return {
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}
```

**Full Validation:**

```bash
# 1. TypeScript check (zero errors expected)
npx tsc --noEmit
echo "Expected: No errors"

# 2. Count remaining any types
grep -r "event: any" src/components src/hooks | wc -l
echo "Expected: 0"

# 3. Run all tests
npm run test -- --run
echo "Expected: All tests pass"

# 4. Final commit for Week 1
git add .
git commit -m "feat(M1): complete TypeScript migration (80 any → 0)

Milestone M1 completed:
- Created comprehensive event type definitions
- Migrated all component event handlers
- Migrated all hook event handlers
- Zero any types remaining in event handlers
- All tests passing

TypeScript strict mode enabled for event types.

Part of Phase 1: Foundation Stabilization

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin phase-1-foundation-stabilization
```

---

## Week 2: Test Stabilization (M2 + M3)

### Day 6-7 (Monday-Tuesday): Auth Test Stabilization (M2)

**Goal:** Fix all 25 excluded auth tests

**Current Status:**
```typescript
// vitest.config.ts (current exclusions)
exclude: [
  '**/tests/services/auth/**',    // 12 tests
  '**/tests/components/auth/**',  // 13 tests
]
```

#### Step 6.1: Create Supabase Test Mock

**File:** `src/tests/mocks/services/supabase.ts`

```typescript
// src/tests/mocks/services/supabase.ts
import { vi } from 'vitest';
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';

export interface MockSupabaseOptions {
  user?: Partial<User>;
  session?: Partial<Session>;
  shouldSucceed?: boolean;
}

export function createMockSupabase(options: MockSupabaseOptions = {}): SupabaseClient {
  const {
    user = { id: 'test-user-123', email: 'test@example.com' },
    session = { access_token: 'mock-token', user: user as User },
    shouldSucceed = true,
  } = options;

  return {
    auth: {
      signUp: vi.fn(async ({ email, password }) => {
        if (shouldSucceed) {
          return {
            data: {
              user: user as User,
              session: session as Session,
            },
            error: null,
          };
        }
        return {
          data: { user: null, session: null },
          error: new Error('Sign up failed'),
        };
      }),

      signInWithPassword: vi.fn(async ({ email, password }) => {
        if (shouldSucceed) {
          return {
            data: {
              user: user as User,
              session: session as Session,
            },
            error: null,
          };
        }
        return {
          data: { user: null, session: null },
          error: new Error('Invalid credentials'),
        };
      }),

      signOut: vi.fn(async () => {
        if (shouldSucceed) {
          return { error: null };
        }
        return { error: new Error('Sign out failed') };
      }),

      getSession: vi.fn(async () => {
        if (shouldSucceed) {
          return {
            data: { session: session as Session },
            error: null,
          };
        }
        return {
          data: { session: null },
          error: null,
        };
      }),

      onAuthStateChange: vi.fn((callback) => {
        // Immediately call with initial state
        callback('SIGNED_IN', session as Session);

        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        };
      }),
    },

    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: {}, error: null }),
    })),
  } as unknown as SupabaseClient;
}

// Helper for testing error scenarios
export function createFailingMockSupabase(): SupabaseClient {
  return createMockSupabase({ shouldSucceed: false });
}
```

#### Step 6.2: Fix AuthService Tests

**File:** `src/tests/services/auth/AuthService.test.ts`

```typescript
// src/tests/services/auth/AuthService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '@/services/auth/AuthService';
import { createMockSupabase, createFailingMockSupabase } from '@/tests/mocks/services/supabase';

describe('AuthService', () => {
  let authService: AuthService;
  let mockSupabase: ReturnType<typeof createMockSupabase>;

  beforeEach(() => {
    mockSupabase = createMockSupabase();
    authService = new AuthService(mockSupabase);
  });

  describe('signUp', () => {
    it('should create new user account', async () => {
      const result = await authService.signUp({
        email: 'newuser@example.com',
        password: 'SecurePassword123!',
      });

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user?.email).toBe('test@example.com');
    });

    it('should handle sign up errors', async () => {
      const failingSupabase = createFailingMockSupabase();
      const failingService = new AuthService(failingSupabase);

      const result = await failingService.signUp({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should validate email format', async () => {
      const result = await authService.signUp({
        email: 'invalid-email',
        password: 'password',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email');
    });
  });

  describe('signIn', () => {
    it('should authenticate existing user', async () => {
      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'password',
      });

      expect(result.success).toBe(true);
      expect(result.session).toBeDefined();
    });

    it('should handle invalid credentials', async () => {
      const failingSupabase = createFailingMockSupabase();
      const failingService = new AuthService(failingSupabase);

      const result = await failingService.signIn({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should clear session on sign out', async () => {
      const result = await authService.signOut();

      expect(result.success).toBe(true);
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
    });
  });

  // ... 9 more test cases (see M2_AUTH_TESTS_IMPLEMENTATION.md for complete suite)
});
```

**Run tests:**

```bash
# Remove auth exclusion from vitest.config.ts
# Then run auth tests
npm run test -- tests/services/auth/AuthService.test.ts

# Expected: 12/12 passing
```

#### Step 6.3: Fix Auth Component Tests

**Similar pattern for:**
- `src/tests/components/auth/LoginForm.test.tsx`
- `src/tests/components/auth/SignupForm.test.tsx`
- `src/tests/components/auth/UserProfile.test.tsx`

**Validation:**

```bash
# Remove component/auth exclusion
# Run all auth tests
npm run test -- --grep="auth"

# Expected: 25/25 passing

git add src/tests/mocks/services/supabase.ts src/tests/services/auth/ src/tests/components/auth/
git commit -m "fix(M2): stabilize all auth tests (25/25 passing)

- Created comprehensive Supabase mocks
- Fixed all AuthService tests
- Fixed all auth component tests
- Removed test exclusions from vitest.config.ts

Part of Phase 1: Foundation Stabilization (Week 2)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

### Day 8-10 (Wed-Fri): Hook Test Restoration (M3)

**Goal:** Fix all 180 excluded hook tests

**Strategy:** Create modular browser API mocks, apply to each hook test file

#### Step 8.1: Create Modular Browser Mocks

```bash
mkdir -p src/tests/mocks/browser
```

**File:** `src/tests/mocks/browser/observers.ts`

```typescript
// src/tests/mocks/browser/observers.ts
import { vi } from 'vitest';

export function setupObserverMocks(): void {
  // ResizeObserver
  if (typeof ResizeObserver === 'undefined') {
    global.ResizeObserver = class ResizeObserver {
      private callback: ResizeObserverCallback;
      private observedElements: Set<Element> = new Set();

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe(target: Element): void {
        this.observedElements.add(target);

        // Simulate initial observation
        this.callback(
          [
            {
              target,
              contentRect: {
                width: 1024,
                height: 768,
                top: 0,
                left: 0,
                bottom: 768,
                right: 1024,
                x: 0,
                y: 0,
              } as DOMRectReadOnly,
              borderBoxSize: [],
              contentBoxSize: [],
              devicePixelContentBoxSize: [],
            } as ResizeObserverEntry,
          ],
          this
        );
      }

      unobserve(target: Element): void {
        this.observedElements.delete(target);
      }

      disconnect(): void {
        this.observedElements.clear();
      }
    } as unknown as typeof ResizeObserver;
  }

  // IntersectionObserver
  if (typeof IntersectionObserver === 'undefined') {
    global.IntersectionObserver = class IntersectionObserver {
      private callback: IntersectionObserverCallback;

      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
      }

      observe(target: Element): void {
        // Simulate element becoming visible
        this.callback(
          [
            {
              target,
              isIntersecting: true,
              intersectionRatio: 1,
              boundingClientRect: {
                width: 100,
                height: 100,
                top: 0,
                left: 0,
                bottom: 100,
                right: 100,
                x: 0,
                y: 0,
              } as DOMRectReadOnly,
              intersectionRect: {} as DOMRectReadOnly,
              rootBounds: null,
              time: Date.now(),
            } as IntersectionObserverEntry,
          ],
          this
        );
      }

      unobserve(): void {}
      disconnect(): void {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }

      root = null;
      rootMargin = '';
      thresholds = [0];
    } as unknown as typeof IntersectionObserver;
  }
}

export function cleanupObserverMocks(): void {
  // Cleanup is automatic in Vitest
}
```

**File:** `src/tests/mocks/browser/animation.ts`

```typescript
// src/tests/mocks/browser/animation.ts
export function setupAnimationMocks(): void {
  // requestAnimationFrame
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
      return setTimeout(() => callback(Date.now()), 16) as unknown as number;
    };
  }

  // cancelAnimationFrame
  if (!global.cancelAnimationFrame) {
    global.cancelAnimationFrame = (id: number): void => {
      clearTimeout(id);
    };
  }
}
```

**File:** `src/tests/mocks/browser/index.ts`

```typescript
// src/tests/mocks/browser/index.ts
import { setupObserverMocks } from './observers';
import { setupAnimationMocks } from './animation';

export type BrowserMock = 'observers' | 'animation';

export function mockBrowserAPIs(...mocks: BrowserMock[]): void {
  if (mocks.includes('observers')) {
    setupObserverMocks();
  }
  if (mocks.includes('animation')) {
    setupAnimationMocks();
  }
}

export { setupObserverMocks, setupAnimationMocks };
```

#### Step 8.2: Fix Hook Tests

**Example:** `src/tests/hooks/useModalManager.test.ts`

```typescript
// src/tests/hooks/useModalManager.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { mockBrowserAPIs } from '@/tests/mocks/browser';
import { useModalManager } from '@/hooks/useModalManager';

describe('useModalManager', () => {
  beforeEach(() => {
    mockBrowserAPIs('observers'); // Only load what's needed
  });

  it('should open modal', () => {
    const { result } = renderHook(() => useModalManager());

    act(() => {
      result.current.openModal('hint');
    });

    expect(result.current.isModalOpen('hint')).toBe(true);
  });

  it('should close modal', () => {
    const { result } = renderHook(() => useModalManager());

    act(() => {
      result.current.openModal('hint');
      result.current.closeModal('hint');
    });

    expect(result.current.isModalOpen('hint')).toBe(false);
  });

  // ... 8 more tests
});
```

**Batch fix all hook tests:**

```bash
# Apply pattern to all hook test files
ls src/tests/hooks/*.test.ts | while read file; do
  echo "Fixing $file"
  # Add mockBrowserAPIs import and beforeEach
done

# Remove hook exclusions from vitest.config.ts

# Run hook tests
npm run test -- tests/hooks/

# Expected: 180/180 passing
```

**Validation:**

```bash
git add src/tests/mocks/browser/ src/tests/hooks/
git commit -m "fix(M3): restore all hook tests (180/180 passing)

- Created modular browser API mocks
- Fixed all hook tests with on-demand mock loading
- Removed test exclusions from vitest.config.ts

Part of Phase 1: Foundation Stabilization (Week 2)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Week 3: React Warnings Elimination (M4)

### Day 11-15: React Warnings Remediation

**Goal:** Zero React warnings in development console

**Common React Warnings to Fix:**

1. **Missing `key` props in lists**
2. **Deprecated lifecycle methods**
3. **Uncontrolled → Controlled component warnings**
4. **Missing dependencies in useEffect**
5. **State updates on unmounted components**

#### Step 11.1: Audit Current Warnings

```bash
# Start dev server
npm run dev

# Open browser console
# Document all warnings
```

**Create tracking file:**

```markdown
# React Warnings Audit (Phase 1, Week 3)

## Date: [Current Date]

### Total Warnings: [Count]

1. Missing key prop (12 occurrences)
   - `src/components/DepartmentTray.tsx:45`
   - `src/components/StudyMode.tsx:120`
   - ...

2. useEffect missing dependencies (8 occurrences)
   - `src/hooks/useGameTimer.ts:28`
   - ...

3. Uncontrolled component warnings (3 occurrences)
   - `src/components/AccessibilitySettings.tsx:67`
   - ...

4. State updates after unmount (2 occurrences)
   - `src/components/HintModal.tsx:89`
   - ...
```

#### Step 11.2: Fix Missing Keys

**Pattern:**

```typescript
// BEFORE (WARNING):
{departments.map(dept => (
  <DepartmentCard department={dept} />
))}

// AFTER (NO WARNING):
{departments.map(dept => (
  <DepartmentCard key={dept.id} department={dept} />
))}
```

**Automated fix:**

```bash
# Use ESLint to find issues
npx eslint src/components --rule 'react/jsx-key: error' --fix
```

#### Step 11.3: Fix useEffect Dependencies

**Pattern:**

```typescript
// BEFORE (WARNING):
useEffect(() => {
  fetchData(userId);
}, []); // Missing userId dependency

// AFTER (NO WARNING):
useEffect(() => {
  fetchData(userId);
}, [userId, fetchData]); // All dependencies listed
```

**Or use exhaustive-deps rule:**

```bash
npx eslint src --rule 'react-hooks/exhaustive-deps: error' --fix
```

#### Step 11.4: Fix Uncontrolled Components

**Pattern:**

```typescript
// BEFORE (WARNING):
const [value, setValue] = useState();
<input value={value} onChange={e => setValue(e.target.value)} />
// Warning: switching from uncontrolled to controlled

// AFTER (NO WARNING):
const [value, setValue] = useState(''); // Always controlled
<input value={value} onChange={e => setValue(e.target.value)} />
```

#### Step 11.5: Fix Unmounted State Updates

**Pattern:**

```typescript
// BEFORE (WARNING):
useEffect(() => {
  fetchData().then(data => setState(data));
  // Component may unmount before setState
}, []);

// AFTER (NO WARNING):
useEffect(() => {
  let mounted = true;

  fetchData().then(data => {
    if (mounted) {
      setState(data);
    }
  });

  return () => {
    mounted = false;
  };
}, []);
```

**Validation:**

```bash
# Start dev server
npm run dev

# Open browser console
# Expected: Zero warnings

# Run tests
npm run test -- --run
# Expected: All tests pass

# Final commit for M4
git add .
git commit -m "fix(M4): eliminate all React warnings

Fixed all React development warnings:
- Added missing key props (12 fixes)
- Fixed useEffect dependencies (8 fixes)
- Fixed uncontrolled components (3 fixes)
- Fixed state updates after unmount (2 fixes)

Development console now shows zero warnings.

Part of Phase 1: Foundation Stabilization (Week 3)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin phase-1-foundation-stabilization
```

---

## Phase 1 Final Validation

### Comprehensive Test Suite

```bash
# 1. TypeScript validation
npx tsc --noEmit
echo "Expected: No errors"

# 2. ESLint validation
npm run lint
echo "Expected: No errors"

# 3. Test suite
npm run test -- --run --reporter=verbose
echo "Expected: 914/914 passing"

# 4. Build validation
npm run build
echo "Expected: Successful build"

# 5. Bundle size check
du -sh dist/
echo "Expected: ≤280KB total"

# 6. Development warnings check
npm run dev &
sleep 5
# Open browser, check console
echo "Expected: Zero warnings"
```

### Success Criteria Checklist

✅ **M1: TypeScript Migration**
- [ ] Zero `any` types in event handlers (80 → 0)
- [ ] All components use strict types
- [ ] All hooks use strict types
- [ ] TypeScript compiles with no errors

✅ **M2: Auth Tests**
- [ ] All 25 auth tests passing
- [ ] Comprehensive Supabase mocks created
- [ ] Zero test exclusions for auth

✅ **M3: Hook Tests**
- [ ] All 180 hook tests passing
- [ ] Modular browser mocks created
- [ ] Zero test exclusions for hooks

✅ **M4: React Warnings**
- [ ] Zero React warnings in console
- [ ] All missing keys fixed
- [ ] All useEffect dependencies correct
- [ ] No uncontrolled component warnings

✅ **Overall Phase 1**
- [ ] 914/914 tests passing (100%)
- [ ] Zero TypeScript errors
- [ ] Zero ESLint errors
- [ ] Zero React warnings
- [ ] Build succeeds
- [ ] Bundle size within limits

---

## Rollback Procedures

### If Phase 1 Needs Rollback

```bash
# Full rollback to baseline
git checkout main
git branch -D phase-1-foundation-stabilization
git checkout -b phase-1-foundation-stabilization
git push -f origin phase-1-foundation-stabilization

# Restore from backup tag
git reset --hard phase-0-baseline
```

### Partial Rollback (by Milestone)

```bash
# Rollback M4 only
git revert <M4-commit-hash>

# Rollback M3 only
git revert <M3-commit-hash>

# etc.
```

---

## Next Steps

After Phase 1 completion:

1. **Code Review**: 2-3 day peer review period
2. **Merge to Main**: Create PR, run CI/CD
3. **Deploy to Staging**: Test in staging environment
4. **Phase 2 Kickoff**: Begin architectural refactoring

---

**End of Phase 1 Master Playbook**

**Status:** COMPLETE
**Next Document:** `M1_TYPESCRIPT_IMPLEMENTATION.md` (detailed guide for TypeScript migration)
