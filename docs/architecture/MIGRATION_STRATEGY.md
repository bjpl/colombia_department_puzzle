# Migration Strategy

**Document Version:** 1.0
**Date:** 2025-12-04
**Architect:** System Architecture Designer
**Status:** Design Phase

---

## Executive Summary

This document provides a comprehensive, step-by-step migration strategy for implementing all architectural improvements while maintaining zero downtime and full backward compatibility.

**Migration Scope:**
1. Component refactoring (8 large files → 30+ modular components)
2. Test infrastructure modernization (jsdom → Playwright)
3. CI/CD pipeline enhancement (basic → production-grade)
4. Service layer introduction (50% → 100% coverage)
5. Type safety improvements (236 `any` → 0 `any`)

**Migration Duration:** 12 weeks (3 months)

**Risk Level:** Medium (mitigated through phased rollout)

---

## 1. Migration Principles

### 1.1 Core Principles

**Principle 1: NO Big Bang**
```
❌ WRONG: Refactor everything at once
✓ RIGHT: Incremental, feature-flagged changes

Rationale:
- Reduces risk
- Easier to debug
- Faster feedback
- Can rollback individual changes
```

**Principle 2: Parallel Implementation**
```
Old System ─────────┐
                    ├── Both run in parallel
New System ─────────┘    (Feature flagged)

After validation → Gradually shift traffic → Deprecate old
```

**Principle 3: Test Coverage First**
```
Before refactoring:
1. Write tests for current behavior
2. Verify tests pass
3. Refactor
4. Verify tests still pass
5. Add new tests for new features

Never refactor without tests!
```

**Principle 4: Backward Compatibility**
```
All public APIs must remain compatible during migration.
Deprecation warnings 2 weeks before removal.
```

---

## 2. Week-by-Week Migration Plan

### Week 1: Foundation & Infrastructure

**Goals:**
- Set up feature flag system
- Create test infrastructure foundation
- Establish migration patterns

**Tasks:**

**Day 1-2: Feature Flags**
```bash
# Create feature flag service
mkdir -p src/config src/services/features
touch src/services/features/FeatureFlagService.ts
touch src/config/feature-flags.json

# Implement basic feature flags
# See: SCALABILITY_ROADMAP.md section 5.1

# Test feature flags
npm run test -- features/FeatureFlagService.test.ts
```

**Day 3-4: Modular Test Utilities**
```bash
# Create modular mock structure
mkdir -p src/tests/mocks/{browser,storage,audio,input,services}
mkdir -p src/tests/{fixtures,helpers,matchers}

# Migrate setup.ts → modular mocks
# See: TEST_INFRASTRUCTURE_BLUEPRINT.md section 2.1

# Create test helpers
touch src/tests/helpers/renderWithProviders.tsx
touch src/tests/helpers/setupTest.ts
touch src/tests/fixtures/departments.ts

# Test modular setup
npm run test -- tests/helpers
```

**Day 5: Playwright Setup**
```bash
# Install Playwright
npm install -D @playwright/test @playwright/experimental-ct-react

# Create Playwright configs
touch playwright.config.ts
touch playwright-ct.config.ts

# Create first Playwright component test
mkdir -p src/components/__tests__
touch src/components/DepartmentCard.ct.tsx

# Test Playwright setup
npx playwright test --project=chromium
```

**Validation:**
- [ ] Feature flags working
- [ ] Modular mocks can be imported
- [ ] Playwright runs successfully
- [ ] All existing tests still pass

---

### Week 2: First Refactoring (HintModal)

**Goals:**
- Refactor largest component (HintModal: 908 lines)
- Validate refactoring pattern
- Prove feature flag strategy

**Tasks:**

**Day 1-2: Extract Data**
```bash
# Extract hint data to separate files
mkdir -p src/data/hints
touch src/data/hints/geographicHints.ts
touch src/data/hints/hintStrategies.ts

# Move data from HintModal.tsx
# Create TypeScript interfaces
# Write unit tests for data

# Test data extraction
npm run test -- data/hints
```

