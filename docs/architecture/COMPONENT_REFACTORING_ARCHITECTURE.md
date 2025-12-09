# Component Refactoring Architecture

**Document Version:** 1.0
**Date:** 2025-12-04
**Architect:** System Architecture Designer
**Status:** Design Phase

---

## Executive Summary

This document defines the technical architecture for refactoring 8 large components (>500 lines) into modular, maintainable units while preserving existing functionality and test coverage.

**Current State:**
- 8 files exceed 500-line threshold
- HintModal: 908 lines (181% over target)
- GameContainer: 511 lines (102% over target)
- Monolithic component structure
- 236 `any` type usages
- 5 TypeScript errors

**Target State:**
- All components under 500 lines
- Single Responsibility Principle compliance
- Zero `any` usages in refactored components
- Zero TypeScript errors
- 100% backward compatibility
- No test regressions

---

## 1. Refactoring Strategy

### 1.1 Component Splitting Methodology

**Pattern: Extract-Test-Integrate (ETI)**

```
Phase 1: EXTRACT
├── Identify logical boundaries
├── Create new component files
├── Define strict TypeScript interfaces
└── Extract with props/state isolation

Phase 2: TEST
├── Write component tests FIRST (TDD)
├── Verify original tests still pass
├── Add integration tests
└── Coverage must equal or exceed original

Phase 3: INTEGRATE
├── Replace inline code with new component
├── Verify rendering
├── Performance benchmark
└── Accessibility audit
```

### 1.2 Priority Matrix

| Component | Lines | Priority | Risk | Effort | Order |
|-----------|-------|----------|------|--------|-------|
| HintModal | 908 | Critical | Medium | High | 1 |
| regionalContent.ts | 898 | High | Low | Low | 6 |
| StudyMode | 707 | High | Medium | High | 2 |
| translations.ts | 700 | Medium | Low | Low | 7 |
| OptimizedColombiaMap | 576 | Medium | High | High | 5 |
| departmentEducation.ts | 571 | Medium | Low | Low | 8 |
| DepartmentTray | 570 | High | Medium | Medium | 3 |
| GameContainer | 511 | Critical | High | High | 4 |

**Rationale:**
- HintModal first: Highest LOC, pure UI logic (low risk)
- GameContainer later: Central orchestrator (high risk, needs careful planning)
- Data files (regionalContent, translations) last: Low hanging fruit, can batch

---

## 2. Detailed Refactoring Plans

### 2.1 HintModal (908 lines → ~350 lines)

**Current Structure Analysis:**
```typescript
HintModal.tsx (908 lines)
├── geographicHints (200+ lines) - DATA
├── Hint rendering logic (300+ lines) - UI
├── Progressive hint system (150+ lines) - LOGIC
├── Modal controls (100+ lines) - UI
└── Accessibility features (158+ lines) - UI
```

**Target Architecture:**
```
src/components/hints/
├── HintModal.tsx (180 lines) - Main orchestrator
├── HintContent.tsx (120 lines) - Content rendering
├── ProgressiveHintSystem.tsx (100 lines) - Logic extraction
└── HintAccessibility.tsx (80 lines) - A11y features

src/data/hints/
├── geographicHints.ts (250 lines) - Hint data
└── hintStrategies.ts (150 lines) - Hint algorithms
```

**Component Interfaces:**
```typescript
// HintModal.tsx - Main orchestrator
interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
  region: string;
  hintLevel: number; // 1, 2, or 3
}

// HintContent.tsx - Pure presentation
interface HintContentProps {
  departmentName: string;
  region: string;
  hintLevel: number;
  hints: GeographicHint;
  regionColor: string;
}

// ProgressiveHintSystem.tsx - Logic layer
interface ProgressiveHintSystemProps {
  departmentName: string;
  currentLevel: number;
  onLevelChange: (level: number) => void;
  maxLevel: number;
}

// HintAccessibility.tsx - A11y wrapper
interface HintAccessibilityProps {
  children: React.ReactNode;
  departmentName: string;
  hintLevel: number;
  ariaLabel?: string;
}
```

