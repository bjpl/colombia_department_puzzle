# Complete Technical Specifications - Implementation Roadmap

**Project:** Colombia Puzzle Game - Test Coverage & Code Quality Initiative
**Total Milestones:** 12 across 3 phases
**Current Coverage:** 92.1% (842/914 tests passing)
**Target:** Production-ready with 95%+ coverage

---

## Documentation Structure

```
docs/technical-specs/
├── IMPLEMENTATION_ROADMAP.md (this file)
├── phase-1/
│   ├── typescript-fixes.md ✓ COMPLETE
│   ├── auth-test-infrastructure.md ✓ COMPLETE
│   ├── hook-test-infrastructure.md (185+ tests)
│   └── react-warnings-fixes.md (dependency arrays)
├── phase-2/
│   ├── mobile-test-infrastructure.md (150+ tests)
│   ├── component-test-infrastructure.md (237+ tests)
│   ├── refactoring-specs/
│   │   ├── HintModal-refactoring.md (908 → <300 lines)
│   │   ├── StudyMode-refactoring.md (707 → <300 lines)
│   │   ├── OptimizedColombiaMap-refactoring.md (576 → <300 lines)
│   │   ├── DepartmentTray-refactoring.md (570 → <300 lines)
│   │   ├── InteractiveTutorial-refactoring.md (531 → <300 lines)
│   │   ├── GameContainer-refactoring.md (511 → <300 lines)
│   │   ├── PostGameReport-refactoring.md (318 → <250 lines)
│   │   └── AccessibilitySettings-refactoring.md (modularization)
│   └── type-migration-plan.md (236 → <120 any)
└── phase-3/
    ├── dependency-migration/
    │   ├── react-19-migration.md
    │   ├── eslint-9-migration.md
    │   └── package-updates.md
    ├── lazy-loading-implementation.md
    └── cicd-pipeline/
        ├── github-actions-workflow.yml
        ├── stage-definitions.md
        └── deployment-automation.md
```

---

## Phase 1: Foundation & Stability (M1-M4)

### M1: TypeScript Stability ✓ SPEC COMPLETE
**File:** `phase-1/typescript-fixes.md`

**Deliverables:**
- [x] Complete fix for all 5 TypeScript errors
- [x] Before/after code samples
- [x] Validation commands
- [x] Implementation checklist

**Key Fixes:**
1. Remove unused `isCI` variable (line 6)
2. Fix `requestAnimationFrame` return type (line 43)
3. Implement `createTouchList` helper for TouchList conversion (lines 198-200)

**Status:** Production-ready code provided

---

### M2: Auth Tests (0% → 80%) ✓ SPEC COMPLETE
**File:** `phase-1/auth-test-infrastructure.md`

**Deliverables:**
- [x] Complete Supabase mock implementation (all methods)
- [x] AuthTestProvider wrapper with hooks
- [x] 25 AuthService tests (signup, signin, signout, session, profile)
- [x] 25 LoginForm tests (validation, functionality, accessibility)
- [x] 20+ SignupForm tests (validation, password strength, error handling)

**Files Created:**
1. `src/tests/mocks/supabaseMock.ts` - Full Supabase client mock
2. `src/tests/utils/authTestUtils.tsx` - Test provider wrapper
3. `src/tests/services/authService.test.ts` - Service layer tests
4. `src/tests/components/auth/LoginForm.test.tsx` - Component tests
5. `src/tests/components/auth/SignupForm.test.tsx` - Component tests

**Status:** Production-ready code provided (70+ tests)

---

### M3: Hook Tests (4.13% → 25%)
**File:** `phase-1/hook-test-infrastructure.md`

**Target:** 185+ tests across 8 hook files

**Hooks to Test:**
1. `useGameTimer` - Timer logic, pause/resume, completion
2. `useModalManager` - Modal state orchestration
3. `usePWA` - Install prompts, update detection, offline status
4. `useProgressiveHints` - Hint system, progression logic
5. `useTouchGestures` - Touch event handling, swipe detection
6. `useAuth` - Auth context consumer
7. `useMediaQuery` - Responsive breakpoint detection
8. `useModalOrchestration` - Complex modal flows

**Infrastructure Required:**
```typescript
// src/tests/utils/hookTestUtils.ts
- renderHook wrapper with all providers
- mockGameContext
- mockAuthContext
- mockTouchEvent factory
- mockMediaQueryList
```

**Test Template Per Hook:**
- Initialization tests (5-8 tests)
- State management tests (8-12 tests)
- Effect cleanup tests (3-5 tests)
- Edge case tests (5-8 tests)
- Integration tests (3-5 tests)

