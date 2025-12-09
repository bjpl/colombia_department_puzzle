# Phase 2-3 Execution Matrix - Complete Project Plan

**Total Tasks:** 400 tasks (Phases 2-3)
**Total Effort:** 150 hours
**Timeline:** 11-15 weeks (with parallelization)
**Resources:** 1-3 developers + optional AI swarm agents

---

## Executive Summary

This execution matrix provides week-by-week breakdown of Phases 2-3, optimized for parallel execution with clear dependencies, resource allocation, and progress tracking.

**Phase 2: Mobile & Architecture** (73h, 185 tasks, Weeks 1-8)
- M5: Mobile Tests (35 tasks, 14h)
- M6: Component Tests (50 tasks, 20h)
- M7: Component Refactoring (55 tasks, 22h)
- M8: Type Safety (45 tasks, 17h)

**Phase 3: Excellence & Maturity** (77h, 215 tasks, Weeks 9-15)
- M9: Coverage Maintenance (35 tasks, 14h)
- M10: Dependency Updates (60 tasks, 25h)
- M11: Performance (45 tasks, 18h)
- M12: CI/CD Maturity (50 tasks, 20h)

---

## Week-by-Week Breakdown

### Week 1: Mobile Testing Foundation (M5.1-M5.15)

**Goal:** Establish comprehensive mobile test infrastructure

**Tasks (15 tasks, 7.5h):**
```
Day 1-2 (M5.1-M5.3): Touch Infrastructure & Testing
├─ M5.1: Touch Event Testing Infrastructure (2h) - CRITICAL PATH
├─ M5.2: Touch Target Sizes WCAG AAA (1h)
└─ M5.3: Drag-and-Drop on Touch Devices (2h) - HIGH RISK

Day 3-4 (M5.4-M5.10): Responsiveness & Device Testing
├─ M5.4: Viewport Responsiveness Tests (1.5h)
├─ M5.5: Orientation Change Tests (1h)
├─ M5.6: Safe Area Insets Tests (1h)
├─ M5.7: Virtual Keyboard Tests (1.5h)
├─ M5.8: Scroll Behavior Tests (1h)
├─ M5.9: Pinch-to-Zoom Tests (1h)
└─ M5.10: Device Pixel Ratio Tests (0.5h)

Day 5 (M5.11-M5.15): PWA & Offline
├─ M5.11: PWA Manifest Tests (1h)
├─ M5.12: Service Worker Tests (2h) - CRITICAL
├─ M5.13: Offline Mode Tests (1.5h)
├─ M5.14: Network Transition Tests (1h)
└─ M5.15: Touch Feedback Tests (0.5h)
```

**Parallel Execution Strategy:**
- Developer 1: M5.1 → M5.2 → M5.3 (critical path)
- Developer 2: M5.4-M5.7 (parallel tasks)
- Developer 3: M5.8-M5.10 (parallel tasks)
- Week 2 prep: M5.11-M5.15

**Blockers & Risks:**
- M5.3 HIGH RISK: Browser compatibility issues with touch events
- M5.12 CRITICAL: Service worker configuration complexity

**Validation Checkpoints:**
- [ ] Day 2: Touch simulator working
- [ ] Day 4: All viewport tests passing
- [ ] Day 5: PWA installable, offline mode functional

---

### Week 2: Mobile Device Matrix (M5.16-M5.35)

**Goal:** Test across all device types and platforms

**Tasks (20 tasks, 6.5h):**
```
Day 1-2 (M5.16-M5.25): Extended Mobile Tests
├─ M5.16: Multi-Touch Gesture Tests (1.5h)
├─ M5.17: Accessibility on Mobile (1h)
├─ M5.18: Performance on Low-End Devices (2h)
├─ M5.19: Battery Usage Tests (1h)
└─ M5.20: Camera/Sensor Tests (1h)

Day 3-5 (M5.21-M5.35): Device Matrix (14 tasks, iOS/Android/Tablets)
├─ iOS Safari Testing: iPhone 12-15 (4 tasks, 4h)
├─ Android Chrome Testing: Pixel, Samsung (4 tasks, 4h)
├─ Tablet Testing: iPad, Android tablets (3 tasks, 3h)
├─ Foldable Testing: Galaxy Fold, Surface Duo (2 tasks, 2h)
└─ M5.35: M5 Milestone Integration Test (1h)
```