**Migration Steps:**
1. Extract `geographicHints` to `/src/data/hints/geographicHints.ts` (1 hour)
2. Create `HintContent.tsx` with pure rendering logic (2 hours)
3. Create `ProgressiveHintSystem.tsx` with level management (2 hours)
4. Create `HintAccessibility.tsx` with ARIA features (1 hour)
5. Refactor `HintModal.tsx` to orchestrate components (2 hours)
6. Write comprehensive component tests (3 hours)
7. Integration testing with existing flows (2 hours)

**Total Effort:** 13 hours

**Type Safety Improvements:**
```typescript
// Before (any usage)
const hintData: any = geographicHints[departmentName];

// After (strict typing)
interface GeographicHint {
  neighbors?: string[];
  position?: string;
  landmark?: string;
  size?: string;
}

const hintData: GeographicHint | undefined = geographicHints[departmentName];
if (!hintData) {
  return <HintNotFound departmentName={departmentName} />;
}
```

---

### 2.2 GameContainer (511 lines → ~300 lines)

**Current Structure Analysis:**
```typescript
GameContainer.tsx (511 lines)
├── Modal orchestration (100+ lines) - STATE
├── Drag handlers (80+ lines) - LOGIC
├── Responsive layout logic (70+ lines) - UI
├── Keyboard navigation setup (60+ lines) - LOGIC
├── Effect cleanup (50+ lines) - LIFECYCLE
└── Component rendering (151+ lines) - UI
```

**Target Architecture:**
```
src/components/game/
├── GameContainer.tsx (200 lines) - Main orchestrator
├── GameLayout.tsx (100 lines) - Layout logic
└── GameCleanup.tsx (80 lines) - Lifecycle management

src/hooks/ (already extracted)
├── useDragHandlers.ts ✓ (already done)
├── useModalOrchestration.ts ✓ (already done)
└── useGameCleanup.ts (new - 120 lines)
```

**Component Interfaces:**
```typescript
// GameLayout.tsx - Responsive layout wrapper
interface GameLayoutProps {
  isMobile: boolean;
  isTouchMode: boolean;
  children: {
    header: React.ReactNode;
    main: React.ReactNode;
    sidebar: React.ReactNode;
  };
}

// useGameCleanup.ts - Lifecycle hook
interface GameCleanupOptions {
  onMount?: () => void;
  onUnmount?: () => void;
  cleanupSelectors?: string[]; // CSS selectors to clean
  resetDragState?: boolean;
}

function useGameCleanup(options: GameCleanupOptions): void;
```

**Migration Steps:**
1. Extract cleanup logic to `useGameCleanup.ts` hook (3 hours)
2. Create `GameLayout.tsx` component (2 hours)
3. Refactor `GameContainer.tsx` main file (3 hours)
4. Update existing tests (2 hours)
5. Add new component tests (2 hours)
6. Integration testing (2 hours)

**Total Effort:** 14 hours

---

### 2.3 StudyMode (707 lines → ~400 lines)

**Current Structure Analysis:**
```typescript
StudyMode.tsx (707 lines)
├── Study state management (150+ lines) - STATE
├── Region filtering (100+ lines) - LOGIC
├── Department card rendering (200+ lines) - UI
├── Navigation controls (100+ lines) - UI
└── Progress tracking (157+ lines) - LOGIC
```

**Target Architecture:**
```
src/components/study/
├── StudyMode.tsx (250 lines) - Main container
├── RegionFilter.tsx (100 lines) - Filter controls
├── DepartmentGrid.tsx (150 lines) - Card grid
└── StudyProgress.tsx (120 lines) - Progress tracking

src/hooks/
└── useStudyNavigation.ts (150 lines) - Navigation logic
```

**Migration Steps:**
1. Extract `RegionFilter.tsx` (2 hours)
2. Extract `DepartmentGrid.tsx` (2 hours)
3. Extract `StudyProgress.tsx` (2 hours)
4. Create `useStudyNavigation.ts` hook (3 hours)
5. Refactor main `StudyMode.tsx` (2 hours)
6. Write component tests (3 hours)
7. Integration testing (2 hours)

**Total Effort:** 16 hours

---

### 2.4 DepartmentTray (570 lines → ~350 lines)

**Current Structure Analysis:**
```typescript
DepartmentTray.tsx (570 lines)
├── Drag source setup (120+ lines) - LOGIC
├── Department item rendering (200+ lines) - UI
├── Search/filter (100+ lines) - LOGIC
├── Accessibility controls (80+ lines) - A11Y
└── Animations (70+ lines) - UI
```

