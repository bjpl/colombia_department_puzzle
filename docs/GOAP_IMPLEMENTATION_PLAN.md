# GOAP Implementation Plan - Colombia Puzzle Game
**Goal-Oriented Action Planning for Technical Excellence**

## Current State Baseline (2025-12-04)

### Metrics Snapshot
- **Test Files:** 44 test files
- **Tests Passing:** 180/180 (100% of running tests)
- **TypeScript Errors:** 5 compilation errors
- **Any Types:** 232 instances
- **Large Files (>500 lines):** 8 files identified
- **Test Coverage:** ~92% (180 tests running successfully)
- **Build Status:** ✅ Successful (657.74 KiB)

### Goal State Targets

**P0 - Critical (Week 1-2):**
- TypeScript errors: 5 → 0
- Auth test coverage: Current → 80%
- Core hook tests: Current → 25%
- React Hooks warnings: 10+ → 0

**P1 - High Priority (Week 3-4):**
- Mobile test coverage: Current → 70%
- Component test coverage: Current → 60%
- Large files: 8 → 3
- Any types: 232 → <120

**P2 - Medium Priority (Month 2):**
- Overall test coverage: 92% → 70% maintained
- Dependency updates: React 18→19, ESLint 8→9
- Lazy loading implementation
- CI/CD maturity improvements

---

## MILESTONE 1: TypeScript Compilation Stability
**Priority:** P0 (Critical)
**Sprint:** Week 1, Days 1-2

### Goal
Eliminate all TypeScript compilation errors to establish a stable foundation for further development.

### Success Criteria
- ✅ 0 TypeScript compilation errors
- ✅ `npm run build` completes without errors
- ✅ `npm run typecheck` passes clean
- ✅ All existing tests continue to pass (180/180)

### Preconditions
- None (can start immediately)

### Actions
1. **Identify Error Sources** (30 min)
   - Run `npm run typecheck > typecheck-errors.log`
   - Categorize errors by type and file
   - Priority: type mismatches > missing types > strictNullChecks

2. **Fix Type Errors** (4 hours)
   - Fix highest-impact errors first (blocking multiple files)
   - Add proper type annotations where `any` causes issues
   - Update deprecated type imports
   - Validate with incremental typecheck after each fix

3. **Validate Build** (30 min)
   - Run full build: `npm run build`
   - Check bundle output for warnings
   - Verify no new runtime errors introduced

4. **Regression Test** (1 hour)
   - Run full test suite: `npm test -- --run`
   - Verify 180/180 tests still pass
   - Check for new console warnings

### Estimated Effort
**6 hours** (0.75 developer days)

### Risks
- **Risk:** Fixing type errors may require refactoring that breaks tests
  - **Mitigation:** Fix in small increments, run tests after each change
  - **Fallback:** Revert individual commits if tests fail

- **Risk:** Circular dependency issues when adding proper imports
  - **Mitigation:** Use type-only imports (`import type`) where possible
  - **Fallback:** Extract shared types to dedicated files

### Validation
```bash
# Must all pass:
npm run typecheck              # 0 errors
npm run build                  # Success
npm test -- --run              # 180/180 passing
git diff --stat                # Review changes
```

### Dependencies
- None (blocks all other milestones)

### Deliverables
- Zero TypeScript compilation errors
- Build script running successfully
- Documentation of type improvements made
- Commit: `fix: resolve all TypeScript compilation errors`

---

## MILESTONE 2: Auth System Test Coverage
**Priority:** P0 (Critical)
**Sprint:** Week 1, Days 3-4

### Goal
Restore and improve authentication system test coverage to 80%.

### Success Criteria
- ✅ Auth test coverage: 0% → 80%
- ✅ All auth flows covered: login, logout, session, token refresh
- ✅ Error scenarios tested: network failures, invalid tokens, expired sessions
- ✅ 25+ auth-related tests passing

### Preconditions
- MILESTONE 1 completed (TypeScript stable)

### Actions
1. **Audit Current Auth Tests** (1 hour)
   - Review `src/tests/context/AuthContext.test.tsx` (639 lines)
   - Review `src/tests/services/auth/AuthService.test.ts` (618 lines)
   - Identify gaps in coverage
   - Map auth flows needing tests

2. **Write Missing Auth Tests** (6 hours)
   - Login flow tests (happy path + errors)
   - Logout and session cleanup
   - Token refresh logic
   - Permission/role checks
   - Session persistence
   - Multi-tab synchronization

3. **Mock External Dependencies** (2 hours)
   - Mock Firebase/Auth SDK
   - Mock localStorage/sessionStorage
   - Mock network requests
   - Create test fixtures for user data