**Parallel Execution:**
- Developer 1: iOS testing
- Developer 2: Android testing
- Developer 3: Tablet/foldable testing

**Success Criteria:**
- [ ] All 35 mobile tests passing
- [ ] WCAG AAA compliance: 100%
- [ ] PWA score: 100/100
- [ ] Tested on 10+ device types

---

### Week 3: Component Test Infrastructure (M6.1-M6.20)

**Goal:** Establish component testing foundation

**Tasks (20 tasks, 8h):**
```
Day 1 (M6.1-M6.5): Core Component Tests
├─ M6.1: Component Test Infrastructure (2h) - CRITICAL PATH
├─ M6.2: GameBoard Component Rendering (1.5h)
├─ M6.3: DepartmentPiece Interactions (1h)
├─ M6.4: PuzzleGrid Layout (1.5h)
└─ M6.5: Game Timer Component (1h)

Day 2-4 (M6.6-M6.15): UI Component Library Tests
├─ M6.6: ScoreDisplay Component (0.5h)
├─ M6.7: LeaderBoard Component (1.5h)
├─ M6.8: MapOverlay Component (1h)
├─ M6.9: HintSystem Component (1h)
├─ M6.10: ProgressBar Component (0.5h)
├─ M6.11: Modal Component (1h)
├─ M6.12: Button Component (0.5h)
├─ M6.13: Input Component (1h)
├─ M6.14: Dropdown Component (1h)
└─ M6.15: Checkbox Component (0.5h)

Day 5 (M6.16-M6.20): Form & Navigation Components
├─ M6.16: Radio Component (0.5h)
├─ M6.17: Tooltip Component (0.5h)
├─ M6.18: Alert Component (0.5h)
├─ M6.19: Card Component (0.5h)
└─ M6.20: Avatar Component (0.5h)
```

**Parallel Execution:**
- All 3 developers: Parallel component testing after M6.1

**Validation:**
- [ ] Day 1: Test infrastructure complete
- [ ] Day 3: Core game components tested
- [ ] Day 5: UI library 40% covered

---

### Week 4: Remaining Component Tests (M6.21-M6.50)

**Goal:** Complete component test coverage

**Tasks (30 tasks, 12h):**
```
Day 1-2 (M6.21-M6.35): Intermediate Components
├─ Badge, Tabs, Accordion, Carousel (5 tasks, 5h)
├─ Header, Footer, Sidebar, Navigation (4 tasks, 3.5h)
├─ Loading, Error, Skeleton, Image, Icon (5 tasks, 3.5h)
└─ Form, SearchBar, Pagination (3 tasks, 3.5h)

Day 3-4 (M6.36-M6.46): Advanced Components
├─ Table, Grid, Flex, Container (4 tasks, 2.5h)
├─ Theme, Language, User, Notification, Profile, Settings (6 tasks, 6h)

Day 5 (M6.47-M6.50): Testing Validation
├─ M6.47: Component Snapshot Tests (2h)
├─ M6.48: Component Accessibility Tests (2h)
├─ M6.49: Component Performance Tests (1h)
└─ M6.50: M6 Milestone Integration Test (0.5h)
```

**Success Criteria:**
- [ ] 50 components tested
- [ ] Component coverage: 95%+
- [ ] Accessibility: WCAG AAA
- [ ] Performance: No regressions

---

### Week 5-6: Component Refactoring (M7.1-M7.30)

**Goal:** Clean component architecture, < 150 lines per component