**Day 3: Create Sub-components**
```bash
# Create hint components
mkdir -p src/components/hints
touch src/components/hints/HintContent.tsx
touch src/components/hints/ProgressiveHintSystem.tsx
touch src/components/hints/HintAccessibility.tsx

# Extract logic from HintModal.tsx
# Write component tests

# Test components in isolation
npm run test -- components/hints
```

**Day 4: Refactor Main Component**
```bash
# Refactor HintModal.tsx to use sub-components
# Keep old implementation behind feature flag

# In HintModal.tsx:
const useRefactoredHintModal = features.isEnabled('refactored-hint-modal');

return useRefactoredHintModal
  ? <NewHintModal {...props} />
  : <OldHintModal {...props} />;

# Test both versions
npm run test -- components/HintModal.test.tsx
```

**Day 5: Integration Testing**
```bash
# Create integration tests
npx playwright test tests/integration/hint-modal.spec.ts

# Enable feature flag in dev
VITE_REFACTORED_HINT_MODAL=true npm run dev

# Manual testing
# Visual regression tests

# Validation
npm run test:all
```

**Validation:**
- [ ] New HintModal <200 lines
- [ ] All sub-components <150 lines
- [ ] Feature flag toggles between versions
- [ ] All tests pass for both versions
- [ ] Zero regressions

---

### Week 3: Service Layer (Game State)

**Goals:**
- Create first service (GameStateService)
- Establish service patterns
- Extract logic from components

**Tasks:**

**Day 1-2: Service Foundation**
```bash
# Create service base classes
mkdir -p src/services/game
touch src/services/base/BaseService.ts # (already exists)
touch src/services/game/GameStateService.ts

# Implement GameStateService
# See: COMPONENT_REFACTORING_ARCHITECTURE.md section 3.2

# Write service tests
npm run test -- services/game/GameStateService.test.ts
```

**Day 3-4: Migrate Component Logic**
```bash
# Identify state management in GameContainer
# Extract to GameStateService

# Before (in component):
const [gameState, setGameState] = useState(initialState);

# After (using service):
const gameState = gameStateService.getState();
const updateState = gameStateService.updateState;

# Update GameContainer to use service
# Keep old implementation behind feature flag

# Test service integration
npm run test -- components/GameContainer.test.tsx
```

**Day 5: Integration & Performance**
```bash
# Performance benchmarks
npm run build
npm run build:analyze

# Check bundle size (should not increase)
# Integration testing

# Enable in dev
VITE_USE_GAME_STATE_SERVICE=true npm run dev

# Validation
npm run test:all
```

**Validation:**
- [ ] GameStateService fully tested
- [ ] Component logic reduced by 30%+
- [ ] No bundle size increase
- [ ] All tests pass

---

### Week 4: Type Safety (Event Handlers)

**Goals:**
- Eliminate `any` in event handlers (80 instances)
- Create type definitions
- Enable strict TypeScript checks

**Tasks:**

**Day 1-2: Type Definitions**
```bash
# Create type definitions
mkdir -p src/types/events
touch src/types/events.ts

# Define strict types for all events
# See: COMPONENT_REFACTORING_ARCHITECTURE.md section 4.2

# Import library types
import type { DragEndEvent } from '@dnd-kit/core';
import type { TouchEvent, KeyboardEvent } from 'react';
```

**Day 3-4: Apply Types**
```bash
# Replace any types in components
# Run TypeScript compiler

npx tsc --noEmit

# Fix type errors incrementally
# Update tests with correct types

# Test type safety
npm run typecheck
```

**Day 5: Validation**
```bash
# Enable strict mode in tsconfig.json
{
  "strict": true,
  "noImplicitAny": true
}

# Verify zero `any` in event handlers
grep -r "event: any" src/components/
# Should return nothing

# Full validation
npm run validate
```

**Validation:**
- [ ] 80 `any` → 0 `any` in event handlers
- [ ] TypeScript strict mode enabled
- [ ] Zero type errors
- [ ] All tests pass

---

### Week 5: StudyMode Refactoring

**Goals:**
- Refactor StudyMode component (707 lines)
- Apply learned patterns
- Improve code reuse

**Tasks:**

**Day 1-2: Extract Components**
```bash
# Create study components
mkdir -p src/components/study
touch src/components/study/RegionFilter.tsx
touch src/components/study/DepartmentGrid.tsx
touch src/components/study/StudyProgress.tsx

# Extract from StudyMode.tsx
# Write component tests
```