4. **Validate Coverage** (1 hour)
   - Run coverage report: `npm run test:coverage`
   - Verify 80% line coverage for auth files
   - Check branch coverage for conditionals
   - Test edge cases

### Estimated Effort
**10 hours** (1.25 developer days)

### Risks
- **Risk:** Auth service uses complex async patterns that are hard to test
  - **Mitigation:** Use Vitest's async testing utilities, mock timers
  - **Fallback:** Test at integration level instead of unit level

- **Risk:** Third-party auth SDK is tightly coupled
  - **Mitigation:** Create abstraction layer for auth operations
  - **Fallback:** Use spy/mock patterns to isolate SDK calls

### Validation
```bash
# Must all pass:
npm run test:coverage -- --reporter=verbose | grep -A5 "auth"
# Expect: 80%+ coverage for AuthContext, AuthService
npm test -- src/tests/context/AuthContext.test.tsx
npm test -- src/tests/services/auth/AuthService.test.ts
```

### Dependencies
- Depends on: MILESTONE 1

### Deliverables
- 80% auth test coverage
- Comprehensive auth test suite
- Mock infrastructure for auth testing
- Commit: `test: achieve 80% auth test coverage with comprehensive flows`

---

## MILESTONE 3: Core Hook Test Coverage
**Priority:** P0 (Critical)
**Sprint:** Week 1-2, Days 5-7

### Goal
Increase core hooks test coverage from 4.13% to 25%.

### Success Criteria
- ✅ Hooks test coverage: 4.13% → 25%
- ✅ Critical hooks tested: useEnhancedKeyboardNavigation, useStudyMode
- ✅ 30+ hook-related tests passing
- ✅ All hook dependencies mocked properly

### Preconditions
- MILESTONE 1 completed (TypeScript stable)

### Actions
1. **Identify Core Hooks** (1 hour)
   - Audit `src/hooks/*` directory
   - Prioritize by usage frequency (grep analysis)
   - Review existing test: `useEnhancedKeyboardNavigation.test.tsx` (840 lines)
   - Review existing test: `useStudyMode.test.ts` (766 lines)

2. **Write Hook Tests** (8 hours)
   - `useStudyMode`: state management, transitions
   - `useEnhancedKeyboardNavigation`: key handlers, focus management
   - `useGameState`: game logic, scoring
   - `useAccessibility`: a11y features, ARIA
   - `useLocalStorage`: persistence, sync

3. **Mock React/Browser APIs** (2 hours)
   - Mock `localStorage`, `sessionStorage`
   - Mock `window.matchMedia`, `IntersectionObserver`
   - Mock `requestAnimationFrame`
   - Setup `@testing-library/react-hooks`

4. **Validate Coverage** (1 hour)
   - Run coverage: `npm run test:coverage -- --include="src/hooks/**"`
   - Verify 25% threshold met
   - Check for untested edge cases

### Estimated Effort
**12 hours** (1.5 developer days)

### Risks
- **Risk:** Hooks depend on complex React context that's hard to mock
  - **Mitigation:** Use `renderHook` with wrapper components
  - **Fallback:** Test hooks within component tests instead

- **Risk:** Browser API mocks are inconsistent across test environments
  - **Mitigation:** Create centralized mock setup in `vitest.setup.ts`
  - **Fallback:** Use conditional test skipping for browser-specific tests

### Validation
```bash
npm run test:coverage -- --include="src/hooks/**"
# Expect: 25%+ coverage
npm test -- src/tests/hooks/useEnhancedKeyboardNavigation.test.tsx
npm test -- src/tests/hooks/useStudyMode.test.ts
```

### Dependencies
- Depends on: MILESTONE 1

### Deliverables
- 25% hooks test coverage
- Test infrastructure for React hooks
- Documentation of hook testing patterns
- Commit: `test: increase core hooks test coverage to 25%`

---

## MILESTONE 4: React Hooks Warnings Elimination
**Priority:** P0 (Critical)
**Sprint:** Week 2, Days 8-9

### Goal
Eliminate all React Hooks warnings (10+ warnings → 0).

### Success Criteria
- ✅ 0 React Hooks warnings in console
- ✅ 0 "Cannot update component while rendering" errors
- ✅ 0 missing dependency warnings in useEffect/useCallback
- ✅ All ESLint react-hooks rules passing

### Preconditions
- MILESTONE 1 completed (TypeScript stable)

### Actions
1. **Identify Warning Sources** (1 hour)
   - Run dev server: `npm run dev`
   - Document all console warnings
   - Run ESLint: `npm run lint | grep react-hooks`
   - Categorize: dependency arrays, setState in render, cleanup