**Week 5 Tasks (15 tasks, 11h):**
```
Day 1 (M7.1-M7.3): Foundation
├─ M7.1: Component Library Structure (1.5h) - CRITICAL
├─ M7.2: Extract Button Component Variants (2h)
└─ M7.3: Extract Input Component with Validation (2h)

Day 2-3 (M7.4-M7.5): Game Components - HIGH RISK
├─ M7.4: Refactor GameBoard Component (3h) - 450+ lines → 5 components
└─ M7.5: Refactor PuzzleGrid Component (2.5h) - 350+ lines → 4 components

Day 4-5 (M7.6-M7.15): Additional Refactoring
├─ DepartmentPiece, Timer, Score, LeaderBoard (4 tasks, 6h)
├─ Modal, Forms, Header, Footer, Sidebar (5 tasks, 8h)
└─ Theme, Auth, Game Contexts (3 tasks, 5h)
```

**Week 6 Tasks (15 tasks, 11h):**
```
Day 1-3 (M7.16-M7.25): Advanced Patterns
├─ Compound Components, Composition, Render Props (3 tasks, 4.5h)
├─ forwardRef, displayName, Common Hooks (3 tasks, 4h)
├─ Custom Hook Library (20+ hooks) (2h)
├─ PropTypes, Documentation, Storybook (3 tasks, 6h)

Day 4-5 (M7.26-M7.30): Finalization
├─ Component Playground (2h)
├─ Add/Update Tests (2 tasks, 5h)
├─ Performance, Accessibility, Bundle Analysis (3 tasks, 5h)
└─ Documentation Finalization (2h)
```

**Parallel Execution:**
- Developer 1: M7.4, M7.5 (critical game components)
- Developer 2: M7.6-M7.10 (UI components)
- Developer 3: M7.11-M7.15 (contexts)

**Blockers:**
- M7.4, M7.5: Breaking changes to core game components - REQUIRE COMPREHENSIVE TESTING

**Validation:**
- [ ] Week 5 end: Core components refactored
- [ ] Week 6 end: 30+ components < 150 lines
- [ ] All tests passing: 100%

---

### Week 7: Type Safety Implementation (M8.1-M8.25)

**Goal:** Eliminate all 83 `any` types, enable strict mode

**Tasks (25 tasks, 8.5h):**
```
Day 1 (M8.1-M8.5): Foundation & Critical Fixes
├─ M8.1: Audit `any` Type Usage (1.5h) - CRITICAL
├─ M8.2: Create Event Handler Types (2h)
├─ M8.3: Type API Response Structures (2.5h)
├─ M8.4: Type Third-Party Library Wrappers (3h) - HIGH RISK
└─ M8.5: Enable TypeScript Strict Mode (2h) - CRITICAL

Day 2-3 (M8.6-M8.15): Function & Component Typing
├─ Return Types, Parameters, Null Checks (3 tasks, 5.5h)
├─ Component Props, Hook Returns, Context Values (3 tasks, 3.5h)
├─ Redux (if applicable), Utility Functions, JSDoc (3 tasks, 4h)

Day 4-5 (M8.16-M8.25): Domain & Advanced Types
├─ Domain Types, SVG Data, Animations (3 tasks, 3h)
├─ Route/Query Params, LocalStorage, Env Variables (3 tasks, 2h)
├─ Generic Constraints, Union Types, Type Guards (3 tasks, 4h)
├─ Type Predicates, Assertions, Error Objects, Promises, Callbacks (5 tasks, 4.5h)
```

**Parallel Execution:**
- Day 1: Sequential (M8.1-M8.5 are dependencies)
- Day 2-5: Parallel by category (events, API, components)

**High-Risk Tasks:**
- M8.4: Supabase/DnD-kit typing may reveal runtime errors
- M8.5: Strict mode will surface hidden bugs

**Validation:**
- [ ] Day 1: All critical types defined
- [ ] Day 3: Strict mode enabled
- [ ] Day 5: Zero `any` types remaining

---