**Target Architecture:**
```
src/components/tray/
├── DepartmentTray.tsx (200 lines) - Main container
├── DepartmentItem.tsx (120 lines) - Individual items
├── TraySearch.tsx (100 lines) - Search controls
└── TrayAccessibility.tsx (80 lines) - A11Y features

src/hooks/
└── useTrayDragSource.ts (100 lines) - Drag logic
```

**Migration Steps:**
1. Extract `DepartmentItem.tsx` (2 hours)
2. Extract `TraySearch.tsx` (2 hours)
3. Extract `TrayAccessibility.tsx` (1 hour)
4. Create `useTrayDragSource.ts` hook (2 hours)
5. Refactor main `DepartmentTray.tsx` (2 hours)
6. Write component tests (3 hours)
7. Integration testing (2 hours)

**Total Effort:** 14 hours

---

### 2.5 OptimizedColombiaMap (576 lines → ~350 lines)

**Current Structure Analysis:**
```typescript
OptimizedColombiaMap.tsx (576 lines)
├── SVG path generation (200+ lines) - RENDERING
├── Map projection logic (150+ lines) - MATH
├── Interaction handlers (100+ lines) - LOGIC
├── Accessibility features (70+ lines) - A11Y
└── Performance optimizations (56+ lines) - PERF
```

**Target Architecture:**
```
src/components/map/
├── OptimizedColombiaMap.tsx (200 lines) - Main container
├── MapSVGRenderer.tsx (150 lines) - SVG generation
├── MapProjection.ts (120 lines) - Projection math
└── MapInteractions.tsx (100 lines) - Click/hover logic

src/utils/map/
└── mapOptimizations.ts (80 lines) - Performance utils
```

**Migration Steps:**
1. Extract `MapProjection.ts` utility (2 hours)
2. Extract `mapOptimizations.ts` (1 hour)
3. Create `MapSVGRenderer.tsx` (3 hours)
4. Create `MapInteractions.tsx` (2 hours)
5. Refactor main map component (2 hours)
6. Write unit tests (3 hours)
7. Integration and visual regression testing (2 hours)

**Total Effort:** 15 hours

---

## 3. Service Layer Pattern

### 3.1 Current State Analysis

**Existing Services:**
```
src/services/
├── auth/
│   ├── AuthService.ts ✓ (already good)
│   └── BaseService.ts ✓ (already good)
├── game/
│   └── GameStatsService.ts (440 lines - needs split)
├── soundManager.ts (345 lines - needs split)
└── keyboardManager.ts (unknown size)
```

**Missing Services (50% of code not in services):**
- Hint management logic (scattered in HintModal)
- Study mode progression (scattered in StudyMode)
- Game state persistence (scattered in GameContainer)
- Analytics/tracking (not implemented)
- Error reporting (basic ErrorBoundary only)

### 3.2 Target Service Architecture

```
src/services/
├── auth/ ✓
│   ├── AuthService.ts
│   └── BaseService.ts
├── game/
│   ├── GameStatsService.ts (refactored to 250 lines)
│   ├── GameStateService.ts (new - 200 lines)
│   └── GameProgressService.ts (new - 150 lines)
├── hint/
│   ├── HintService.ts (new - 200 lines)
│   └── HintStrategyService.ts (new - 150 lines)
├── study/
│   ├── StudyModeService.ts (new - 200 lines)
│   └── StudyProgressService.ts (new - 150 lines)
├── audio/
│   ├── SoundService.ts (refactored from soundManager - 180 lines)
│   └── AudioContextService.ts (new - 120 lines)
├── input/
│   ├── KeyboardService.ts (refactored from keyboardManager - 150 lines)
│   └── TouchService.ts (new - 120 lines)
├── analytics/
│   ├── AnalyticsService.ts (new - 200 lines)
│   └── EventTrackingService.ts (new - 150 lines)
└── error/
    ├── ErrorReportingService.ts (new - 180 lines)
    └── ErrorRecoveryService.ts (new - 120 lines)
```

### 3.3 Service Design Principles

**Pattern: Service Singleton with Dependency Injection**