**Day 3-4: Extract Hook**
```bash
# Create navigation hook
touch src/hooks/useStudyNavigation.ts

# Extract navigation logic
# Write hook tests

# Refactor StudyMode.tsx
# Feature flag new version
```

**Day 5: Integration**
```bash
# Integration tests
npx playwright test tests/integration/study-mode.spec.ts

# Enable in dev
VITE_REFACTORED_STUDY_MODE=true npm run dev

# Validation
npm run test:all
```

**Validation:**
- [ ] StudyMode.tsx <250 lines
- [ ] All sub-components <150 lines
- [ ] Navigation logic in reusable hook
- [ ] All tests pass

---

### Week 6: Test Infrastructure Migration

**Goals:**
- Migrate component tests to Playwright
- Remove test exclusions
- Achieve 90%+ test pass rate

**Tasks:**

**Day 1-2: Migrate Critical Components**
```bash
# Migrate GameContainer tests
cp src/tests/components/GameContainer.test.tsx \
   src/components/GameContainer.ct.tsx

# Rewrite for Playwright
# See: TEST_INFRASTRUCTURE_BLUEPRINT.md section 5.3

# Run Playwright tests
npx playwright test --project=chromium src/components/GameContainer.ct.tsx
```

**Day 3-4: Migrate Remaining Components**
```bash
# Migrate HintModal, DepartmentTray, MapCanvas
# Batch migration

# Remove test exclusions from vitest.config.ts
# One category at a time

# Test pass rate tracking
npm run test -- --reporter=json > test-results.json
```

**Day 5: Test Cleanup**
```bash
# Remove old setup.ts (277 lines)
# Keep minimal setup for unit tests

# Update documentation
# Create test writing guide

# Full test run
npm run test:all
```

**Validation:**
- [ ] 820+/914 tests passing (90%+)
- [ ] setup.ts <100 lines
- [ ] All component tests in Playwright
- [ ] No test exclusions

---

### Week 7: CI/CD Enhancement

**Goals:**
- Implement production-grade CI/CD
- Set up staging environment
- Enable automated deployments

**Tasks:**

**Day 1-2: Pipeline Stages**
```bash
# Create new workflow files
touch .github/workflows/validate.yml
touch .github/workflows/test-unit.yml
touch .github/workflows/test-component.yml
touch .github/workflows/test-integration.yml
touch .github/workflows/test-e2e.yml

# See: CICD_PIPELINE_DESIGN.md section 3
# Implement each stage
```

**Day 3: Security & Build**
```bash
# Add security scanning
touch .github/workflows/security.yml

# Enhance build workflow
touch .github/workflows/build.yml

# Add bundle size checks
# Add bundle analysis
```

**Day 4-5: Deployment**
```bash
# Set up staging environment
touch .github/workflows/deploy-staging.yml
touch .github/workflows/deploy-production.yml

# Configure Vercel
# Add smoke tests
# Test deployments

# Full pipeline run
git push origin main
```

**Validation:**
- [ ] Pipeline completes in <15 minutes
- [ ] All stages passing
- [ ] Automated staging deployments
- [ ] Manual production approval gate

---

### Week 8: Remaining Refactoring

**Goals:**
- Complete DepartmentTray, GameContainer refactoring
- Finish service layer
- Code cleanup

**Tasks:**

**Day 1-2: DepartmentTray**
```bash
# Apply refactoring pattern
# Extract components and hooks
# Feature flag new version
# Tests
```

**Day 3-4: GameContainer**
```bash
# Most critical refactoring
# Extract layout logic
# Create cleanup hook
# Feature flag
# Extensive testing
```

**Day 5: Service Layer Completion**
```bash
# Create remaining services
touch src/services/hint/HintService.ts
touch src/services/study/StudyModeService.ts

# Migrate component logic
# Tests
```

**Validation:**
- [ ] All components <500 lines
- [ ] All services implemented
- [ ] 100% service test coverage
- [ ] Zero regressions

---

### Week 9: Type Safety Completion