### Week 8: Type Safety Completion (M8.26-M8.45)

**Goal:** Complete type safety, 100% type coverage

**Tasks (20 tasks, 8.5h):**
```
Day 1-3 (M8.26-M8.40): Component-Specific Typing
├─ 10 major components fully typed (M8.31-M8.40, 10h)
├─ Type Utility Library (M8.41, 1.5h)

Day 4-5 (M8.42-M8.45): Validation & Documentation
├─ M8.42: Add Type Tests (2h) - ts-expect-error tests
├─ M8.43: Documentation Update (1.5h) - Type usage guide
├─ M8.44: TypeScript Config Optimization (1h) - Compiler tuning
└─ M8.45: M8 Milestone Integration Test (0.5h) - Final validation
```

**Success Criteria:**
- [ ] `any` types: 83 → 0
- [ ] Strict mode: Enabled
- [ ] Type coverage: 100%
- [ ] Zero TypeScript errors
- [ ] Runtime validation: Implemented (Zod)

---

### Week 9: Coverage Maintenance (M9.1-M9.35)

**Goal:** Maintain 97%+ coverage with automated monitoring

**Tasks (35 tasks, 14h):**
```
Day 1 (M9.1-M9.3): Foundation
├─ M9.1: Configure Coverage Thresholds (1h)
├─ M9.2: Create Coverage Report Generator (1.5h)
└─ M9.3: Add Uncovered Code Detection (1.5h)

Day 2-3 (M9.4-M9.15): Visualization & Analysis
├─ Badges, Dashboard, Webhooks, PR Comments (4 tasks, 5h)
├─ Diff Tool, Visualization, Branch Coverage (3 tasks, 4.5h)
├─ Mutation Testing, Flaky Detection, Impact Analysis (4 tasks, 7h)

Day 4-5 (M9.16-M9.35): Advanced Testing
├─ Performance, Parallel Execution, Retries, Grouping (4 tasks, 3h)
├─ Tagging, Filtering, Watch Mode, Debugging (4 tasks, 3h)
├─ Factories, Snapshots, Visual Regression, E2E (4 tasks, 7.5h)
├─ Accessibility, Load, Security Testing (3 tasks, 5.5h)
├─ Maintenance, Metrics, Quality Gates, Coverage for New Code (4 tasks, 5.5h)
├─ Roadmap & Validation (2 tasks, 1.5h)
```

**Validation:**
- [ ] Coverage: 97%+ maintained
- [ ] Mutation score: > 80%
- [ ] Test execution: < 3 minutes

---

### Week 10-11: Dependency Updates (M10.1-M10.40)

**Goal:** Update all 45 outdated dependencies, fix 8 security vulnerabilities

**Week 10 Tasks (20 tasks, 12.5h):**
```
Day 1 (M10.1-M10.2): Planning
├─ M10.1: Audit Current Dependencies (2h)
└─ M10.2: Create Dependency Update Strategy (1.5h)

Day 2-3 (M10.3-M10.6): Critical Framework Updates - HIGH RISK
├─ M10.3: Update React to 18.3.1 (2h) - Security fix
├─ M10.4: Update TypeScript to 5.6.3 (2.5h) - Breaking changes
├─ M10.5: Update Vite to 5.4.8 (2h) - CVE fixes
└─ M10.6: Update Vitest to 2.1.2 (3h) - Breaking changes

Day 4-5 (M10.7-M10.20): Library Updates
├─ Testing Library, Playwright, ESLint 9.x (3 tasks, 6.5h)
├─ Prettier, Tailwind, PostCSS (3 tasks, 3h)
├─ Supabase, @dnd-kit, React Router (3 tasks, 5.5h)
├─ Framer Motion, i18next, Date-fns, Zod, React Hook Form (5 tasks, 5h)
```