2. **Fix Dependency Arrays** (3 hours)
   - Add missing dependencies to useEffect hooks
   - Wrap functions in useCallback where needed
   - Memoize objects with useMemo
   - Validate with ESLint exhaustive-deps rule

3. **Fix State Update Timing** (2 hours)
   - Move setState calls out of render phase
   - Use useLayoutEffect for synchronous updates
   - Fix conditional hook calls
   - Ensure cleanup functions in useEffect

4. **Validate in Browser** (1 hour)
   - Test in development mode
   - Check React DevTools for warnings
   - Test all interactive features
   - Verify no runtime errors

### Estimated Effort
**7 hours** (0.9 developer days)

### Risks
- **Risk:** Adding dependencies to arrays causes infinite re-render loops
  - **Mitigation:** Use functional setState updates, stabilize references
  - **Fallback:** Use ESLint disable comments with justification (temporary)

- **Risk:** Wrapping too many things in useCallback degrades performance
  - **Mitigation:** Profile before/after, only memoize expensive operations
  - **Fallback:** Accept minor performance trade-off for correctness

### Validation
```bash
# Development mode - check console:
npm run dev
# Open http://localhost:5173
# Navigate through all features, check console

# ESLint check:
npm run lint | grep -i "react-hooks"
# Expect: 0 warnings

# Production build:
npm run build
# Expect: 0 warnings
```

### Dependencies
- Depends on: MILESTONE 1

### Deliverables
- Zero React Hooks warnings
- Clean ESLint react-hooks report
- Performance profiling report
- Commit: `fix: eliminate all React Hooks warnings and timing issues`

---

## MILESTONE 5: Mobile Test Coverage Restoration
**Priority:** P1 (High)
**Sprint:** Week 3, Days 10-12

### Goal
Restore mobile-specific test coverage to 70%.

### Success Criteria
- ✅ Mobile test coverage: 0% → 70%
- ✅ Touch event handling tested
- ✅ Responsive layout tested (viewport sizes)
- ✅ Mobile gesture tests: swipe, pinch, long-press
- ✅ 40+ mobile-specific tests passing

### Preconditions
- MILESTONE 1-4 completed (stable foundation)

### Actions
1. **Setup Mobile Test Infrastructure** (2 hours)
   - Configure Vitest for touch events
   - Setup viewport mocking
   - Install `@testing-library/user-event` for mobile
   - Create touch event helpers

2. **Write Touch Event Tests** (6 hours)
   - Drag-and-drop on touch devices
   - Swipe gestures for navigation
   - Pinch-to-zoom on map
   - Long-press for hints
   - Multi-touch interactions

3. **Test Responsive Layouts** (4 hours)
   - Test breakpoints: mobile (320px), tablet (768px), desktop (1024px)
   - Orientation changes
   - Bottom sheet on mobile
   - Tray layout adaptations
   - Font scaling

4. **Validate Coverage** (2 hours)
   - Run mobile-specific tests
   - Check coverage report
   - Test on actual devices/emulators
   - Performance testing on mobile

### Estimated Effort
**14 hours** (1.75 developer days)

### Risks
- **Risk:** Touch event simulation is inconsistent across test environments
  - **Mitigation:** Use `@testing-library/user-event` with pointer API
  - **Fallback:** Use Playwright E2E tests for critical touch flows

- **Risk:** Responsive layout testing is flaky with viewport mocking
  - **Mitigation:** Use consistent viewport setup in test configuration
  - **Fallback:** Snapshot tests for layout verification

### Validation
```bash
npm test -- --grep="mobile|touch|gesture|responsive"
# Expect: 40+ tests passing

npm run test:coverage -- --include="**/mobile/**,**/touch/**"
# Expect: 70%+ coverage
```

### Dependencies
- Depends on: MILESTONE 1-4

### Deliverables
- 70% mobile test coverage
- Touch event testing infrastructure
- Responsive layout test suite
- Commit: `test: restore mobile test coverage to 70% with touch events`

---

## MILESTONE 6: Component Test Coverage Improvement
**Priority:** P1 (High)
**Sprint:** Week 3-4, Days 13-16

### Goal
Increase component test coverage from minimal to 60%.

### Success Criteria
- ✅ Component test coverage: minimal → 60%
- ✅ All major components tested: StudyMode, HintModal, DepartmentTray, OptimizedColombiaMap
- ✅ 60+ component tests passing
- ✅ Integration tests for component interactions

### Preconditions
- MILESTONE 1-4 completed

### Actions
1. **Audit Existing Component Tests** (2 hours)
   - Review existing tests (StudyMode: 932 lines, HintModal: 593 lines, etc.)
   - Identify coverage gaps
   - Map component tree and interactions
   - Prioritize by user impact