**Example Structure:**
```typescript
describe('useGameTimer', () => {
  describe('Initialization', () => {
    it('should start with zero time');
    it('should accept initial time');
    it('should restore from localStorage');
  });

  describe('Timer Operations', () => {
    it('should increment time each second');
    it('should pause timer');
    it('should resume timer');
    it('should reset timer');
  });

  describe('Completion Detection', () => {
    it('should detect game completion');
    it('should save final time');
    it('should trigger onComplete callback');
  });

  describe('Cleanup', () => {
    it('should clear interval on unmount');
    it('should save state before unmount');
  });
});
```

---

### M4: React Warnings (Dependency Arrays)
**File:** `phase-1/react-warnings-fixes.md`

**Target:** Fix all React Hook dependency warnings

**Common Patterns:**
```typescript
// BEFORE (warning)
useEffect(() => {
  fetchData();
}, []); // Missing dependency: fetchData

// AFTER (fixed)
const fetchData = useCallback(() => {
  // fetch logic
}, [/* dependencies */]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

**Files Requiring Fixes:**
- `src/components/HintModal.tsx` - 8 useEffect calls
- `src/components/StudyMode.tsx` - 12 useEffect calls
- `src/components/OptimizedColombiaMap.tsx` - 6 useEffect calls
- `src/components/GameContainer.tsx` - 10 useEffect calls
- `src/hooks/useGameTimer.ts` - 3 useEffect calls
- `src/hooks/useTouchGestures.ts` - 4 useEffect calls

---

## Phase 2: Component Quality & Type Safety (M5-M8)

### M5: Mobile Tests (0% → 70%)
**File:** `phase-2/mobile-test-infrastructure.md`

**Target:** 150+ mobile-specific tests

**Infrastructure:**
```typescript
// src/tests/utils/mobileTestUtils.ts
export const mockTouchEvent = (type, options) => { /* ... */ };
export const mockViewport = (width, height) => { /* ... */ };
export const mockOrientation = (type) => { /* ... */ };
export const mockGesture = (type, coordinates) => { /* ... */ };
```

**Components to Test:**
1. TouchModeAdapter (gesture detection)
2. BottomSheet (swipe mechanics)
3. TouchFeedback (haptic simulation)
4. MobileGameLayout (responsive grid)
5. MobileHeader (touch targets)
6. ScrollIndicator (scroll detection)
7. SwipeDetector (swipe patterns)

**Test Categories:**
- Touch event handling (40 tests)
- Gesture recognition (30 tests)
- Viewport adaptation (25 tests)
- Accessibility (touch targets) (20 tests)
- Performance (scroll/gesture) (15 tests)
- Orientation changes (10 tests)
- Edge cases (multi-touch, interrupts) (10 tests)

---

### M6: Component Tests (10% → 60%)
**File:** `phase-2/component-test-infrastructure.md`

**Target:** 237+ component tests

**Infrastructure:**
```typescript
// src/tests/utils/componentTestUtils.tsx
export const renderWithProviders = (ui, options) => { /* ... */ };
export const mockDndContext = () => { /* ... */ };
export const mockD3Geo = () => { /* ... */ };
export const createGameState = (overrides) => { /* ... */ };
```

**Priority Components:**
1. HintModal - 35 tests (modal states, hint progression)
2. StudyMode - 60 tests (already complete from earlier test)
3. OptimizedColombiaMap - 40 tests (d3-geo, zoom, interactions)
4. DepartmentTray - 30 tests (drag-drop, sorting, filtering)
5. InteractiveTutorial - 25 tests (step progression, hotspots)
6. GameContainer - 30 tests (game flow, state management)
7. PostGameReport - 20 tests (statistics, charts, sharing)
8. AccessibilitySettings - 15 tests (settings persistence, a11y)

---

### M7: Component Refactoring (8 → 3 files)
**Files:** `phase-2/refactoring-specs/*.md` (8 documents)

**Each refactoring spec includes:**
1. Current file analysis (lines, complexity, issues)
2. Target architecture (component tree, file structure)
3. Complete interface definitions
4. Before/after code samples
5. Migration steps with validation
6. Test update requirements

**Example: HintModal Refactoring**

**Current:** 908 lines, single file
**Target:** 3 files, <300 lines each

```
src/components/hint/
├── HintModal.tsx (250 lines) - Main modal container
├── HintContent.tsx (200 lines) - Content display logic
├── HintProgression.tsx (180 lines) - Progression system
├── types.ts (50 lines) - Shared types
└── utils.ts (80 lines) - Helper functions
```

**Interfaces:**
```typescript
// types.ts
export interface HintLevel {
  id: string;
  title: string;
  description: string;
  cost: number;
  revealed: boolean;
}

export interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentId: string;
  availableHints: HintLevel[];
  onHintReveal: (hintId: string) => void;
}

export interface HintContentProps {
  hint: HintLevel;
  isRevealed: boolean;
  onReveal: () => void;
}
```

**Migration Steps:**
1. Extract types to `types.ts`
2. Create `HintContent.tsx` with content rendering
3. Create `HintProgression.tsx` with progression logic
4. Refactor `HintModal.tsx` to use new components
5. Update tests to match new structure
6. Validate functionality unchanged

---

### M8: Type Safety (236 → <120 any)
**File:** `phase-2/type-migration-plan.md`

**Strategy:** File-by-file migration with strict type definitions

**High-Priority Files:**
1. `OptimizedColombiaMap.tsx` - 45 any (d3-geo types)
2. `StudyMode.tsx` - 28 any (event handlers, geo data)
3. `GameContainer.tsx` - 22 any (game state, callbacks)
4. `DepartmentTray.tsx` - 18 any (drag-drop types)
5. `InteractiveTutorial.tsx` - 15 any (tutorial state)

**Type Definitions Needed:**
```typescript
// types/d3-geo.d.ts
import type { GeoPath, GeoProjection } from 'd3-geo';

export interface ColombiaGeoData {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

export interface GeoFeature {
  type: 'Feature';
  properties: DepartmentProperties;
  geometry: GeoGeometry;
}

// types/dnd-kit.d.ts
import type { DraggableAttributes } from '@dnd-kit/core';

export interface DepartmentDraggable {
  id: string;
  data: DepartmentData;
  attributes: DraggableAttributes;
}
```

---

## Phase 3: Modern Stack & Automation (M9-M12)

### M9: Coverage Maintenance
**Automation for continuous monitoring**

```yaml
# .github/workflows/coverage.yml
name: Coverage Check
on: [push, pull_request]
jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test -- --coverage
      - run: npx coverage-check --threshold=95
      - uses: codecov/codecov-action@v4
```

---

### M10: Dependency Updates

**React 18 → 19 Migration:**
```typescript
// Breaking changes to handle
- useId() hook changes
- Automatic batching in timeouts/promises
- Strict mode double-rendering
- Concurrent features enabled by default
```

**ESLint 8 → 9 Migration:**
```javascript
// eslint.config.js (new flat config)
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import typescript from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { react, typescript },
    rules: { /* ... */ },
  },
];
```

---

### M11: Lazy Loading

**Route-based code splitting:**
```typescript
// src/App.tsx
const GameContainer = lazy(() => import('./components/GameContainer'));
const StudyMode = lazy(() => import('./components/StudyMode'));
const Settings = lazy(() => import('./components/Settings'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<GameContainer />} />
        <Route path="/study" element={<StudyMode />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

**Bundle Analysis:**
```bash
npm run build -- --analyze
# Target: <200KB main bundle, <50KB per route chunk
```

---

### M12: CI/CD Pipeline

**Complete GitHub Actions workflow:**
```yaml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run coverage

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
      - run: npm run deploy
```

---

## Implementation Timeline

**Phase 1 (Week 1-2):**
- Day 1-2: M1 TypeScript fixes
- Day 3-5: M2 Auth test infrastructure
- Day 6-8: M3 Hook test infrastructure
- Day 9-10: M4 React warnings

**Phase 2 (Week 3-5):**
- Day 11-13: M5 Mobile test infrastructure
- Day 14-16: M6 Component tests
- Day 17-22: M7 Component refactoring (8 components)
- Day 23-25: M8 Type migration

**Phase 3 (Week 6):**
- Day 26-27: M9 Coverage automation
- Day 28-29: M10 Dependency updates
- Day 30: M11 Lazy loading
- Day 31-32: M12 CI/CD pipeline

---

## Validation Checkpoints

**After Each Milestone:**
```bash
# Run full test suite
npm test

# Check coverage
npm run coverage

# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build

# E2E (if applicable)
npm run e2e
```

**Success Criteria:**
- ✓ All tests passing (100%)
- ✓ Coverage ≥ 95%
- ✓ Zero TypeScript errors
- ✓ Zero ESLint errors
- ✓ Build completes successfully
- ✓ Bundle size within targets

---

## Current Status Summary

**Completed:**
- ✅ M1 TypeScript Fixes - Specification complete
- ✅ M2 Auth Tests - Specification complete (70+ tests)
- 🔄 M3-M12 - Specifications in progress

**Next Actions:**
1. Review and approve Phase 1 specs
2. Begin implementation of M1 (15 min)
3. Begin implementation of M2 (2-3 hours)
4. Continue specification creation for M3-M12

---

**Document Version:** 1.0
**Last Updated:** 2025-12-04
**Author:** System Architect Agent
**Status:** Phase 1 specifications complete, Phase 2-3 summaries provided