**Week 11 Tasks (40 tasks, 12.5h):**
```
Day 1-3 (M10.21-M10.40): Minor Updates & Automation
├─ 20 minor dependency updates (15h)
├─ Dev/Peer dependency updates (2 tasks, 3.5h)
├─ Remove unused deps (1h)

Day 4-5 (M10.41-M10.60): CI/CD & Documentation
├─ Package audit, Lock policy, Renovate, Dependabot (4 tasks, 4h)
├─ License check, Documentation, Bundle tracking (3 tasks, 3.5h)
├─ Security, SBOM, Runbook, Canary, Feature Flags (5 tasks, 7h)
├─ Rollback, Health checks, Benchmarks, Final testing (5 tasks, 7.5h)
```

**High-Risk Updates:**
- M10.4: TypeScript 5.6 may reveal new errors
- M10.6: Vitest 2.x has breaking API changes
- M10.9: ESLint 9.x requires flat config migration

**Validation:**
- [ ] Week 10: Critical frameworks updated
- [ ] Week 11: All dependencies current
- [ ] Security vulnerabilities: 8 → 0
- [ ] Automated update process: Enabled

---

### Week 12-13: Performance Optimization (M11.1-M11.45)

**Goal:** Lighthouse 100/100/100/100, bundle < 500KB

**Week 12 Tasks (22 tasks, 9h):**
```
Day 1 (M11.1-M11.3): Foundation
├─ M11.1: Performance Baseline Audit (2h)
├─ M11.2: Implement Code Splitting (3h) - Save 200KB
└─ M11.3: Optimize Image Assets (1.5h) - Save 50KB

Day 2-4 (M11.4-M11.15): Core Optimizations
├─ Virtual Scrolling, React.memo, useMemo/useCallback (3 tasks, 4h)
├─ Windowing, SVG, Service Worker (3 tasks, 5.5h)
├─ Preload, Fonts, Bundle, CSS (4 tasks, 5h)
├─ Prefetch, Preconnect, Third-Party Scripts (3 tasks, 3h)

Day 5 (M11.16-M11.22): Advanced Performance
├─ Compression, HTTP/2, Database, API Caching (4 tasks, 5.5h)
├─ Client Cache, State, Debounce/Throttle, PWA (4 tasks, 6.5h)
```

**Week 13 Tasks (23 tasks, 9h):**
```
Day 1-3 (M11.23-M11.35): Optimization Finalization
├─ Animation, Layout, Events, Intersection Observer (4 tasks, 4.5h)
├─ Monitoring, Build, Budget, CDN (4 tasks, 5.5h)
├─ SEO, Accessibility, Security Headers (3 tasks, 3.5h)
├─ Mobile, Performance Tests, Dashboard (3 tasks, 5h)

Day 4-5 (M11.36-M11.45): Validation & Documentation
├─ Error Boundaries, Memory, Critical Render Path (3 tasks, 4h)
├─ Documentation (2h)
├─ M11.43: Final Lighthouse Audit (1h) - Verify 100/100/100/100
├─ M11.44: Bundle Size Verification (0.5h) - < 500KB
└─ M11.45: M11 Milestone Completion (1h)
```

**Success Metrics:**
- [ ] Lighthouse: 100/100/100/100
- [ ] Bundle: 742KB → < 500KB (33% reduction)
- [ ] LCP: 2.8s → < 2.5s
- [ ] CLS: 0.15 → < 0.1

---

### Week 14-15: CI/CD Maturity (M12.1-M12.50)

**Goal:** Production-grade pipeline, < 5min CI, zero-downtime deploys

**Week 14 Tasks (25 tasks, 10h):**
```
Day 1 (M12.1-M12.3): CI Optimization
├─ M12.1: Audit Current CI/CD Pipeline (1.5h)
├─ M12.2: Implement Dependency Caching (1h) - Save 3-5 min
└─ M12.3: Add Parallel Test Execution (1.5h) - 8min → 4min

Day 2-4 (M12.4-M12.18): Testing & Deployment
├─ E2E, Security, SAST, License scanning (4 tasks, 5.5h)
├─ Dependency bot, Staging, Production, Canary (4 tasks, 7.5h)
├─ Rollback, Smoke tests, Perf benchmarks (3 tasks, 5h)
├─ Visual regression, Accessibility, Notifications, PR previews (4 tasks, 6.5h)

Day 5 (M12.19-M12.25): Infrastructure
├─ Feature flags, Env vars, Documentation (3 tasks, 4.5h)
├─ Monitoring, Logging, Error tracking, Health checks (4 tasks, 6h)
```