**Goals:**
- Eliminate remaining `any` usages (156 remaining)
- Strict TypeScript mode
- Runtime validation with Zod

**Tasks:**

**Day 1-2: D3 Projections**
```bash
# Create projection type wrappers
touch src/types/projections.ts

# Type all D3 usage
# 45 any → 0
```

**Day 3-4: API Responses & Props**
```bash
# Install Zod
npm install zod

# Create schemas for API responses
touch src/types/schemas.ts

# Type all component props
# 65 any → 0
```

**Day 5: Final Cleanup**
```bash
# Remaining utilities and helpers
# 21 any → 0

# Enable strictest TypeScript settings
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}

# Full validation
npm run typecheck
```

**Validation:**
- [ ] 236 any → 0 any
- [ ] Strictest TypeScript mode
- [ ] Runtime validation with Zod
- [ ] Zero type errors

---

### Week 10: Performance Optimization

**Goals:**
- Code splitting optimization
- Bundle size reduction
- Performance budgets

**Tasks:**

**Day 1-2: Code Splitting**
```bash
# Analyze current bundles
npm run build:analyze

# Optimize lazy loading
# Implement route-based splitting
# Implement component-based splitting

# Build and analyze
npm run build
du -sh dist/
```

**Day 3-4: Bundle Optimization**
```bash
# Remove unused dependencies
npx depcheck

# Optimize imports
# Tree-shaking validation

# Lighthouse audits
npx lighthouse http://localhost:4173 --view
```

**Day 5: Performance Budgets**
```bash
# Create budget file
touch lighthouse-budget.json

# Add to CI
# Fail build if exceeded

# Validation
npm run build:analyze
```

**Validation:**
- [ ] Bundle size ≤450KB
- [ ] Load time <2s (3G)
- [ ] Lighthouse score ≥92
- [ ] Performance budgets enforced

---

### Week 11: Documentation & Polish

**Goals:**
- Update all documentation
- Create migration guides
- Code quality improvements

**Tasks:**

**Day 1-2: Technical Documentation**
```bash
# Update README.md
# Update CONTRIBUTING.md
# Create architecture diagrams

# API documentation
npm run docs:api
```

**Day 3-4: Developer Guides**
```bash
# Create guides
touch docs/guides/COMPONENT_DEVELOPMENT.md
touch docs/guides/SERVICE_LAYER.md
touch docs/guides/TESTING_STRATEGY.md
touch docs/guides/TYPE_SAFETY.md

# Code examples
# Best practices
```

**Day 5: Code Quality**
```bash
# ESLint strict mode
# Prettier formatting
# Remove TODOs and FIXMEs

# Final cleanup
npm run lint:fix
npm run format
```

**Validation:**
- [ ] All documentation current
- [ ] Developer guides complete
- [ ] Zero linting errors
- [ ] Clean codebase

---

### Week 12: Production Validation

**Goals:**
- Remove feature flags
- Production deployment
- Monitoring setup
- Final validation

**Tasks:**

**Day 1: Feature Flag Removal**
```bash
# Remove all feature flags
# Delete old implementations
# Clean up conditional code

# Verify removals
git diff main
```

**Day 2: Load Testing**
```bash
# Create load tests
touch tests/load/concurrent-users.test.ts
touch tests/load/plugin-loading.test.ts

# Run load tests
npx playwright test tests/load

# Stress test
# See: SCALABILITY_ROADMAP.md section 9.2
```

**Day 3: Security Audit**
```bash
# Final security scan
npm audit
npx snyk test

# Penetration testing
# Dependency review

# Fix issues
```

**Day 4: Production Deployment**
```bash
# Deploy to staging
git push origin develop

# Smoke tests on staging
npm run test:smoke -- --config=staging

# Production deployment
git checkout main
git merge develop
git push origin main

# Monitor deployment
# Health checks
```

**Day 5: Post-Deployment Validation**
```bash
# Monitor metrics
# User feedback
# Error tracking

# Rollback readiness
# Create production runbook

# Celebrate! 🎉
```

**Validation:**
- [ ] Zero feature flags
- [ ] Load tests passing
- [ ] Security audit clean
- [ ] Production deployment successful
- [ ] Monitoring active
- [ ] Zero critical issues

---