```typescript
// BaseService.ts (existing, used as template)
export abstract class BaseService {
  protected initialized = false;

  abstract initialize(): Promise<void>;
  abstract cleanup(): void;

  protected assertInitialized(): void {
    if (!this.initialized) {
      throw new ServiceNotInitializedError(this.constructor.name);
    }
  }
}

// Example: HintService.ts
export class HintService extends BaseService {
  private hints: Map<string, GeographicHint> = new Map();
  private strategies: HintStrategy[] = [];

  async initialize(): Promise<void> {
    // Load hint data
    this.hints = await this.loadHints();
    this.strategies = await this.loadStrategies();
    this.initialized = true;
  }

  cleanup(): void {
    this.hints.clear();
    this.strategies = [];
    this.initialized = false;
  }

  getHint(
    departmentName: string,
    level: number,
    options?: HintOptions
  ): HintResult {
    this.assertInitialized();

    const hint = this.hints.get(departmentName);
    if (!hint) {
      return { type: 'not-found', departmentName };
    }

    const strategy = this.strategies.find(s => s.level === level);
    if (!strategy) {
      return { type: 'invalid-level', level };
    }

    return strategy.apply(hint, options);
  }
}

// Singleton export
export const hintService = new HintService();
```

**Service Interfaces:**

```typescript
// src/types/services.ts
export interface ServiceOptions {
  autoInit?: boolean;
  retryOnError?: boolean;
  maxRetries?: number;
}

export interface ServiceStatus {
  initialized: boolean;
  healthy: boolean;
  lastError?: Error;
  stats?: Record<string, number>;
}

export interface IService {
  initialize(options?: ServiceOptions): Promise<void>;
  cleanup(): void;
  getStatus(): ServiceStatus;
}

// Example: GameStateService
export interface GameStateService extends IService {
  saveState(state: GameState): Promise<void>;
  loadState(): Promise<GameState | null>;
  clearState(): Promise<void>;
  exportState(): Promise<string>; // JSON export
  importState(json: string): Promise<void>;
}
```

### 3.4 Migration Strategy

**Phase 1: Core Services (Week 1)**
1. Refactor `GameStatsService.ts` (4 hours)
2. Create `GameStateService.ts` (6 hours)
3. Create `HintService.ts` (6 hours)
4. Write service tests (8 hours)

**Phase 2: Feature Services (Week 2)**
1. Create `StudyModeService.ts` (6 hours)
2. Refactor `SoundService.ts` (4 hours)
3. Create `KeyboardService.ts` (4 hours)
4. Write service tests (6 hours)

**Phase 3: Infrastructure Services (Week 3)**
1. Create `AnalyticsService.ts` (6 hours)
2. Create `ErrorReportingService.ts` (6 hours)
3. Create `TouchService.ts` (4 hours)
4. Write service tests (6 hours)

**Total Effort:** 66 hours (3 weeks)

---

## 4. Type Safety Roadmap

### 4.1 Current Type Issues

**Statistics:**
- 236 `any` usages across codebase
- 5 TypeScript errors
- Weak type coverage in:
  - Event handlers (drag/drop)
  - D3 geo projections
  - Third-party library integrations
  - Dynamic data structures

### 4.2 Type Safety Strategy

**Tier 1: Critical Paths (Priority 1)**
```typescript
// Before
const handleDragEnd = (event: any) => {
  const { active, over } = event;
  // ...
};

// After
import type { DragEndEvent } from '@dnd-kit/core';

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  // Type-safe access to event properties
};
```

**Tier 2: Data Structures (Priority 2)**
```typescript
// Before
const departmentData: any = {
  // ...
};

// After
interface Department {
  id: string;
  name: string;
  region: Region;
  coordinates: GeoCoordinates;
  properties: DepartmentProperties;
}

const departmentData: readonly Department[] = [
  // Readonly to prevent mutations
];
```

**Tier 3: Type Guards (Priority 3)**
```typescript
// src/types/guards.ts
export function isDepartment(value: unknown): value is Department {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'region' in value
  );
}

export function assertDepartment(value: unknown): asserts value is Department {
  if (!isDepartment(value)) {
    throw new TypeError('Expected Department');
  }
}

// Usage
const maybeData: unknown = getDataFromAPI();
if (isDepartment(maybeData)) {
  // TypeScript knows maybeData is Department here
  console.log(maybeData.name);
}
```