**Week 15 Tasks (25 tasks, 10h):**
```
Day 1-3 (M12.26-M12.40): Advanced Features
├─ Uptime, Status page, Analytics, A/B testing (4 tasks, 5.5h)
├─ DB migrations, Backups, DR plan (3 tasks, 5.5h)
├─ Load testing, Stress testing, Rate limiting, CORS (4 tasks, 5h)
├─ API docs, versioning, GraphQL, WebSocket (4 tasks, 6.5h)

Day 4-5 (M12.41-M12.50): Finalization
├─ Mobile CI, Docker, Kubernetes, Terraform (4 tasks, 8h)
├─ Compliance, SLOs, Incident response, Post-mortems (4 tasks, 5.5h)
├─ M12.49: Final CI/CD Validation (2h)
└─ M12.50: M12 Milestone Completion (1h)
```

**Success Criteria:**
- [ ] CI time: 10min → < 5min
- [ ] Deployment: Automated, < 10min
- [ ] Zero-downtime: 100%
- [ ] Rollback: < 2min

---

## Resource Allocation Strategies

### Strategy 1: Single Developer (Sequential)
**Timeline:** 20 weeks @ 40h/week
- Phase 2: 8 weeks (1.8 weeks per milestone)
- Phase 3: 7 weeks (1.8 weeks per milestone)
- Integration: 1 week

**Pros:**
- Lower coordination overhead
- Consistent code style
- Simpler git workflow

**Cons:**
- Longer timeline
- No parallel execution
- Single point of failure

---

### Strategy 2: Two Developers (Parallel)
**Timeline:** 12 weeks @ 40h/week per dev (480 dev-hours total)
- Phase 2: 5 weeks
  - Dev 1: M5 + M7 (36h)
  - Dev 2: M6 + M8 (37h)
- Phase 3: 6 weeks
  - Dev 1: M9 + M11 (32h)
  - Dev 2: M10 + M12 (45h)
- Integration: 1 week

**Pros:**
- 40% faster than single dev
- Balanced workload
- Pairing opportunities

**Cons:**
- Coordination required
- Potential merge conflicts
- Communication overhead

---

### Strategy 3: Three Developers (Optimal Parallelization)
**Timeline:** 8 weeks @ 40h/week per dev (960 dev-hours total)
- Phase 2: 4 weeks
  - Dev 1: M5 (14h) + M7.1-M7.30 (11h)
  - Dev 2: M6 (20h) + M8.1-M8.25 (8.5h)
  - Dev 3: M7.31-M7.55 (11h) + M8.26-M8.45 (8.5h)
- Phase 3: 4 weeks
  - Dev 1: M9 (14h) + M11.1-M11.22 (9h)
  - Dev 2: M10 (25h)
  - Dev 3: M11.23-M11.45 (9h) + M12 (20h)

**Pros:**
- Fastest timeline
- Maximum parallelization
- Specialized roles

**Cons:**
- Higher coordination cost
- More merge conflicts
- Team communication essential

---

### Strategy 4: AI Swarm Agents (Experimental)
**Timeline:** 4-6 weeks with human oversight
- Use Claude Flow + swarm orchestration
- 5-8 agents in parallel
- Human review/merge gates

**Setup:**
```bash
# Initialize swarm for Phase 2
npx claude-flow sparc tdd "Phase 2 - Mobile & Architecture"

# Spawn specialized agents
npx claude-flow agent spawn mobile-dev M5
npx claude-flow agent spawn tester M6
npx claude-flow agent spawn code-analyzer M7
npx claude-flow agent spawn coder M8

# Monitor progress
npx claude-flow swarm status
npx claude-flow task results
```