2. **Write Missing Component Tests** (12 hours)
   - `GameContainer`: game lifecycle, state transitions
   - `PostGameReport`: score display, achievements
   - `BottomSheet`: open/close, drag interactions
   - `AccessibilitySettings`: preference changes
   - `GameModeSelector`: mode selection, validation
   - `InteractiveTutorial`: step navigation, completion

3. **Integration Tests** (4 hours)
   - Parent-child component communication
   - Context provider integration
   - Event bubbling and delegation
   - State synchronization

4. **Validate Coverage** (2 hours)
   - Run coverage report
   - Check for untested branches
   - Test accessibility features
   - Performance profiling

### Estimated Effort
**20 hours** (2.5 developer days)

### Risks
- **Risk:** Large components (700+ lines) are hard to test comprehensively
  - **Mitigation:** Refactor into smaller sub-components (MILESTONE 7)
  - **Fallback:** Focus on critical paths, defer edge cases

- **Risk:** Component tests are slow, increasing CI time
  - **Mitigation:** Use shallow rendering where possible, parallelize tests
  - **Fallback:** Split into fast/slow test suites

### Validation
```bash
npm run test:coverage -- --include="src/components/**"
# Expect: 60%+ coverage

npm test -- src/tests/components/
# Expect: 60+ tests passing
```

### Dependencies
- Depends on: MILESTONE 1-4

### Deliverables
- 60% component test coverage
- Integration test suite
- Component testing best practices doc
- Commit: `test: achieve 60% component test coverage with integration tests`

---

## MILESTONE 7: Large Component Refactoring
**Priority:** P1 (High)
**Sprint:** Week 4, Days 17-20

### Goal
Reduce large components (>500 lines) from 8 files to 3 files.

### Success Criteria
- ✅ Files >500 lines: 8 → 3
- ✅ 5 components refactored into smaller modules
- ✅ All tests still passing (no regressions)
- ✅ Code maintainability improved (cyclomatic complexity <10)

### Preconditions
- MILESTONE 1-6 completed (stable test coverage)

### Actions
1. **Identify Refactoring Candidates** (2 hours)
   - Analyze large files: HintModal (908), StudyMode (707), DepartmentTray (570), OptimizedColombiaMap (576)
   - Measure cyclomatic complexity
   - Identify logical sub-components
   - Plan extraction strategy

2. **Refactor HintModal** (4 hours)
   - Extract sub-components: HintContent, HintActions, HintHeader
   - Move modal logic to custom hook
   - Update tests incrementally
   - Validate accessibility maintained

3. **Refactor StudyMode** (5 hours)
   - Extract: StudyModeControls, StudyModeProgress, StudyModeRecommendations
   - Separate business logic into hooks
   - Update 932-line test file
   - Ensure state management works

4. **Refactor DepartmentTray** (4 hours)
   - Extract: TrayItem, TrayControls, TraySearch
   - Optimize rendering performance
   - Update tests
   - Verify drag-and-drop still works

5. **Refactor OptimizedColombiaMap** (4 hours)
   - Extract: MapRegion, MapControls, MapZoom
   - Separate SVG logic
   - Maintain optimization benefits
   - Update tests

6. **Validation** (3 hours)
   - Run full test suite
   - Performance benchmarking
   - Bundle size analysis
   - Accessibility audit

### Estimated Effort
**22 hours** (2.75 developer days)

### Risks
- **Risk:** Refactoring breaks existing tests
  - **Mitigation:** Refactor incrementally, run tests after each extraction
  - **Fallback:** Keep original components until new ones are tested

- **Risk:** Performance degrades with more component boundaries
  - **Mitigation:** Use React.memo, measure with profiler
  - **Fallback:** Revert if performance drops >10%

### Validation
```bash
# File size check:
find src -name "*.tsx" -o -name "*.ts" | xargs wc -l | sort -rn | head -10
# Expect: Only 3 files >500 lines

# Test suite:
npm test -- --run
# Expect: All tests passing

# Bundle size:
npm run build:analyze
# Expect: No significant increase
```

### Dependencies
- Depends on: MILESTONE 1-6 (need stable tests before refactoring)

### Deliverables
- 5 components refactored
- Reduced file count >500 lines
- Performance maintained/improved
- Commit: `refactor: decompose large components into smaller, maintainable modules`

---

## MILESTONE 8: TypeScript Any Reduction
**Priority:** P1 (High)
**Sprint:** Week 4-5, Days 21-23

### Goal
Reduce `any` type usage from 232 instances to <120.

### Success Criteria
- ✅ Any types: 232 → <120 (48% reduction)
- ✅ No new `any` types introduced
- ✅ Type safety improved in critical paths
- ✅ ESLint `@typescript-eslint/no-explicit-any` rule enforced