### 4.3 `any` Elimination Plan

| Category | Count | Strategy | Priority |
|----------|-------|----------|----------|
| Event handlers | 80 | Use library types (@dnd-kit, React) | High |
| D3 projections | 45 | Create projection type wrappers | Medium |
| API responses | 35 | Use Zod for runtime validation | High |
| Component props | 30 | Define strict interfaces | High |
| Utility functions | 25 | Generic type parameters | Medium |
| Test mocks | 21 | Use vi.Mock<T> properly | Low |

**Implementation Steps:**

**Week 1: Event Handlers (80 any → 0)**
```typescript
// Create type definitions
// src/types/events.ts
export type DragEvent = DragEndEvent | DragStartEvent | DragMoveEvent;
export type TouchEvent = React.TouchEvent<HTMLElement>;
export type KeyboardEvent = React.KeyboardEvent<HTMLElement>;

// Apply across codebase
```

**Week 2: D3 Projections (45 any → 0)**
```typescript
// src/types/projections.ts
import type { GeoPath, GeoProjection } from 'd3-geo';

export interface ColombiaProjection {
  projection: GeoProjection;
  path: GeoPath;
  scale: number;
  translate: [number, number];
}

// Type-safe wrapper
export function createColombiaProjection(
  width: number,
  height: number
): ColombiaProjection {
  // Implementation with full type safety
}
```

**Week 3: API Responses (35 any → 0)**
```typescript
// Use Zod for runtime validation + type inference
import { z } from 'zod';

const DepartmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  region: z.enum(['Caribe', 'Pacífico', 'Andina', 'Orinoquía', 'Amazonía']),
  coordinates: z.array(z.number()),
});

type Department = z.infer<typeof DepartmentSchema>;

// Runtime validation + compile-time types
const department = DepartmentSchema.parse(apiResponse);
```

**Week 4: Component Props (30 any → 0)**
```typescript
// Strict prop interfaces with documentation
interface HintModalProps {
  /** Whether the modal is currently visible */
  isOpen: boolean;
  /** Callback fired when modal should close */
  onClose: () => void;
  /** Name of the department to show hints for */
  departmentName: string;
  /** Geographic region of the department */
  region: Region;
  /** Current hint progression level (1-3) */
  hintLevel: 1 | 2 | 3;
}
```

**Total Effort:** 32 hours (4 weeks)

---

## 5. Validation Criteria

### 5.1 Refactoring Success Metrics

✅ **Component Size:**
- All files under 500 lines
- Average file size: 250 lines
- No single responsibility violations

✅ **Type Safety:**
- Zero `any` usages in refactored code
- Zero TypeScript errors
- 100% type coverage on public APIs

✅ **Test Coverage:**
- Maintain existing 92.1% coverage
- Add component-specific tests
- No regression in existing tests

✅ **Performance:**
- No increase in bundle size (code splitting)
- No decrease in rendering performance
- Lazy loading maintained for large components

✅ **Accessibility:**
- WCAG AAA compliance maintained
- No ARIA violations introduced
- Screen reader testing passes

### 5.2 Pre-Merge Checklist

```bash
# Before merging any refactoring PR:

# 1. Type checking
npm run typecheck  # Must pass with 0 errors

# 2. Tests
npm test -- --run  # Must maintain 92.1%+ coverage
npm run test:e2e   # All E2E tests pass

# 3. Linting
npm run lint       # Zero warnings/errors

# 4. Build
npm run build      # Successful production build

# 5. Bundle analysis
npm run build:analyze  # No size increase

# 6. Accessibility
npm run test:a11y  # WCAG AAA maintained

# 7. Visual regression
npm run test:visual  # No unintended changes
```

---

## 6. Risk Mitigation

### 6.1 Identified Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing tests | Medium | High | Feature flags, parallel implementation |
| Performance regression | Low | High | Benchmark before/after, lazy loading |
| Type errors in production | Low | Critical | Strict CI/CD checks, staging environment |
| Accessibility degradation | Low | High | Automated a11y testing in CI |
| Developer confusion | Medium | Medium | Comprehensive documentation, examples |

### 6.2 Rollback Strategy