**Pros:**
- Fastest possible timeline
- 24/7 execution
- Perfect parallelization
- Consistent code quality

**Cons:**
- Requires human review
- Setup complexity
- Agent coordination
- Novel approach

---

## Progress Tracking

### Daily Standup Template

```markdown
## Daily GOAP Progress - YYYY-MM-DD

**Phase:** [2 or 3] | **Week:** [1-15] | **Milestone:** [M5-M12]

### ✅ Completed Today
- [ ] M5.1: Touch Event Testing Infrastructure (2h)
- [ ] M5.2: Touch Target Sizes WCAG AAA (1h)

### 🏗️ In Progress
- [ ] M5.3: Drag-and-Drop on Touch (50% complete)

### 🚧 Blocked
- [ ] M5.4: Waiting for M5.3 completion

### 📅 Planned Tomorrow
- [ ] M5.4: Viewport Responsiveness Tests
- [ ] M5.5: Orientation Change Tests
- [ ] M5.6: Safe Area Insets Tests

### 📊 Metrics
- **Tasks Completed:** 2/400 (0.5%)
- **Phase 2 Progress:** 2/185 (1.1%)
- **Hours Logged:** 3h / 150h total
- **Velocity:** 1 task/day (target: 2-3)
- **Blockers:** 0 active

### 🎯 Sprint Goals (Week 1)
- [ ] Complete M5.1-M5.15 (15 tasks)
- [ ] Touch infrastructure fully functional
- [ ] PWA tests passing

### ⚠️ Risks
- M5.3 complexity higher than estimated
```

---

## Risk Register

### Phase 2 High-Risk Tasks

| Task | Risk Level | Impact | Mitigation Strategy |
|------|-----------|---------|---------------------|
| M5.3 | HIGH | Touch drag-and-drop may fail in Safari | - Test early<br>- Polyfills ready<br>- Fallback to mouse events |
| M5.12 | MEDIUM | Service worker caching complexity | - Use Workbox library<br>- Incremental implementation<br>- Extensive testing |
| M7.4 | HIGH | GameBoard refactoring breaks gameplay | - Comprehensive tests first<br>- Feature flag<br>- Rollback plan |
| M7.5 | HIGH | PuzzleGrid refactoring affects performance | - Performance benchmarks<br>- Before/after comparison<br>- Gradual rollout |
| M8.4 | HIGH | Supabase types reveal runtime bugs | - Type tests<br>- Runtime validation (Zod)<br>- Gradual strict mode |
| M8.5 | CRITICAL | Strict mode surfaces hidden bugs | - Fix incrementally<br>- Comprehensive testing<br>- Disable if blocked |

### Phase 3 High-Risk Tasks

| Task | Risk Level | Impact | Mitigation Strategy |
|------|-----------|---------|---------------------|
| M10.4 | HIGH | TypeScript 5.6 breaking changes | - Review changelog<br>- Test thoroughly<br>- Rollback ready |
| M10.6 | HIGH | Vitest 2.x breaking API changes | - Migration guide<br>- Test all tests<br>- Parallel branch |
| M10.9 | HIGH | ESLint 9.x flat config migration | - New config format<br>- Incremental adoption<br>- Keep old config |
| M11.2 | MEDIUM | Code splitting increases complexity | - Careful chunking<br>- Test all routes<br>- Monitor bundle |
| M12.10 | MEDIUM | Production deployment automation | - Staging first<br>- Manual approval gate<br>- Quick rollback |

---

## Quality Gates

### Phase 2 Exit Criteria
```
[ ] TypeScript errors: 0
[ ] any types: 0
[ ] Test coverage: > 95%
[ ] Mobile tests: 35/35 passing
[ ] Component tests: 50/50 passing
[ ] WCAG AAA: 100%
[ ] Strict mode: Enabled
[ ] Component refactoring: 30+ components < 150 lines
[ ] Bundle size: < 550KB (after code splitting)
[ ] All tests: 900+ passing
```