### Preconditions
- MILESTONE 1 completed (TypeScript stable)

### Actions
1. **Audit Any Usage** (2 hours)
   - Run: `grep -rn "any" src --include="*.ts" --include="*.tsx" > any-usage.log`
   - Categorize by file and context
   - Prioritize: API responses > event handlers > utilities > tests
   - Identify safe-to-fix vs. complex cases

2. **Replace with Proper Types** (10 hours)
   - API responses: create interface definitions
   - Event handlers: use React.MouseEvent, React.ChangeEvent, etc.
   - Third-party libraries: use @types packages or declare types
   - Generic functions: add type parameters
   - Unknown types: use `unknown` instead of `any`

3. **Add Type Narrowing** (4 hours)
   - Use type guards (typeof, instanceof)
   - Add assertion functions
   - Use discriminated unions
   - Implement branded types where needed

4. **Enforce with ESLint** (1 hour)
   - Enable `@typescript-eslint/no-explicit-any: error`
   - Add exceptions for test files (warn instead of error)
   - Update CI to fail on new `any` types
   - Document exceptions with JSDoc

### Estimated Effort
**17 hours** (2.1 developer days)

### Risks
- **Risk:** Some third-party libraries lack type definitions
  - **Mitigation:** Create custom type declarations in `src/types/`
  - **Fallback:** Use `any` with `@ts-expect-error` and justification comment

- **Risk:** Complex dynamic types require significant effort
  - **Mitigation:** Use `unknown` with type narrowing instead
  - **Fallback:** Accept some `any` in low-impact areas

### Validation
```bash
# Count any types:
grep -r "any" src --include="*.ts" --include="*.tsx" | wc -l
# Expect: <120

# ESLint check:
npm run lint
# Expect: 0 errors (warnings acceptable in tests)

# TypeScript check:
npm run typecheck
# Expect: 0 errors
```

### Dependencies
- Depends on: MILESTONE 1

### Deliverables
- 50%+ reduction in `any` types
- Type definition files for untyped libraries
- ESLint rule enforced
- Commit: `refactor: reduce any types by 50% with proper type definitions`

---

## MILESTONE 9: Test Coverage Maintenance
**Priority:** P2 (Medium)
**Sprint:** Week 5-6, Days 24-28

### Goal
Maintain 70% overall test coverage while expanding codebase.

### Success Criteria
- ✅ Overall coverage: ≥70% maintained
- ✅ All new code has tests
- ✅ Coverage trends tracked over time
- ✅ CI fails if coverage drops below threshold

### Preconditions
- MILESTONE 1-8 completed

### Actions
1. **Setup Coverage Tracking** (2 hours)
   - Configure Vitest coverage thresholds
   - Setup coverage reporting in CI
   - Create coverage badge
   - Track coverage over time (database/file)

2. **Fill Coverage Gaps** (8 hours)
   - Identify files with <50% coverage
   - Write tests for uncovered branches
   - Test error paths and edge cases
   - Integration tests for critical flows

3. **Enforce Coverage in CI** (2 hours)
   - Add coverage gate to GitHub Actions
   - Fail PR if coverage drops >2%
   - Generate coverage reports in PR comments
   - Block merges below threshold

4. **Documentation** (2 hours)
   - Document testing guidelines
   - Create testing recipes for common patterns
   - Onboarding guide for contributors
   - Coverage monitoring dashboard

### Estimated Effort
**14 hours** (1.75 developer days)

### Risks
- **Risk:** Coverage threshold is too aggressive, blocks valid PRs
  - **Mitigation:** Set threshold at 68% (2% buffer)
  - **Fallback:** Allow manual override with justification

- **Risk:** Developers write low-value tests just to hit coverage
  - **Mitigation:** Code review focuses on test quality, not just coverage
  - **Fallback:** Track mutation testing score in addition to coverage

### Validation
```bash
npm run test:coverage
# Expect: ≥70% overall coverage

# CI should pass:
npm run validate
```

### Dependencies
- Depends on: MILESTONE 1-8

### Deliverables
- 70% coverage maintained
- CI coverage enforcement
- Testing documentation
- Commit: `ci: enforce 70% test coverage threshold with automated tracking`

---

## MILESTONE 10: Major Dependency Updates
**Priority:** P2 (Medium)
**Sprint:** Week 6-7, Days 29-34

### Goal
Update major dependencies: React 18→19, ESLint 8→9.

### Success Criteria
- ✅ React 19 fully integrated
- ✅ ESLint 9 configured and passing
- ✅ All tests passing after updates
- ✅ No breaking changes introduced
- ✅ Bundle size not increased >5%

### Preconditions
- MILESTONE 1-9 completed (stable codebase)