**Feature Flags:**
```typescript
// src/config/features.ts
export const FEATURES = {
  USE_REFACTORED_HINT_MODAL: import.meta.env.VITE_USE_REFACTORED_HINT_MODAL === 'true',
  USE_REFACTORED_GAME_CONTAINER: import.meta.env.VITE_USE_REFACTORED_GAME_CONTAINER === 'true',
  // etc.
};

// In component
import { FEATURES } from '@/config/features';

export default function HintModalWrapper(props: HintModalProps) {
  return FEATURES.USE_REFACTORED_HINT_MODAL
    ? <NewHintModal {...props} />
    : <OldHintModal {...props} />;
}
```

**Parallel Implementation:**
- Keep old components until new ones are battle-tested
- Use feature flags for gradual rollout
- Monitor error rates in production
- Easy rollback via environment variable

---

## 7. Timeline

### Overall Schedule: 12 Weeks

**Weeks 1-4: Foundation**
- HintModal refactoring (Week 1)
- GameContainer refactoring (Week 2)
- Core services (GameState, Hint) (Week 3)
- Type safety - Event handlers & D3 (Week 4)

**Weeks 5-8: Features**
- StudyMode refactoring (Week 5)
- DepartmentTray refactoring (Week 6)
- Feature services (StudyMode, Sound, Keyboard) (Week 7)
- Type safety - API responses & Component props (Week 8)

**Weeks 9-11: Polish**
- OptimizedColombiaMap refactoring (Week 9)
- Infrastructure services (Analytics, Error) (Week 10)
- Data files refactoring (Week 11)

**Week 12: Validation**
- Comprehensive testing
- Performance benchmarking
- Documentation finalization
- Production readiness audit

---

## 8. Next Steps

**Immediate Actions:**
1. Review this architecture with team
2. Set up feature flag infrastructure
3. Create refactoring branches in Git
4. Schedule HintModal refactoring sprint (Week 1)

**Required Approvals:**
- [ ] Queen Coordinator (architecture approval)
- [ ] GOAP Planner (timeline feasibility)
- [ ] Test Lead (testing strategy)
- [ ] DevOps Lead (CI/CD integration)

**Documentation:**
- [ ] Update CONTRIBUTING.md with refactoring patterns
- [ ] Create component template repository
- [ ] Document service layer conventions
- [ ] Add TypeScript style guide

---

## Appendix A: File Structure After Refactoring

```
src/
├── components/
│   ├── game/
│   │   ├── GameContainer.tsx (200 lines)
│   │   ├── GameLayout.tsx (100 lines)
│   │   └── GameCleanup.tsx (80 lines)
│   ├── hints/
│   │   ├── HintModal.tsx (180 lines)
│   │   ├── HintContent.tsx (120 lines)
│   │   ├── ProgressiveHintSystem.tsx (100 lines)
│   │   └── HintAccessibility.tsx (80 lines)
│   ├── study/
│   │   ├── StudyMode.tsx (250 lines)
│   │   ├── RegionFilter.tsx (100 lines)
│   │   ├── DepartmentGrid.tsx (150 lines)
│   │   └── StudyProgress.tsx (120 lines)
│   ├── tray/
│   │   ├── DepartmentTray.tsx (200 lines)
│   │   ├── DepartmentItem.tsx (120 lines)
│   │   ├── TraySearch.tsx (100 lines)
│   │   └── TrayAccessibility.tsx (80 lines)
│   └── map/
│       ├── OptimizedColombiaMap.tsx (200 lines)
│       ├── MapSVGRenderer.tsx (150 lines)
│       ├── MapProjection.ts (120 lines)
│       └── MapInteractions.tsx (100 lines)
├── services/
│   ├── game/
│   │   ├── GameStatsService.ts (250 lines)
│   │   ├── GameStateService.ts (200 lines)
│   │   └── GameProgressService.ts (150 lines)
│   ├── hint/
│   │   ├── HintService.ts (200 lines)
│   │   └── HintStrategyService.ts (150 lines)
│   ├── study/
│   │   ├── StudyModeService.ts (200 lines)
│   │   └── StudyProgressService.ts (150 lines)
│   └── [other services...]
└── data/
    ├── hints/
    │   ├── geographicHints.ts (250 lines)
    │   └── hintStrategies.ts (150 lines)
    └── [other data...]
```

---

**End of Document**