### Phase 3 Exit Criteria
```
[ ] Coverage: > 97%
[ ] Dependencies: All updated (45/45)
[ ] Security vulnerabilities: 0
[ ] Lighthouse: 100/100/100/100
[ ] Bundle size: < 500KB
[ ] LCP: < 2.5s
[ ] FID: < 100ms
[ ] CLS: < 0.1
[ ] CI time: < 5 minutes
[ ] Deployment: Automated, < 10min
[ ] Zero-downtime deploys: Proven
[ ] Rollback time: < 2min
```

---

## Weekly Velocity Tracking

```
Week 1:  █████░░░░░ 15/400 tasks (3.8%)
Week 2:  ██████████ 35/400 tasks (8.8%)
Week 3:  ████████████░░ 55/400 tasks (13.8%)
Week 4:  ██████████████████ 85/400 tasks (21.3%)
Week 5:  ████████████████████░░ 100/400 tasks (25%)
Week 6:  ██████████████████████░░ 115/400 tasks (28.8%)
Week 7:  ████████████████████████░░ 140/400 tasks (35%)
Week 8:  ██████████████████████████░░ 160/400 tasks (40%)
Week 9:  ████████████████████████████░░ 195/400 tasks (48.8%)
Week 10: ██████████████████████████████░░ 215/400 tasks (53.8%)
Week 11: ████████████████████████████████░░ 255/400 tasks (63.8%)
Week 12: ██████████████████████████████████░░ 277/400 tasks (69.3%)
Week 13: ████████████████████████████████████░░ 300/400 tasks (75%)
Week 14: ██████████████████████████████████████░░ 325/400 tasks (81.3%)
Week 15: ████████████████████████████████████████ 400/400 tasks (100%)
```

**Target Velocity:**
- Weeks 1-4: 20 tasks/week (ramp-up)
- Weeks 5-12: 25-30 tasks/week (peak)
- Weeks 13-15: 23-25 tasks/week (finalization)

---

## Tools & Automation

### Required Tools

```bash
# Testing
npm install -D vitest @testing-library/react @testing-library/user-event
npm install -D @playwright/test @playwright/experimental-ct-react

# Type Safety
npm install zod
npm install -D @types/node

# Performance
npm install -D vite-bundle-visualizer lighthouse

# CI/CD
npm install -D gh @vercel/ncc

# Code Quality
npm install -D eslint@9 prettier @typescript-eslint/parser
```

### Automation Scripts

```json
{
  "scripts": {
    "goap:progress": "node scripts/goap-progress.js",
    "goap:velocity": "node scripts/goap-velocity.js",
    "goap:blockers": "node scripts/goap-blockers.js",
    "daily:standup": "node scripts/generate-standup.js",
    "weekly:report": "node scripts/generate-weekly-report.js",
    "validate:phase2": "node scripts/validate-phase2-exit.js",
    "validate:phase3": "node scripts/validate-phase3-exit.js"
  }
}
```

---

## Next Steps

1. **Choose Execution Strategy**
   - Single developer: 20 weeks
   - Two developers: 12 weeks
   - Three developers: 8 weeks
   - AI swarm: 4-6 weeks

2. **Review Risk Register**
   - Identify high-risk tasks
   - Prepare mitigation strategies
   - Set up rollback procedures

3. **Set Up Tracking**
   - Create project board
   - Configure daily standup template
   - Enable velocity tracking

4. **Begin Phase 2 - Week 1**
   - Start with M5.1 (Touch Infrastructure)
   - Critical path items first
   - Daily progress updates

---

**Last Updated:** 2025-12-04
**Document Version:** 1.0
**Total Estimated Effort:** 150 hours (Phases 2-3)
**Recommended Timeline:** 8-15 weeks depending on resources