### Actions
1. **Preparation** (3 hours)
   - Create backup branch
   - Review migration guides: React 19, ESLint 9
   - Identify breaking changes
   - Update changelog

2. **React 18→19 Migration** (8 hours)
   - Update React packages
   - Update react-dom, react-router
   - Update @types/react
   - Fix deprecated APIs
   - Update testing library versions
   - Test new features (useTransition, useDeferredValue)
   - Validate performance

3. **ESLint 8→9 Migration** (6 hours)
   - Update ESLint and plugins
   - Migrate to flat config format
   - Update rules for compatibility
   - Fix new linting errors
   - Update CI lint scripts

4. **Other Dependencies** (4 hours)
   - Update Vite, Vitest
   - Update TypeScript
   - Update testing libraries
   - Update build tools
   - Check for security vulnerabilities

5. **Validation** (4 hours)
   - Full test suite run
   - E2E test run
   - Build and deploy to staging
   - Performance benchmarking
   - Accessibility audit

### Estimated Effort
**25 hours** (3.1 developer days)

### Risks
- **Risk:** React 19 has breaking changes that require major refactoring
  - **Mitigation:** Use React 19 migration guide, codemod tools
  - **Fallback:** Stay on React 18 LTS until blockers resolved

- **Risk:** ESLint 9 flat config breaks existing setup
  - **Mitigation:** Test in isolated branch first
  - **Fallback:** Use ESLint 8 compatibility mode

### Validation
```bash
# Check versions:
npm list react react-dom eslint
# Expect: react@19.x, eslint@9.x

# Full validation:
npm run validate
npm run test:all
npm run build

# Performance:
npm run build:analyze
# Compare before/after bundle sizes
```

### Dependencies
- Depends on: MILESTONE 1-9

### Deliverables
- React 19 integrated
- ESLint 9 configured
- All dependencies updated
- Migration documentation
- Commit: `chore: upgrade to React 19 and ESLint 9 with full validation`

---

## MILESTONE 11: Lazy Loading Implementation
**Priority:** P2 (Medium)
**Sprint:** Week 7-8, Days 35-38

### Goal
Implement code splitting and lazy loading to improve initial load time.

### Success Criteria
- ✅ Initial bundle size reduced by 30%
- ✅ Time to interactive (TTI) improved by 25%
- ✅ Route-based code splitting implemented
- ✅ Critical components loaded first
- ✅ Loading states implemented for lazy components

### Preconditions
- MILESTONE 10 completed (React 19 has improved lazy loading)

### Actions
1. **Bundle Analysis** (2 hours)
   - Run `npm run build:analyze`
   - Identify large chunks
   - Map component import graph
   - Prioritize lazy loading candidates

2. **Route-Based Splitting** (4 hours)
   - Lazy load routes: StudyMode, PostGameReport, GameModeSelector
   - Implement React.lazy and Suspense
   - Add loading skeletons
   - Prefetch critical routes

3. **Component-Based Splitting** (6 hours)
   - Lazy load heavy components: HintModal, InteractiveTutorial
   - Code split map SVG data
   - Lazy load regional content
   - Defer non-critical libraries

4. **Optimization** (4 hours)
   - Configure Vite code splitting
   - Optimize chunk sizes
   - Implement preload hints
   - Add service worker caching

5. **Validation** (2 hours)
   - Measure TTI with Lighthouse
   - Test on slow networks (3G)
   - Verify no loading glitches
   - Performance monitoring setup

### Estimated Effort
**18 hours** (2.25 developer days)

### Risks
- **Risk:** Lazy loading introduces loading flicker
  - **Mitigation:** Use skeleton loaders, preload critical paths
  - **Fallback:** Reduce lazy loading granularity

- **Risk:** Service worker caching conflicts with lazy loaded chunks
  - **Mitigation:** Configure workbox for dynamic imports
  - **Fallback:** Disable service worker for lazy chunks

### Validation
```bash
# Build and analyze:
npm run build:analyze

# Lighthouse audit:
npx lighthouse http://localhost:5173 --view

# Expected improvements:
# - Initial bundle: -30%
# - TTI: -25%
# - First Contentful Paint: -20%
```

### Dependencies
- Depends on: MILESTONE 10

### Deliverables
- 30% smaller initial bundle
- Lazy loading infrastructure
- Performance monitoring
- Commit: `perf: implement lazy loading reducing initial bundle by 30%`

---

## MILESTONE 12: CI/CD Maturity Improvements
**Priority:** P2 (Medium)
**Sprint:** Week 8, Days 39-41

### Goal
Enhance CI/CD pipeline with automated testing, deployment, and monitoring.