## 3. Risk Mitigation

### 3.1 Rollback Procedures

**Component Refactoring Rollback:**
```bash
# Disable feature flag
export VITE_REFACTORED_HINT_MODAL=false
npm run build
npm run deploy

# Or revert commit
git revert HEAD
git push origin main
```

**Service Layer Rollback:**
```bash
# Disable service feature flag
export VITE_USE_GAME_STATE_SERVICE=false

# Or remove service usage
git revert <service-commit>
```

**CI/CD Rollback:**
```bash
# Use Vercel rollback
vercel rollback <previous-deployment-id>

# Or redeploy previous version
git checkout <previous-tag>
npm run build
npm run deploy
```

### 3.2 Emergency Contacts

**Critical Issues:**
- Lead Developer: [Contact]
- DevOps Lead: [Contact]
- On-Call Engineer: [Contact]

**Escalation Path:**
1. Lead Developer (0-15 min)
2. DevOps Lead (15-30 min)
3. CTO (30+ min)

---

## 4. Success Criteria

### 4.1 Technical Metrics

✅ **Code Quality:**
- All files <500 lines ✓
- Zero `any` types ✓
- Zero TypeScript errors ✓
- 90%+ test pass rate ✓

✅ **Performance:**
- Bundle size ≤450KB ✓
- Load time <2s ✓
- Lighthouse score ≥92 ✓

✅ **Testing:**
- 820+/914 tests passing ✓
- 70%+ coverage ✓
- Zero test exclusions ✓

✅ **Deployment:**
- CI/CD pipeline <15 min ✓
- Automated deployments ✓
- Zero-downtime deploys ✓

### 4.2 Business Metrics

✅ **Reliability:**
- Zero regressions
- Zero production incidents
- 99.9%+ uptime

✅ **Velocity:**
- Feature development 30% faster
- Bug fixing 50% faster
- Deployment frequency 10x

✅ **Quality:**
- User-reported bugs -80%
- Accessibility AAA maintained
- Performance complaints -90%

---

## 5. Post-Migration Tasks

**Week 13: Monitoring & Optimization**
- Set up error tracking (Sentry)
- Set up analytics (PostHog)
- Performance monitoring
- User feedback collection

**Week 14-16: Iteration**
- Address user feedback
- Performance optimization
- Bug fixes
- Documentation updates

**Month 4+: Future Enhancements**
- Plugin architecture (see SCALABILITY_ROADMAP.md)
- Multi-country support
- Advanced features
- Community building

---

## 6. Communication Plan

### 6.1 Stakeholder Updates

**Weekly Updates:**
- Progress report
- Blockers/risks
- Metrics dashboard
- Next week plan

**Bi-Weekly Demos:**
- Feature demonstrations
- Q&A sessions
- Feedback collection

**Monthly Reviews:**
- Retrospectives
- Lessons learned
- Process improvements

### 6.2 Documentation

**Migration Log:**
```markdown
# Migration Log

## Week 1 (Dec 4-8, 2025)
- ✅ Feature flags implemented
- ✅ Modular test utilities created
- ✅ Playwright set up
- ⚠️ Minor delay in test setup (resolved)

## Week 2 (Dec 11-15, 2025)
- ✅ HintModal refactored (908 → 180 lines)
- ✅ Sub-components tested
- ✅ Feature flag working
- 🎯 All validations passed
```

---

## 7. Next Steps

**Immediate Actions:**
1. Review migration strategy with team
2. Set up feature flag infrastructure (Week 1, Day 1)
3. Create project board with week-by-week tasks
4. Schedule daily standups during migration

**Required Approvals:**
- [ ] Engineering Lead (timeline feasibility)
- [ ] Product Lead (feature freeze during migration)
- [ ] DevOps Lead (infrastructure readiness)
- [ ] QA Lead (testing strategy)

**Resources Needed:**
- 1 Senior Developer (full-time, 12 weeks)
- 1 DevOps Engineer (part-time, weeks 7-12)
- 1 QA Engineer (part-time, weeks 6-12)
- Code review support from team

---

**End of Document**

**Migration Start Date:** TBD
**Expected Completion:** TBD + 12 weeks
**Status:** Awaiting approval