### Success Criteria
- ✅ Automated E2E tests in CI
- ✅ Automated deployment to staging/production
- ✅ Performance budgets enforced
- ✅ Automated accessibility audits
- ✅ Build time reduced by 20%

### Preconditions
- MILESTONE 1-11 completed

### Actions
1. **CI Pipeline Optimization** (4 hours)
   - Parallelize test execution
   - Cache dependencies effectively
   - Split into fast/slow test jobs
   - Optimize Docker build

2. **Automated E2E Tests** (6 hours)
   - Setup Playwright in CI
   - Add E2E test suite to pipeline
   - Configure test sharding
   - Screenshot/video on failure

3. **Deployment Automation** (4 hours)
   - Setup staging environment auto-deploy
   - Production deployment with approvals
   - Rollback mechanism
   - Blue-green deployment strategy

4. **Quality Gates** (3 hours)
   - Performance budgets (Lighthouse CI)
   - Accessibility audits (axe-core)
   - Security scanning (Snyk)
   - Dependency vulnerability checks

5. **Monitoring** (3 hours)
   - Error tracking (Sentry)
   - Performance monitoring (Web Vitals)
   - Uptime monitoring
   - Alert configuration

### Estimated Effort
**20 hours** (2.5 developer days)

### Risks
- **Risk:** E2E tests are flaky in CI
  - **Mitigation:** Use retry logic, wait for network idle
  - **Fallback:** Mark E2E tests as optional until stable

- **Risk:** CI build time increases with more checks
  - **Mitigation:** Parallelize jobs, cache aggressively
  - **Fallback:** Run expensive checks only on main branch

### Validation
```bash
# CI should complete in <10 minutes:
# - Lint: <1 min
# - Typecheck: <1 min
# - Unit tests: <3 min
# - E2E tests: <5 min
# - Build: <2 min

# Quality gates should pass:
# - Performance budget: PASS
# - Accessibility: PASS
# - Security: PASS
```

### Dependencies
- Depends on: MILESTONE 1-11

### Deliverables
- Optimized CI/CD pipeline
- Automated deployments
- Quality gates enforced
- Monitoring infrastructure
- Commit: `ci: implement mature CI/CD pipeline with quality gates and monitoring`

---

## Dependency Graph

```
MILESTONE 1 (TypeScript Stability)
├── MILESTONE 2 (Auth Tests)
├── MILESTONE 3 (Hook Tests)
├── MILESTONE 4 (React Warnings)
└── MILESTONE 8 (Any Reduction)

MILESTONE 2-4 (Foundation)
├── MILESTONE 5 (Mobile Tests)
└── MILESTONE 6 (Component Tests)

MILESTONE 5-6 (Test Coverage)
└── MILESTONE 7 (Refactoring)

MILESTONE 7-8 (Code Quality)
└── MILESTONE 9 (Coverage Maintenance)

MILESTONE 9 (Stability)
└── MILESTONE 10 (Dependencies)

MILESTONE 10 (Modern Stack)
└── MILESTONE 11 (Lazy Loading)

MILESTONE 11 (Performance)
└── MILESTONE 12 (CI/CD Maturity)
```

**Critical Path:** 1 → 2-4 → 5-6 → 7 → 9 → 10 → 11 → 12

**Parallelizable:**
- MILESTONE 2, 3, 4, 8 can run in parallel after MILESTONE 1
- MILESTONE 5, 6 can run in parallel after MILESTONE 2-4

---

## Sprint Plan (2-Week Iterations)

### Sprint 1 (Week 1-2): Foundation
**Goal:** Establish stable TypeScript foundation and critical test coverage

- **Days 1-2:** MILESTONE 1 (TypeScript) - 6h
- **Days 3-4:** MILESTONE 2 (Auth) - 10h
- **Days 5-7:** MILESTONE 3 (Hooks) - 12h
- **Days 8-9:** MILESTONE 4 (Warnings) - 7h

**Total:** 35 hours (4.4 developer days)
**Buffer:** 5 hours (12% slack)

### Sprint 2 (Week 3-4): Test Coverage & Refactoring
**Goal:** Comprehensive test coverage and code quality

- **Days 10-12:** MILESTONE 5 (Mobile) - 14h
- **Days 13-16:** MILESTONE 6 (Components) - 20h
- **Days 17-20:** MILESTONE 7 (Refactoring) - 22h

**Total:** 56 hours (7 developer days)
**Buffer:** 8 hours (14% slack)

### Sprint 3 (Week 5-6): Quality & Modernization
**Goal:** Type safety and dependency updates

- **Days 21-23:** MILESTONE 8 (Any Types) - 17h
- **Days 24-28:** MILESTONE 9 (Coverage) - 14h
- **Days 29-34:** MILESTONE 10 (Dependencies) - 25h

**Total:** 56 hours (7 developer days)
**Buffer:** 8 hours (14% slack)

### Sprint 4 (Week 7-8): Performance & Infrastructure
**Goal:** Optimize performance and CI/CD

- **Days 35-38:** MILESTONE 11 (Lazy Loading) - 18h
- **Days 39-41:** MILESTONE 12 (CI/CD) - 20h

**Total:** 38 hours (4.75 developer days)
**Buffer:** 6 hours (16% slack)

---

## Risk Register

### High-Risk Items

| Milestone | Risk | Impact | Probability | Mitigation |
|-----------|------|--------|-------------|------------|
| M2 | Auth tests reveal critical bugs | High | Medium | Allocate extra time for bug fixes |
| M7 | Refactoring breaks functionality | High | Medium | Incremental refactoring, continuous testing |
| M10 | React 19 migration issues | High | Medium | Migration in isolated branch, thorough testing |
| M11 | Lazy loading degrades UX | Medium | Low | A/B testing, gradual rollout |

### Medium-Risk Items

| Milestone | Risk | Impact | Probability | Mitigation |
|-----------|------|--------|-------------|------------|
| M3 | Hook testing complexity | Medium | High | Use testing library utilities, integration tests |
| M5 | Mobile test environment setup | Medium | Medium | Use established libraries, documented patterns |
| M8 | Type definitions unavailable | Low | High | Create custom declarations |
| M12 | CI/CD configuration complexity | Medium | Low | Use proven tools, incremental rollout |

---

## Automated Progress Tracking

### KPI Dashboard Specification

**Metrics to Track:**

1. **Code Quality**
   - TypeScript errors: 5 → 0
   - Any types: 232 → <120
   - ESLint warnings: Current → 0
   - Large files (>500): 8 → 3

2. **Test Coverage**
   - Overall: Current → 70%
   - Auth: 0% → 80%
   - Hooks: 4.13% → 25%
   - Mobile: 0% → 70%
   - Components: minimal → 60%

3. **Performance**
   - Bundle size: Baseline → -30%
   - TTI: Baseline → -25%
   - Build time: Baseline → -20%

4. **Velocity**
   - Milestones completed: 0/12
   - Tests written per day: Track
   - Code churn: Monitor

**Tracking Implementation:**

```json
{
  "goap_metrics": {
    "updated_at": "ISO-8601",
    "milestones": {
      "completed": 0,
      "in_progress": 1,
      "total": 12
    },
    "code_quality": {
      "typescript_errors": 5,
      "any_types": 232,
      "eslint_warnings": 0,
      "large_files": 8
    },
    "test_coverage": {
      "overall": 92,
      "auth": 0,
      "hooks": 4.13,
      "mobile": 0,
      "components": 10
    },
    "performance": {
      "bundle_size_kb": 657.74,
      "tti_ms": 0,
      "build_time_s": 10.49
    }
  }
}
```

**Storage:** `.claude-flow/metrics/goap-progress.json`

**Update Frequency:** After each milestone completion

---

## Velocity Targets

### Realistic Estimates (Based on Gaming AI Heuristics)

- **Tests per day:** 15-20 new tests
- **Any types removed:** 10-15 per day
- **Components refactored:** 1 per 2 days
- **Lines of code changed:** 500-1000 per day

### Adaptive Replanning Triggers

**Replan if:**
- Milestone takes >150% estimated time
- Unexpected blocker discovered (>2 days to resolve)
- Test coverage drops below 65%
- Critical bug discovered in production

**Replanning Process:**
1. Pause current milestone
2. Reassess priorities with stakeholders
3. Update dependency graph
4. Adjust sprint plan
5. Communicate changes

---

## Success Definition

**Project Complete When:**
- ✅ All 12 milestones completed
- ✅ 0 TypeScript errors
- ✅ 70% test coverage maintained
- ✅ 0 React Hooks warnings
- ✅ <120 any types
- ✅ ≤3 files >500 lines
- ✅ React 19 & ESLint 9 integrated
- ✅ 30% bundle size reduction
- ✅ CI/CD pipeline mature

**Timeline:** 8 weeks (56 days)
**Total Effort:** 205 hours (25.6 developer days)
**With Buffer:** 247 hours (30.9 developer days)

---

## Honest Assessment

This plan is **ambitious but achievable** with:
- Dedicated developer focus (80% time allocation)
- Minimal scope changes
- Effective tooling and automation
- Proactive risk management

**Realistic Timeline:** 8-10 weeks (accounting for unknowns)

**Recommendation:** Execute Sprint 1 first, reassess velocity, then commit to full timeline.
